const Doctor = require("../../models/Doctor");

// ==============================
// Add Specialization
// ==============================
const addSpecialization = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { field, description } = req.body;

    if (!field) {
      return res
        .status(400)
        .json({ message: "Specialization field is required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.specialization.push({ field, description });
    await doctor.save();

    return res.status(201).json({
      message: "Specialization added successfully",
      specialization: doctor.specialization,
    });
  } catch (error) {
    console.error("Error adding specialization:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// Update Specialization
// ==============================
const updateSpecialization = async (req, res) => {
  try {
    const { doctorId, specializationId } = req.params;
    const { field, description } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const specialization = doctor.specialization.id(specializationId);
    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    if (field !== undefined) specialization.field = field;
    if (description !== undefined) specialization.description = description;

    await doctor.save();

    return res.status(200).json({
      message: "Specialization updated successfully",
      specialization,
    });
  } catch (error) {
    console.error("Error updating specialization:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// Delete Specialization
// ==============================
const deleteSpecialization = async (req, res) => {
  try {
    const { doctorId, specializationId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const specialization = doctor.specialization.id(specializationId);
    if (!specialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    specialization.deleteOne();
    await doctor.save();

    return res
      .status(200)
      .json({ message: "Specialization deleted successfully" });
  } catch (error) {
    console.error("Error deleting specialization:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addSpecialization,
  updateSpecialization,
  deleteSpecialization,
};
