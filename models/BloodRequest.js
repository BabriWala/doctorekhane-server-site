const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  requestNumber: { type: String, unique: true, index: true },
  patientName: { type: String, required: true, trim: true, maxlength: 120 },
  bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: true, index: true },
  hospital: { type: String, required: true, trim: true, maxlength: 250 },
  requiredDate: { type: Date, required: true, index: true },
  contactNumber: { type: String, required: true, trim: true, maxlength: 30 },
  urgency: { type: String, enum: ["normal", "urgent", "critical"], default: "normal", index: true },
  status: { type: String, enum: ["pending", "matched", "fulfilled", "cancelled"], default: "pending", index: true },
  adminNotes: { type: String, trim: true, maxlength: 1500 },
}, { timestamps: true });

bloodRequestSchema.pre("validate", function () {
  if (!this.requestNumber) this.requestNumber = `BLD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
});

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
