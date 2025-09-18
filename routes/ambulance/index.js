const express = require("express");

const queriesRoutes = require("./queriesRoutes");
const availabilityRoutes = require("./availabilityRoutes");
const contactRoutes = require("./contactRoutes");
const basicInfoRoutes = require("./basicInfoRoutes");
const addressRoutes = require("./addressRoutes");
const profilePictureRoutes = require("./profilePictureRoutes");

const router = express.Router();

router.use("/", queriesRoutes);

router.use("/", availabilityRoutes);
router.use("/", basicInfoRoutes);
router.use("/", contactRoutes);
router.use("/", addressRoutes);
router.use("/", profilePictureRoutes);

module.exports = router;
