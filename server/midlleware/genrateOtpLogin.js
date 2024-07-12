const otpGenerator = require("otp-generator");

const sendOtpViaSMS = require("./contact");

const generateOTPDeliveryRegister = async (req, res) => {
  const contact = `+91${9080877144}`;
  const phone = `+91${req.body.phone}`;

  if (!contact) {
    return res.status(400).json({ message: "Phone Number is required" });
  }

  try {
    // Initialize session object for otpLimits if not already done
    if (!req.session.otpLimits) {
      req.session.otpLimits = {};
    }
    if (!req.session.generatedOTP) {
      req.session.generatedOTP = {};
    }

    const currentEmailLimit = req.session.otpLimits[phone] || {
      count: 0,
      limitTime: Date.now(),
    };

    // Check if limit is reached and if the limit time has expired
    if (
      currentEmailLimit.count >= 5 &&
      currentEmailLimit.limitTime > Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "OTP limit reached, try again later" });
    }

    // Reset count if limit time has expired
    if (currentEmailLimit.limitTime < Date.now()) {
      req.session.otpLimits[phone] = { count: 0, limitTime: Date.now() };
    }

    const generatedOTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Update the session with the new OTP limit and OTP details
    req.session.otpLimits[phone] = {
      count: (currentEmailLimit.count || 0) + 1,
      limitTime: Date.now() + 1800000, // 30 minutes
    };
    req.session.generatedOTP[phone] = {
      OTP: generatedOTP,
      OTPExpiresAt: Date.now() + 60000, // 1 minute
    };

    await sendOtpViaSMS(contact, generatedOTP);
    console.log(generatedOTP);

    return res.status(201).json({ code: generatedOTP });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { generateOTPDeliveryRegister };
