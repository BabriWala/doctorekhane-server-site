const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const { updateHospitalContact } = require("../../controllers/hospital/contact");
const router = express.Router();

// ======================================
//  HOSPITAL CONTACT
// ======================================
router.put(
  "/:hospitalId/contact",
  protect,
  adminOnly,
  updateHospitalContact
);

module.exports = router;
