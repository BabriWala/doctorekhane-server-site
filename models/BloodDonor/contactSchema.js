const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      sparse: true, // allow empty / null values
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // same for email
    },
  },
  { _id: false }
);

module.exports = { contactSchema };
