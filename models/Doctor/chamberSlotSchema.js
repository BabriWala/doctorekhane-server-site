const mongoose = require("mongoose");
const { addressSchema } = require("./addressSchema");

// --- Chamber Slot Schema (Day Wise) ---
const chamberSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  from: { type: String, required: true }, // "10:00"
  to: { type: String, required: true }, // "12:00"
  chamberName: { type: String, required: true },
  address: addressSchema,
  contactNumber: String,
  order: { type: Number, default: 1 }, // slot sorting
});

module.exports = { chamberSlotSchema };
