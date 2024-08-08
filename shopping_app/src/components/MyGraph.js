import React from "react";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const MyGraph = ({ type, data, labels, options }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Price",
        data,
        backgroundColor: labels.map(
          () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 0.9)`
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
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
    maintainAspectRatio: false,
    ...options,
  };

  const ChartComponent =
    type === "bar" ? Bar : type === "pie" ? Pie : type === "line" ? Line : null;

  if (!ChartComponent) {
    return <p>Unsupported chart type</p>;
  }

  return (
    <div style={{ width: "90%", height: "400px", padding: "30px" }}>
      <ChartComponent data={chartData} options={chartOptions} />
    </div>
  );
};

export default MyGraph;
