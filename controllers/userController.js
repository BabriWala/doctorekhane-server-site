const User = require("../models/User");
const { validationResult } = require("express-validator");

const publicUser = (document) => {
  const user = document.toJSON ? document.toJSON() : document;
  return {
    id: String(user._id || user.id), _id: user._id || user.id,
    name: user.personalDetails?.name || "", email: user.personalDetails?.email || "",
    phone: user.personalDetails?.phone || "", role: user.account?.role || "user",
    account: { role: user.account?.role || "user" }, personalDetails: user.personalDetails,
    passportNumber: user.passportNumber || "", profilePhoto: user.profilePhoto || null,
    emailVerified: Boolean(user.emailVerified), status: user.status || "active",
    createdAt: user.createdAt, updatedAt: user.updatedAt, bookings: [], visaApplications: [],
  };
};

const validationErrors = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
  return true;
};

exports.getProfile = async (req, res, next) => { try {
  const user = await User.findById(req.user.id);
  res.json({ success: true, data: publicUser(user), user: publicUser(user) });
} catch (error) { next(error); } };

exports.updateProfile = async (req, res, next) => { try {
  if (validationErrors(req, res)) return;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  for (const field of ["name", "phone"]) if (req.body[field] !== undefined) user.personalDetails[field] = String(req.body[field]).trim();
  if (req.body.email !== undefined) {
    const email = String(req.body.email).trim().toLowerCase();
    if (await User.exists({ "personalDetails.email": email, _id: { $ne: user._id } })) return res.status(409).json({ success: false, message: "Email already exists" });
    user.personalDetails.email = email;
  }
  if (req.body.dob !== undefined) user.personalDetails.dob = req.body.dob ? new Date(req.body.dob) : null;
  if (req.body.address && typeof req.body.address === "object") {
    for (const field of ["street", "city", "state", "postalCode", "country"]) if (req.body.address[field] !== undefined) user.personalDetails.address[field] = String(req.body.address[field]).trim();
  }
  if (req.body.passportNumber !== undefined) user.passportNumber = req.body.passportNumber;
  await user.save();
  res.json({ success: true, message: "Profile updated", data: publicUser(user), user: publicUser(user) });
} catch (error) { next(error); } };

exports.uploadProfilePhoto = async (req, res, next) => { try {
  if (!req.file) return res.status(400).json({ success: false, message: "Photo is required" });
  const photoUrl = `/uploads/profilePhoto/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.user.id, { profilePhoto: photoUrl }, { new: true });
  res.json({ success: true, message: "Profile photo updated", data: { profilePhoto: user.profilePhoto } });
} catch (error) { next(error); } };

exports.deleteAccount = async (req, res, next) => { try {
  const user = await User.findById(req.user.id).select("+account.password");
  if (!user || !req.body.password || !(await user.comparePassword(req.body.password))) return res.status(400).json({ success: false, message: "Password is incorrect" });
  await user.deleteOne();
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.json({ success: true, message: "Account deleted" });
} catch (error) { next(error); } };

const userFilter = (query) => {
  const filter = {};
  if (query.role) filter["account.role"] = query.role;
  if (query.status) filter.status = query.status;
  if (query.search) {
    const regex = new RegExp(String(query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ "personalDetails.name": regex }, { "personalDetails.email": regex }, { "personalDetails.phone": regex }];
  }
  return filter;
};

exports.getAllUsers = async (req, res, next) => { try {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
  const filter = userFilter(req.query);
  const [users, total] = await Promise.all([User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), User.countDocuments(filter)]);
  res.json({ success: true, data: { users: users.map(publicUser), pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalItems: total, pageSize: limit, from: total ? (page - 1) * limit + 1 : 0, to: Math.min(page * limit, total), total } } });
} catch (error) { next(error); } };

exports.getUserStats = async (req, res, next) => { try {
  const [total, active, blocked, admins] = await Promise.all([User.countDocuments(), User.countDocuments({ status: "active" }), User.countDocuments({ status: "blocked" }), User.countDocuments({ "account.role": { $in: ["admin", "superadmin"] } })]);
  res.json({ success: true, total, active, blocked, admins });
} catch (error) { next(error); } };

exports.getUserById = async (req, res, next) => { try {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: publicUser(user) });
} catch (error) { next(error); } };

exports.updateUser = async (req, res, next) => { try {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  for (const field of ["name", "email", "phone"]) if (req.body[field] !== undefined) user.personalDetails[field] = req.body[field];
  if (req.body.role !== undefined) user.account.role = req.body.role;
  if (req.body.passportNumber !== undefined) user.passportNumber = req.body.passportNumber;
  await user.save();
  res.json({ success: true, data: publicUser(user) });
} catch (error) { next(error); } };

exports.updateUserStatus = async (req, res, next) => { try {
  if (!["active", "blocked"].includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid status" });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (String(user._id) === String(req.user._id) && req.body.status === "blocked") return res.status(400).json({ success: false, message: "You cannot block your own account" });
  user.status = req.body.status; await user.save();
  res.json({ success: true, data: publicUser(user) });
} catch (error) { next(error); } };

exports.deleteUser = async (req, res, next) => { try {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (String(user._id) === String(req.user._id) || user.account?.role === "superadmin") return res.status(400).json({ success: false, message: "This account cannot be deleted" });
  await user.deleteOne(); res.json({ success: true, message: "User deleted" });
} catch (error) { next(error); } };

exports.createAdmin = async (req, res, next) => { try {
  if (validationErrors(req, res)) return;
  const email = req.body.email.trim().toLowerCase();
  if (await User.exists({ "personalDetails.email": email })) return res.status(409).json({ success: false, message: "Email already exists" });
  const admin = await User.create({ personalDetails: { name: req.body.name, email, phone: req.body.phone }, account: { password: req.body.password, role: "admin" }, status: "active", emailVerified: true });
  res.status(201).json({ success: true, user: publicUser(admin) });
} catch (error) { next(error); } };

exports.bulkAction = async (req, res, next) => { try {
  const { action, userIds } = req.body;
  if (!Array.isArray(userIds) || !userIds.length) return res.status(400).json({ success: false, message: "userIds are required" });
  const safeIds = userIds.filter((id) => String(id) !== String(req.user._id));
  if (["activate", "unblock"].includes(action)) await User.updateMany({ _id: { $in: safeIds } }, { status: "active" });
  else if (action === "block") await User.updateMany({ _id: { $in: safeIds }, "account.role": { $ne: "superadmin" } }, { status: "blocked" });
  else if (action === "delete") await User.deleteMany({ _id: { $in: safeIds }, "account.role": { $nin: ["admin", "superadmin"] } });
  else return res.status(400).json({ success: false, message: "Invalid bulk action" });
  res.json({ success: true, message: "Bulk action completed" });
} catch (error) { next(error); } };

exports.exportUsers = async (req, res, next) => { try {
  const users = (await User.find().sort({ createdAt: -1 })).map(publicUser);
  const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const rows = [["name", "email", "phone", "role", "status", "createdAt"], ...users.map((u) => [u.name, u.email, u.phone, u.role, u.status, u.createdAt])];
  res.set("Content-Type", "text/csv; charset=utf-8"); res.set("Content-Disposition", "attachment; filename=users.csv");
  res.send(rows.map((row) => row.map(quote).join(",")).join("\n"));
} catch (error) { next(error); } };

exports.getFavoriteDoctors = async (req, res, next) => { try {
  const user = await User.findById(req.user._id).populate("favoriteDoctors");
  res.json({ success: true, data: user.favoriteDoctors || [] });
} catch (error) { next(error); } };

exports.toggleFavoriteDoctor = async (req, res, next) => { try {
  const Doctor = require("../models/Doctor");
  if (!(await Doctor.exists({ _id: req.params.doctorId, "professional.status": "Active" }))) return res.status(404).json({ success: false, message: "Doctor not found" });
  const user = await User.findById(req.user._id);
  const exists = user.favoriteDoctors.some((id) => String(id) === req.params.doctorId);
  if (exists) user.favoriteDoctors.pull(req.params.doctorId); else user.favoriteDoctors.push(req.params.doctorId);
  await user.save();
  res.json({ success: true, favorite: !exists, data: user.favoriteDoctors });
} catch (error) { next(error); } };

exports.publicUser = publicUser;
