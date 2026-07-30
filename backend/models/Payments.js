const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  payment_id: {
    type: Number,
    unique: true,
  },
  booking_id: {
    type: Number,
    required: [true, "booking_id is required"],
  },
  payment_method: {
    type: String,
  },
   status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  transaction: {
    type: String,
  },
  paid_at: {
    type: Date,
  },
});


module.exports = mongoose.model("Payments", paymentSchema, "payments");