const mongoose = require("mongoose");

// --- Basic Info ---
const ambulanceBasicInfoSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true }, // registration plate
  type: { type: String, enum: ["Basic", "Advanced", "ICU"], required: true },
  driverName: { type: String, required: true },
  driverLicense: { type: String },
  profilePicture: { type: String }, // optional driver/ambulance photo
});

module.exports = { ambulanceBasicInfoSchema };
