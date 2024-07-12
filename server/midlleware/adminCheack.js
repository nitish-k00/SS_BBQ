const jwt = require("jsonwebtoken");

const cheackIsAdmin = (req, res, next) => {
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

    if (
      !decodedToken ||
      typeof decodedToken !== "object" ||
      !decodedToken.role
    ) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (decodedToken.role === 1 || req.user.role === 1) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden access" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { cheackIsAdmin };
