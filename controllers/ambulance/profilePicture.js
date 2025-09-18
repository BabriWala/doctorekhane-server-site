const path = require("path");
const Ambulance = require("../../models/Ambulance");
const fs = require("fs");


const updateAmbulanceProfilePicture = async (req, res) => {
  try {
    const { ambulance: ambulanceId } = req.params;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const ambulance = await Ambulance.findById(ambulanceId);
    if (!ambulance)
      return res.status(404).json({ message: "Ambulance not found" });

    // Delete old profile picture
    if (ambulance.basicInfo.profilePicture) {
      const oldPath = path.join(
        process.cwd(),
        ambulance.basicInfo.profilePicture.replace(/^\//, "")
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Build relative path dynamically
    const relativePath =
      "/uploads/" +
      path
        .relative(path.join(process.cwd(), "uploads"), req.file.path)
        .replace(/\\/g, "/");

    ambulance.basicInfo.profilePicture = relativePath;
    await ambulance.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: ambulance.basicInfo.profilePicture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { updateAmbulanceProfilePicture };
