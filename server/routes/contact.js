const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, mobile, message, type, orderId, relatedTo } = req.body;

  // Validate required fields
  if (!name || !email || !mobile || !message || !type) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  // Extra validation based on type
  if (type === "complaint" && !orderId) {
    return res
      .status(400)
      .json({ error: "Order ID is required for complaints" });
  }
  if (type === "suggestion" && !relatedTo) {
    return res
      .status(400)
      .json({ error: "Related To is required for suggestions" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Dynamic subject line
    const subject =
      type === "complaint"
        ? `📢 New Complaint from ${name}`
        : `💡 New Suggestion from ${name}`;

    // Dynamic email body
    let extraFields = "";
    if (type === "complaint") {
      extraFields = `<p><b>Order ID:</b> ${orderId}</p>`;
    } else if (type === "suggestion") {
      extraFields = `<p><b>Related To:</b> ${relatedTo}</p>`;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVE_EMAIL || process.env.EMAIL_USER,
      subject,
      html: `
        <h2 style="color:#4CAF50;">New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mobile:</b> ${mobile}</p>
        <p><b>Type:</b> ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
        ${extraFields}
        <p><b>Message:</b><br/>${message}</p>
        <hr/>
        <p style="font-size:12px;color:gray;">This message was sent from your website contact form.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
