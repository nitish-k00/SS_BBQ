const express = require("express");
const { tokenCheck } = require("../midlleware/tokenCheack");
const { cheackIsAdmin } = require("../midlleware/adminCheack");
const router = express.Router();
const {
  allOrders,
  ordersToday,
  singleOrders,
  deliveryStatusChange,
  userOrders,
  GetSingleUsersOrders,
  allOrdersDate,
  ordersTodayData,
  allOrdersByDate,
  comparisonData,
} = require("../controller/orders");

router.get("/allOrders", tokenCheck, cheackIsAdmin, allOrders);
router.get("/todayOrders", tokenCheck, cheackIsAdmin, ordersToday);
router.get("/singleOrder/:id", tokenCheck, cheackIsAdmin, singleOrders);
router.put(
  "/deliveryStatusChange/:id",
  tokenCheck,
  cheackIsAdmin,
  deliveryStatusChange
);
router.get("/userOrders", tokenCheck, userOrders);
router.get(
  "/GetSingleUsersOrders/:id",
  tokenCheck,
  cheackIsAdmin,
  GetSingleUsersOrders
);

router.get("/allOrdersDate", tokenCheck, cheackIsAdmin, allOrdersDate);
router.get("/ordersTodayData", tokenCheck, cheackIsAdmin, ordersTodayData);
router.get("/allOrdersByDate", tokenCheck, cheackIsAdmin, allOrdersByDate);
router.get("/comparisonData", comparisonData);

allOrdersByDate;

module.exports = router;
