const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  updateAmbulanceContact,
} = require("../../controllers/ambulance/contact");
const router = express.Router();

// ======================================
//  CONTACT
// ======================================
router.put("/:ambulanceId/contact", protect, adminOnly, updateAmbulanceContact);

module.exports = router;
