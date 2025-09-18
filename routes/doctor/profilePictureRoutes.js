const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const { uploadDoctorProfile } = require("../../middleware/upload");
const { updateProfilePicture } = require("../../controllers/doctor");

const router = express.Router();

router.put(
  "/:doctorId/profile-picture",
  protect,
  adminOnly,
  uploadDoctorProfile.single("profilePicture"),
  updateProfilePicture
);

module.exports = router;
