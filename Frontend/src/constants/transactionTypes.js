// src/constants/transactionTypes.js
export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
};

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.INCOME]: "Income",
  [TRANSACTION_TYPES.EXPENSE]: "Expense",
};

export const TRANSACTION_TYPE_ICONS = {
  [TRANSACTION_TYPES.INCOME]: "💰",
  [TRANSACTION_TYPES.EXPENSE]: "💳",
};

export default {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_ICONS,
};
