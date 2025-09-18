const mongoose = require("mongoose");
const { personalDetailsSchema } = require("./personalDetailsSchema");
const { educationSchema } = require("./educationSchema");
const { experienceSchema } = require("./experienceSchema");
const { specializationSchema } = require("./specializationSchema");
const { chamberSlotSchema } = require("./chamberSlotSchema");
const { professionalSchema } = require("./professionalSchema");

// --- Doctor Schema (Main) ---
const doctorSchema = new mongoose.Schema(
  {
    personalDetails: personalDetailsSchema,
    education: [educationSchema],
    experience: [experienceSchema],
    specialization: [specializationSchema],
    chambers: [chamberSlotSchema],
    professional: { type: professionalSchema, default: {} },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
