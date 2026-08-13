// src/routes/transaction.routes.js
const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTransactions);

router.post(
  "/",
  [
    body("type")
      .isIn(["income", "expense"])
      .withMessage("Invalid transaction type"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("description").optional().trim(),
    body("date").optional().isDate().withMessage("Invalid date"),
  ],
  createTransaction,
);

router.put(
  "/:id",
  [
    body("type")
      .optional()
      .isIn(["income", "expense"])
      .withMessage("Invalid transaction type"),
    body("amount")
      .optional()
      .isNumeric()
      .withMessage("Amount must be a number"),
    body("category").optional().notEmpty().withMessage("Category is required"),
    body("description").optional().trim(),
    body("date").optional().isDate().withMessage("Invalid date"),
  ],
  updateTransaction,
);

router.delete("/:id", deleteTransaction);

module.exports = router;
