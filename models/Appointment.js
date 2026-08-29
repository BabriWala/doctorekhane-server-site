const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointmentNumber: { type: String, unique: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  chamberId: { type: mongoose.Schema.Types.ObjectId },
  patient: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    age: { type: Number, min: 0, max: 130 },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
  },
  appointmentDate: { type: Date, required: true, index: true },
  timeSlot: { type: String, required: true },
  reason: { type: String, trim: true, maxlength: 1000 },
  consultationType: { type: String, enum: ["in-person", "video"], default: "in-person" },
  fee: { type: Number, min: 0 },
  paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled", "no-show"], default: "pending", index: true },
  notes: { type: String, trim: true, maxlength: 2000 },
}, { timestamps: true });

appointmentSchema.pre("validate", function () {
  if (!this.appointmentNumber) this.appointmentNumber = `DE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
});
appointmentSchema.index({ doctor: 1, appointmentDate: 1, timeSlot: 1, status: 1 });
module.exports = mongoose.model("Appointment", appointmentSchema);
