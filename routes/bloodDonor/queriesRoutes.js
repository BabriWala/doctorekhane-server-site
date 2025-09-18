const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  getAllBloodDonors,
  getBloodDonorById,
  getBloodDonorsByBloodGroup,
  getBloodDonorsByCity,
  getActiveBloodDonors,
} = require("../../controllers/bloodDonor/queries");

const router = express.Router();

// ======================================
//  QUERY ROUTES
// ======================================
// Get all donors (optional filters: bloodGroup, city, isActive)
router.get("/", getAllBloodDonors);

// Get single donor by ID
router.get("/:donorId", getBloodDonorById);

// Get donors by blood group
router.get(
  "/blood-group/:bloodGroup",
  protect,
  adminOnly,
  getBloodDonorsByBloodGroup
);

// Get donors by city
router.get("/city/:city", getBloodDonorsByCity);

// Get active donors
router.get("/active", getActiveBloodDonors);
module.exports = router;
