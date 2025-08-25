require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());

// ✅ CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000", // allow local frontend
      "https://kartenity.vercel.app", // allow deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Serve uploaded files (only once, no duplication)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Import routes ---
const userRoutes = require("./routes/users");
const reviewsRoute = require("./routes/reviews");
const ordersRouter = require("./routes/orders");
const emailRoutes = require("./routes/email");
const contactRoutes = require("./routes/contact");
const productRoutes = require("./routes/products");
const paymentRoute = require("./routes/payment");

// --- Use routes ---
app.use("/api/reviews", reviewsRoute);
app.use("/api/users", userRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/orders", ordersRouter);

// --- Root test route ---
app.get("/", (req, res) => res.send("API Running"));

// --- Debug route: show all registered routes ---
app.get("/debug-routes", (req, res) => {
  res.json(app._router.stack.filter((r) => r.route).map((r) => r.route.path));
});

// --- Database connection & Server start ---
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
