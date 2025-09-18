const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = "uploads/temp/";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("শুধুমাত্র ছবি এবং PDF ফাইল আপলোড করা যাবে"), false);
  }
};

const packageUpload = multer({
  storage: tempStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

module.exports = packageUpload;
