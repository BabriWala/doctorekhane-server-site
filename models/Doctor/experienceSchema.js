const mongoose = require("mongoose");

// --- Experience Schema ---
const experienceSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  role: { type: String, required: true },
  years: { type: Number, required: true },
  from: { type: Date },
  to: { type: Date },
});

module.exports = { experienceSchema };
