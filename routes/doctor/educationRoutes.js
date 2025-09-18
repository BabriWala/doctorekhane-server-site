const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  addEducation,
  updateEducation,
  deleteEducation,
} = require("../../controllers/doctor");
const router = express.Router();

// Add education
router.post("/:doctorId/education", protect, adminOnly, addEducation);

// Update education
router.put(
  "/:doctorId/education/:educationId",
  protect,
  adminOnly,
  updateEducation
);

// Delete education
router.delete(
  "/:doctorId/education/:educationId",
  protect,
  adminOnly,
  deleteEducation
);

module.exports = router;
