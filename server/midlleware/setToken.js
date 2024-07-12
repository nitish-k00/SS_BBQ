const jwt = require("jsonwebtoken");

const accessTokens = (
  res,
  existingUserId,
  existingUserRole,
  existingUserAaccepted,
  existingUserBlocked
) => {
  try {
    const accessTokens = jwt.sign(
      {
        _id: existingUserId,
        role: existingUserRole,
        accepted: existingUserAaccepted,
        blocked: existingUserBlocked,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("jwtaccess", accessTokens, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 10000,
    });
  } catch (error) {
    console.log(error);
  }
};

const refreshTokens = (
  req,
  existingUserId,
  existingUserRole,
  existingUserAaccepted,
  existingUserBlocked
) => {
  try {
    const refreshTokens = jwt.sign(
      {
        _id: existingUserId,
        role: existingUserRole,
        accepted: existingUserAaccepted,
        blocked: existingUserBlocked,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    req.session.refreshToken = refreshTokens;
  } catch (error) {
    console.log(error);
  }
};

const uiTokens = (
  res,
  existingUserId,
  existingUserRole,
  existingUserAccepted
) => {
  try {
    const accessTokens = jwt.sign(
      {
        _id: existingUserId,
        role: existingUserRole,
        accepted: existingUserAccepted,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("uiToken", accessTokens, {
      sameSite: "Strict",
      maxAge: 60 * 60 * 10000,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { accessTokens, refreshTokens, uiTokens };
