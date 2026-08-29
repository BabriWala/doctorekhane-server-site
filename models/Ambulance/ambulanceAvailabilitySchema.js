const mongoose = require("mongoose");

// --- Availability ---
const ambulanceAvailabilitySchema = new mongoose.Schema({
  isAvailable: { type: Boolean, default: true },
  // lastServiceDate: { type: Date },
  notes: { type: String },
  lastServiceDate: { type: Date },
});

module.exports = { ambulanceAvailabilitySchema };
