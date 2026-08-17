// src/utils/formatCurrency.js
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    // "en-US" se "en-IN"
    style: "currency",
    currency: "INR", // "USD" se "INR"
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrencyCompact = (amount) => {
  if (amount === undefined || amount === null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    // "en-US" se "en-IN"
    style: "currency",
    currency: "INR", // "USD" se "INR"
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
};
