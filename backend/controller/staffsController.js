const Staff = require("../models/Staffs");
const mongoose = require("mongoose");
const { parseMaybeJson, pickDefined } = require("../utils/upload");
// create staff
const createStaff = async (req, res) => {
  try {
    const {
      staff_id,
      hotel_id,
      full_name,
      position,
      contact,
      salary,
      date_of_birth,
      isActive,
    } = req.body;

    const parsedContact = parseMaybeJson(contact);

    const staff = await Staff.create({
      staff_id,
      hotel_id,
      full_name,
      position,
      contact: parsedContact,
      salary,
      date_of_birth,
      isActive,
    });

    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// getAll
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get by id
const getOneStaff = async (req, res) => {
  try {
    const staff = await Staff.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
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
        $project: {
          _id: 1,
          staff_id: 1,
          hotel_id: 1,
          full_name: 1,
          position: 1,
          contact: 1,
          salary: 1,
          date_of_birth: 1,
          isActive: 1,
          hotel_name: { $arrayElemAt: ["$hotel_snap_shot.hotel_name", 0] },
          location: { $arrayElemAt: ["$hotel_snap_shot.location", 0] },
        },
      },
    ]);
 
    if (!staff.length) {
      return res.status(404).json({ message: "Staff not found" });
    }
 
    res.status(200).json(staff[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update staff
const updateStaff = async (req, res) => {
  try {
    const {
      hotel_id,
      full_name,
      position,
      contact,
      salary,
      date_of_birth,
      isActive,
    } = req.body;

    const parsedContact = parseMaybeJson(contact);

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      pickDefined({
        hotel_id,
        full_name,
        position,
        contact: parsedContact,
        salary,
        date_of_birth,
        isActive,
      }),
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete staff
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStaff,
  getAllStaff,
  getOneStaff,
  updateStaff,
  deleteStaff,
};
