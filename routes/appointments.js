const express = require("express");
const { optionalAuth, protect, adminOnly } = require("../middleware/auth");
const { createAppointment, myAppointments, listAppointments, updateAppointment, cancelMyAppointment } = require("../controllers/appointmentController");
const router = express.Router();

router.post("/", optionalAuth, createAppointment);
router.get("/mine", protect, myAppointments);
router.patch("/:id/cancel", protect, cancelMyAppointment);
router.get("/", protect, adminOnly, listAppointments);
router.patch("/:id", protect, adminOnly, updateAppointment);
module.exports = router;
