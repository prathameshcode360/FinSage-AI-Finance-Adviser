// src/components/charts/CategoryBreakdownChart/CategoryBreakdownChart.jsx
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import styles from "./CategoryBreakdownChart.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

// FIX #3: Extended color palette - 20 colors
const DEFAULT_COLORS = [
  "#0ea5e9", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f97316", // Orange
  "#6366f1", // Indigo
  "#84cc16", // Lime
  "#06b6d4", // Cyan
  "#d946ef", // Fuchsia
  "#22d3ee", // Light Cyan
  "#34d399", // Light Green
  "#fb923c", // Light Orange
  "#a78bfa", // Light Purple
  "#f472b6", // Light Pink
  "#2dd4bf", // Light Teal
  "#fbbf24", // Light Amber
  "#e879f9", // Light Fuchsia
];

// Get color with fallback for any number of categories
const getColor = (index) => {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
};

const CategoryBreakdownChart = ({
  data,
  loading,
  title = "Category Breakdown",
}) => {
  if (loading) {
    return <div className={styles.skeletonContainer}>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className={styles.emptyState}>No category data available</div>;
  }

  // FIX #3: Use getColor with modulo for unlimited categories
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: data.map((_, index) => getColor(index)),
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
            const percentage =
              total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CategoryBreakdownChart;
