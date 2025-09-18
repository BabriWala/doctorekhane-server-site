const mongoose = require("mongoose");

// --- Address Schema ---
const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  zip: String,
});

module.exports = { addressSchema };
