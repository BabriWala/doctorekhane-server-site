const mongoose = require("mongoose");
const Doctor = require("../../models/Doctor");

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAllDoctors = async (req, res, next) => { try {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const match = {};
  const isAdmin = ["admin", "superadmin"].includes(req.user?.account?.role);
  if (!isAdmin) match["professional.status"] = "Active";
  else if (["Active", "Inactive"].includes(req.query.status)) match["professional.status"] = req.query.status;
  if (req.query.department) match["professional.department"] = req.query.department;
  if (req.query.field) match["professional.field"] = req.query.field;
  if (req.query.specialization) match.$and = [{ $or: ["specialization.field", "professional.department", "professional.field"].map(field => ({ [field]: { $regex: escapeRegex(req.query.specialization), $options: "i" } })) }];
  if (req.query.city) match["chambers.address.city"] = { $regex: escapeRegex(req.query.city), $options: "i" };
  if (req.query.district) match["chambers.address.state"] = { $regex: escapeRegex(req.query.district), $options: "i" };
  if (req.query.gender) match["personalDetails.gender"] = req.query.gender;
  if (req.query.availableDay) match["chambers.day"] = req.query.availableDay;
  if (req.query.telemedicine !== undefined) match.telemedicine = req.query.telemedicine === "true";
  if (req.query.featured !== undefined) match.featured = req.query.featured === "true";
  if (Number(req.query.minRating) > 0) match.ratingAverage = { $gte: Number(req.query.minRating) };
  if (req.query.minExperience) match["personalDetails.totalExperience"] = { $gte: Number(req.query.minExperience) };
  if (req.query.minFee || req.query.maxFee) {
    match["professional.consultationFee"] = {};
    if (req.query.minFee) match["professional.consultationFee"].$gte = Number(req.query.minFee);
    if (req.query.maxFee) match["professional.consultationFee"].$lte = Number(req.query.maxFee);
  }
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "i");
    match.$or = ["firstName", "middleName", "lastName", "email", "phone"].map((field) => ({ [`personalDetails.${field}`]: regex }));
    match.$or.push({ "professional.department": regex }, { "professional.field": regex }, { "specialization.field": regex });
  }
  const sortOptions = {
    rating: { ratingAverage: -1, reviewCount: -1 }, experience: { "personalDetails.totalExperience": -1 },
    feeLow: { "professional.consultationFee": 1 }, feeHigh: { "professional.consultationFee": -1 }, newest: { createdAt: -1 },
  };
  const sort = sortOptions[req.query.sort] || { "professional.order": 1, ratingAverage: -1, createdAt: -1 };
  const [doctors, totalItems] = await Promise.all([
    Doctor.find(match).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Doctor.countDocuments(match),
  ]);
  res.json({ success: true, currentPage: page, totalItems, totalPages: Math.ceil(totalItems / limit), count: doctors.length, data: doctors.map((doctor) => ({ ...doctor, id: doctor._id })) });
} catch (error) { next(error); } };

const getDoctorById = async (req, res, next) => { try {
  const isAdmin = ["admin", "superadmin"].includes(req.user?.account?.role);
  const identifier = mongoose.isValidObjectId(req.params.doctorId) ? { _id: req.params.doctorId } : { slug: req.params.doctorId };
  const doctor = await Doctor.findOne(isAdmin ? identifier : { ...identifier, "professional.status": "Active" });
  if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
  res.json(doctor);
} catch (error) { next(error); } };

const getDoctorFilterOptions = async (_req, res, next) => { try {
  const active = { "professional.status": "Active" };
  const [departments, fields, specializations, cities, languages, districts] = await Promise.all([
    Doctor.distinct("professional.department", active),
    Doctor.distinct("professional.field", active),
    Doctor.distinct("specialization.field", active),
    Doctor.distinct("chambers.address.city", active),
    Doctor.distinct("languages", active),
    Doctor.distinct("chambers.address.state", active),
  ]);
  const clean = (values) => values.filter((value) => typeof value === "string" && value.trim()).sort((a, b) => a.localeCompare(b));
  res.json({ success: true, data: { departments: clean(departments), fields: clean(fields), specializations: clean(specializations), cities: clean(cities), districts: clean(districts), languages: clean(languages) } });
} catch (error) { next(error); } };

const getDoctorsBySpecialization = async (req, res, next) => { try {
  const doctors = await Doctor.find({ "specialization.field": { $regex: escapeRegex(req.params.specialization), $options: "i" }, "professional.status": "Active" });
  res.json(doctors);
} catch (error) { next(error); } };

const getDoctorsByChamberCity = async (req, res, next) => { try {
  const doctors = await Doctor.find({ "chambers.address.city": { $regex: escapeRegex(req.params.city), $options: "i" }, "professional.status": "Active" });
  res.json(doctors);
} catch (error) { next(error); } };

const sortDoctorsByField = async (req, res, next) => { try {
  const allowed = ["personalDetails.totalExperience", "professional.consultationFee", "professional.order", "ratingAverage"];
  if (!allowed.includes(req.params.field)) return res.status(400).json({ success: false, message: `Invalid sort field. Allowed: ${allowed.join(", ")}` });
  res.json(await Doctor.find({ "professional.status": "Active" }).sort({ [req.params.field]: 1 }));
} catch (error) { next(error); } };

module.exports = { getAllDoctors, getDoctorById, getDoctorFilterOptions, getDoctorsBySpecialization, getDoctorsByChamberCity, sortDoctorsByField };
