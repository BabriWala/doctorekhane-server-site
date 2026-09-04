const mongoose = require('mongoose');
const prescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true, index: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  instructions: { type: String, trim: true, maxlength: 12000, default: '' },
  attachment: { type: Buffer, select: false },
  fileName: String,
  mimeType: String,
}, { timestamps: true });
const messageSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['doctor', 'user'], required: true },
  text: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });
const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  dueAt: { type: Date, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = {
  Prescription: mongoose.model('Prescription', prescriptionSchema),
  PortalMessage: mongoose.model('PortalMessage', messageSchema),
  Reminder: mongoose.model('Reminder', reminderSchema),
};
