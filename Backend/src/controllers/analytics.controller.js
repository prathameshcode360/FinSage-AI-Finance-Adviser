// src/controllers/analytics.controller.js
const Transaction = require("../models/transaction.model");
const Budget = require("../models/budget.model");

exports.getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Default to current month if not specified
    const now = new Date();

    const start =
      startDate ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    const end =
      endDate ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
      ).padStart(2, "0")}`;

    const summary = await Transaction.getSummary(req.user.id, start, end);

    // Get budget info
    const month = start.substring(0, 7);
    const budgets = await Budget.getBudgetWithSpending(req.user.id, month);

    res.json({
      summary: {
        totalIncome: parseFloat(summary.total_income),
        totalExpenses: parseFloat(summary.total_expenses),
        balance:
          parseFloat(summary.total_income) - parseFloat(summary.total_expenses),
        transactionCount: parseInt(summary.transaction_count),
      },
      budgets,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyTrend = async (req, res, next) => {
  try {
    const { year, month } = req.query;
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

    const now = new Date();

    const start =
      startDate ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    const end =
      endDate ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
      ).padStart(2, "0")}`;

    const data = await Transaction.getCategoryBreakdown(
      req.user.id,
      start,
      end,
    );

    res.json({ data });
  } catch (error) {
    next(error);
  }
};
