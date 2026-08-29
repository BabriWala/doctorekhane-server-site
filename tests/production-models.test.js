const mongoose = require("mongoose");
const Review = require("../models/Review");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

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
});
