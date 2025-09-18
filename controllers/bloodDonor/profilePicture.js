const fs = require("fs");
const path = require("path");
const BloodDonor = require("../../models/BloodDonor");

// ======================================
//  UPDATE BLOOD DONOR PROFILE PICTURE
// ======================================
const updateBloodDonorProfilePicture = async (req, res) => {
  try {
    const { donorId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const donor = await BloodDonor.findById(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    // Delete old profile picture if exists
    if (donor.basicInfo.profilePicture) {
      const oldPath = path.join(
        process.cwd(),
        donor.basicInfo.profilePicture.replace(/^\//, "")
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Save new profile picture path relative to root for frontend
    const relativePath = `/uploads/blood-donors/${donorId}/profilePicture/${req.file.filename}`;

    // Ensure folder exists
    const uploadDir = path.join(
      process.cwd(),
      "uploads",
      "blood-donors",
      donorId
    );
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    donor.basicInfo.profilePicture = relativePath;
    await donor.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: donor.basicInfo.profilePicture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { updateBloodDonorProfilePicture };
