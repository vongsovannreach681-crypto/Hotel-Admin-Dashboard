const express = require("express");
const router = express.Router();

const {
    createRooms,
    getAllRoom,
    getOneRoom,
    updateRoom,
    deleteRoom
}= require('../controller/roomsController')
const { upload } = require("../utils/upload");

router.post('/', upload.array("image", 10), createRooms)
router.get('/', getAllRoom)
router.get('/:id', getOneRoom)
router.put('/:id', upload.array("image", 10), updateRoom)
router.delete('/:id', deleteRoom)

module.exports= router;
