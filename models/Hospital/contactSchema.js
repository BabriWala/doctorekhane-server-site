const mongoose = require("mongoose");
const { addressSchema } = require("./addressSchema");

// --- Contact Sub-schema ---
const contactSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
});

module.exports = { contactSchema };
