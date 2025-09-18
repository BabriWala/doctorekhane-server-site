const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  addExperience,
  updateExperience,
  deleteExperience,
} = require("../../controllers/doctor");
const router = express.Router();

// Add experience
router.post("/:doctorId/experience", protect, adminOnly, addExperience);

// Update experience
router.put(
  "/:doctorId/experience/:experienceId",
  protect,
  adminOnly,
  updateExperience
);

// Delete experience
router.delete(
  "/:doctorId/experience/:experienceId",
  protect,
  adminOnly,
  deleteExperience
);

module.exports = router;
