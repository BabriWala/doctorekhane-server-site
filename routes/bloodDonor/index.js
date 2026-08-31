const express = require("express");

const queriesRoutes = require("./queriesRoutes");
const addressRoutes = require("./addressRoutes");
const contactRoutes = require("./contactRoutes");
const basicInfoRoutes = require("./basicInfoRoutes");
const donationInfoRoutes = require("./donationInfoRoutes");
const profilePictureRoutes = require("./profilePictureRoutes");

const router = express.Router();
const { protect, adminOnly } = require("../../middleware/auth");
const { deleteBloodDonor } = require("../../controllers/resourceController");
const { registerBloodDonor } = require("../../controllers/bloodDonor/registration");

router.use("/", queriesRoutes);
router.post("/register", registerBloodDonor);

router.use("/", addressRoutes);
router.use("/", basicInfoRoutes);
router.use("/", contactRoutes);
router.use("/", donationInfoRoutes);
router.use("/", profilePictureRoutes);
router.delete("/:id", protect, adminOnly, deleteBloodDonor);

module.exports = router;
