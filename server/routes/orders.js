const express = require("express");
const router = express.Router();
const Order = require("../models/Order");



// PUT /api/orders/:orderId/status — Update order status
router.put("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// POST /api/orders — Create a new order
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    // Create new order document
    const newOrder = new Order(orderData);

    // Save order to DB
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error });
  }
});

// GET /api/orders — Fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

module.exports = router;
