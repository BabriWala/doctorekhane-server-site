const express = require("express");
const { protect, adminOnly } = require("../../middleware/auth");
const {
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../../controllers/hospital/departments");
const router = express.Router();

// ======================================
//  DEPARTMENTS
// ======================================
router.post("/:hospitalId/departments", protect, adminOnly, addDepartment);
router.put(
  "/:hospitalId/departments/:departmentId",
  protect,
  adminOnly,
  updateDepartment
);
router.delete(
  "/:hospitalId/departments/:departmentId",
  protect,
  adminOnly,
  deleteDepartment
);

module.exports = router;
