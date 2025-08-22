// routes/reviews.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Review = require("../models/Review");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/reviews";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only images are allowed (jpeg, jpg, png, webp)"));
  },
});

// --- GET reviews by productId ---
router.get("/", async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId)
      return res.status(400).json({ error: "productId is required" });

    const query = mongoose.Types.ObjectId.isValid(productId)
      ? { product_id: new mongoose.Types.ObjectId(productId) }
      : { product_id: productId };

    const reviews = await Review.find(query);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// --- POST add new review with images ---
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const { product_id, rating, title, comment } = req.body;
    if (!product_id || !rating || !title || !comment)
      return res
        .status(400)
        .json({ error: "All fields except images are required" });

    const imagePaths = req.files ? req.files.map((f) => "/" + f.path) : [];
    const newReview = new Review({
      product_id,
      rating,
      title,
      comment,
      image: imagePaths.length > 0 ? imagePaths : null,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(400).json({ error: "Failed to add review" });
  }
});

module.exports = router;
