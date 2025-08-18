const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.get("/test", (req, res) => res.send("Email route is working"));

router.post("/send-order-email", async (req, res) => {
  try {
    const { order } = req.body;

    if (!order) {
      return res
        .status(400)
        .json({ success: false, error: "Missing order data" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developerkunal01@gmail.com",
        pass: "diutpowmlbvztdvy", // app-specific password
      },
    });

    const mailOptions = {
      from: '"Kartenity" <developerkunal01@gmail.com>',
      to: "ughade1.kunal@gmail.com",
      subject: `Invoice - Order #${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #4CAF50;">Kartenity - Invoice</h2>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          
          <h3>Customer Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td><strong>Name:</strong></td><td>${
              order.customer.fullName
            }</td></tr>
            <tr><td><strong>Email:</strong></td><td>${
              order.customer.email
            }</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${
              order.customer.phone
            }</td></tr>
            <tr><td><strong>Address:</strong></td><td>${
              order.customer.address
            }</td></tr>
          </table>
          
          <h3 style="margin-top: 20px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f4f4f4;">
                <th style="border: 1px solid #ddd; padding: 8px;">Item</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Qty</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px;">${
                        item.name
                      }</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
                        item.quantity
                      }</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">₹${item.price.toFixed(
                        2
                      )}</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">₹${(
                        item.quantity * item.price
                      ).toFixed(2)}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>

          <h3 style="text-align: right; margin-top: 20px;">
            Total: ₹${order.pricing.total.toFixed(2)}
          </h3>

          <p style="text-align: center; color: #777; font-size: 12px; margin-top: 30px;">
            Thank you for shopping with Kartenity!
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
