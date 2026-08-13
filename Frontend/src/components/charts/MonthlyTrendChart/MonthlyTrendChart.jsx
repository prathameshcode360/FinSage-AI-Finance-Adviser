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
import { formatCurrency } from "../../../../utils/formatCurrency";

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
        No data available
      </div>
    );
  }

  const labels = data.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const incomeData = data.filter((d) => d.type === "income");
  const expenseData = data.filter((d) => d.type === "expense");

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: labels.map((_, index) => {
          const found = incomeData.find((d) => {
            const date = new Date(d.date);
            return (
              date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }) === labels[index]
            );
          });
          return found ? found.total_amount : 0;
        }),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgb(16, 185, 129)",
      },
      {
        label: "Expenses",
        data: labels.map((_, index) => {
          const found = expenseData.find((d) => {
            const date = new Date(d.date);
            return (
              date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }) === labels[index]
            );
          });
          return found ? found.total_amount : 0;
        }),
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
    <div style={{ height: "300px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyTrendChart;
