const mongoose = require("mongoose");
const { imageSchema } = require("../Service/imageSchema");
// 🔹 Personal Details Schema
const personalDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "নাম আবশ্যক"],
      trim: true,
      maxlength: [50, "নাম ৫০ অক্ষরের বেশি হতে পারবে না"],
    },
    email: {
      type: String,
      required: [true, "ইমেইল আবশ্যক"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "সঠিক ইমেইল দিন"],
    },
    phone: {
      type: String,
      required: [true, "ফোন নম্বর আবশ্যক"],
      match: [/^(\+88)?01[3-9]\d{8}$/, "সঠিক বাংলাদেশি ফোন নম্বর দিন"],
    },
    dob: { type: Date, default: null },
    address: {
      street: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      postalCode: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "বাংলাদেশ" },
    },
    // passportNumber: { type: String, default: null, uppercase: true },
    profilePhoto: imageSchema,
  },
  { _id: false }
);

module.exports = { personalDetailsSchema };
