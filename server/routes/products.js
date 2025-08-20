const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // Unique filename based on timestamp
  },
});

const upload = multer({ storage });

// POST /api/products — Create a new product with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      image: imageUrl,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

// GET /api/products — Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// PUT /api/products/:id — update product (optionally with new image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const updatedData = { name, description, price, category };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

const mongoose = require("mongoose");

// GET /api/products/:id — Fetch single product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

// DELETE /api/products/:id — delete product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

module.exports = router;
