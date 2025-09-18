const Doctor = require("../../models/Doctor");

// --- Update Doctor Profile Picture ---
const updateProfilePicture = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No profile picture uploaded" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Save relative path instead of absolute
    doctor.personalDetails.profilePicture = `/uploads/doctors/${doctorId}/profilePicture/${req.file.filename}`;

    await doctor.save();

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: doctor.personalDetails.profilePicture,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfilePicture };
