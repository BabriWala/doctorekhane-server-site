const express = require("express");

const queriesRoutes = require("./queriesRoutes");
const availabilityRoutes = require("./availabilityRoutes");
const contactRoutes = require("./contactRoutes");
const basicInfoRoutes = require("./basicInfoRoutes");
const addressRoutes = require("./addressRoutes");
const profilePictureRoutes = require("./profilePictureRoutes");

const router = express.Router();
const { protect, adminOnly } = require("../../middleware/auth");
const { deleteAmbulance } = require("../../controllers/resourceController");

router.use("/", queriesRoutes);

router.use("/", availabilityRoutes);
router.use("/", basicInfoRoutes);
router.use("/", contactRoutes);
router.use("/", addressRoutes);
router.use("/", profilePictureRoutes);
router.delete("/:id", protect, adminOnly, deleteAmbulance);

module.exports = router;
