const BloodRequest = require("../models/BloodRequest");

exports.createBloodRequest = async (req, res, next) => { try {
  const requiredDate = new Date(req.body.requiredDate);
  if (Number.isNaN(requiredDate.getTime()) || requiredDate < new Date(new Date().setHours(0,0,0,0))) return res.status(400).json({ success: false, message: "A valid required date is required" });
  const request = await BloodRequest.create({ patientName: req.body.patientName, bloodGroup: req.body.bloodGroup, hospital: req.body.hospital, requiredDate, contactNumber: req.body.contactNumber, urgency: req.body.urgency });
  res.status(201).json({ success: true, message: "Blood request submitted", data: request });
} catch (error) { next(error); } };

exports.listBloodRequests = async (req, res, next) => { try {
  const page = Math.max(Number(req.query.page) || 1, 1); const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
  const filter = {}; if (req.query.status) filter.status = req.query.status; if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
  const [items, totalItems] = await Promise.all([BloodRequest.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), BloodRequest.countDocuments(filter)]);
  res.json({ success: true, data: items, pagination: { currentPage: page, totalPages: Math.ceil(totalItems / limit), totalItems, pageSize: limit } });
} catch (error) { next(error); } };

exports.trackBloodRequest = async (req, res, next) => { try {
  const requestNumber = String(req.query.requestNumber || "").trim().toUpperCase(); const contactNumber = String(req.query.contactNumber || "").trim();
  if (!requestNumber || !contactNumber) return res.status(400).json({ success: false, message: "Request number and contact number are required" });
  const item = await BloodRequest.findOne({ requestNumber, contactNumber });
  if (!item) return res.status(404).json({ success: false, message: "No matching blood request found" });
  res.json({ success: true, data: item });
} catch (error) { next(error); } };

exports.updateBloodRequest = async (req, res, next) => { try {
  const updates = {}; for (const field of ["status", "adminNotes"]) if (req.body[field] !== undefined) updates[field] = req.body[field];
  const request = await BloodRequest.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!request) return res.status(404).json({ success: false, message: "Blood request not found" });
  res.json({ success: true, data: request });
} catch (error) { next(error); } };
