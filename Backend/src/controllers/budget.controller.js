// src/controllers/budget.controller.js
const Budget = require("../models/budget.model");
const { validationResult } = require("express-validator");

exports.getBudgets = async (req, res, next) => {
  try {
    const { month } = req.query;

    // If month is provided, get with spending data
    if (month) {
      const budgets = await Budget.getBudgetWithSpending(req.user.id, month);
      return res.json({ budgets });
    }

    // Otherwise, get all budgets
    const budgets = await Budget.findByUser(req.user.id);
    res.json({ budgets });
  } catch (error) {
    next(error);
  }
};

exports.createBudget = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, amount, month } = req.body;

    const budget = await Budget.create({
      userId: req.user.id,
      category,
      amount,
      month,
    });

    res.status(201).json({ budget });
  } catch (error) {
    next(error);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { category, amount, month } = req.body;

    const budget = await Budget.findById(id, req.user.id);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    const updated = await Budget.update(id, req.user.id, {
      category,
      amount,
      month,
    });

    res.json({ budget: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findById(id, req.user.id);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    await Budget.delete(id, req.user.id);
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    next(error);
  }
};
