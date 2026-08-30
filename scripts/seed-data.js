const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const Review = require("../models/Review");
const Ambulance = require("../models/Ambulance");
const BloodDonor = require("../models/BloodDonor");
const Appointment = require("../models/Appointment");
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

const doctorProfiles = [
  ["Tanvir", "Ahmed", "Male", "Cardiology", "Cardiologist", "Dhaka", 16],
  ["Farhana", "Islam", "Female", "Dermatology", "Dermatologist", "Dhaka", 9],
  ["Rashed", "Chowdhury", "Male", "Orthopedics", "Orthopedic Surgeon", "Chattogram", 18],
  ["Samira", "Haque", "Female", "Neurology", "Neurologist", "Rajshahi", 13],
  ["Imran", "Kabir", "Male", "ENT", "ENT Specialist", "Sylhet", 11],
  ["Tahmina", "Akter", "Female", "Ophthalmology", "Eye Specialist", "Barishal", 8],
  ["Sabbir", "Rahman", "Male", "Psychiatry", "Psychiatrist", "Rangpur", 12],
  ["Maliha", "Sultana", "Female", "Endocrinology", "Endocrinologist", "Mymensingh", 10],
  ["Fahim", "Hossain", "Male", "Urology", "Urologist", "Cumilla", 15],
  ["Sharmeen", "Alam", "Female", "Oncology", "Oncologist", "Dhaka", 17],
  ["Adnan", "Mahmud", "Male", "Gastroenterology", "Gastroenterologist", "Khulna", 14],
  ["Rumana", "Yasmin", "Female", "Nephrology", "Nephrologist", "Chattogram", 12],
];

doctorProfiles.forEach(([first, last, gender, department, field, city, experience], index) => doctors.push({
  firstName: `Dr. ${first}`, lastName: last, gender,
  phone: `01790001${String(index + 4).padStart(3, "0")}`,
  email: `${first.toLowerCase()}.${last.toLowerCase()}.demo@doctorekhane.com`,
  about: `${field} providing evidence-based diagnosis, treatment and long-term follow-up care.`,
  experience, position: experience >= 15 ? "Senior Consultant" : "Consultant", department, field,
  fee: 600 + (index % 5) * 100, newFee: 800 + (index % 5) * 100,
  license: `DEMO-BMDC-${String(index + 1004)}`, languages: ["Bangla", "English"],
  services: [`${department} consultation`, "Follow-up care", "Health assessment"],
  conditions: [`Common ${department.toLowerCase()} conditions`, "Chronic disease management"],
  telemedicine: index % 2 === 0, featured: index < 5, patients: 900 + index * 175,
  chamber: `${city} Specialist Care`, city, days: index % 2 ? ["Monday", "Wednesday", "Friday"] : ["Sunday", "Tuesday", "Thursday"],
}));

const hospitalCities = ["Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh", "Cumilla", "Dhaka", "Chattogram", "Khulna"];
hospitalCities.forEach((city, index) => hospitals.push({
  name: `${city} Community & Specialist Hospital`, reg: `DEMO-HOSP-${String(index + 4).padStart(3, "0")}`,
  type: index % 3 === 0 ? "Specialized" : "Private", year: 2010 + index,
  city, street: `${12 + index} Central Avenue`, phone: `09610001${String(index + 4).padStart(3, "0")}`,
  email: `${city.toLowerCase()}.hospital.demo@doctorekhane.com`, beds: 70 + index * 15,
  departments: [doctors[(index + 3) % doctors.length].department, "Medicine", "Emergency"],
  services: ["24/7 Emergency", "Diagnostics", "Pharmacy", index % 2 ? "ICU" : "Ambulance"],
}));

const cities = ["Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh", "Cumilla"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const donorNames = [["Arif", "Hasan"], ["Mim", "Akter"], ["Sohan", "Rahman"], ["Tania", "Islam"], ["Nayeem", "Ahmed"], ["Puja", "Das"], ["Rafi", "Hossain"], ["Sadia", "Karim"], ["Joy", "Roy"], ["Nusrat", "Haque"], ["Shakib", "Alam"], ["Rima", "Sultana"], ["Fardin", "Kabir"], ["Mehjabin", "Noor"], ["Siam", "Mahmud"], ["Anika", "Jahan"]];

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

async function seedAmbulances() {
  const docs = [];
  for (let index = 0; index < 15; index += 1) {
    const serial = String(index + 1).padStart(2, "0");
    docs.push(await Ambulance.findOneAndUpdate(
      { "basicInfo.vehicleNumber": `DHAKA-METRO-AMB-${serial}` },
      { $set: {
        basicInfo: { vehicleNumber: `DHAKA-METRO-AMB-${serial}`, type: ["Basic", "Advanced", "ICU"][index % 3], driverName: `Demo Driver ${serial}`, driverLicense: `DEMO-DL-${serial}` },
        address: { address: `${20 + index} Hospital Road`, city: cities[index % cities.length], area: "Central", latitude: 23.7 + index * 0.01, longitude: 90.3 + index * 0.01 },
        contact: { phone: `01880001${String(index + 1).padStart(3, "0")}`, alternatePhone: `01980001${String(index + 1).padStart(3, "0")}`, email: `ambulance${serial}.demo@doctorekhane.com` },
        availability: { isAvailable: index % 5 !== 0, notes: "Demo ambulance available through Doctor Ekhane dispatch.", lastServiceDate: new Date(`2026-08-${String((index % 20) + 1).padStart(2, "0")}`) },
      } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ));
  }
  return docs;
}

async function seedDonors() {
  const docs = [];
  for (let index = 0; index < donorNames.length; index += 1) {
    const [firstName, lastName] = donorNames[index];
    const serial = String(index + 1).padStart(3, "0");
    docs.push(await BloodDonor.findOneAndUpdate(
      { "contact.email": `donor${serial}.demo@doctorekhane.com` },
      { $set: {
        basicInfo: { firstName, lastName, gender: index % 2 ? "Female" : "Male", dob: new Date(`${1987 + (index % 12)}-${String((index % 9) + 1).padStart(2, "0")}-15`), bloodGroup: bloodGroups[index % bloodGroups.length] },
        address: { address: `${30 + index} Community Road`, street: "Community Road", city: cities[index % cities.length], state: cities[index % cities.length], country: "Bangladesh", postalCode: `12${serial}` },
        contact: { phone: `01680001${serial}`, email: `donor${serial}.demo@doctorekhane.com` },
        donationInfo: { lastDonationDate: new Date(`2026-${String((index % 6) + 1).padStart(2, "0")}-10`), isActive: index % 6 !== 0, notes: "Fictional demo donor; verify availability before contact." },
      } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ));
  }
  return docs;
}

async function seedAppointments(doctorDocs) {
  const docs = [];
  const statuses = ["pending", "confirmed", "completed", "cancelled"];
  for (let index = 0; index < 15; index += 1) {
    const doctor = doctorDocs[index % doctorDocs.length];
    const serial = String(index + 1).padStart(3, "0");
    docs.push(await Appointment.findOneAndUpdate(
      { appointmentNumber: `DE-DEMO-${serial}` },
      { $set: {
        doctor: doctor._id, chamberId: doctor.chambers?.[0]?._id,
        patient: { name: `Demo Patient ${serial}`, phone: `01580001${serial}`, email: `patient${serial}.demo@example.com`, age: 22 + index, gender: index % 2 ? "Female" : "Male" },
        appointmentDate: new Date(`2026-09-${String((index % 20) + 2).padStart(2, "0")}T12:00:00.000Z`),
        timeSlot: `${String(10 + (index % 8)).padStart(2, "0")}:00`, reason: ["Routine consultation", "Follow-up visit", "Diagnostic review"][index % 3],
        consultationType: doctor.telemedicine && index % 3 === 0 ? "video" : "in-person", fee: doctor.professional.consultationFee,
        paymentStatus: index % 3 === 0 ? "paid" : "unpaid", status: statuses[index % statuses.length], notes: "Seeded demonstration appointment.",
      } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ));
  }
  return docs;
}

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);
  const doctorDocs = []; for (const doctor of doctors) doctorDocs.push(await upsertDoctor(doctor));
  const hospitalDocs = []; for (const hospital of hospitals) hospitalDocs.push(await upsertHospital(hospital, doctorDocs));
  for (const doctor of doctorDocs) await addReviews("Doctor", doctor);
  for (const hospital of hospitalDocs) await addReviews("Hospital", hospital);
  const ambulanceDocs = await seedAmbulances();
  const donorDocs = await seedDonors();
  const appointmentDocs = await seedAppointments(doctorDocs);
  console.log(JSON.stringify({ success: true, doctors: doctorDocs.length, hospitals: hospitalDocs.length, approvedReviews: doctorDocs.length + hospitalDocs.length, ambulances: ambulanceDocs.length, bloodDonors: donorDocs.length, appointments: appointmentDocs.length }));
  await mongoose.disconnect();
}

seed().catch(async (error) => { console.error(error); await mongoose.disconnect(); process.exit(1); });
