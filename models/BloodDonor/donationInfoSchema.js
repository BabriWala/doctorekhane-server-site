const mongoose = require("mongoose");

// --- Donation Info Sub-schema ---
const donationInfoSchema = new mongoose.Schema({
  lastDonationDate: { type: Date },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
});

module.exports = { donationInfoSchema };
