// src/controllers/analytics.controller.js
const Transaction = require("../models/transaction.model");

// Helper function for date validation
const isValidDate = (dateString) => {
  if (!dateString) return true; // Empty is allowed (will use default)
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

// Helper function to get default month range
const getDefaultMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = `${year}-${String(month).padStart(2, "0")}-${String(
    new Date(year, month, 0).getDate(),
  ).padStart(2, "0")}`;

  return { start, end };
};

exports.getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // FIX #5: Input validation
    if (startDate && !isValidDate(startDate)) {
      return res
        .status(400)
        .json({ message: "Invalid startDate format. Expected YYYY-MM-DD" });
    }
    if (endDate && !isValidDate(endDate)) {
      return res
        .status(400)
        .json({ message: "Invalid endDate format. Expected YYYY-MM-DD" });
    }

    const { start, end } = getDefaultMonthRange();
    const finalStart = startDate || start;
    const finalEnd = endDate || end;

    const summary = await Transaction.getSummary(
      req.user.id,
      finalStart,
      finalEnd,
    );

    // FIX #1: Remove unused budget query
    // const month = start.substring(0, 7);
    // const budgets = await Budget.getBudgetWithSpending(req.user.id, month);

    res.json({
      summary: {
        totalIncome: parseFloat(summary.total_income || 0),
        totalExpenses: parseFloat(summary.total_expenses || 0),
        balance:
          parseFloat(summary.total_income || 0) -
          parseFloat(summary.total_expenses || 0),
        transactionCount: parseInt(summary.transaction_count || 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyTrend = async (req, res, next) => {
  try {
    const { year, month } = req.query;

    // FIX #5: Input validation
    if (year && (isNaN(year) || year < 2000 || year > 2100)) {
      return res.status(400).json({ message: "Invalid year" });
    }
    if (month && (isNaN(month) || month < 1 || month > 12)) {
      return res.status(400).json({ message: "Invalid month. Must be 1-12" });
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const data = await Transaction.getMonthlyTrend(
      req.user.id,
      parseInt(year || currentYear),
      parseInt(month || currentMonth),
    );

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // FIX #5: Input validation
    if (startDate && !isValidDate(startDate)) {
      return res
        .status(400)
        .json({ message: "Invalid startDate format. Expected YYYY-MM-DD" });
    }
    if (endDate && !isValidDate(endDate)) {
      return res
        .status(400)
        .json({ message: "Invalid endDate format. Expected YYYY-MM-DD" });
    }

    const { start, end } = getDefaultMonthRange();
    const finalStart = startDate || start;
    const finalEnd = endDate || end;

    const data = await Transaction.getCategoryBreakdown(
      req.user.id,
      finalStart,
      finalEnd,
    );

    res.json({ data });
  } catch (error) {
    next(error);
  }
};
