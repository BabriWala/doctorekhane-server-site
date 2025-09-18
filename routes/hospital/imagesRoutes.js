const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  uploadHospitalImages: uploadMiddleware,
} = require("../../middleware/upload");
const {
  uploadHospitalImages,
  deleteHospitalImage,
} = require("../../controllers/hospital/images");
const router = express.Router();

// ======================================
//  HOSPITAL IMAGES
// ======================================
router.post(
  "/:hospitalId/images",
  protect,
  adminOnly,
  uploadMiddleware.array("images", 5),
  uploadHospitalImages
);
router.delete(
  "/:hospitalId/images/:imageId",
  protect,
  adminOnly,
  deleteHospitalImage
);

module.exports = router;
