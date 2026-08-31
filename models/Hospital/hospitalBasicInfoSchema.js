const mongoose = require("mongoose");

// --- Hospital Basic Info Schema ---
const hospitalBasicInfoSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  registrationNumber: { type: String, unique: true },
  type: {
    type: String,
    enum: ["Public", "Private", "Specialized", "Clinic"],
    required: true,
  },
  establishedYear: { type: Number },

  description: { type: String }, // Hospital about/overview

  logo: { type: String },
  images: [{ type: String }],
  services: [{ type: String, trim: true }],
  facilities: [{ type: String, trim: true }],
  insurance: [{ type: String, trim: true }],
  accreditations: [{ type: String, trim: true }],
  is24Hours: { type: Boolean, default: false },
  emergencyPhone: { type: String },
  ambulancePhone: { type: String },
  bedCount: { type: Number, default: 0, min: 0 },
  visitingHours: [{ day: { type: String, trim: true }, open: { type: String, trim: true }, close: { type: String, trim: true } }],
  ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

module.exports = { hospitalBasicInfoSchema };
