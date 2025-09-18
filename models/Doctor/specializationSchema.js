const mongoose = require("mongoose");

// --- Specialization Schema ---
const specializationSchema = new mongoose.Schema({
  field: { type: String, required: true },
  description: String,
});

module.exports = { specializationSchema };
