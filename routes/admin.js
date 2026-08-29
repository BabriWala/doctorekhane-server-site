const express = require("express");
const {
  getDashboardStats,
  getSystemInfo,
  exportData,
  clearCache,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/stats", getDashboardStats);
router.get("/system", getSystemInfo);
router.get("/export", exportData);
router.post("/clear-cache", clearCache);

module.exports = router;
