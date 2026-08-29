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
    slug: { type: String, unique: true, sparse: true, index: true },
    personalDetails: personalDetailsSchema,
    education: [educationSchema],
    experience: [experienceSchema],
    specialization: [specializationSchema],
    chambers: [chamberSlotSchema],
    professional: { type: professionalSchema, default: {} },
    languages: [{ type: String, trim: true }],
    services: [{ type: String, trim: true }],
    conditionsTreated: [{ type: String, trim: true }],
    telemedicine: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    totalPatients: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

doctorSchema.pre("validate", function () {
  if (!this.slug && this.personalDetails?.firstName) {
    const name = `${this.personalDetails.firstName}-${this.personalDetails.lastName || ""}`
      .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    this.slug = `${name || "doctor"}-${String(this._id).slice(-6)}`;
  }
});

// --- Transform _id to id for JSON responses ---
doctorSchema.set("toJSON", {
  virtuals: true,
  versionKey: false, // removes __v
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
