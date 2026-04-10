const mongoose = require("mongoose");

// --- Education Schema ---
const educationSchema = new mongoose.Schema({
  // degree: { type: String, required: true },
  // institution: { type: String, required: true },
  // yearOfCompletion: { type: Number, required: true },
  degree: { type: String },
  institution: { type: String },
  yearOfCompletion: { type: Number },
});

module.exports = { educationSchema };
