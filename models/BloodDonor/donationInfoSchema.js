const mongoose = require("mongoose");

// --- Donation Info Sub-schema ---
const donationInfoSchema = new mongoose.Schema({
  lastDonationDate: { type: Date },
  totalDonations: { type: Number, min: 0, default: 0 },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
});

module.exports = { donationInfoSchema };
