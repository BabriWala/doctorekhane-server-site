const Hospital = require("../../models/Hospital");
const fs = require("fs");
const path = require("path");

// ======================================
//  UPDATE HOSPITAL LOGO
// ======================================
const updateHospitalLogo = async (req, res) => {
  const { hospitalId } = req.params;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No logo uploaded" });
    }

    // Delete previous logo from disk if exists
    if (hospital.basicInfo.logo) {
      const oldLogoPath = path.join(
        __dirname,
        "../../uploads/hospital",
        hospitalId,
        "logo",
        hospital.basicInfo.logo
      );
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    // Update with new logo filename
    // hospital.basicInfo.logo = req.file.filename;
    hospital.basicInfo.logo = `/uploads/hospitals/${hospitalId}/logo/${req.file.filename}`;

    await hospital.save();

    res.status(200).json({
      message: "Hospital logo updated successfully",
      logo: hospital.basicInfo.logo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { updateHospitalLogo };
