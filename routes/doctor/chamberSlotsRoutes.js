const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  updateChamber,
  deleteChamber,
  updateChamberAddress,
  addChamber,
} = require("../../controllers/doctor");
const router = express.Router();

// Add chamber
router.post("/:doctorId/chamber", protect, adminOnly, addChamber);

// Update chamber slot
router.put("/:doctorId/chamber/:chamberId", protect, adminOnly, updateChamber);

// Delete chamber slot
router.delete(
  "/:doctorId/chamber/:chamberId",
  protect,
  adminOnly,
  deleteChamber
);

// Update chamber address separately
router.put(
  "/:doctorId/chamber/:chamberId/address",
  protect,
  adminOnly,
  updateChamberAddress
);

module.exports = router;
