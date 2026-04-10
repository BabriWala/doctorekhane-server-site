const Doctor = require("../../models/Doctor");

// --- Add Education ---
const addEducation = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { degree, institution, yearOfCompletion } = req.body;

    // if (!degree || !institution || !yearOfCompletion) {
    //   return res.status(400).json({ message: "One fields are required" });
    // }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.education.push({ degree, institution, yearOfCompletion });
    await doctor.save();

    return res.status(201).json({
      message: "Education added successfully",
      education: doctor.education,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Update Education ---
const updateEducation = async (req, res) => {
  try {
    const { doctorId, educationId } = req.params;
    const updateData = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const education = doctor.education.id(educationId);
    if (!education)
      return res.status(404).json({ message: "Education not found" });

    Object.assign(education, updateData);
    await doctor.save();

    return res.status(200).json({ message: "Education updated", education });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Delete Education ---
const deleteEducation = async (req, res) => {
  try {
    const { doctorId, educationId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Remove education by ID
    doctor.education.pull(educationId);

    await doctor.save();

    return res.status(200).json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addEducation, updateEducation, deleteEducation };
