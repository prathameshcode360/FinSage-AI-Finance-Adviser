// src/routes/analytics.routes.js
const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  getSummary,
  getMonthlyTrend,
  getCategoryBreakdown,
} = require("../controllers/analytics.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/summary", getSummary);
router.get("/monthly", getMonthlyTrend);
router.get("/categories", getCategoryBreakdown);

module.exports = router;
