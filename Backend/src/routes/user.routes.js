// src/routes/user.routes.js
const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/user.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getProfile);

router.put(
  "/profile",
  [
    body("name").optional().trim().notEmpty().withMessage("Name is required"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
  ],
  updateProfile,
);

module.exports = router;
