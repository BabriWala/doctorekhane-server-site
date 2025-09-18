const mongoose = require("mongoose");

// --- Education Schema ---
const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  yearOfCompletion: { type: Number, required: true },
});

module.exports = { educationSchema };
