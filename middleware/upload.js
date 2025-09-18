const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ======================================
//  DYNAMIC MULTER FACTORY
// ======================================
/**
 * Creates a multer middleware for a specific folder type.
 * @param {string} entity - 'doctors', 'hospitals', 'blood-donors', 'ambulances'
 * @param {string} folderType - 'profilePicture', 'certificates', 'chambers', 'images', etc.
 * @returns multer middleware
 */
const uploadFactory = (entity, folderType) => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const entityId =
          req.params.id ||
          req.params.doctorId ||
          req.params.hospitalId ||
          req.params.donorId ||
          req.params.ambulanceId ||
          "unknown"; // dynamic id

        // Use path.join for cross-platform compatibility
        const dir = path.resolve(
          __dirname,
          "..",
          // "public",
          "uploads",
          entity,
          entityId,
          folderType
        );

        // create folder recursively if it doesn't exist
        fs.mkdirSync(dir, { recursive: true });

        cb(null, dir);
      },
      filename: (req, file, cb) => {
        // Keep only safe filename
        const safeName = file.originalname.replace(/\s+/g, "_");
        cb(null, Date.now() + "-" + safeName);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB limit
    fileFilter: (req, file, cb) => {
      // optional: allow only images
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"));
      }
      cb(null, true);
    },
  });
};

// ======================================
//  DOCTOR UPLOAD MIDDLEWARE
// ======================================
const uploadDoctorProfile = uploadFactory("doctors", "profilePicture");
// const uploadDoctorCertificates = uploadFactory("doctors", "certificates");
// const uploadDoctorChamberImages = uploadFactory("doctors", "chambers");

// ======================================
//  HOSPITAL UPLOAD MIDDLEWARE
// ======================================
const uploadHospitalImages = uploadFactory("hospitals", "images"); // multiple images
const uploadHospitalLogo = uploadFactory("hospitals", "logo"); // single logo file

// ======================================
//  BLOOD DONOR UPLOAD MIDDLEWARE
// ======================================
const uploadBloodDonorProfile = uploadFactory("blood-donors", "profilePicture");

// ======================================
//  AMBULANCE UPLOAD MIDDLEWARE
// ======================================
const uploadAmbulanceProfile = uploadFactory("ambulances", "profilePicture");

module.exports = {
  uploadDoctorProfile,
  // uploadDoctorCertificates,
  // uploadDoctorChamberImages,
  uploadHospitalImages,
  uploadHospitalLogo,
  uploadBloodDonorProfile,
  uploadAmbulanceProfile,
};
