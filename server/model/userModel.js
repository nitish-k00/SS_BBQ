const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
  address: {
    type: String,
    default: "",
  },
  MapAddress: {
    type: String,
    default: "",
  },
  latitude: {
    type: String,
    default: "",
  },
  longitude: {
    type: String,
    default: "",
  },
  phoneNo: {
    type: String,
    default: "",
  },
  avator: {
    type: String,
    default: "",
  },
  googleId: {
    type: String,
  },
  role: {
    type: Number,
    default: 0,
  },
});

const userModel = mongoose.model("usersInfo", userSchema);

module.exports = userModel;
