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

router.use("/", queriesRoutes);

router.use("/", personalDetailsRoutes);
router.use("/", addressRoutes);
router.use("/", educationRoutes);
router.use("/", chamberSlotsRoutes);
router.use("/", experienceRoutes);
router.use("/", professionalRoutes);
router.use("/", profilePictureRoutes);
router.use("/", specializationRoutes);

module.exports = router;
