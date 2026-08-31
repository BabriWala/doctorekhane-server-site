const express = require("express");
const {
  getAllDoctors,
  getDoctorById,
  getDoctorFilterOptions,
  getDoctorsBySpecialization,
  getDoctorsByChamberCity,
  sortDoctorsByField,
} = require("../../controllers/doctor");
const { optionalAuth } = require("../../middleware/auth");
const router = express.Router();

// Get all doctors
router.get("", optionalAuth, getAllDoctors);

router.get("/filter-options", getDoctorFilterOptions);

// Search by specialization
router.get("/specialization/:specialization", getDoctorsBySpecialization);

// Search by chamber city
router.get("/chamber/location/:city", getDoctorsByChamberCity);

// Sort doctors
router.get("/sort/:field", sortDoctorsByField);

// Keep the catch-all identifier route last so named routes remain reachable.
router.get("/:doctorId", optionalAuth, getDoctorById);

module.exports = router;
