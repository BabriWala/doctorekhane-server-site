const mongoose = require("mongoose");

const ambulanceRequestSchema = new mongoose.Schema({
  requestNumber: { type: String, unique: true, index: true },
  ambulance: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance", default: null },
  pickupLocation: { type: String, required: true, trim: true, maxlength: 300 },
  dropLocation: { type: String, required: true, trim: true, maxlength: 300 },
  serviceType: { type: String, enum: ["Basic", "Advanced", "ICU"], required: true },
  scheduledAt: { type: Date, required: true, index: true },
  patientName: { type: String, required: true, trim: true, maxlength: 120 },
  contactNumber: { type: String, required: true, trim: true, maxlength: 30 },
  emergencyDetails: { type: String, trim: true, maxlength: 1500 },
  status: { type: String, enum: ["pending", "assigned", "dispatched", "completed", "cancelled"], default: "pending", index: true },
  adminNotes: { type: String, trim: true, maxlength: 1500 },
  customerAcceptedAt: { type: Date },
}, { timestamps: true });

ambulanceRequestSchema.pre("validate", function () {
  if (!this.requestNumber) this.requestNumber = `AMB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
});

module.exports = mongoose.model("AmbulanceRequest", ambulanceRequestSchema);
