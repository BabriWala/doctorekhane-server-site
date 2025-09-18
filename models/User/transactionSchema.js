const mongoose = require("mongoose");
const { imageSchema } = require("../Service/imageSchema");
// 🔹 Transaction Schema
const transactionSchema = new mongoose.Schema({
  pictures: [imageSchema],
  reason: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
});

module.exports = { transactionSchema };
