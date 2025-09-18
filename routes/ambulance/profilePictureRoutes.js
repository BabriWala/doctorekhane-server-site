const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  uploadAmbulanceProfile: uploadMiddleware,
} = require("../../middleware/upload");
const {
  updateAmbulanceProfilePicture,
} = require("../../controllers/ambulance");

const router = express.Router();

// Update profile picture
router.put(
  "/:ambulance/profile-picture",
  protect,
  adminOnly,
  uploadMiddleware.single("profilePicture"),
  updateAmbulanceProfilePicture
);

module.exports = router;
