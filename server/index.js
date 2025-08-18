require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Comment out other routes for now
const ordersRouter = require("./routes/orders");
const emailRoutes = require("./routes/email");
const contactRoutes = require("./routes/contact");
const productRoutes = require("./routes/products");
const paymentRoute = require("./routes/payment");

app.use("/api/email", emailRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/orders", ordersRouter);
app.get("/", (req, res) => res.send("API Running"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Atlas connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB Atlas connection error:", err);
  });
