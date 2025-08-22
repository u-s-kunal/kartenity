const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // store inside /server/uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// @desc Get all users (for testing, remove later)
// @route GET /api/users
// @access Public (make private later)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// @desc Get single user by ID
// @route GET /api/users/:id
// @access Private (auth middleware later)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/:id/profile-picture
router.put("/:id/profilePic", upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profilePic: `/uploads/${req.file.filename}` },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error updating profile picture:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// @desc Update user profile
// @route PUT /api/users/:id
// @access Private (auth middleware later)
// @desc Update user profile
// @route PUT /api/users/:id
// @access Private (auth middleware later)
router.put("/:id", async (req, res) => {
  try {
    console.log("Incoming update request for user:", req.params.id);
    console.log("Update payload:", req.body);

    const updates = req.body;

    // Do not allow password update directly here unless hashed
    if (updates.password) {
      const bcrypt = require("bcryptjs");
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!user) {
      console.log("User not found with ID:", req.params.id);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Updated user:", user);
    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err); // full error object
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
