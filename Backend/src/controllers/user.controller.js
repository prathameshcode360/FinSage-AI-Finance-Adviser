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

    // Build update object only with fields that were provided
    const updates = {};

    if (name !== undefined) {
      updates.name = name;
    }

    if (email !== undefined) {
      updates.email = email;
    }

    // Check if email is taken by another user
    if (email !== undefined) {
      const existingUser = await User.findByEmail(email);

      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({
          error: "Email already in use",
        });
      }
    }

    const user = await User.updateProfile(req.user.id, updates);

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
