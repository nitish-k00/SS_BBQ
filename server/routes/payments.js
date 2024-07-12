const express = require("express");
const { order, paymentCapture } = require("../controller/payment");
const { tokenCheck } = require("../midlleware/tokenCheack");
const router = express.Router();

router.post("/create-order", tokenCheck, order);
router.post("/payment-capture", tokenCheck, paymentCapture);

module.exports = router;
