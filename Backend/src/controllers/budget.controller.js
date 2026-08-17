// src/controllers/budget.controller.js

const Budget = require("../models/budget.model");
const { validationResult } = require("express-validator");
const {
  isValidExpenseCategory,
  getExactExpenseCategory,
} = require("../constants/categories");

const isValidMonth = (month) => /^\d{4}-(0[1-9]|1[0-2])$/.test(month);

const formatBudgetMonth = (month) => {
  if (!month) return month;
  if (month instanceof Date) {
    return `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(2, "0")}`;
  }
  if (typeof month === "string") return month.substring(0, 7);
  return month;
};

const formatBudget = (budget) => {
  if (!budget) return budget;
  return { ...budget, month: formatBudgetMonth(budget.month) };
};

const formatBudgets = (budgets) => budgets.map(formatBudget);

// ==================== GET BUDGETS ====================
exports.getBudgets = async (req, res, next) => {
  try {
    const { month } = req.query;
    if (month) {
      if (!isValidMonth(month)) {
        return res
          .status(400)
          .json({ error: "Invalid month format. Expected YYYY-MM" });
      }
      const budgets = await Budget.getBudgetWithSpending(req.user.id, month);
      return res.json({ budgets: formatBudgets(budgets) });
    }
    const budgets = await Budget.findByUser(req.user.id);
    return res.json({ budgets: formatBudgets(budgets) });
  } catch (error) {
    next(error);
  }
};

// ==================== CREATE BUDGET ====================
exports.createBudget = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { category, amount, month } = req.body;

    if (!isValidMonth(month)) {
      return res
        .status(400)
        .json({ error: "Invalid month format. Expected YYYY-MM" });
    }

    // Fix: Validate and get exact category
    if (!isValidExpenseCategory(category)) {
      return res.status(400).json({ error: "Invalid expense category" });
    }
    category = getExactExpenseCategory(category);

    // Fix: Round amount
    const parsedAmount = Math.round(parseFloat(amount) * 100) / 100;
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const budget = await Budget.create({
      userId: req.user.id,
      category,
      amount: parsedAmount,
      month,
    });

    return res.status(201).json({ budget: formatBudget(budget) });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "Budget already exists for this category and month" });
    }
    next(error);
  }
};

// ==================== UPDATE BUDGET ====================
exports.updateBudget = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    let { category, amount, month } = req.body;

    const existingBudget = await Budget.findById(id, req.user.id);
    if (!existingBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    if (category === undefined && amount === undefined && month === undefined) {
      return res.status(400).json({
        error:
          "At least one field (category, amount, or month) must be provided",
      });
    }

    if (month !== undefined && !isValidMonth(month)) {
      return res
        .status(400)
        .json({ error: "Invalid month format. Expected YYYY-MM" });
    }

    // Fix: Validate category
    if (category !== undefined) {
      if (!isValidExpenseCategory(category)) {
        return res.status(400).json({ error: "Invalid expense category" });
      }
      category = getExactExpenseCategory(category);

      // Fix: Check if transactions exist before changing category
      if (category !== existingBudget.category) {
        const hasTransactions = await Budget.hasTransactions(
          req.user.id,
          existingBudget.category,
          existingBudget.month,
        );
        if (hasTransactions) {
          return res.status(409).json({
            error: `Cannot change category: Transactions exist for '${existingBudget.category}' this month`,
          });
        }
      }
    }

    // Fix: Check if transactions exist before changing month
    if (month !== undefined && month !== existingBudget.month) {
      const hasTransactions = await Budget.hasTransactions(
        req.user.id,
        existingBudget.category,
        existingBudget.month,
      );
      if (hasTransactions) {
        return res.status(409).json({
          error: `Cannot change month: Transactions exist for '${existingBudget.category}' this month`,
        });
      }
    }

    // Fix: Round amount
    let parsedAmount;
    if (amount !== undefined) {
      parsedAmount = Math.round(parseFloat(amount) * 100) / 100;
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ error: "Amount must be greater than 0" });
      }
    }

    const updated = await Budget.update(id, req.user.id, {
      category,
      amount: parsedAmount,
      month,
    });

    return res.json({ budget: formatBudget(updated) });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "Budget already exists for this category and month" });
    }
    next(error);
  }
};

// ==================== DELETE BUDGET ====================
exports.deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findById(id, req.user.id);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // Fix: Check if transactions exist before deleting
    const hasTransactions = await Budget.hasTransactions(
      req.user.id,
      budget.category,
      budget.month,
    );

    if (hasTransactions) {
      return res.status(409).json({
        error:
          "Cannot delete budget: Transactions exist for this category and month",
      });
    }

    await Budget.delete(id, req.user.id);
    return res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    next(error);
  }
};
