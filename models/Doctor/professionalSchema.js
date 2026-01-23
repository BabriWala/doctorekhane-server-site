const mongoose = require("mongoose");

// --- Professional Schema ---
const professionalSchema = new mongoose.Schema({
  position: { type: String }, // e.g. Senior Consultant
  department: { type: String },
  field: { type: String },
  consultationFee: { type: Number },
  consultationFeeNew: { type: Number },

  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended", "Retired"],
    default: "Active",
  },
  order: { type: Number, default: 1 },
  licenseNumber: { type: String }, // BMDC license
  nidNumber: { type: String }, // National ID
});

module.exports = { professionalSchema };
