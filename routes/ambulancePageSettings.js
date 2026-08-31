const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const { getSettings, updateSettings } = require("../controllers/ambulancePageSettingsController");

router.get("/", getSettings);
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;
