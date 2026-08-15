// src/components/charts/MonthlyTrendChart/MonthlyTrendChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import styles from "./MonthlyTrendChart.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const MonthlyTrendChart = ({ data, loading, title = "Monthly Trend" }) => {
  if (loading) {
    return <div className={styles.skeletonContainer}>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className={styles.emptyState}>No data available</div>;
  }

  // Group income and expense totals by date
  const grouped = data.reduce((acc, item) => {
    const dateKey = String(item.date).slice(0, 10);

    if (!acc[dateKey]) {
      acc[dateKey] = {
        income: 0,
        expense: 0,
      };
    }

    const amount = parseFloat(item.total_amount) || 0;

    if (item.type === "income") {
      acc[dateKey].income += amount;
    } else if (item.type === "expense") {
      acc[dateKey].expense += amount;
    }

    return acc;
  }, {});

  const dateKeys = Object.keys(grouped).sort();

  const labels = dateKeys.map((dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  });

  const incomeValues = dateKeys.map((date) => grouped[date].income);
  const expenseValues = dateKeys.map((date) => grouped[date].expense);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeValues,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(16, 185, 129)",
      },
      {
        label: "Expenses",
        data: expenseValues,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(239, 68, 68)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }

            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }

            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyTrendChart;
