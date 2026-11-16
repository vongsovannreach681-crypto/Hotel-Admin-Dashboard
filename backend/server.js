require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// 1. CORS Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 2. Connect to Database
connectDB();

// 3. Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 4. API Routes
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Hotel Management API is running" });
});
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/hotel", require("./routes/hotelRoute"));
app.use("/api/rooms", require("./routes/roomsRoute"));
app.use("/api/staff", require("./routes/staffsRoute"));
app.use("/api/booking", require("./routes/bookingRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));

// 5. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
