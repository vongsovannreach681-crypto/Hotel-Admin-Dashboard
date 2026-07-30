const Payment = require("../models/Payments");
const mongoose = require("mongoose");

// create payment
const createPayment = async (req, res) => {
  try {
    const {
      payment_id,
      booking_id,
      payment_method,
      status,
      transaction,
      paid_at,
    } = req.body;
 
    const payment = await Payment.create({
      payment_id,
      booking_id,
      payment_method,
      status,
      transaction,
      paid_at,
    });
 
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// getAll

const getAllPayment = async (req, res)=>{
    try{
        const payment = await Payment.find();
        res.status(200).json(payment)
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

const getOnePayment = async (req, res) => {
  try {
    const payment = await Payment.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "booking_id",
          foreignField: "booking_id",
          as: "booking_snap_shot",
        },
      },
      {
        $unwind: {
          path: "$booking_snap_shot",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "booking_snap_shot.user_id",
          foreignField: "userId",
          as: "user_snap_shot",
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "booking_snap_shot.hotel_id",
          foreignField: "hotel_id",
          as: "hotel_snap_shot",
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "booking_snap_shot.room_id",
          foreignField: "room_id",
          as: "room_snap_shot",
        },
      },
      {
        $project: {
          payment_id: 1,
          booking_id: 1,
          transaction: 1,
          status: 1,
          payment_method: 1,
          paid_at: 1,
          booking: {
            booking_id: "$booking_snap_shot.booking_id",
            check_in: "$booking_snap_shot.check_in",
            check_out: "$booking_snap_shot.check_out",
            nights: "$booking_snap_shot.nights",
            guests: "$booking_snap_shot.guests",
            total_price: "$booking_snap_shot.total_price",
            status: "$booking_snap_shot.status",
            user_id: "$booking_snap_shot.user_id",
            user_name: { $arrayElemAt: ["$user_snap_shot.userName", 0] },
            user_email: { $arrayElemAt: ["$user_snap_shot.email", 0] },
            hotel_id: "$booking_snap_shot.hotel_id",
            hotel_name: { $arrayElemAt: ["$hotel_snap_shot.hotel_name", 0] },
            room_id: "$booking_snap_shot.room_id",
            room_number: { $arrayElemAt: ["$room_snap_shot.room_number", 0] },
            room_type: { $arrayElemAt: ["$room_snap_shot.room_type", 0] },
          },
        },
      },
    ]);

    if (!payment.length) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const {
      payment_id,
      booking_id,
      payment_method,
      status,
      transaction,
      paid_at,
    } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        payment_id,
        booking_id,
        payment_method,
        status,
        transaction,
        paid_at,
      },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete payment
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPayment,
  getAllPayment,
  getOnePayment,
  updatePayment,
  deletePayment
};
