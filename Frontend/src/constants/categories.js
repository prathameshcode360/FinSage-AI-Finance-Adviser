// src/constants/categories.js
export const CATEGORIES = {
  income: [
    "Salary",
    "Freelance",
    "Investments",
    "Rental",
    "Business",
    "Gifts",
    "Other Income",
  ],
  expense: [
    "Housing",
    "Food & Dining",
    "Transportation",
    "Utilities",
    "Insurance",
    "Healthcare",
    "Entertainment",
    "Shopping",
    "Education",
    "Groceries",
    "Dining Out",
    "Rent",
    "Mortgage",
    "Car",
    "Gas",
    "Phone",
    "Internet",
    "Subscriptions",
    "Clothing",
    "Travel",
    "Other Expenses",
  ],
};

// Backward compatible exports
export const EXPENSE_CATEGORIES = CATEGORIES.expense;
export const INCOME_CATEGORIES = CATEGORIES.income;

// Get all categories
export const getAllCategories = () => {
  return [...CATEGORIES.income, ...CATEGORIES.expense];
};

export const getCategoriesByType = (type) => {
  return CATEGORIES[type] || [];
};

// Fix: Case-insensitive validation
export const isIncomeCategory = (category) => {
  if (!category || typeof category !== "string") return false;
  return CATEGORIES.income.some(
    (c) => c.toLowerCase() === category.toLowerCase().trim(),
  );
};

// Fix: Case-insensitive validation
export const isExpenseCategory = (category) => {
  if (!category || typeof category !== "string") return false;
  return CATEGORIES.expense.some(
    (c) => c.toLowerCase() === category.toLowerCase().trim(),
  );
};

// Helper: Get exact category match (for storing)
export const getExactCategory = (category, type) => {
  if (!category || typeof category !== "string") return null;
  const normalized = category.toLowerCase().trim();
  const categories = CATEGORIES[type] || [];
  return categories.find((c) => c.toLowerCase() === normalized) || null;
};
