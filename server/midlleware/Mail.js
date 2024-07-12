const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const dotenv = require("dotenv");
dotenv.config();
const Client = process.env.FRONT_END_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "SS BBQ",
    link: "https://mailgen.js/",
    logo: `${Client}/img/logo.png`,
  },
});

const sendOTPEmail = async (email, otp, content) => {
  console.log(email, "mail");
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const userName = email.split("@")[0];

  const registrationContent = `
<div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px;">
  <div style="text-align: center; padding: 10px 0;">
    <h1 style="font-size: 28px; font-weight: bold; color: #ff6600;">SS BBQ</h1>
    <hr style="border: none; border-top: 1px solid #ff6600; margin: 10px 0;">
  </div>
  <div style="text-align: center; padding: 20px;">
    <p style="font-size: 18px; color: #333;">Dear ${userName},</p>
    <p style="font-size: 16px; color: #333;">We are thrilled to have you as part of our SS BBQ family!</p>
    <p style="font-size: 16px; color: #333;">For your security, we have generated a One-Time Password (OTP) for <strong>REGISTRATION</strong> .</p>
    <p style="font-size: 20px; color: #ff6600;"><strong>Your OTP is ${otp}</strong></p>
    <p style="font-size: 16px; color: #333;">It is valid for the next 1 minute.</p>
  </div>
  <div style="text-align: center; font-size: 14px; color: #aaa; padding: 10px 0;">
    <p>Need help, or have questions? Just reply to this email, we'd love to help.</p>
    <p>&copy; 2023 SS BBQ. All rights reserved.</p>
  </div>
</div>`;

  const forgotPasswordContent = `
<div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px;">
  <div style="text-align: center; padding: 10px 0;">
    <h1 style="font-size: 28px; font-weight: bold; color: #ff6600;">SS BBQ</h1>
    <hr style="border: none; border-top: 1px solid #ff6600; margin: 10px 0;">
  </div>
  <div style="text-align: center; padding: 20px;">
    <p style="font-size: 18px; color: #333;">Dear ${userName},</p>
    <p style="font-size: 16px; color: #333;">We have received a request to <strong>Reset your Password</strong> .</p>
    <p style="font-size: 16px; color: #333;">For your security, we have generated a One-Time Password (OTP) just for you.</p>
    <p style="font-size: 20px; color: #ff6600;"><strong>Your OTP is ${otp}</strong></p>
    <p style="font-size: 16px; color: #333;">It is valid for the next 1 minute.</p>
  </div>
  <div style="text-align: center; font-size: 14px; color: #aaa; padding: 10px 0;">
    <p>Need help, or have questions? Just reply to this email, we'd love to help.</p>
    <p>&copy; 2023 SS BBQ. All rights reserved.</p>
  </div>
</div>`;

  const commonContent = {
    body: {
      name: userName,
      intro:
        content === "registration"
          ? registrationContent
          : forgotPasswordContent,
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  // Generate an HTML email with the provided contents
  const emailBody = mailGenerator.generate(commonContent);

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code from SS BBQ",
    html: emailBody,
  };

  try {
    await transporter.sendMail(message);
    console.log("OTP email sent");
  } catch (error) {
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { sendOTPEmail };
