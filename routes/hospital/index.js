const express = require("express");

const queriesRoutes = require("./queriesRoutes");
const addressRoutes = require("./addressRoutes");
const contactRoutes = require("./contactRoutes");
const departmentsRoutes = require("./departmentsRoutes");
const hospitalBasicInfoRoutes = require("./hospitalBasicInfoRoutes");
const imagesRoutes = require("./imagesRoutes");
const logoRoutes = require("./logoRoutes");

const router = express.Router();

router.use("/", queriesRoutes);

router.use("/", addressRoutes);
router.use("/", contactRoutes);
router.use("/", departmentsRoutes);
router.use("/", hospitalBasicInfoRoutes);
router.use("/", imagesRoutes);
router.use("/", logoRoutes);

module.exports = router;
