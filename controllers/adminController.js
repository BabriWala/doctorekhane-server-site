const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const BloodDonor = require("../models/BloodDonor");
const Ambulance = require("../models/Ambulance");
const Appointment = require("../models/Appointment");
const Review = require("../models/Review");

const percentTrend = (current, previous) => previous ? Math.round(((current - previous) / previous) * 100) : current ? 100 : 0;

exports.getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const [users, doctors, hospitals, donors, ambulances, activeDoctors, availableAmbulances, appointments, pendingAppointments, pendingReviews, newUsers, previousUsers, recentUsers, recentDoctors] = await Promise.all([
      User.countDocuments(), Doctor.countDocuments(), Hospital.countDocuments(), BloodDonor.countDocuments(), Ambulance.countDocuments(),
      Doctor.countDocuments({ "professional.status": "Active" }), Ambulance.countDocuments({ "availability.isAvailable": true }),
      Appointment.countDocuments(), Appointment.countDocuments({ status: { $in: ["pending", "confirmed"] } }), Review.countDocuments({ status: "pending" }),
      User.countDocuments({ createdAt: { $gte: monthStart } }), User.countDocuments({ createdAt: { $gte: previousMonthStart, $lt: monthStart } }),
      User.find().sort({ createdAt: -1 }).limit(4), Doctor.find().sort({ createdAt: -1 }).limit(4),
    ]);
    const recentActivity = [
      ...recentUsers.map((u) => ({ action: `User created: ${u.personalDetails?.name || u.personalDetails?.email}`, timestamp: u.createdAt })),
      ...recentDoctors.map((d) => ({ action: `Doctor added: ${d.personalDetails?.firstName || ""} ${d.personalDetails?.lastName || ""}`.trim(), timestamp: d.createdAt })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);
    res.json({
      success: true,
      users: { total: users, trend: percentTrend(newUsers, previousUsers) },
      bookings: { total: appointments, active: pendingAppointments, trend: 0 },
      visaApplications: { total: 0, trend: 0 },
      revenue: { total: 0, trend: 0 },
      doctors: { total: doctors, active: activeDoctors }, hospitals: { total: hospitals },
      bloodDonors: { total: donors }, ambulances: { total: ambulances, available: availableAmbulances },
      reviews: { pending: pendingReviews },
      recentActivity,
    });
  } catch (error) { next(error); }
};

exports.getSystemInfo = (req, res) => res.json({
  success: true,
  data: {
    nodeVersion: process.version, uptime: process.uptime(), memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV, database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  },
});

exports.exportData = async (req, res, next) => { try {
  const models = { users: User, doctors: Doctor, hospitals: Hospital, "blood-donors": BloodDonor, ambulances: Ambulance };
  if (req.query.type === "all") {
    const data = {}; for (const [key, Model] of Object.entries(models)) data[key] = await Model.find();
    return res.json({ success: true, data, exportedAt: new Date().toISOString() });
  }
  const Model = models[req.query.type];
  if (!Model) return res.status(400).json({ success: false, message: "Invalid export type" });
  res.json({ success: true, data: await Model.find(), exportedAt: new Date().toISOString() });
} catch (error) { next(error); } };

exports.clearCache = (req, res) => res.json({ success: true, message: "No application cache is configured", clearedAt: new Date().toISOString() });
