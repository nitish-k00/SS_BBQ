const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },

  description: { type: String },

  discountType: { type: String, enum: ["percentage", "fixed"], required: true },

  discountValue: { type: Number, required: true },

  expiryDate: { type: Date, required: true },

  maxUses: { type: Number, default: 1 },

  uses: { type: Number, default: 0 },

  active: { type: Boolean, default: true },

  minOrderValue: { type: Number, default: 0 },

  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "usersInfo" }],
});

const CouponModel = mongoose.model("Coupons", couponSchema);

module.exports = CouponModel;
