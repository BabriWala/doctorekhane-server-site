const mongoose = require("mongoose");

// --- Contact ---
const ambulanceContactSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  alternatePhone: { type: String },
  email: { type: String },
});
module.exports = { ambulanceContactSchema };
