const Hotel = require("../models/Hotel");
const {
  fileToPath,
  parseMaybeJson,
  pickDefined,
} = require("../utils/upload");

const createHotel = async (req, res) => {
  try {
    const {
      hotel_id,
      hotel_name,
      star_rating,
      location, // { street, city, country }
      contact, // { phone, email }
      image,
      available_rooms,
    } = req.body;
    const parsedLocation = parseMaybeJson(location) || {};
    const parsedContact = parseMaybeJson(contact) || {};
    const hotelImage = fileToPath(req.file) || image;

    const hotelExists = await Hotel.findOne({ hotel_id });
    if (hotelExists) {
      return res.status(400).json({ message: "Hotel ID already exists" });
    }

    const hotel = await Hotel.create({
      hotel_id,
      hotel_name,
      star_rating,
      location: {
        street: parsedLocation?.street,
        city: parsedLocation?.city,
        country: parsedLocation?.country,
      },
      contact: {
        phone: parsedContact?.phone,
        email: parsedContact?.email,
      },
      image: hotelImage,
      available_rooms,
    });

    res.status(201).json({
      message: "Hotel created successfully",
      hotel,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllHotel = async (req, res) => {
  try {
    const hotel = await Hotel.find();
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOneHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateHotel = async (req, res) => {
  try {
    const {
      hotel_id,
      hotel_name,
      star_rating,
      location,
      contact,
      image,
      available_rooms,
    } = req.body;
    const parsedLocation = parseMaybeJson(location);
    const parsedContact = parseMaybeJson(contact);
    const hotelImage = fileToPath(req.file) || image;

    const payload = pickDefined({
      hotel_id,
      hotel_name,
      star_rating,
      location: parsedLocation,
      contact: parsedContact,
      image: hotelImage,
      available_rooms,
    });

    const hotel = await Hotel.findByIdAndUpdate(req.params.id, {
      ...payload,
    },
    {
      new:true,
      runValidators: true
    }
  );
  res.status(201).json({message: "update successfull", hotel})
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteHotel = async (req, res)=>{
  try{
    const hotel = await Hotel.findByIdAndDelete(req.params.id)
    if(!hotel){
      res.status(404).json({message: "Hotel Not Found"})
    }
    res.status(200).json({message: "delete successful"})
  }
  catch(err){
    res.status(500).json(err.message);
  }
}

module.exports = {
  createHotel,
  getAllHotel,
  getOneHotel,
  updateHotel,
  deleteHotel
};
