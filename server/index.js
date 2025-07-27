require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// Connect your routes
app.use('/products', productRoutes);

// Example home route (optional)
app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Secure connection using environment variable
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err));
