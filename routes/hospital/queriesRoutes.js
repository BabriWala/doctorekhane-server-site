const express = require("express");
const { optionalAuth } = require("../../middleware/auth");
const {
  getAllHospitals,
  searchHospitalsByCity,
  searchHospitalsByType,
  sortHospitalsByField,
  getHospitalById,
  getHospitalFilters,
} = require("../../controllers/hospital/queries");
const router = express.Router();

// ======================================
//  GET ALL HOSPITALS
//  Optional filters: city, type, status
// ======================================
router.get("", optionalAuth, getAllHospitals);
router.get("/filters/options", getHospitalFilters);

// ======================================
//  GET SINGLE HOSPITAL BY ID
// ======================================
router.get("/city/:city", searchHospitalsByCity);

// ======================================
//  SEARCH HOSPITALS BY TYPE
// ======================================
router.get("/type/:type", searchHospitalsByType);

// ======================================
//  SORT HOSPITALS BY FIELD
//  Example fields: establishedYear, name
// ======================================
router.get("/sort/:field", sortHospitalsByField);
router.get("/:hospitalId", optionalAuth, getHospitalById);

module.exports = router;
