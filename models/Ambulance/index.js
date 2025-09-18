const mongoose = require("mongoose");
const { ambulanceBasicInfoSchema } = require("./ambulanceBasicInfoSchema");
const { ambulanceContactSchema } = require("./ambulanceContactSchema");

const {
  ambulanceAvailabilitySchema,
} = require("./ambulanceAvailabilitySchema");
const { ambulanceAddressSchema } = require("./ambulanceAddressSchema");

// ==========================
// MAIN AMBULANCE SCHEMA
// ==========================
const ambulanceSchema = new mongoose.Schema(
  {
    basicInfo: ambulanceBasicInfoSchema,
    address: ambulanceAddressSchema,
    contact: ambulanceContactSchema,
    availability: ambulanceAvailabilitySchema,
  },
  { timestamps: true }
);

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);

module.exports = Ambulance;
