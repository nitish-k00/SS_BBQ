const mongoose = require("mongoose");

const userCouponSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usersInfo",
  },
  usedCoupons: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Coupons",
  },
});

const userCouponModel = mongoose.model("userCoupons", userCouponSchema);

module.exports = userCouponModel;
