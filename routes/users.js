const express = require("express");
const { body } = require("express-validator");
const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteAccount,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  createAdmin,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");
const profilePhotoUpload = require("../middleware/profilePhotoUpload");

const router = express.Router();

// Validation rules
const profileValidation = [
  body("name").optional().notEmpty().withMessage("নাম খালি রাখা যাবে না"),
  body("phone")
    .optional()
    .matches(/^(\+88)?01[3-9]\d{8}$/)
    .withMessage("সঠিক ফোন নম্বর দিন"),
  body("passportNumber")
    .optional()
    .isLength({ min: 6, max: 15 })
    .withMessage("সঠিক পাসপোর্ট নম্বর দিন"),
];

const adminValidation = [
  body("name").notEmpty().withMessage("নাম আবশ্যক"),
  body("email").isEmail().withMessage("সঠিক ইমেইল দিন"),
  body("phone")
    .matches(/^(\+88)?01[3-9]\d{8}$/)
    .withMessage("সঠিক ফোন নম্বর দিন"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
];

// User routes (protected)
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", profileValidation, updateProfile);
router.post(
  "/profile/photo",
  profilePhotoUpload.single("photo"),
  uploadProfilePhoto
);
router.delete("/account", deleteAccount);

// Admin routes
router.get("/admin/all", adminOnly, getAllUsers);
router.get("/admin/:id", adminOnly, getUserById);
router.patch("/admin/:id/status", adminOnly, updateUserStatus);
router.delete("/admin/:id", adminOnly, deleteUser);
router.post("/admin/create", adminOnly, adminValidation, createAdmin);

module.exports = router;
