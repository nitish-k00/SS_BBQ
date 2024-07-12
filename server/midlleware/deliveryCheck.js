const jwt = require("jsonwebtoken");

const checkIsDelivery = (req, res, next) => {
  try {
    const accessToken = req.cookies.jwtaccess;

    if (!accessToken && !req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      decodedToken = req.user;
    }

    console.log(decodedToken);

    if (
      !decodedToken ||
      typeof decodedToken !== "object" ||
      !decodedToken.role
    ) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!decodedToken.accepted || decodedToken.blocked) {
      return res.status(400).json({ message: "User Not verified " });
    }

    if (decodedToken.role === 2 || req.user.role === 2) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden access" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { checkIsDelivery };
