const express = require("express");
const {
  register,
  login,
  logout,
  uiToken,
  GetForgotPasswordEmail,
  forgotPasswordOtpCheack,
  NewPaaword,
  GetAllUsers,
  GetSingleUsers,
} = require("../controller/user");
const { tokenCheck } = require("../midlleware/tokenCheack");
const { cheackIsAdmin } = require("../midlleware/adminCheack");
const { generateOTP } = require("../midlleware/genateOtp");
const passport = require("passport");
const {
  accessTokens,
  refreshTokens,
  uiTokens,
} = require("../midlleware/setToken");
const { allReadyRegisterd } = require("../midlleware/allreadyRegistered");
const route = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const Client = process.env.FRONT_END_URL || "http://localhost:3000";

route.post("/register", register);
route.post("/login", login);
route.post("/genrateotp", allReadyRegisterd, generateOTP);
route.post("/logout", logout);
route.post("/removeUiToken", uiToken);
route.post("/GetForgotPasswordEmail", GetForgotPasswordEmail, generateOTP);
route.post("/forgotPasswordOtpCheack", forgotPasswordOtpCheack);
route.post("/NewPaaword", NewPaaword);
route.post("/genrateotpForgotPassword", generateOTP);

route.get("/GetAllUsers", tokenCheck, cheackIsAdmin, GetAllUsers);
route.get("/GetSingleUsers/:id", tokenCheck, cheackIsAdmin, GetSingleUsers);

route.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

route.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${Client}/login`,
  }),
  (req, res) => {
    const user = req.user;
    accessTokens(res, user._id, user.role);
    refreshTokens(req, user._id, user.role);

    const token = uiTokens(user._id, user.role);

    res.redirect(`${Client}?token=${token}`);
  }
);

module.exports = route;
