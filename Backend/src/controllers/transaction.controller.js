// src/controllers/transaction.controller.js
const Transaction = require("../models/transaction.model");
const { validationResult } = require("express-validator");

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findByUser(req.user.id);

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      amount,
      category,
      description,
      date,
    });

    res.status(201).json({
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findById(id, req.user.id);

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    const updated = await Transaction.update(id, req.user.id, {
      type,
      amount,
      category,
      description,
      date,
    });

    res.json({
      transaction: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id, req.user.id);

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    await Transaction.delete(id, req.user.id);

    res.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
