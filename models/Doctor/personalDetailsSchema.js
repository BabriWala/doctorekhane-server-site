const mongoose = require("mongoose");
const { addressSchema } = require("./addressSchema");

// --- Personal Details Schema ---
const personalDetailsSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  dob: { type: Date, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  address: addressSchema,

  // 👇 Injected here
  about: { type: String }, // Doctor's bio/intro
  totalExperience: { type: Number, default: 0 }, // in years
});

module.exports = { personalDetailsSchema };
