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
    const userEmail = window.localStorage.getItem("userEmail");
    if (storedUserName) {
      setUserName(storedUserName);
      try {
        const response = await fetch(
          `http://localhost:4000/auth/${userEmail}/purchase-history`
        );
        const data = await response.json();
        if (response.ok) {
          setPurchaseHistory(data.purchaseHistory);
          processChartData(data.purchaseHistory);
        } else {
          console.error("Error fetching purchase history:", data.message);
          alert(
            data.message ||
              "An error occurred while fetching the purchase history"
          );
        }
      } catch (error) {
        console.error("Error fetching purchase history:", error);
        alert("An error occurred while fetching the purchase history");
      }
    } else {
      setPurchaseHistory([]);
    }
  };

  const processChartData = (purchaseHistory) => {
    const metrics = ["price", "quantity", "yearly-spent"];
    const newChartData = {};

    metrics.forEach((metric) => {
      const categoryTotals = {};
      const monthlyTotals = Array(12).fill(0); // Array to store monthly totals

      purchaseHistory.forEach((purchase) => {
        const purchaseDate = new Date(purchase.date);
        const month = purchaseDate.getMonth(); // 0-based month (0 = January, 11 = December)
        const year = purchaseDate.getFullYear();

        purchase.items.forEach((item) => {
          const value =
            metric === "price" ? item.price * item.quantity : item.quantity;

          if (metric === "yearly-spent") {
            if (
              purchaseDate >=
              new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            ) {
              monthlyTotals[month] += item.price * item.quantity; // Sum up monthly totals
            }
          } else {
            if (categoryTotals[item.category]) {
              categoryTotals[item.category] += value;
            } else {
              categoryTotals[item.category] = value;
            }
          }
        });
      });

      if (metric === "yearly-spent") {
        newChartData[metric] = {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          data: monthlyTotals,
        };
      } else {
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        newChartData[metric] = {
          labels,
          data,
        };
      }
    });

    setChartData(newChartData);
  };

  useEffect(() => {
    fetchUserPurchaseHistory();
  }, [metric]);

  const handleMetricChange = (event) => {
    setMetric(event.target.value);
  };

  return (
    <div className="stats-container">
      <h1>Here's {userName}'s shopping data</h1>
      <div className="metric-selector">
        <label htmlFor="metric">Select Metric: </label>
        <select id="metric" value={metric} onChange={handleMetricChange}>
          <option value="price">Total Price</option>
          <option value="quantity">Total Quantity</option>
          <option value="yearly-spent">Yearly Spent</option>
        </select>
      </div>
      {purchaseHistory.length === 0 ? (
        <p>No purchase history available</p>
      ) : (
        <div className="charts-wrapper">
          <div className="chart-container">
            <h2 className="chart-title">
              {metric === "price"
                ? "Total $ spent per category"
                : metric === "quantity"
                ? "Total amount of products purchased per category"
                : "Total $ spent per month over the past year"}
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
                ? "Total $ spent per category"
                : metric === "quantity"
                ? "Total amount of products purchased per category"
                : "Total $ spent per month over the past year"}
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
                ? "Total $ spent per category"
                : metric === "quantity"
                ? "Total amount of products purchased per category"
                : "Total $ spent per month over the past year"}
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
