const express = require("express");
const {
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  getDoctorsByChamberCity,
  sortDoctorsByField,
} = require("../../controllers/doctor");
const { optionalAuth } = require("../../middleware/auth");
const router = express.Router();

// Get all doctors
router.get("", optionalAuth, getAllDoctors);

// Get doctor by ID
router.get("/:doctorId", getDoctorById);

// Search by specialization
router.get("/specialization/:specialization", getDoctorsBySpecialization);

// Search by chamber city
router.get("/chamber/location/:city", getDoctorsByChamberCity);

// Sort doctors
router.get("/sort/:field", sortDoctorsByField);

module.exports = router;
