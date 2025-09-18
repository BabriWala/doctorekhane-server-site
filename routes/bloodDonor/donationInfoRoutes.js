const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  updateBloodDonorDonationInfo,
} = require("../../controllers/bloodDonor/donationInfo");

const router = express.Router();

// ======================================
//  DONATION INFO
// ======================================
router.put(
  "/:donorId/donation-info",
  protect,
  adminOnly,
  updateBloodDonorDonationInfo
);
module.exports = router;
