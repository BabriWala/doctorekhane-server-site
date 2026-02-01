const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  getAllAmbulances,
  getAmbulanceById,
  getAmbulancesByType,
  getAmbulancesByAddress,
  getAvailableAmbulances,
} = require("../../controllers/ambulance/queries");

const router = express.Router();

// ======================================
//  QUERY ROUTES
// ======================================
// Get all ambulances (optional filters: type, address, isAvailable)
router.get("/", protect, adminOnly, getAllAmbulances);

// Get ambulances by type
router.get("/type/:address", protect, adminOnly, getAmbulancesByType);

// Get ambulances by city
// router.get("/address/:address", protect, adminOnly, getAmbulancesByAddress);

// Get available ambulances
router.get("/available", protect, adminOnly, getAvailableAmbulances);

// Get single ambulance by ID
router.get("/:ambulanceId", protect, adminOnly, getAmbulanceById);

module.exports = router;
