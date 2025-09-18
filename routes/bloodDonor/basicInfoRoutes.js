const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  createBloodDonorBasicInfo,
  updateBloodDonorBasicInfo,
} = require("../../controllers/bloodDonor/basicInfo");
const router = express.Router();

// ======================================
//  BLOOD DONOR BASIC INFO
// ======================================
// Create new blood donor
router.post("/basic-info", protect, adminOnly, createBloodDonorBasicInfo);

// Update existing blood donor basic info
router.put(
  "/:donorId/basic-info",
  protect,
  adminOnly,
  updateBloodDonorBasicInfo
);

module.exports = router;
