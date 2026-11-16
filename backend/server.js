require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// 1. Connect to Database
connectDB();

// 2. Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. API Routes
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/hotel", require("./routes/hotelRoute"));
app.use("/api/rooms", require("./routes/roomsRoute"));
app.use("/api/staff", require("./routes/staffsRoute"));
app.use("/api/booking", require("./routes/bookingRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));

// 4. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
