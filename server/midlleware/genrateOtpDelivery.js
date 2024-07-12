const otpGenerator = require("otp-generator");
const sendOtpViaSMS = require("./contact");

const generateOTPDelivery = async (req, res) => {
  const contact = `+91${9080877144}` || req.body.contact;

  if (!contact) {
    return res.status(400).json({ message: "contact is required" });
  }

  try {
    if (!req.session.generatedOTPDelivery) {
      req.session.generatedOTPDelivery = {};
    }

    const generatedOTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    req.session.generatedOTPDelivery[contact] = {
      OTP: generatedOTP,
    };

    await sendOtpViaSMS(contact, generatedOTP);
    return res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { generateOTPDelivery };
