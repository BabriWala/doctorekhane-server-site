const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const { createBloodRequest, trackBloodRequest, listBloodRequests, updateBloodRequest } = require("../controllers/bloodRequestController");
router.post("/", createBloodRequest);
router.get("/track", trackBloodRequest);
router.get("/", protect, adminOnly, listBloodRequests);
router.patch("/:id", protect, adminOnly, updateBloodRequest);
module.exports = router;
