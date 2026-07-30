const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  hotel_id: {
    type: Number,
    unique: true,
  },
  hotel_name: {
    type: String,
    required: [true, "Name is required"],
  },
  star_rating: {
    type: Number,
  },
  location: {
    street: String,
    city: String,
    country: String,
  },
  contact: {
    phone: String,
    email: String,
  },
  image :{
    type:String
  },
  available_rooms: {
    type: Number,
  },
});

module.exports = mongoose.model("hotels", userSchema);
