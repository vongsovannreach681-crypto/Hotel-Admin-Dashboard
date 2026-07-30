const express = require("express");
const router = express.Router();

const {
    createPayment,
    getAllPayment,
    getOnePayment,
    updatePayment,
    deletePayment
}= require('../controller/paymentsController')

router.post('/', createPayment)
router.get('/', getAllPayment)
router.get('/:id', getOnePayment)
router.put('/:id', updatePayment)
router.delete('/:id', deletePayment)

module.exports= router;