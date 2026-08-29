const express = require("express");

const queriesRoutes = require("./queriesRoutes");
const addressRoutes = require("./addressRoutes");
const contactRoutes = require("./contactRoutes");
const departmentsRoutes = require("./departmentsRoutes");
const hospitalBasicInfoRoutes = require("./hospitalBasicInfoRoutes");
const imagesRoutes = require("./imagesRoutes");
const logoRoutes = require("./logoRoutes");

const router = express.Router();
const { protect, adminOnly } = require("../../middleware/auth");
const { deleteHospital } = require("../../controllers/resourceController");
const { optionalAuth } = require("../../middleware/auth");
const { listReviews, createReview } = require("../../controllers/reviewController");

router.use("/", queriesRoutes);

router.use("/", addressRoutes);
router.use("/", contactRoutes);
router.use("/", departmentsRoutes);
router.use("/", hospitalBasicInfoRoutes);
router.use("/", imagesRoutes);
router.use("/", logoRoutes);
router.get("/:id/reviews", listReviews("hospital"));
router.post("/:id/reviews", optionalAuth, createReview("hospital"));
router.delete("/:id", protect, adminOnly, deleteHospital);

module.exports = router;
