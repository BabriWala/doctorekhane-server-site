const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  updateBloodDonorAddress,
} = require("../../controllers/bloodDonor/address");
const router = express.Router();

// ======================================
//  ADDRESS
// ======================================
router.put("/:donorId/address", protect, adminOnly, updateBloodDonorAddress);

module.exports = router;
