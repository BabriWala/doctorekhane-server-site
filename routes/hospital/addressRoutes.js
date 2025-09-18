const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const { updateHospitalAddress } = require("../../controllers/hospital/address");
const router = express.Router();

// ======================================
//  HOSPITAL ADDRESS
// ======================================
router.put(
  "/:hospitalId/address",
  protect,
  adminOnly,
  updateHospitalAddress
);

module.exports = router;
