// src/utils/calculations.js
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return (value / total) * 100;
};

export const calculateSavingsRate = (income, expenses) => {
  if (!income || income === 0) return 0;
  return ((income - expenses) / income) * 100;
};

export const getBudgetStatus = (spent, budget) => {
  if (!budget || budget === 0) return "no-budget";
  const percentage = (spent / budget) * 100;
  if (percentage >= 100) return "over-budget";
  if (percentage >= 90) return "near-limit";
  if (percentage >= 70) return "moderate";
  return "healthy";
};

export const getStatusColor = (status) => {
  const colors = {
    healthy: "var(--success)",
    moderate: "var(--warning)",
    "near-limit": "var(--warning)",
    "over-budget": "var(--danger)",
    "no-budget": "var(--gray-400)",
  };
  return colors[status] || "var(--gray-400)";
};

export const getStatusLabel = (status) => {
  const labels = {
    healthy: "Healthy",
    moderate: "Moderate",
    "near-limit": "Near Limit",
    "over-budget": "Over Budget",
    "no-budget": "No Budget",
  };
  return labels[status] || "Unknown";
};
