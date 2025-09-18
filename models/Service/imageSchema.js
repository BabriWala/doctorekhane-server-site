const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: String,
  position: Number,
});

module.exports = { imageSchema };
