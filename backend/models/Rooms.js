const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  room_id: {
    type: Number,
    unique: true,
  },
  hotel_id:{
    type: Number,
  },
  booking_id:{
    type:Number
  },
  room_number:{
    type:Number
  },
  room_type:{
    type:String,
    unique: true,
    required: [true, "name is required"],
  },
  floor:{
    type:Number
  },
  description:{
    type:String,
  },
  image:[
    String
  ],
  room_information:{
    price_per_night:Number,
    status:Boolean,
    bed_type:String
  }
});

module.exports = mongoose.model("Rooms", userSchema, "rooms");
