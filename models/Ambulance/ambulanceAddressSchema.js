const mongoose = require("mongoose");

// --- Location ---
const ambulanceAddressSchema = new mongoose.Schema({
  // city: { type: String, required: true },
  // area: { type: String },
  address: { type: String },
  city: { type: String },
  area: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  // latitude: { type: String },
  // longitude: { type: String },
});

module.exports = { ambulanceAddressSchema };
