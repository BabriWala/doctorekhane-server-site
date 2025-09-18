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

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

module.exports = { hospitalBasicInfoSchema };
