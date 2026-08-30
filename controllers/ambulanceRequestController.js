const Ambulance = require("../models/Ambulance");
const AmbulanceRequest = require("../models/AmbulanceRequest");

exports.createRequest = async (req, res, next) => { try {
  const scheduledAt = new Date(req.body.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime()) || scheduledAt < new Date()) return res.status(400).json({ success: false, message: "A future pickup date and time is required" });
  const required = ["pickupLocation", "dropLocation", "serviceType", "patientName", "contactNumber"];
  if (required.some((field) => !String(req.body[field] || "").trim())) return res.status(400).json({ success: false, message: "Pickup, destination, service type, patient name and contact number are required" });
  let ambulance = null;
  if (req.body.ambulanceId) {
    ambulance = await Ambulance.findOne({ _id: req.body.ambulanceId, "availability.isAvailable": true });
    if (!ambulance) return res.status(409).json({ success: false, message: "Selected ambulance is no longer available" });
  }
  const request = await AmbulanceRequest.create({ ambulance: ambulance?._id, pickupLocation: req.body.pickupLocation, dropLocation: req.body.dropLocation, serviceType: req.body.serviceType, scheduledAt, patientName: req.body.patientName, contactNumber: req.body.contactNumber, emergencyDetails: req.body.emergencyDetails });
  res.status(201).json({ success: true, message: "Ambulance request submitted", data: request });
} catch (error) { next(error); } };

exports.listRequests = async (req, res, next) => { try {
  const filter = req.query.status ? { status: req.query.status } : {};
  const requests = await AmbulanceRequest.find(filter).populate("ambulance").sort({ createdAt: -1 }).limit(500);
  res.json({ success: true, data: requests });
} catch (error) { next(error); } };

exports.updateRequest = async (req, res, next) => { try {
  const allowed = ["status", "ambulance", "adminNotes", "scheduledAt"];
  const updates = {}; for (const field of allowed) if (req.body[field] !== undefined) updates[field] = req.body[field];
  const request = await AmbulanceRequest.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate("ambulance");
  if (!request) return res.status(404).json({ success: false, message: "Ambulance request not found" });
  res.json({ success: true, data: request });
} catch (error) { next(error); } };
