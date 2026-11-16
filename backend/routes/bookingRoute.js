const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBooking,
  getOneBooking,
  updateBooking,
  deleteBooking,
} = require("../controller/BookingController");

router.post("/", createBooking);
router.get("/", getAllBooking);
router.get("/:id", getOneBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;