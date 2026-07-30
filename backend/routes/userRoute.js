const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser
  
} = require("../controller/userController");
const { upload } = require("../utils/upload");

router.post("/", upload.single("avatar"), createUser);
router.get("/", getAllUser);
router.get("/:id", getOneUser);
router.put("/:id", upload.single("avatar"), updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
