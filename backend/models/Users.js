const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
    },
    userName: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    booking_id:{
      type:Number
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Users", userSchema, "users");