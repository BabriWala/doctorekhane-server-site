const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  targetType: { type: String, enum: ["Doctor", "Hospital"], required: true, index: true },
  target: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "targetType", index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  patientName: { type: String, required: true, trim: true, maxlength: 100 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true, maxlength: 150 },
  comment: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
  visitDate: { type: Date },
  treatmentType: { type: String, trim: true, maxlength: 120 },
  verified: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  helpfulCount: { type: Number, default: 0, min: 0 },
  unhelpfulCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

reviewSchema.index({ targetType: 1, target: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, targetType: 1, target: 1 }, { unique: true, sparse: true });
module.exports = mongoose.model("Review", reviewSchema);
