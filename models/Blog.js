const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  summary: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: String, required: true, trim: true, index: true },
  tags: [{ type: String, trim: true }],
  authorName: { type: String, required: true, trim: true },
  authorImage: { type: String, trim: true },
  thumbnail: { type: String, trim: true },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
  views: { type: Number, default: 0, min: 0 },
  publishedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
