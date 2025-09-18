const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const { updateDoctorAddress } = require("../../controllers/doctor");
const router = express.Router();

// Update address
router.put(
  "/:doctorId/address",
  protect,
  adminOnly,
  updateDoctorAddress
);

module.exports = router;
