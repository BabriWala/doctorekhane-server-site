const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate Access Token (short-lived)
exports.generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Generate Refresh Token (long-lived)
exports.generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// Protect middleware (for any authenticated route)
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this resource",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (user.status === "blocked") {
      return res
        .status(401)
        .json({ success: false, message: "Your account has been blocked" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Admin-only access
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.account.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
};
