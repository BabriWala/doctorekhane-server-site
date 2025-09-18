const mongoose = require("mongoose");
const { hospitalBasicInfoSchema } = require("./hospitalBasicInfoSchema");
const { addressSchema } = require("./addressSchema");
const { contactSchema } = require("./contactSchema");
const { departmentSchema } = require("./departmentSchema");

// --- Main Hospital Schema ---
const hospitalSchema = new mongoose.Schema(
  {
    basicInfo: hospitalBasicInfoSchema, // Main hospital info
    address: addressSchema, // Direct address
    contact: contactSchema, // Direct contact

    departments: [departmentSchema], // Array of departments
  },
  { timestamps: true }
);

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
