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
        $project: {
          payment_id: 1,
          transaction: 1,
          status: 1,
          payment_method: 1,
          check_in: { $arrayElemAt: ["$booking_snap_shot.check_in", 0] },
          check_out: { $arrayElemAt: ["$booking_snap_shot.check_out", 0] },
          total_price: { $arrayElemAt: ["$booking_snap_shot.total_price", 0] },
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
