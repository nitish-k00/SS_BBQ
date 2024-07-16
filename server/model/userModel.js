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
<<<<<<< HEAD
=======
   
>>>>>>> 2f7e8a854292f4a07210494b3f4cbc8ffccbc182
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
