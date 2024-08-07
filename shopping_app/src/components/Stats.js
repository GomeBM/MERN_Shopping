import React, { useState, useEffect } from "react";
import MyGraph from "./MyGraph"; // Import the MyGraph component
import "./Stats.css"; // Import the CSS file

const Stats = () => {
  const [userName, setUserName] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [chartData, setChartData] = useState({
    bar: { labels: [], data: [] },
    pie: { labels: [], data: [] },
    line: { labels: [], data: [] },
  });
  const [metric, setMetric] = useState("price"); // Default metric

  const fetchUserPurchaseHistory = async () => {
    const storedUserName = window.localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
      try {
        const response = await fetch(
          `http://localhost:4000/auth/${storedUserName}/purchase-history`
        );
        const data = await response.json();
        if (response.ok) {
          setPurchaseHistory(data.purchaseHistory); // Set the purchaseHistory state
          processChartData(data.purchaseHistory);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching purchase history:", error);
        alert("An error occurred while fetching the purchase history");
      }
    } else {
      setPurchaseHistory([]); // No username available, clear purchase history
    }
  };

  const processChartData = (purchaseHistory) => {
    const metrics = ["price", "quantity"];
    const newChartData = {};

    metrics.forEach((metric) => {
      const categoryTotals = {};

      purchaseHistory.forEach((purchase) => {
        purchase.items.forEach((item) => {
          const value =
            metric === "price" ? item.price * item.quantity : item.quantity;

          if (categoryTotals[item.category]) {
            categoryTotals[item.category] += value;
          } else {
            categoryTotals[item.category] = value;
          }
        });
      });

      const labels = Object.keys(categoryTotals);
      const data = Object.values(categoryTotals);

      newChartData[metric] = {
        labels,
        data,
      };
    });

    setChartData(newChartData);
  };

  useEffect(() => {
    fetchUserPurchaseHistory();
  }, [metric]); // Add metric to dependency array to update when metric changes

  const handleMetricChange = (event) => {
    setMetric(event.target.value);
  };

  return (
    <div className="stats-container">
      <h1>Purchase History</h1>
      <div className="metric-selector">
        <label htmlFor="metric">Select Metric: </label>
        <select id="metric" value={metric} onChange={handleMetricChange}>
          <option value="price">Total Price</option>
          <option value="quantity">Total Quantity</option>
        </select>
      </div>
      {purchaseHistory.length === 0 ? (
        <p>No purchase history available</p>
      ) : (
        <div className="charts-wrapper">
          <div className="chart-container">
            <h2 className="chart-title">
              {metric === "price"
                ? "Total Price per Category"
                : "Total Quantity per Category"}
            </h2>
            <MyGraph
              type="bar"
              data={chartData[metric]?.data}
              labels={chartData[metric]?.labels}
              options={{
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
          <div className="chart-container">
            <h2 className="chart-title">
              {metric === "price"
                ? "Total Price per Category"
                : "Total Quantity per Category"}
            </h2>
            <MyGraph
              type="pie"
              data={chartData[metric]?.data}
              labels={chartData[metric]?.labels}
              options={{
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => {
                        const { label, raw } = tooltipItem;
                        return `${label}: $${raw.toFixed(2)}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="chart-container">
            <h2 className="chart-title">
              {metric === "price"
                ? "Total Price per Category"
                : "Total Quantity per Category"}
            </h2>
            <MyGraph
              type="line"
              data={chartData[metric]?.data}
              labels={chartData[metric]?.labels}
              options={{
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
