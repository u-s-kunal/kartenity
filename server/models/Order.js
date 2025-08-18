const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  paymentId: { type: String, required: true },
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [
    {
      // Assuming each cart item has these fields, adjust if needed
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
      price: Number,
      // Add any other fields your cart items contain
    },
  ],
  pricing: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    total: { type: Number, required: true },
    couponCode: { type: String, default: "" },
  },
  payment: { type: String, required: true }, // e.g., "Paid"
  orderStatus: { type: String, required: true }, // e.g., "pending"
  orderDate: { type: Date, default: Date.now, required: true },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
