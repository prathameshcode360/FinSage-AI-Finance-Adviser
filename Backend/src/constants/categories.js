// backend/src/constants/categories.js

const EXPENSE_CATEGORIES = [
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
];

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Rental",
  "Business",
  "Gifts",
  "Other Income",
];

// Case-insensitive validation (main fix)
const isValidExpenseCategory = (category) => {
  if (!category) return false;
  return EXPENSE_CATEGORIES.some(
    (c) => c.toLowerCase() === category.toLowerCase().trim(),
  );
};

// Get exact category match (for storing correct format)
const getExactExpenseCategory = (category) => {
  if (!category) return null;
  return (
    EXPENSE_CATEGORIES.find(
      (c) => c.toLowerCase() === category.toLowerCase().trim(),
    ) || null
  );
};

module.exports = {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  isValidExpenseCategory,
  getExactExpenseCategory,
};
