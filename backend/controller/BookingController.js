const Booking = require("../models/Booking");
const mongoose = require("mongoose");
// create booking
const createBooking = async (req, res) => {
  try {
    const {
      booking_id,
      user_id,
      hotel_id,
      room_id,
      check_in,
      check_out,
      nights,
      guests,
      total_price,
      status,
      notes,
    } = req.body;

    const booking = new Booking({
      booking_id,
      user_id,
      hotel_id,
      room_id,
      check_in,
      check_out,
      nights,
      guests,
      total_price,
      status,
      notes,
    });

    await booking.save(); // triggers pre("save") hook to calculate "nights"

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// getAll
const getAllBooking = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get by id
const getOneBooking = async (req, res) => {
  try {
    const booking = await Booking.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "userId", // Users model field is "userId", not "user_id"
          as: "user_snap_shot",
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "hotel_id",
          foreignField: "hotel_id",
          as: "hotel_snap_shot",
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "room_id",
          foreignField: "room_id",
          as: "room_snap_shot",
        },
      },
      {
        $project: {
          _id: 1,
          booking_id: 1,
          check_in: 1,
          check_out: 1,
          nights: 1,
          guests: 1,
          total_price: 1,
          status: 1,
          notes: 1,
 
          // -- user detail (password intentionally excluded) --
          user_id: 1,
          user_name: { $arrayElemAt: ["$user_snap_shot.userName", 0] },
          user_email: { $arrayElemAt: ["$user_snap_shot.email", 0] },
 
          // -- hotel detail --
          hotel_id: 1,
          hotel_name: { $arrayElemAt: ["$hotel_snap_shot.hotel_name", 0] },
          location: { $arrayElemAt: ["$hotel_snap_shot.location", 0] },
 
          // -- room detail --
          room_id: 1,
          room_number: { $arrayElemAt: ["$room_snap_shot.room_number", 0] },
          room_type: { $arrayElemAt: ["$room_snap_shot.room_type", 0] },
          room_information: {
            $arrayElemAt: ["$room_snap_shot.room_information", 0],
          },
        },
      },
    ]);
 
    if (!booking.length) {
      return res.status(404).json({ message: "Booking not found" });
    }
 
    res.status(200).json(booking[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update booking
const updateBooking = async (req, res) => {
  try {
    const {
      user_id,
      hotel_id,
      room_id,
      check_in,
      check_out,
      nights,
      guests,
      total_price,
      status,
      notes,
    } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // assign + .save() instead of findByIdAndUpdate so the pre("save")
    // hook recalculates "night" whenever check_in/check_out changes
    if (user_id !== undefined) booking.user_id = user_id;
    if (hotel_id !== undefined) booking.hotel_id = hotel_id;
    if (room_id !== undefined) booking.room_id = room_id;
    if (check_in !== undefined) booking.check_in = check_in;
    if (check_out !== undefined) booking.check_out = check_out;
    if (guests !== undefined) booking.guests = guests;
    if (total_price !== undefined) booking.total_price = total_price;
    if (status !== undefined) booking.status = status;
    if (notes !== undefined) booking.notes = notes;

    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBooking,
  getOneBooking,
  updateBooking,
  deleteBooking,
};
