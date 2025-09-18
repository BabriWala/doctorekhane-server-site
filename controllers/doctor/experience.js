const Doctor = require("../../models/Doctor");

// --- Add Experience ---
const addExperience = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { hospitalName, role, years, from, to } = req.body;

    if (!hospitalName || !role || !years) {
      return res
        .status(400)
        .json({ message: "hospitalName, role, and years are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.experience.push({ hospitalName, role, years, from, to });
    await doctor.save();

    return res.status(201).json({
      message: "Experience added successfully",
      experience: doctor.experience,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Update Experience ---
const updateExperience = async (req, res) => {
  try {
    const { doctorId, experienceId } = req.params;
    const updateData = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const experience = doctor.experience.id(experienceId);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    Object.assign(experience, updateData);
    await doctor.save();

    return res.status(200).json({ message: "Experience updated", experience });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Delete Experience ---
const deleteExperience = async (req, res) => {
  try {
    const { doctorId, experienceId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Remove experience by ID
    doctor.experience.pull(experienceId);

    await doctor.save();

    return res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addExperience, updateExperience, deleteExperience };
