const jwt = require("jsonwebtoken");
const { accessTokens } = require("../midlleware/setToken");
const tokenCheck = (req, res, next) => {
  const accessToken = req.cookies.jwtaccess;
  const refreshToken = req.session.refreshToken;

  // console.log(accessToken,refreshToken)

  if (!accessToken && !refreshToken) {
    return res
      .status(401)
      .json({ message: " your session expried login again " });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: " Unauthorized access" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: " your session expried login again " });
    }
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      req.user = decoded;
      accessTokens(res, decoded._id, decoded.role);
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "  your session expried login again " });
    }
  }
};

module.exports = { tokenCheck };
