// src/routes/budget.routes.js
const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware");
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budget.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getBudgets);

router.post(
  "/",
  [
    body("category").notEmpty().withMessage("Category is required"),
    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be greater than 0"),
    body("month")
      .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
      .withMessage("Invalid month format (YYYY-MM)"),
  ],
  createBudget,
);

router.put(
  "/:id",
  [
    body("category").optional().notEmpty().withMessage("Category is required"),
    body("amount")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Amount must be greater than 0"),
    body("month")
      .optional()
      .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
      .withMessage("Invalid month format (YYYY-MM)"),
  ],
  updateBudget,
);

router.delete("/:id", deleteBudget);

module.exports = router;
