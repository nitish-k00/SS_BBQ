const express = require("express");
const {
  addToCart,
  getCart,
  Quantity,
  removeFromCart,
  cartcheack,
  cartCouponCheack,
} = require("../controller/cart");
const { tokenCheck } = require("../midlleware/tokenCheack");
const route = express.Router();

route.get("/carts", tokenCheck, getCart);
route.get("/cartcheack", tokenCheck, cartcheack);
route.post("/addtocart", tokenCheck, addToCart);
route.put("/updateQuantatiy", tokenCheck, Quantity);
route.delete("/removeFromCart/:productId", tokenCheck, removeFromCart);

route.get("/cartCouponCheack", tokenCheck, cartCouponCheack);

module.exports = route;
