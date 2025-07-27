const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
});
const Product = mongoose.model("Product", productSchema, "Products");

module.exports = Product;
