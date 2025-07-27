const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to /uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// Route to handle product creation with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({ name, description, price, image: imageUrl });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

module.exports = router;
