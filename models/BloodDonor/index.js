const mongoose = require("mongoose");
const { addressSchema } = require("./addressSchema");
const { contactSchema } = require("./contactSchema");
const { bloodDonorBasicInfoSchema } = require("./bloodDonorBasicInfoSchema ");
const { donationInfoSchema } = require("./donationInfoSchema");

const bloodDonorSchema = new mongoose.Schema(
  {
    basicInfo: bloodDonorBasicInfoSchema,
    address: addressSchema,
    contact: contactSchema,
    donationInfo: donationInfoSchema,
  },
  { timestamps: true }
);

const BloodDonor = mongoose.model("BloodDonor", bloodDonorSchema);

module.exports = BloodDonor;
