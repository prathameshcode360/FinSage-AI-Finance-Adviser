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
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("month")
      .matches(/^\d{4}-\d{2}$/)
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
      .isNumeric()
      .withMessage("Amount must be a number"),
    body("month")
      .optional()
      .matches(/^\d{4}-\d{2}$/)
      .withMessage("Invalid month format (YYYY-MM)"),
  ],
  updateBudget,
);

router.delete("/:id", deleteBudget);

module.exports = router;
