const express = require("express");
const {
  getAllCoupon,
  removeCoupon,
  ValidateCoupon,
  createCoupon,
  getAllCouponUser,
  editCoupon,
  deleteCoupon,
} = require("../controller/coupon");
const { tokenCheck } = require("../midlleware/tokenCheack");
const { cheackIsAdmin } = require("../midlleware/adminCheack");
const route = express.Router();

route.get("/allCoupans", tokenCheck, getAllCoupon);
route.get("/getAllCouponUser", tokenCheck, getAllCouponUser);
route.delete("/removeCoupons", tokenCheck, removeCoupon);
route.post("/validateCoupans", tokenCheck, ValidateCoupon);

route.post("/createCoupons", cheackIsAdmin, createCoupon);
route.delete("/deleteCoupons", cheackIsAdmin, deleteCoupon);
route.put("/editCoupon", cheackIsAdmin, editCoupon);

module.exports = route;
