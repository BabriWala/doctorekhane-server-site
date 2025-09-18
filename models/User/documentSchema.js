const mongoose = require("mongoose");

// 🔹 Document Schema (only type + file path/URL)
const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // e.g. "visa", "ticket", "contract", etc.
  },
  file: {
    type: String, // just store path or cloud URL
    required: true,
  },
});

module.exports = { documentSchema };
