const mongoose = require("mongoose");

const deliveryUserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  role: {
    type: Number,
    default: 2,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  driveingLisense: {
    type: String,
    default: "",
  },
  deliveryStatus: {
    type: String,
    enum: ["available", "pending"],
    default: "available",
  },
});

const DeliveryUser = mongoose.model("DeliveryUser", deliveryUserSchema);

module.exports = DeliveryUser;
