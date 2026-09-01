const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

exports.createAppointment = async (req, res, next) => { try {
  const doctor = await Doctor.findOne({ _id: req.body.doctorId, "professional.status": "Active" });
  if (!doctor) return res.status(404).json({ success: false, message: "Active doctor not found" });
  const appointmentDate = new Date(req.body.appointmentDate);
  if (Number.isNaN(appointmentDate.getTime()) || appointmentDate < new Date()) return res.status(400).json({ success: false, message: "A future appointment date is required" });
  if (!req.body.patientName || !req.body.patientPhone || !req.body.timeSlot) return res.status(400).json({ success: false, message: "Patient name, phone, and time slot are required" });
  const collision = await Appointment.exists({ doctor: doctor._id, appointmentDate, timeSlot: req.body.timeSlot, status: { $in: ["pending", "confirmed"] } });
  if (collision) return res.status(409).json({ success: false, message: "This appointment slot is no longer available" });
  const appointment = await Appointment.create({ doctor: doctor._id, user: req.user?._id || null, chamberId: req.body.chamberId, patient: { name: req.body.patientName, phone: req.body.patientPhone, email: req.body.patientEmail, age: req.body.patientAge, gender: req.body.patientGender }, appointmentDate, timeSlot: req.body.timeSlot, reason: req.body.reason, consultationType: req.body.consultationType, fee: req.body.consultationType === "video" ? doctor.professional?.consultationFeeNew : doctor.professional?.consultationFee });
  res.status(201).json({ success: true, message: "Appointment request submitted", data: appointment });
} catch (error) { next(error); } };

exports.myAppointments = async (req, res, next) => { try {
  const page = Math.max(Number(req.query.page) || 1, 1); const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100); const filter = { user: req.user._id };
  const [appointments, totalItems] = await Promise.all([Appointment.find(filter).populate("doctor", "personalDetails professional").sort({ appointmentDate: -1 }).skip((page - 1) * limit).limit(limit), Appointment.countDocuments(filter)]);
  res.json({ success: true, data: appointments, pagination: { currentPage: page, totalPages: Math.ceil(totalItems / limit), totalItems, pageSize: limit } });
} catch (error) { next(error); } };

exports.trackAppointment = async (req, res, next) => { try {
  const number = String(req.query.appointmentNumber || "").trim().toUpperCase();
  const phone = String(req.query.phone || "").trim();
  if (!number || !phone) return res.status(400).json({ success: false, message: "Appointment number and phone are required" });
  const item = await Appointment.findOne({ appointmentNumber: number, "patient.phone": phone }).populate("doctor", "personalDetails professional");
  if (!item) return res.status(404).json({ success: false, message: "No matching appointment found" });
  res.json({ success: true, data: item });
} catch (error) { next(error); } };

exports.listAppointments = async (req, res, next) => { try {
  const filter = {}; if (req.query.status) filter.status = req.query.status; if (req.query.doctorId) filter.doctor = req.query.doctorId; if (req.query.date) { const start = new Date(req.query.date); const end = new Date(start); end.setDate(end.getDate() + 1); filter.appointmentDate = { $gte: start, $lt: end }; }
  const page = Math.max(Number(req.query.page) || 1, 1); const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
  const [appointments, totalItems] = await Promise.all([Appointment.find(filter).populate("doctor", "personalDetails professional").populate("user", "personalDetails").sort({ appointmentDate: 1, timeSlot: 1 }).skip((page - 1) * limit).limit(limit), Appointment.countDocuments(filter)]);
  res.json({ success: true, data: appointments, pagination: { currentPage: page, totalPages: Math.ceil(totalItems / limit), totalItems, pageSize: limit } });
} catch (error) { next(error); } };

exports.updateAppointment = async (req, res, next) => { try {
  const allowed = ["status", "paymentStatus", "notes", "appointmentDate", "timeSlot"];
  const updates = {}; for (const field of allowed) if (req.body[field] !== undefined) updates[field] = req.body[field];
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });
  res.json({ success: true, data: appointment });
} catch (error) { next(error); } };

exports.cancelMyAppointment = async (req, res, next) => { try {
  const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id, status: { $in: ["pending", "confirmed"] } });
  if (!appointment) return res.status(404).json({ success: false, message: "Cancellable appointment not found" });
  appointment.status = "cancelled"; await appointment.save(); res.json({ success: true, data: appointment });
} catch (error) { next(error); } };
