const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  getMe,
  updatePassword,
  refreshToken,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

const registerValidation = [
  body("name").notEmpty().withMessage("নাম আবশ্যক"),
  body("email").isEmail().withMessage("সঠিক ইমেইল দিন"),
  body("phone")
    .matches(/^(\+88)?01[3-9]\d{8}$/)
    .withMessage("সঠিক ফোন নম্বর দিন"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
];

router.post("/register", registerValidation, register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update-password", protect, updatePassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
