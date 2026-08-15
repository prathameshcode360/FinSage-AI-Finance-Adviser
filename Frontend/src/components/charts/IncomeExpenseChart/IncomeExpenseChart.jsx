// src/components/charts/IncomeExpenseChart/IncomeExpenseChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatCurrency } from "../../../utils/formatCurrency.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const IncomeExpenseChart = ({
  data,
  loading,
  title = "Income vs Expenses",
}) => {
  if (loading) {
    return (
      <div className="chart-skeleton" style={{ height: "250px" }}>
        Loading...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary)",
        }}>
        No data available
      </div>
    );
  }

  const labels = data.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  // Group by date for income and expense
  const grouped = data.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (!acc[date]) {
      acc[date] = { income: 0, expense: 0 };
    }
    if (item.type === "income") {
      acc[date].income += item.total_amount;
    } else {
      acc[date].expense += item.total_amount;
    }
    return acc;
  }, {});

  const uniqueLabels = Object.keys(grouped);
  const incomeValues = uniqueLabels.map((label) => grouped[label].income);
  const expenseValues = uniqueLabels.map((label) => grouped[label].expense);

  const chartData = {
    labels: uniqueLabels,
    datasets: [
      {
        label: "Income",
        data: incomeValues,
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Expenses",
        data: expenseValues,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
        borderRadius: 4,
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
    <div style={{ height: "250px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default IncomeExpenseChart;
