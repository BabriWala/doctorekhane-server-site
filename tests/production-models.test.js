const mongoose = require("mongoose");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const BloodRequest = require("../models/BloodRequest");
const Hospital = require("../models/Hospital");

describe("production healthcare models", () => {
  test("review enforces rating and useful comment", async () => {
    const review = new Review({ targetType: "Doctor", target: new mongoose.Types.ObjectId(), patientName: "Patient", rating: 6, comment: "short" });
    const error = review.validateSync();
    expect(error.errors.rating).toBeDefined();
    expect(error.errors.comment).toBeDefined();
  });

  test("appointment generates a customer-facing number", async () => {
    const appointment = new Appointment({ doctor: new mongoose.Types.ObjectId(), patient: { name: "Patient", phone: "01700000000" }, appointmentDate: new Date(Date.now() + 86400000), timeSlot: "10:00" });
    await appointment.validate();
    expect(appointment.appointmentNumber).toMatch(/^DE-/);
  });

  test("doctor generates a stable slug and discovery defaults", async () => {
    const doctor = new Doctor({ personalDetails: { firstName: "Ayesha", lastName: "Rahman", gender: "Female", phone: "01700000001", email: "ayesha@example.com" } });
    await doctor.validate();
    expect(doctor.slug).toMatch(/^ayesha-rahman-/);
    expect(doctor.ratingAverage).toBe(0);
    expect(doctor.services).toEqual([]);
  });

  test("blood request generates a trackable reference", async () => {
    const request = new BloodRequest({ patientName: "Patient", bloodGroup: "O+", hospital: "General Hospital", requiredDate: new Date(Date.now() + 86400000), contactNumber: "01700000000", urgency: "urgent" });
    await request.validate();
    expect(request.requestNumber).toMatch(/^BLD-/);
    expect(request.status).toBe("pending");
  });

  test("hospital supports customer-visible operational details", async () => {
    const hospital = new Hospital({ basicInfo: { name: "Model Test Hospital", type: "Private", services: ["ICU"], facilities: ["Pharmacy"], insurance: ["Health Plan"], accreditations: ["ISO"], visitingHours: [{ day: "Sunday", open: "09:00", close: "17:00" }] }, address: { city: "Dhaka" }, contact: { phone: "01700000000", email: "hospital@example.com" }, departments: [{ name: "Cardiology", services: ["ECG"] }] });
    await hospital.validate();
    expect(hospital.departments[0].services).toEqual(["ECG"]);
    expect(hospital.basicInfo.accreditations).toEqual(["ISO"]);
  });
});
