const express = require("express");

const queriesRoutes = require("./queriesRoutes");
const addressRoutes = require("./addressRoutes");
const contactRoutes = require("./contactRoutes");
const basicInfoRoutes = require("./basicInfoRoutes");
const donationInfoRoutes = require("./donationInfoRoutes");
const profilePictureRoutes = require("./profilePictureRoutes");

const router = express.Router();

router.use("/", queriesRoutes);

router.use("/", addressRoutes);
router.use("/", basicInfoRoutes);
router.use("/", contactRoutes);
router.use("/", donationInfoRoutes);
router.use("/", profilePictureRoutes);

module.exports = router;
