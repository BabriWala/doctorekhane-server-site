const mongoose = require("mongoose");

// --- Location ---
const ambulanceAddressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  area: { type: String },
  addressLine: { type: String },
  latitude: { type: String },
  longitude: { type: String },
});

module.exports = { ambulanceAddressSchema };
