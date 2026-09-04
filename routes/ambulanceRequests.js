const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const { createRequest, trackRequest, listRequests, updateRequest } = require("../controllers/ambulanceRequestController");

router.post("/", createRequest);
router.post("/track/action", require("../controllers/ambulanceRequestController").customerAction);
router.get("/track", trackRequest);
router.get("/", protect, adminOnly, listRequests);
router.patch("/:id", protect, adminOnly, updateRequest);

module.exports = router;
