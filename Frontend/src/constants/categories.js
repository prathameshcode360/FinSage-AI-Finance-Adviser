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

export const getAllCategories = () => {
  return [...CATEGORIES.income, ...CATEGORIES.expense];
};

export const getCategoriesByType = (type) => {
  return CATEGORIES[type] || [];
};

export const isIncomeCategory = (category) => {
  return CATEGORIES.income.includes(category);
};

export const isExpenseCategory = (category) => {
  return CATEGORIES.expense.includes(category);
};
