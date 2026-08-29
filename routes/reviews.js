const express = require("express");
const { optionalAuth, protect, adminOnly } = require("../middleware/auth");
const { listReviews, createReview, voteReview, listForModeration, moderateReview, deleteReview } = require("../controllers/reviewController");
const router = express.Router();

router.get("/doctor/:id", listReviews("doctor"));
router.post("/doctor/:id", optionalAuth, createReview("doctor"));
router.get("/hospital/:id", listReviews("hospital"));
router.post("/hospital/:id", optionalAuth, createReview("hospital"));
router.post("/:reviewId/vote", voteReview);
router.get("/", protect, adminOnly, listForModeration);
router.patch("/:reviewId", protect, adminOnly, moderateReview);
router.delete("/:reviewId", protect, adminOnly, deleteReview);
module.exports = router;
