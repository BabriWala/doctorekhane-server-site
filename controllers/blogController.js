const Blog = require("../models/Blog");

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const slugify = (value) => String(value).toLowerCase().trim().replace(/[^a-z0-9\u0980-\u09ff]+/g, "-").replace(/^-|-$/g, "");

exports.listBlogs = async (req, res, next) => { try {
  const page = Math.max(Number(req.query.page) || 1, 1); const limit = Math.min(Math.max(Number(req.query.limit) || 9, 1), 50);
  const filter = { status: "published" };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured !== undefined) filter.featured = req.query.featured === "true";
  if (req.query.search) { const regex = new RegExp(escapeRegex(req.query.search), "i"); filter.$or = [{ title: regex }, { summary: regex }, { authorName: regex }, { tags: regex }]; }
  const [data, totalItems, categories] = await Promise.all([
    Blog.find(filter).select("-content").sort({ featured: -1, publishedAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Blog.countDocuments(filter), Blog.distinct("category", { status: "published" }),
  ]);
  res.json({ success: true, data, pagination: { currentPage: page, totalPages: Math.ceil(totalItems / limit), totalItems }, categories: categories.filter(Boolean).sort() });
} catch (error) { next(error); } };

exports.getBlog = async (req, res, next) => { try {
  const blog = await Blog.findOneAndUpdate({ slug: req.params.slug, status: "published" }, { $inc: { views: 1 } }, { new: true });
  if (!blog) return res.status(404).json({ success: false, message: "Article not found" });
  res.json({ success: true, data: blog });
} catch (error) { next(error); } };

exports.createBlog = async (req, res, next) => { try {
  const slug = req.body.slug || `${slugify(req.body.title)}-${Date.now().toString(36)}`;
  const blog = await Blog.create({ ...req.body, slug, publishedAt: req.body.status === "published" ? (req.body.publishedAt || new Date()) : req.body.publishedAt });
  res.status(201).json({ success: true, data: blog });
} catch (error) { next(error); } };

exports.updateBlog = async (req, res, next) => { try {
  const update = { ...req.body }; if (update.status === "published" && !update.publishedAt) update.publishedAt = new Date();
  const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!blog) return res.status(404).json({ success: false, message: "Article not found" });
  res.json({ success: true, data: blog });
} catch (error) { next(error); } };

exports.deleteBlog = async (req, res, next) => { try {
  const blog = await Blog.findByIdAndDelete(req.params.id); if (!blog) return res.status(404).json({ success: false, message: "Article not found" });
  res.json({ success: true, message: "Article deleted" });
} catch (error) { next(error); } };
