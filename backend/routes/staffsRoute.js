const express = require("express");
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getOneStaff,
  updateStaff,
  deleteStaff,
} = require("../controller/staffsController");

router.post("/", createStaff);
router.get("/", getAllStaff);
router.get("/:id", getOneStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;