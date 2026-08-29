const express = require("express");

const queriesRoutes = require("./queriesRoutes");
const addressRoutes = require("./addressRoutes");
const chamberSlotsRoutes = require("./chamberSlotsRoutes");
const educationRoutes = require("./educationRoutes");
const experienceRoutes = require("./experienceRoutes");
const personalDetailsRoutes = require("./personalDetailsRoutes");
const professionalRoutes = require("./professionalRoutes");
const profilePictureRoutes = require("./profilePictureRoutes");
const specializationRoutes = require("./specializationRoutes");

const router = express.Router();
const { protect, adminOnly } = require("../../middleware/auth");
const { deleteDoctor } = require("../../controllers/resourceController");
const { optionalAuth } = require("../../middleware/auth");
const { listReviews, createReview } = require("../../controllers/reviewController");

router.use("/", queriesRoutes);

router.use("/", personalDetailsRoutes);
router.use("/", addressRoutes);
router.get("/:id/reviews", listReviews("doctor"));
router.post("/:id/reviews", optionalAuth, createReview("doctor"));
router.delete("/:id", protect, adminOnly, deleteDoctor);
router.use("/", educationRoutes);
router.use("/", chamberSlotsRoutes);
router.use("/", experienceRoutes);
router.use("/", professionalRoutes);
router.use("/", profilePictureRoutes);
router.use("/", specializationRoutes);

module.exports = router;
