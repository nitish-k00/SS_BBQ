const express = require("express");
const {
  register,
  login,
  GetDeliverySingleUsers,
  editDeliveryProfile,
  forgotPasswordOtpCheackDelivery,
  NewPaawordDelivery,
  GetForgotPasswordEmailDelivery,
  GetDeliveryRegisteredUsers,
  DeliveryResisterAccepect,
  DeliveryManBlockUnBlock,
} = require("../controller/deliveryUser");
const { cheackIsAdmin } = require("../midlleware/adminCheack");
const { tokenCheck } = require("../midlleware/tokenCheack");
const { generateOTP } = require("../midlleware/genateOtp");
const {
  allReadyRegisterdDelivery,
} = require("../midlleware/allreadyRegistered");
const {
  generateOTPDeliveryRegister,
} = require("../midlleware/genrateOtpLogin");

const route = express.Router();

route.post(
  "/generateOTPDeliveryRegister",
  allReadyRegisterdDelivery,
  generateOTPDeliveryRegister
);
route.post("/delivery-register", register);
route.post("/delivery-login", login);
route.get(
  "/GetDeliverySingleUsers/:id",
  tokenCheck,
  cheackIsAdmin,
  GetDeliverySingleUsers
);

route.post(
  "/GetForgotPasswordEmailDelivery",
  GetForgotPasswordEmailDelivery,
  generateOTP
);

route.post("/forgotPasswordOtpCheackDelivery", forgotPasswordOtpCheackDelivery);
route.post("/NewPaawordDelivery", NewPaawordDelivery);
route.post("/editDeliveryProfile", tokenCheck, editDeliveryProfile);

route.get("/GetDeliveryRegisteredUsers", GetDeliveryRegisteredUsers);
route.put("/GetDeliveryResisterAccepect/:id", DeliveryResisterAccepect);
route.put("/DeliveryManBlockUnBlock/:id", DeliveryManBlockUnBlock);

module.exports = route;
