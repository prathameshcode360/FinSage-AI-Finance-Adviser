// src/controllers/ai.controller.js
const aiService = require("../services/ai.service");
const Transaction = require("../models/transaction.model");
const Budget = require("../models/budget.model");

exports.chat = async (req, res, next) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Gather financial context for the user
    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const month = startDate.substring(0, 7);

    // Get summary
    const summary = await Transaction.getSummary(
      req.user.id,
      startDate,
      endDate,
    );

    // Get recent transactions for AI context
    const recentTransactions = await Transaction.findRecentByUser(
      req.user.id,
      10,
    );

    // Get category breakdown
    const categoryBreakdown = await Transaction.getCategoryBreakdown(
      req.user.id,
      startDate,
      endDate,
    );

    // Get budgets
    const budgets = await Budget.getBudgetWithSpending(req.user.id, month);

    // Build financial context
    const financialContext = {
      balance:
        parseFloat(summary.total_income) - parseFloat(summary.total_expenses),

      totalIncome: parseFloat(summary.total_income),

      totalExpenses: parseFloat(summary.total_expenses),

      recentTransactions: recentTransactions.map((t) => ({
        type: t.type,
        amount: parseFloat(t.amount),
        category: t.category,
        description: t.description,
        date: t.date,
      })),

      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c.category,
        amount: parseFloat(c.total_amount),
      })),

      budgets: budgets.map((b) => ({
        category: b.category,
        budgetAmount: parseFloat(b.amount),
        spent: parseFloat(b.spent),
        remaining: parseFloat(b.remaining),
        utilization: parseFloat(b.utilization_percentage),
      })),

      month,
    };

    // Get AI response
    const aiResponse = await aiService.getResponse(message, financialContext);

    res.json({
      response: aiResponse,
      context: financialContext,
    });
  } catch (error) {
    next(error);
  }
};

exports.getInsight = async (req, res, next) => {
  try {
    // Gather financial context
    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const month = startDate.substring(0, 7);

    // Get summary
    const summary = await Transaction.getSummary(
      req.user.id,
      startDate,
      endDate,
    );

    // Get category breakdown
    const categoryBreakdown = await Transaction.getCategoryBreakdown(
      req.user.id,
      startDate,
      endDate,
    );

    // Get budgets
    const budgets = await Budget.getBudgetWithSpending(req.user.id, month);

    // Build financial context
    const financialContext = {
      balance:
        parseFloat(summary.total_income) - parseFloat(summary.total_expenses),

      totalIncome: parseFloat(summary.total_income),

      totalExpenses: parseFloat(summary.total_expenses),

      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c.category,
        amount: parseFloat(c.total_amount),
      })),

      budgets: budgets.map((b) => ({
        category: b.category,
        budgetAmount: parseFloat(b.amount),
        spent: parseFloat(b.spent),
        remaining: parseFloat(b.remaining),
        utilization: parseFloat(b.utilization_percentage),
      })),
    };

    const insight = await aiService.getInsight(financialContext);

    res.json({
      insight: insight.insight,
      recommendation: insight.recommendation,
      type: insight.type,
    });
  } catch (error) {
    next(error);
  }
};
