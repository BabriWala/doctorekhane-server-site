const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const Review = require("../models/Review");
require("dotenv").config();

const doctors = [
  { firstName: "Dr. Afsana", lastName: "Karim", gender: "Female", phone: "01790001001", email: "afsana.demo@doctorekhane.com", about: "Medicine specialist focused on diabetes, hypertension and preventive care.", experience: 12, position: "Senior Consultant", department: "Medicine", field: "Internal Medicine", fee: 700, newFee: 900, license: "DEMO-BMDC-1001", languages: ["Bangla", "English"], services: ["Diabetes care", "Hypertension management", "General consultation"], conditions: ["Diabetes", "Hypertension", "Fever"], telemedicine: true, featured: true, patients: 1850, chamber: "Doctor Ekhane Medical Centre", city: "Dhaka", days: ["Sunday", "Tuesday", "Thursday"] },
  { firstName: "Dr. Mahmudul", lastName: "Hasan", gender: "Male", phone: "01790001002", email: "mahmudul.demo@doctorekhane.com", about: "Experienced child health specialist providing newborn and adolescent care.", experience: 10, position: "Consultant", department: "Pediatrics", field: "Child Specialist", fee: 600, newFee: 800, license: "DEMO-BMDC-1002", languages: ["Bangla", "English"], services: ["Child consultation", "Growth assessment", "Vaccination advice"], conditions: ["Childhood fever", "Asthma", "Nutrition concerns"], telemedicine: true, featured: true, patients: 1320, chamber: "Khulna Family Hospital", city: "Khulna", days: ["Monday", "Wednesday", "Saturday"] },
  { firstName: "Dr. Nusrat", lastName: "Jahan", gender: "Female", phone: "01790001003", email: "nusrat.demo@doctorekhane.com", about: "Gynecology and obstetrics consultant offering respectful, evidence-based women’s healthcare.", experience: 14, position: "Associate Professor", department: "Gynecology", field: "Gynecologist & Obstetrician", fee: 800, newFee: 1000, license: "DEMO-BMDC-1003", languages: ["Bangla", "English", "Hindi"], services: ["Pregnancy care", "Women’s health", "Infertility consultation"], conditions: ["High-risk pregnancy", "PCOS", "Menstrual disorders"], telemedicine: false, featured: true, patients: 2100, chamber: "Chattogram Women’s Care", city: "Chattogram", days: ["Sunday", "Monday", "Wednesday"] },
];

const hospitals = [
  { name: "Doctor Ekhane Medical Centre", reg: "DEMO-HOSP-001", type: "Private", year: 2015, city: "Dhaka", street: "Dhanmondi 27", phone: "09610001001", email: "dhaka.demo@doctorekhane.com", beds: 120, departments: ["Medicine", "Cardiology", "Pediatrics"], services: ["Emergency", "ICU", "Diagnostics", "Pharmacy"] },
  { name: "Khulna Family Hospital", reg: "DEMO-HOSP-002", type: "Private", year: 2018, city: "Khulna", street: "KDA Avenue", phone: "09610001002", email: "khulna.demo@doctorekhane.com", beds: 80, departments: ["Pediatrics", "Medicine", "Gynecology"], services: ["Emergency", "NICU", "Laboratory", "Ambulance"] },
  { name: "Chattogram Women’s Care", reg: "DEMO-HOSP-003", type: "Specialized", year: 2020, city: "Chattogram", street: "Panchlaish", phone: "09610001003", email: "ctg.demo@doctorekhane.com", beds: 60, departments: ["Gynecology", "Obstetrics", "Pediatrics"], services: ["Maternity", "NICU", "Ultrasound", "Laboratory"] },
];

async function upsertDoctor(item) {
  const chambers = item.days.map((day, index) => ({ day, from: "17:00", to: "21:00", chamberName: item.chamber, address: { street: "Central Road", city: item.city, state: item.city, country: "Bangladesh", zip: "1205" }, contactNumber: item.phone, order: index + 1 }));
  return Doctor.findOneAndUpdate({ "personalDetails.email": item.email }, { $set: { personalDetails: { firstName: item.firstName, lastName: item.lastName, gender: item.gender, phone: item.phone, email: item.email, about: item.about, totalExperience: item.experience, address: { city: item.city, country: "Bangladesh" } }, professional: { position: item.position, department: item.department, field: item.field, consultationFee: item.fee, consultationFeeNew: item.newFee, status: "Active", licenseNumber: item.license, order: 10 }, specialization: [{ field: item.field, description: item.about }], education: [{ degree: "MBBS", institution: "Demo Medical College" }], experience: [{ hospitalName: item.chamber, role: item.position, years: item.experience }], chambers, languages: item.languages, services: item.services, conditionsTreated: item.conditions, telemedicine: item.telemedicine, featured: item.featured, totalPatients: item.patients } }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
}

async function upsertHospital(item, doctorMap) {
  const doctorIds = item.departments.flatMap((name) => doctorMap.filter((doctor) => doctor.professional.department === name).map((doctor) => doctor._id));
  return Hospital.findOneAndUpdate({ "basicInfo.registrationNumber": item.reg }, { $set: { basicInfo: { name: item.name, registrationNumber: item.reg, type: item.type, establishedYear: item.year, description: `${item.name} is a demo healthcare provider offering dependable services in ${item.city}.`, services: item.services, facilities: ["Pharmacy", "Parking", "Waiting lounge"], insurance: ["Green Delta", "MetLife"], is24Hours: true, emergencyPhone: item.phone, ambulancePhone: item.phone, bedCount: item.beds, status: "Active" }, address: { street: item.street, city: item.city, state: item.city, postalCode: "1205", country: "Bangladesh" }, contact: { phone: item.phone, email: item.email, website: "https://doctorekhane.com" }, departments: item.departments.map((name) => ({ name, doctors: doctorIds })) } }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
}

async function addReviews(targetType, target) {
  const samples = [
    { patientName: "Rahim Uddin", rating: 5, title: "Very caring service", comment: "The consultation was detailed, respectful and easy to understand.", helpfulCount: 12 },
  ];
  for (const review of samples) await Review.findOneAndUpdate({ targetType, target: target._id, patientName: review.patientName }, { $set: { ...review, status: "approved", verified: true, treatmentType: "Consultation", visitDate: new Date("2026-07-15") } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  const stats = await Review.aggregate([{ $match: { targetType, target: target._id, status: "approved" } }, { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } }]);
  const values = { ratingAverage: Number((stats[0]?.average || 0).toFixed(1)), reviewCount: stats[0]?.count || 0 };
  if (targetType === "Doctor") await Doctor.findByIdAndUpdate(target._id, values); else await Hospital.findByIdAndUpdate(target._id, { "basicInfo.ratingAverage": values.ratingAverage, "basicInfo.reviewCount": values.reviewCount });
}

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);
  const doctorDocs = []; for (const doctor of doctors) doctorDocs.push(await upsertDoctor(doctor));
  const hospitalDocs = []; for (const hospital of hospitals) hospitalDocs.push(await upsertHospital(hospital, doctorDocs));
  for (const doctor of doctorDocs) await addReviews("Doctor", doctor);
  for (const hospital of hospitalDocs) await addReviews("Hospital", hospital);
  console.log(JSON.stringify({ success: true, doctors: doctorDocs.length, hospitals: hospitalDocs.length, approvedReviews: doctorDocs.length + hospitalDocs.length }));
  await mongoose.disconnect();
}

seed().catch(async (error) => { console.error(error); await mongoose.disconnect(); process.exit(1); });
