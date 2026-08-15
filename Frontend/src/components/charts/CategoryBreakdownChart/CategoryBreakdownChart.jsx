// src/components/charts/CategoryBreakdownChart/CategoryBreakdownChart.jsx
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { formatCurrency } from "../../../utils/formatCurrency.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryBreakdownChart = ({
  data,
  loading,
  title = "Category Breakdown",
}) => {
  if (loading) {
    return (
      <div className="chart-skeleton" style={{ height: "300px" }}>
        Loading...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary)",
        }}>
        No category data available
      </div>
    );
  }

  const colors = [
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#6366f1",
    "#84cc16",
    "#06b6d4",
    "#d946ef",
  ];

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 2,
        borderColor: "white",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CategoryBreakdownChart;
