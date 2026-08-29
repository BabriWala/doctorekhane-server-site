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
router.get("/", getAllAmbulances);

// Get ambulances by type
router.get("/type/:type", getAmbulancesByType);

// Get ambulances by city
// router.get("/address/:address", protect, adminOnly, getAmbulancesByAddress);

// Get available ambulances
router.get("/available", getAvailableAmbulances);

// Get single ambulance by ID
router.get("/:ambulanceId", getAmbulanceById);

module.exports = router;
