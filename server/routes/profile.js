const express = require("express");
const route = express.Router();
const {
  profileInfo,
  editProfile,
  mapsAddresAPIProfile,
} = require("../controller/profile");
const { tokenCheck } = require("../midlleware/tokenCheack");

route.get("/profileInfo", tokenCheck, profileInfo);
route.post("/editProfile", tokenCheck, editProfile);
route.get("/maps-addres-api", mapsAddresAPIProfile);

module.exports = route;
