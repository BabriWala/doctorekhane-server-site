const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const { createRequest, listRequests, updateRequest } = require("../controllers/ambulanceRequestController");

router.post("/", createRequest);
router.get("/", protect, adminOnly, listRequests);
router.patch("/:id", protect, adminOnly, updateRequest);

module.exports = router;
