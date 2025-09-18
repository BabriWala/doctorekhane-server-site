const Hospital = require("../../models/Hospital");
const fs = require("fs");
const path = require("path");

// ======================================
//  UPLOAD HOSPITAL IMAGES
// ======================================
const uploadHospitalImages = async (req, res) => {
  const { hospitalId } = req.params;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Ensure hospital images folder exists in root/uploads/hospitals/<hospitalId>/images
    const hospitalImagesDir = path.join(
      process.cwd(),
      "uploads",
      "hospitals",
      hospitalId,
      "images"
    );
    if (!fs.existsSync(hospitalImagesDir)) {
      fs.mkdirSync(hospitalImagesDir, { recursive: true });
    }

    // Save uploaded images filenames with relative paths
    req.files.forEach((file) => {
      const relativePath = `/uploads/hospitals/${hospitalId}/images/${file.filename}`;
      hospital.basicInfo.images.push(relativePath);
    });

    await hospital.save();

    res.status(200).json({
      message: "Hospital images uploaded successfully",
      images: hospital.basicInfo.images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
//  DELETE HOSPITAL IMAGE
// ======================================
const deleteHospitalImage = async (req, res) => {
  const { hospitalId, imageId } = req.params;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const imageIndex = hospital.basicInfo.images.findIndex(
      (img) => path.basename(img) === imageId
    );
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Remove image from array
    const [removedImage] = hospital.basicInfo.images.splice(imageIndex, 1);
    await hospital.save();

    // Remove file from disk
    const imagePath = path.join(
      process.cwd(),
      "uploads",
      "hospitals",
      hospitalId,
      "images",
      imageId
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({
      message: "Hospital image deleted successfully",
      images: hospital.basicInfo.images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadHospitalImages,
  deleteHospitalImage,
};
