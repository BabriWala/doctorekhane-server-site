const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  updateAmbulanceAddress,
} = require("../../controllers/ambulance/address");

const router = express.Router();

// ======================================
//  Address
// ======================================
router.put("/:ambulanceId/address", protect, adminOnly, updateAmbulanceAddress);

module.exports = router;
