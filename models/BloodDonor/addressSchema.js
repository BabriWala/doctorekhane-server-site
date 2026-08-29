const mongoose = require("mongoose");

// --- Address Sub-schema ---
const addressSchema = new mongoose.Schema({
  // street: { type: String },
  // city: { type: String, required: true },
  address: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: "Bangladesh" },
  postalCode: { type: String },
  // postalCode: { type: String },
  // country: { type: String, default: "Bangladesh" },
});

module.exports = { addressSchema };
