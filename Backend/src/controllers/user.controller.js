// src/controllers/user.controller.js
const User = require("../models/user.model");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Check if email is taken by another user
    if (email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    const user = await User.updateProfile(req.user.id, { name, email });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
