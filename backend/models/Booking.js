const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  booking_id: {
    type: Number,
    unique: true,
  },
  user_id: {
    type: Number,
    required: [true, "user_id is required"],
  },
  hotel_id: {
    type: Number,
    required: [true, "hotel_id is required"],
  },
  room_id: {
    type: Number,
    required: [true, "room_id is required"],
  },
  check_in: {
    type: Date,
    required: [true, "check_in date is required"],
  },
  check_out: {
    type: Date,
    required: [true, "check_out date is required"],
  },
  nights: {
    type: Number, // auto-calculated in pre-save hook below
  },
  guests: {
    type: Number,
    default: 1,
  },
  total_price: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "checked_in", "checked_out", "cancelled"],
    default: "pending",
  },
  notes: {
    type: String,
  },
});



module.exports = mongoose.model("Booking", bookingSchema, "bookings");