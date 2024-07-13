const DeliveryUser = require("../model/deliveryUser");
const userModel = require("../model/userModel");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const profileInfo = async (req, res) => {
  try {
    const user = req.user;
    const userData = await userModel.findById(user._id);
    const deliveryUser = await DeliveryUser.findById(user._id);
    if (userData) {
      const { password, googleId, _id, role, ...rest } = userData._doc;

      return res.status(200).json({ userData: rest });
    } else {
      const { password, online, deliveryStatus, role, ...rest } =
        deliveryUser._doc;
      return res.status(200).json({ userData: rest });
    }
  } catch (error) {
    return res.status(501).json({ message: "internal server error" });
  }
};

const editProfile = async (req, res) => {
  try {
    const updatedData = req.body;
    const user = req.user;
    const userData = await userModel.findByIdAndUpdate(user._id, updatedData, {
      new: true,
    });

    const { password, _id, googleId, role, ...rest } = userData._doc;

    return res
      .status(200)
      .json({ message: "user info updated", userData: rest });
  } catch (error) {
    return res.status(501).json({ message: "internal server error" });
  }
};

const mapsAddresAPIProfile = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
    );
    res.status(200).json({
      detail: response.data.features[0].place_name,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
    console.log(error);
  }
};

module.exports = { profileInfo, editProfile, mapsAddresAPIProfile };
