const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  uploadAmbulanceProfile: uploadMiddleware,
} = require("../../middleware/upload");
const {
  createAmbulance,
  updateAmbulanceBasicInfo,
} = require("../../controllers/ambulance");

const router = express.Router();

// ======================================
//  BASIC INFO
// ======================================
// Create new ambulance (no file upload)
router.post("/", protect, adminOnly, createAmbulance);

// Update ambulance basic info (no file upload)
router.put(
  "/:ambulanceId/basic-info",
  protect,
  adminOnly,
  updateAmbulanceBasicInfo
);

module.exports = router;
