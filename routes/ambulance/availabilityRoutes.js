const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  updateAmbulanceAvailability,
} = require("../../controllers/ambulance/availability");

const router = express.Router();

// ======================================
//  AVAILABILITY
// ======================================
router.put(
  "/:ambulanceId/availability",
  protect,
  adminOnly,
  updateAmbulanceAvailability
);

module.exports = router;
