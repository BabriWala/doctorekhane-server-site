const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  createDoctor,
  updatePersonalDetails,
} = require("../../controllers/doctor");
const router = express.Router();

// Create new doctor
router.post("/", protect, adminOnly, createDoctor);

// Update personal details
router.put(
  "/:doctorId/personal-details",
  protect,
  adminOnly,
  updatePersonalDetails
);

module.exports = router;
