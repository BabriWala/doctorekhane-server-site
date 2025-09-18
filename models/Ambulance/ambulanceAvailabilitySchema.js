const mongoose = require("mongoose");

// --- Availability ---
const ambulanceAvailabilitySchema = new mongoose.Schema({
  isAvailable: { type: Boolean, default: true },
  lastServiceDate: { type: Date },
  notes: { type: String },
});

module.exports = { ambulanceAvailabilitySchema };
