const Room = require("../models/Rooms");
const mongoose = require("mongoose");
const {
  filesToPaths,
  parseMaybeJson,
  pickDefined,
} = require("../utils/upload");

const createRooms = async (req, res) => {
  try {
    const {
      room_id,
      hotel_id,
      booking_id,
      room_number,
      room_type,
      floor,
      description,
      image,
      room_information, // nested object: { price_per_night, status, bed_type }
    } = req.body;
    const parsedRoomInformation = parseMaybeJson(room_information);
    const roomImages = req.files?.length
      ? filesToPaths(req.files)
      : image
        ? Array.isArray(image)
          ? image
          : [image]
        : [];

    const existingRoom = await Room.findOne({ hotel_id, room_number });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "Room number already exists for this hotel" });
    }

    const room = await Room.create({
      room_id,
      hotel_id,
      booking_id,
      room_number,
      room_type,
      floor,
      description,
      image: roomImages,
      room_information: parsedRoomInformation,
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// get all rooms
const getAllRoom = async (req, res) =>{
    try{
        const rooms = await Room.find()
        res.status(200).json(rooms)
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}
const getOneRoom = async (req, res) => {
  try {
    const room = await Room.aggregate([
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
          room_id: 1,
          hotel_id: 1,
          booking_id: 1,
          room_type: 1,
          room_number: 1,
          floor: 1,
          room_information: 1,
          image: 1,
          description: 1,
          hotel_name: { $arrayElemAt: ["$hotel_snap_shot.hotel_name", 0] },
          location: { $arrayElemAt: ["$hotel_snap_shot.location", 0] },
          contact: { $arrayElemAt: ["$hotel_snap_shot.contact", 0] },
        },
      },
    ]);

    if (!room.length) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update room
const updateRoom = async (req, res) => {
  try {
    const {
      hotel_id,
      booking_id,
      room_number,
      room_type,
      floor,
      description,
      image,
      room_information,
    } = req.body;
    const parsedRoomInformation = parseMaybeJson(room_information);
    const roomImages = req.files?.length
      ? filesToPaths(req.files)
      : image
        ? Array.isArray(image)
          ? image
          : [image]
        : undefined;
    const payload = pickDefined({
      hotel_id,
      booking_id,
      room_number,
      room_type,
      floor,
      description,
      image: roomImages,
      room_information: parsedRoomInformation,
    });

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete room
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRooms,
  getAllRoom,
  getOneRoom,
  updateRoom,
  deleteRoom
};
