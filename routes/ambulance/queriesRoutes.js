const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  getAllAmbulances,
  getAmbulanceById,
  getAmbulancesByType,
  getAmbulancesByCity,
  getAvailableAmbulances,
} = require("../../controllers/ambulance/queries");

const router = express.Router();

// ======================================
//  QUERY ROUTES
// ======================================
// Get all ambulances (optional filters: type, city, isAvailable)
router.get("/", protect, adminOnly, getAllAmbulances);

// Get single ambulance by ID
router.get("/:ambulanceId", protect, adminOnly, getAmbulanceById);

// Get ambulances by type
router.get("/type/:type", protect, adminOnly, getAmbulancesByType);

// Get ambulances by city
router.get("/city/:city", protect, adminOnly, getAmbulancesByCity);

// Get available ambulances
router.get("/available", protect, adminOnly, getAvailableAmbulances);

module.exports = router;
