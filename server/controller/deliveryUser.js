const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const {
  accessTokens,
  refreshTokens,
  uiTokens,
} = require("../midlleware/setToken");
const DeliveryUser = require("../model/deliveryUser");
dotenv.config();

const login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const existingUser = await DeliveryUser.findOne({ phone });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Phone Number or password is incorrect" });
    }

    if (existingUser.password) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser?.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Phone Number or password is incorrect" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Phone Number or password is incorrect" });
    }

    accessTokens(
      res,
      existingUser._id,
      existingUser.role,
      existingUser.accepted,
      existingUser.blocked
    );
    refreshTokens(
      req,
      existingUser._id,
      existingUser.role,
      existingUser.accepted,
      existingUser.blocked
    );
    const token = uiTokens(existingUser._id, existingUser.role);

    return res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const register = async (req, res) => {
  const { name, email, phone, reenterpassword, otp, driveingLisense } =
    req.body;
  const contact = `+91${phone}`;
  const storedOtpData = req.session.generatedOTP[contact];
  console.log(storedOtpData, phone, "d");

  // if (!storedOtpData) {
  //   return res.status(400).json({
  //     message: "OTP expired or not found. Please generate a new OTP.",
  //   });
  // }

  try {
    if (Date.now() > storedOtpData.OTPExpiresAt) {
      delete req.session.generatedOTP[phone];
      return res.status(400).json({
        message: "OTP expired or not found. Please generate a new OTP.",
      });
    }
    if (storedOtpData.OTP !== otp) {
      return res.status(501).json({ message: "ivalid otp" });
    }

    const hashedPass = await bcrypt.hash(reenterpassword, 10);
    const newUser = new DeliveryUser({
      name,
      email,
      password: hashedPass,
      phone,
      driveingLisense,
    });
    await newUser.save();

    delete req.session.otpLimits[phone];
    delete req.session.generatedOTP[phone];

    const existingUser = await DeliveryUser.findOne({ phone });
    accessTokens(
      res,
      existingUser._id,
      existingUser.role,
      existingUser.accepted,
      existingUser.blocked
    );
    refreshTokens(
      req,
      existingUser._id,
      existingUser.role,
      existingUser.accepted,
      existingUser.blocked
    );
    const token = uiTokens(existingUser._id, existingUser.role);
    return res.status(200).json({ message: "Registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetDeliverySingleUsers = async (req, res) => {
  const userId = req.params.id;
  try {
    const allUsers = await DeliveryUser.findById(userId);

    if (!allUsers) {
      return res.status(404).json({ message: "User not found" });
    }

    const { _id, name, email, phone } = allUsers.toObject();

    const users = {
      id: _id,
      name: name,
      email: email,
      phone: phone,
    };
    return res.status(200).json({ message: "all users", users: users });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const editDeliveryProfile = async (req, res) => {
  try {
    const { avator } = req.body;
    const user = req.user;
    const deliveryUser = await DeliveryUser.findByIdAndUpdate(
      user._id,
      { avatar: avator },
      {
        new: true,
      }
    );
    const { password, online, deliveryStatus, role, ...rest } =
      deliveryUser._doc;

    return res
      .status(200)
      .json({ message: "user info updated", userData: rest });
  } catch (error) {
    return res.status(501).json({ message: "internal server error" });
  }
};

const GetForgotPasswordEmailDelivery = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingEmail = await DeliveryUser.findOne({ email });

    if (!existingEmail || !existingEmail.password) {
      return res.status(404).json({ message: "User not found" });
    }
    req.session.forgotPasswordEmail = email;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPasswordOtpCheackDelivery = async (req, res) => {
  const { otp } = req.body;
  const email = req.session.forgotPasswordEmail;
  const storedOtpData = req.session.generatedOTP[email];
  console.log(storedOtpData, email, "d");

  if (!email) {
    return res.status(400).json({
      message: " Please Enter Email ",
    });
  }
  try {
    if (Date.now() > storedOtpData.OTPExpiresAt) {
      delete req.session.generatedOTP[email];
      return res.status(400).json({
        message: "OTP expired or not found. Please generate a new OTP.",
      });
    }
    if (storedOtpData.OTP !== otp) {
      return res.status(501).json({ message: "invalid otp" });
    }
    return res
      .status(200)
      .json({ message: "OTP verified, proceed to reset password" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const NewPaawordDelivery = async (req, res) => {
  const { password } = req.body;
  const email = req.session.forgotPasswordEmail;

  if (!email) {
    return res.status(400).json({
      message:
        "Invalid session. Please start the password reset process again.",
    });
  }
  try {
    const existingEmail = await DeliveryUser.findOne({ email });
    if (!existingEmail) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    existingEmail.password = hashedPass;
    await existingEmail.save();
    delete req.session.forgotPasswordEmail;
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetDeliveryRegisteredUsers = async (req, res) => {
  try {
    const allUsers = await DeliveryUser.find({ accepted: "false" });

    if (!allUsers) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = allUsers.map((allUsers) => {
      return {
        id: allUsers._id,
        name: allUsers.name,
        email: allUsers.email,
        phone: allUsers.phone,
        driveingLisense: allUsers.driveingLisense,
      };
    });
    return res.status(200).json({ message: "all users", users: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeliveryResisterAccepect = async (req, res) => {
  const userId = req.params.id;
  try {
    const Users = await DeliveryUser.findByIdAndUpdate(
      userId,
      { accepted: true },
      { new: true }
    );

    if (!Users) {
      return res.status(404).json({ message: "User not found" });
    }
    const allUsers = await DeliveryUser.find({ accepted: "false" });
    const users = allUsers.map((allUsers) => {
      return {
        id: allUsers._id,
        name: allUsers.name,
        email: allUsers.email,
        phone: allUsers.phone,
        driveingLisense: allUsers.driveingLisense,
      };
    });
    return res.status(200).json({ message: "updated", users: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeliveryManBlockUnBlock = async (req, res) => {
  const userId = req.params.id;
  try {
    const Users = await DeliveryUser.findByIdAndUpdate(userId);

    Users.blocked = !Users.blocked;

    await Users.save();

    if (!Users) {
      return res.status(404).json({ message: "User not found" });
    }
    const allUsers = await DeliveryUser.find({ accepted: "true" });
    const users = allUsers.map((allUsers) => {
      return {
        deliveryManId: allUsers._id,
        name: allUsers.name,
        email: allUsers.email,
        contact: allUsers.phone,
        status: allUsers.deliveryStatus,
        blocked: allUsers.blocked,
      };
    });
    return res.status(200).json({ message: "updated", users: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  register,
  GetDeliverySingleUsers,
  editDeliveryProfile,
  GetForgotPasswordEmailDelivery,
  forgotPasswordOtpCheackDelivery,
  NewPaawordDelivery,
  GetDeliveryRegisteredUsers,
  DeliveryResisterAccepect,
  DeliveryManBlockUnBlock,
};
