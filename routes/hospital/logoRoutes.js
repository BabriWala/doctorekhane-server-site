const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  uploadHospitalLogo: uploadMiddleware,
} = require("../../middleware/upload");
const { updateHospitalLogo } = require("../../controllers/hospital/logo");

const router = express.Router();

// ======================================
//  HOSPITAL LOGO
// ======================================
router.put(
  "/:hospitalId/logo",
  protect,
  adminOnly,
  uploadMiddleware.single("logo"),
  updateHospitalLogo
);
module.exports = router;
