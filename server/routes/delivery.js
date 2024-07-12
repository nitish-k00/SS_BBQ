const express = require("express");

const {
  deliveryDisplayBox,
  orderPicked,
  ondelivery,
  deliveryOTPcheck,
  deliverdOrder,
  deliveryManInfo,
  SingleDeliveryManInfo,
  deliveryManLOcationUpdate,
} = require("../controller/delivery");
const { checkIsDelivery } = require("../midlleware/deliveryCheck");
const { tokenCheck } = require("../midlleware/tokenCheack");
const { generateOTPDelivery } = require("../midlleware/genrateOtpDelivery");
const { cheackIsAdmin } = require("../midlleware/adminCheack");

const router = express.Router();

router.get("/display-box", tokenCheck, checkIsDelivery, deliveryDisplayBox);
router.post("/conform-Delivery", tokenCheck, checkIsDelivery, orderPicked);
router.get("/on-delivery", tokenCheck, checkIsDelivery, ondelivery);
router.get("/deliverd", tokenCheck, checkIsDelivery, deliverdOrder);
router.post("/delivery-otp", tokenCheck, checkIsDelivery, generateOTPDelivery);
router.post("/delivery-otp-before", generateOTPDelivery);

router.post(
  "/delivery-otp-check",
  tokenCheck,
  checkIsDelivery,
  deliveryOTPcheck
);

router.get("/delivery-Man", tokenCheck, cheackIsAdmin, deliveryManInfo);
router.get(
  "/delivery-Man-info/:id",
  tokenCheck,
  cheackIsAdmin,
  SingleDeliveryManInfo
);
router.put(
  "/delivery-Man-location",
  tokenCheck,
  checkIsDelivery,
  deliveryManLOcationUpdate
);

module.exports = router;
