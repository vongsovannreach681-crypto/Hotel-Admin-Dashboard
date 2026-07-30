const mongoose = require("mongoose");

const staffSchema = mongoose.Schema({
  staff_id: {
    type: Number,
    unique: true,
  },
  hotel_id: {
    type: Number,
  },
  full_name: {
    type: String,
    required: [true, "Full name is required"],
  },
  position: {
    type: String,
    enum: ["manager", "receptionist", "cleaner", "counter", "security"],
    required: [true, "Position is required"],
  },
  contact:{
    email:String,
    phone:String
  },
  salary: {
    type: Number,
  },
  date_of_birth: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Staff", staffSchema, "staff");