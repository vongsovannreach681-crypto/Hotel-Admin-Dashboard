const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MongoDB connection error: MONGO_URI is not defined in environment variables.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);

    const db = conn.connection.db;

    // Existing collections
    const existingCollections = (await db.listCollections().toArray()).map(
      (c) => c.name
    );

    const requiredCollections = ["users", "hotels", "rooms", "staff", "bookings", "payments"];

    for (const name of requiredCollections) {
      if (!existingCollections.includes(name)) {
        await db.createCollection(name);
        console.log(`Created collection: ${name}`);
      }
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
  }
};

module.exports = connectDB;
