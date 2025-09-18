const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const router = express.Router();
const {
  addSpecialization,
  updateSpecialization,
  deleteSpecialization,
} = require("../../controllers/doctor");
// --- Specialization ---
router.post("/:doctorId/specialization", protect, adminOnly, addSpecialization);
router.put(
  "/:doctorId/specialization/:specializationId",
  protect,
  adminOnly,
  updateSpecialization
);
router.delete(
  "/:doctorId/specialization/:specializationId",
  protect,
  adminOnly,
  deleteSpecialization
);

module.exports = router;
