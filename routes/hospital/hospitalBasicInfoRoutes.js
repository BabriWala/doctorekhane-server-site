const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  createHospitalBasicInfo,
  updateHospitalBasicInfo,
} = require("../../controllers/hospital/hospitalBasicInfo");
const router = express.Router();

// ======================================
//  HOSPITAL BASIC INFORMATION
// ======================================
router.post("/basic-info", protect, adminOnly, createHospitalBasicInfo);
router.put(
  "/:hospitalId/basic-info",
  protect,
  adminOnly,
  updateHospitalBasicInfo
);

module.exports = router;
