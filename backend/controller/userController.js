const User = require("../models/Users");
const {
  fileToPath,
  pickDefined,
} = require("../utils/upload");

// create user

const createUser = async (req, res) => {
  try {
    const { userId, userName, email, password, avatar, isActive, booking_id } =
      req.body;
    const userAvatar = fileToPath(req.file) || avatar;

    // email handling
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({
      userId,
      userName,
      email,
      password,
      avatar: userAvatar,
      isActive,
      booking_id,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// getAll

const getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get by id

const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// updateuser

const updateUser = async (req, res) => {
  try {
    const { userName, email, password, avatar, isActive, booking_id } = req.body;
    const userAvatar = fileToPath(req.file);
    const payload = pickDefined({
      userName,
      email,
      password,
      avatar: userAvatar || avatar,
      isActive,
      booking_id,
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
    }
    res.status(200).json({
      message: "Delete Succesfull",
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};



module.exports = {
  createUser,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser
};
