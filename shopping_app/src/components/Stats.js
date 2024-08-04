import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const Stats = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const fetchPurchaseHistory = async () => {
    const userName = window.localStorage.getItem("userName");
    if (!userName) {
      alert("Please log in to view your stats.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/auth/${userName}/purchase-history`
      );

      // Log the raw response
      const text = await response.text();
      console.log("Raw response:", text);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Received invalid JSON from server");
        return;
      }

      if (response.ok) {
        setPurchaseHistory(data.purchaseHistory);
      } else {
        console.error("Server responded with an error:", data.message);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      alert(
        `An error occurred while fetching the purchase history: ${error.message}`
      );
    }
  };

  useEffect(() => {
    if (purchaseHistory.length > 0) {
      createPurchaseGraph();
    }
  }, [purchaseHistory]);

  const createPurchaseGraph = () => {
    // Clear any existing SVG
    d3.select("#purchase-graph").selectAll("*").remove();

    // Set up dimensions
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Create SVG
    const svg = d3
      .select("#purchase-graph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process data
    const categoryCounts = {};

    purchaseHistory.forEach((purchase) => {
      purchase.items.forEach((item) => {
        const category = item.productCategory; // Use productCategory if available
        if (category) {
          if (!categoryCounts[category]) {
            categoryCounts[category] = 0;
          }
          categoryCounts[category] += item.quantity;
        }
      });
    });

    const data = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));

    // Set up scales
    const x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(data.map((d) => d.category));

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, (d) => d.count)]);

    // Create bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.category))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => height - y(d.count));

    // Add the X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g").call(d3.axisLeft(y));
  };

  return (
    <div>
      <h1>Purchase History by Category</h1>
      <div id="purchase-graph"></div>
    </div>
  );
};

export default Stats;
