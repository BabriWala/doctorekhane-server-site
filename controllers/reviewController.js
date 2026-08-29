const Review = require("../models/Review");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

const config = {
  doctor: { type: "Doctor", Model: Doctor },
  hospital: { type: "Hospital", Model: Hospital },
};

const refreshRating = async (type, target) => {
  const entry = Object.values(config).find((item) => item.type === type);
  const [stats] = await Review.aggregate([
    { $match: { target, targetType: type, status: "approved" } },
    { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await entry.Model.findByIdAndUpdate(target, { ratingAverage: Number((stats?.average || 0).toFixed(1)), reviewCount: stats?.count || 0 });
};

exports.listReviews = (kind) => async (req, res, next) => { try {
  const entry = config[kind];
  if (!(await entry.Model.exists({ _id: req.params.id }))) return res.status(404).json({ success: false, message: `${entry.type} not found` });
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const filter = { targetType: entry.type, target: req.params.id, status: "approved" };
  if (req.query.rating) filter.rating = Number(req.query.rating);
  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, highest: { rating: -1 }, lowest: { rating: 1 }, helpful: { helpfulCount: -1 } };
  const sort = sortMap[req.query.sort] || sortMap.newest;
  const targetId = require("mongoose").Types.ObjectId.createFromHexString(req.params.id);
  const [reviews, total, distribution, ratingStats] = await Promise.all([
    Review.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Review.countDocuments(filter),
    Review.aggregate([{ $match: { targetType: entry.type, target: targetId, status: "approved" } }, { $group: { _id: "$rating", count: { $sum: 1 } } }]),
    Review.aggregate([{ $match: { targetType: entry.type, target: targetId, status: "approved" } }, { $group: { _id: null, average: { $avg: "$rating" } } }]),
  ]);
  const average = ratingStats[0]?.average || 0;
  res.json({ success: true, data: reviews, pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalItems: total }, summary: { averageRating: Number(average.toFixed(1)), reviewCount: total, distribution: Object.fromEntries([1,2,3,4,5].map((rating) => [rating, distribution.find((item) => item._id === rating)?.count || 0])) } });
} catch (error) { next(error); } };

exports.createReview = (kind) => async (req, res, next) => { try {
  const entry = config[kind];
  if (!(await entry.Model.exists({ _id: req.params.id }))) return res.status(404).json({ success: false, message: `${entry.type} not found` });
  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !req.body.patientName || !req.body.comment || req.body.comment.trim().length < 10) return res.status(400).json({ success: false, message: "Patient name, rating (1-5), and a comment of at least 10 characters are required" });
  const review = await Review.create({ targetType: entry.type, target: req.params.id, user: req.user?._id || null, patientName: req.body.patientName, rating, title: req.body.title, comment: req.body.comment, visitDate: req.body.visitDate, treatmentType: req.body.treatmentType, verified: false, status: "pending" });
  res.status(201).json({ success: true, message: "Review submitted for moderation", data: review });
} catch (error) {
  if (error.code === 11000) return res.status(409).json({ success: false, message: "You have already reviewed this provider" });
  next(error);
} };

exports.voteReview = async (req, res, next) => { try {
  const field = req.body.helpful === false ? "unhelpfulCount" : "helpfulCount";
  const review = await Review.findOneAndUpdate({ _id: req.params.reviewId, status: "approved" }, { $inc: { [field]: 1 } }, { new: true });
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });
  res.json({ success: true, helpfulCount: review.helpfulCount, unhelpfulCount: review.unhelpfulCount });
} catch (error) { next(error); } };

exports.listForModeration = async (req, res, next) => { try {
  const filter = {}; if (req.query.status) filter.status = req.query.status; if (req.query.targetType) filter.targetType = req.query.targetType;
  const reviews = await Review.find(filter).populate("target").sort({ createdAt: -1 }).limit(200);
  res.json({ success: true, data: reviews });
} catch (error) { next(error); } };

exports.moderateReview = async (req, res, next) => { try {
  if (!["approved", "rejected"].includes(req.body.status)) return res.status(400).json({ success: false, message: "Status must be approved or rejected" });
  const review = await Review.findByIdAndUpdate(req.params.reviewId, { status: req.body.status, verified: req.body.verified === true }, { new: true });
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });
  await refreshRating(review.targetType, review.target);
  res.json({ success: true, data: review });
} catch (error) { next(error); } };

exports.deleteReview = async (req, res, next) => { try {
  const review = await Review.findByIdAndDelete(req.params.reviewId);
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });
  await refreshRating(review.targetType, review.target);
  res.json({ success: true, message: "Review deleted" });
} catch (error) { next(error); } };
