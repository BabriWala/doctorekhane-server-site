const mongoose = require("mongoose");

// --- Department Sub-schema (inside Hospital) ---
const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
});

module.exports = { departmentSchema };
