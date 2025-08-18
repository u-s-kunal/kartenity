const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Secret:", process.env.RAZORPAY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // your actual test key from .env
  key_secret: process.env.RAZORPAY_SECRET, // your actual secret key from .env
});

router.post("/orders", async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: "Amount is required" });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });
    res.json(order);
  } catch (error) {
    console.error("Razorpay order failed:", error);
    res.status(500).json({ error: "Unable to create order" });
  }
});

module.exports = router;
