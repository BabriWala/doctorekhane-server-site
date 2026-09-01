const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const controller = require("../controllers/blogController");

router.get("/", controller.listBlogs);
router.get("/:slug", controller.getBlog);
router.post("/", protect, adminOnly, controller.createBlog);
router.put("/:id", protect, adminOnly, controller.updateBlog);
router.delete("/:id", protect, adminOnly, controller.deleteBlog);

module.exports = router;
