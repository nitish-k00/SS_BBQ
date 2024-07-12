const express = require("express");
const { tokenCheck } = require("../midlleware/tokenCheack");
const {
  addAndRemoveFav,
  getFav,
  favColour,
} = require("../controller/favourite");
const route = express.Router();

route.post("/addAndRemoveFav/:productId", tokenCheck, addAndRemoveFav);
route.get("/fav", tokenCheck, getFav);
route.get("/favColour", tokenCheck, favColour);

module.exports = route;
