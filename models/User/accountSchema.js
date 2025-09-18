const mongoose = require("mongoose");
// 🔹 Account Schema
const accountSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "পাসওয়ার্ড আবশ্যক"],
      minlength: [6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    type: {
      type: String,
      // enum: ["student", "traveller", "worker", "other"],
      default: "other",
    },
    emailVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { _id: false }
);

module.exports = { accountSchema };
