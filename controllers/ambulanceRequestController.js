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
  const page = Math.max(Number(req.query.page) || 1, 1); const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
  const [requests, totalItems] = await Promise.all([AmbulanceRequest.find(filter).populate("ambulance").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), AmbulanceRequest.countDocuments(filter)]);
  res.json({ success: true, data: requests, pagination: { currentPage: page, totalPages: Math.ceil(totalItems / limit), totalItems, pageSize: limit } });
} catch (error) { next(error); } };

exports.trackRequest = async (req, res, next) => { try {
  const requestNumber = String(req.query.requestNumber || "").trim().toUpperCase(); const contactNumber = String(req.query.contactNumber || "").trim();
  if (!requestNumber || !contactNumber) return res.status(400).json({ success: false, message: "Request number and contact number are required" });
  const item = await AmbulanceRequest.findOne({ requestNumber, contactNumber }).populate("ambulance");
  if (!item) return res.status(404).json({ success: false, message: "No matching ambulance request found" });
  res.json({ success: true, data: item });
} catch (error) { next(error); } };

exports.updateRequest = async (req, res, next) => { try {
  const allowed = ["status", "ambulance", "adminNotes", "scheduledAt"];
  const updates = {}; for (const field of allowed) if (req.body[field] !== undefined) updates[field] = req.body[field];
  const request = await AmbulanceRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ success: false, message: "Ambulance request not found" });
  if (updates.ambulance && !updates.status && request.status === "pending") updates.status = "assigned";
  const nextAmbulanceId = updates.ambulance || request.ambulance;
  const nextStatus = updates.status || request.status;
  let selectedAmbulance = null;
  if (nextAmbulanceId) {
    selectedAmbulance = await Ambulance.findById(nextAmbulanceId);
    if (!selectedAmbulance) return res.status(404).json({ success: false, message: "Ambulance not found" });
    if (selectedAmbulance.basicInfo?.type !== request.serviceType) return res.status(409).json({ success: false, message: "The ambulance type does not match the requested service" });
    const changingAmbulance = String(request.ambulance || "") !== String(selectedAmbulance._id);
    if (changingAmbulance && !selectedAmbulance.availability?.isAvailable) return res.status(409).json({ success: false, message: "Selected ambulance is not available" });
  }
  if (["assigned", "dispatched"].includes(nextStatus) && !selectedAmbulance) return res.status(400).json({ success: false, message: "Assign an ambulance before changing this status" });

  const previousAmbulanceId = request.ambulance;
  request.set(updates);
  await request.save();
  if (previousAmbulanceId && String(previousAmbulanceId) !== String(request.ambulance || "")) {
    await Ambulance.findByIdAndUpdate(previousAmbulanceId, { "availability.isAvailable": true });
  }
  if (selectedAmbulance) {
    const isAvailable = ["completed", "cancelled"].includes(request.status);
    await Ambulance.findByIdAndUpdate(selectedAmbulance._id, { "availability.isAvailable": isAvailable });
  }
  await request.populate("ambulance");
  res.json({ success: true, data: request });
} catch (error) { next(error); } };
