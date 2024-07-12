const DeliveryUser = require("../model/deliveryUser");
const userModel = require("../model/userModel");

const allReadyRegisterd = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const allReadyRegisterdDelivery = async (req, res, next) => {
  const { phone } = req.body;
  try {
    const existingPhone = await DeliveryUser.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone Number already exists" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { allReadyRegisterd, allReadyRegisterdDelivery };
