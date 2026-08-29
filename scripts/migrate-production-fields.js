const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const User = require("../models/User");

const slugify = (value) => String(value || "doctor").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([
    Doctor.updateMany({ languages: { $exists: false } }, { $set: { languages: [] } }),
    Doctor.updateMany({ services: { $exists: false } }, { $set: { services: [] } }),
    Doctor.updateMany({ conditionsTreated: { $exists: false } }, { $set: { conditionsTreated: [] } }),
    Doctor.updateMany({ telemedicine: { $exists: false } }, { $set: { telemedicine: false } }),
    Doctor.updateMany({ featured: { $exists: false } }, { $set: { featured: false } }),
    Doctor.updateMany({ ratingAverage: { $exists: false } }, { $set: { ratingAverage: 0 } }),
    Doctor.updateMany({ reviewCount: { $exists: false } }, { $set: { reviewCount: 0 } }),
    Doctor.updateMany({ totalPatients: { $exists: false } }, { $set: { totalPatients: 0 } }),
    Hospital.updateMany({ "basicInfo.services": { $exists: false } }, { $set: { "basicInfo.services": [] } }),
    Hospital.updateMany({ "basicInfo.facilities": { $exists: false } }, { $set: { "basicInfo.facilities": [] } }),
    Hospital.updateMany({ "basicInfo.insurance": { $exists: false } }, { $set: { "basicInfo.insurance": [] } }),
    Hospital.updateMany({ "basicInfo.is24Hours": { $exists: false } }, { $set: { "basicInfo.is24Hours": false } }),
    Hospital.updateMany({ "basicInfo.ratingAverage": { $exists: false } }, { $set: { "basicInfo.ratingAverage": 0 } }),
    Hospital.updateMany({ "basicInfo.reviewCount": { $exists: false } }, { $set: { "basicInfo.reviewCount": 0 } }),
    Hospital.updateMany({ "basicInfo.status": { $nin: ["Active", "Inactive"] } }, { $set: { "basicInfo.status": "Active" } }),
    User.updateMany({ favoriteDoctors: { $exists: false } }, { $set: { favoriteDoctors: [] } }),
  ]);
  const doctors = await Doctor.find({ $or: [{ slug: { $exists: false } }, { slug: "" }] }).select("_id personalDetails").lean();
  for (const doctor of doctors) {
    const base = slugify(`${doctor.personalDetails?.firstName || "doctor"}-${doctor.personalDetails?.lastName || ""}`);
    await Doctor.updateOne({ _id: doctor._id }, { $set: { slug: `${base}-${String(doctor._id).slice(-6)}` } });
  }
  console.log(JSON.stringify({ success: true, migratedDoctors: doctors.length }));
  await mongoose.disconnect();
};

run().catch(async (error) => { console.error(error.message); await mongoose.disconnect().catch(() => {}); process.exit(1); });
