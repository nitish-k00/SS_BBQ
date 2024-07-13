const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const {
  accessTokens,
  refreshTokens,
  uiTokens,
} = require("../midlleware/setToken");
dotenv.config();
const Client = process.env.FRONT_END_URL || "http://localhost:3000";

const register = async (req, res) => {
  const { name, email, reenterpassword, otp } = req.body;
  const storedOtpData = req.session.generatedOTP[email];
  console.log(storedOtpData, email, "d");

  // if (!storedOtpData) {
  //   return res.status(400).json({
  //     message: "OTP expired or not found. Please generate a new OTP.",
  //   });
  // }

  try {
    if (Date.now() > storedOtpData.OTPExpiresAt) {
      delete req.session.generatedOTP[email];
      return res.status(400).json({
        message: "OTP expired or not found. Please generate a new OTP.",
      });
    }
    if (storedOtpData.OTP !== otp) {
      return res.status(501).json({ message: "ivalid otp" });
    }

    const hashedPass = await bcrypt.hash(reenterpassword, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPass,
    });
    await newUser.save();

    delete req.session.otpLimits[email];
    delete req.session.generatedOTP[email];

    const existingUser = await userModel.findOne({ email });
    accessTokens(res, existingUser._id, existingUser.role);
    refreshTokens(req, existingUser._id, existingUser.role);
    const token = uiTokens(existingUser._id, existingUser.role);

    return res.status(200).json({ message: "Registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    if (existingUser.password) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser?.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    accessTokens(res, existingUser._id, existingUser.role);
    refreshTokens(req, existingUser._id, existingUser.role);
    const token = uiTokens(existingUser._id, existingUser.role);

    return res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.clearCookie("uiToken");
    res.clearCookie("jwtaccess"); // Clear JWT access token cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
};

const uiToken = (req, res) => {
  try {
    res.clearCookie("uiToken");
    res.status(200).json({ message: "uiToken cookie cleared successfully" });
  } catch (error) {
    console.error("Error clearing uiToken cookie:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetForgotPasswordEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingEmail = await userModel.findOne({ email });

    if (!existingEmail || !existingEmail.password) {
      return res.status(404).json({ message: "User not found" });
    }
    req.session.forgotPasswordEmail = email;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPasswordOtpCheack = async (req, res) => {
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
      return res.status(501).json({ message: "ivalid otp" });
    }
    return res
      .status(200)
      .json({ message: "OTP verified, proceed to reset password" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const NewPaaword = async (req, res) => {
  const { password } = req.body;
  const email = req.session.forgotPasswordEmail;

  if (!email) {
    return res.status(400).json({
      message:
        "Invalid session. Please start the password reset process again.",
    });
  }
  try {
    const existingEmail = await userModel.findOne({ email });
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

const GetAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find({ role: 0 });

    if (!allUsers) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedUsers = allUsers.map((data) => {
      return {
        id: data._id,
        name: data.name,
        email: data.email,
        address: data.address,
        MapAddress: data.MapAddress,
        phone: data.phoneNo,
      };
    });

    return res
      .status(200)
      .json({ message: "all users", users: formattedUsers });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetSingleUsers = async (req, res) => {
  const userId = req.params.id;
  try {
    const allUsers = await userModel.findById(userId);

    if (!allUsers) {
      return res.status(404).json({ message: "User not found" });
    }

    const { _id, name, email, address, MapAddress, phoneNo } =
      allUsers.toObject();

    const users = {
      id: _id,
      name: name,
      email: email,
      address: address,
      MapAddress: MapAddress,
      phone: phoneNo,
    };
    return res.status(200).json({ message: "all users", users: users });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  uiToken,
  GetForgotPasswordEmail,
  forgotPasswordOtpCheack,
  NewPaaword,
  GetAllUsers,
  GetSingleUsers,
};
