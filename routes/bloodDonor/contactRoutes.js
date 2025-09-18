const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const { updateHospitalContact } = require("../../controllers/hospital/contact");
const {
  updateBloodDonorContact,
} = require("../../controllers/bloodDonor/contact");
const router = express.Router();

// ======================================
//  CONTACT
// ======================================
router.put("/:donorId/contact", protect, adminOnly, updateBloodDonorContact);

module.exports = router;
