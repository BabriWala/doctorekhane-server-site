const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  uploadBloodDonorProfile: uploadMiddleware,
} = require("../../middleware/upload");
const {
  updateBloodDonorProfilePicture,
} = require("../../controllers/bloodDonor/profilePicture");

const router = express.Router();

// Update profile picture
router.put(
  "/:donorId/profile-picture",
  protect,
  adminOnly,
  uploadMiddleware.single("profilePicture"),
  updateBloodDonorProfilePicture
);

module.exports = router;
