// src/routes/ai.routes.js
const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { chat, getInsight } = require("../controllers/ai.controller");

const router = express.Router();

router.use(authMiddleware);

router.post("/chat", chat);
router.get("/insight", getInsight);

module.exports = router;
