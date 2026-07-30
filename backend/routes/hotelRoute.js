const express = require("express");
const router = express.Router();

const {
    createHotel,
    getAllHotel,
    getOneHotel,
    updateHotel,
    deleteHotel
}= require('../controller/hotelsController');
const { upload } = require("../utils/upload");

router.post('/', upload.single("image"), createHotel)
router.get('/', getAllHotel)
router.get('/:id', getOneHotel)
router.put('/:id', upload.single("image"), updateHotel)
router.delete('/:id', deleteHotel)

module.exports= router;
