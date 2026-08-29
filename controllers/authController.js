const User = require("../models/User");
const { validationResult } = require("express-validator");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// Helper to send tokens
const sendTokens = (user, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    accessToken,
    user: {
      _id: user._id,
      name: user.personalDetails?.name || null,
      email: user.personalDetails?.email || null,
      account: {
        role: user.account?.role || "user",
      },
    },
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ "personalDetails.email": normalizedEmail })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({
      personalDetails: { name, email: normalizedEmail, phone },
      account: { password },
    });
    sendTokens(user, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }
    // Find user and select account password for comparison
    const user = await User.findOne({ "personalDetails.email": email }).select(
      "+account.password"
    );


    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user.status === "blocked") {
      return res
        .status(401)
        .json({ success: false, message: "Account blocked" });
    }

    // Convert to JSON and explicitly include account (except password)
    const safeUser = user.toJSON();
    // Send JWT tokens and safe user object
    sendTokens(safeUser, res); // assuming sendTokens expects user object
  } catch (error) {
    console.error("Login failed:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};
// Refresh Token
exports.refreshToken = async (req, res) => {
  // console.log(req.cookies.refreshToken);
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.json({ success: true, message: "Logged out" });
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // .populate("bookings")
    // .populate("visaApplications");

    res.json({
      success: true,
      message: "User data",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+account.password");

    if (!(await user.comparePassword(currentPassword))) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }
    user.account.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
};
