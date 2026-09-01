const router=require("express").Router();const {protect,adminOnly}=require("../middleware/auth");const controller=require("../controllers/contactInquiryController");
router.post("/",controller.create);router.get("/",protect,adminOnly,controller.list);router.patch("/:id",protect,adminOnly,controller.update);module.exports=router;
