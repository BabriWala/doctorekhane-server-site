const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const { updateProfessional } = require("../../controllers/doctor");
const router = express.Router();

// Update professional info
router.put("/:doctorId/professional", protect, adminOnly, updateProfessional);

module.exports = router;
