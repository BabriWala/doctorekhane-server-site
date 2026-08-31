const mongoose = require("mongoose");

const ambulancePageSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "ambulance-page", unique: true, immutable: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    subtitle: { type: String, required: true, trim: true, maxlength: 300 },
    emergencyTitle: { type: String, required: true, trim: true, maxlength: 120 },
    emergencyDescription: { type: String, required: true, trim: true, maxlength: 300 },
    emergencyPhone: { type: String, trim: true, maxlength: 30 },
    bookingTitle: { type: String, required: true, trim: true, maxlength: 120 },
    bookingDescription: { type: String, required: true, trim: true, maxlength: 300 },
    tipsTitle: { type: String, required: true, trim: true, maxlength: 120 },
    emergencyTips: [{ type: String, trim: true, maxlength: 300 }],
    providersTitle: { type: String, required: true, trim: true, maxlength: 120 },
    serviceTypes: [{ type: String, enum: ["Basic", "Advanced", "ICU"] }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("AmbulancePageSettings", ambulancePageSettingsSchema);
