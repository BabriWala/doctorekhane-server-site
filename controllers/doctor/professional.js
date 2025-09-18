const Doctor = require("../../models/Doctor");

// --- Update Professional Info ---
const updateProfessional = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const {
      position,
      department,
      field,
      consultationFee,
      status,
      order,
      licenseNumber,
      nidNumber,
    } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const prof = doctor.professional;

    if (position) prof.position = position;
    if (department) prof.department = department;
    if (field) prof.field = field;
    if (consultationFee) prof.consultationFee = consultationFee;
    if (status) prof.status = status;
    if (order) prof.order = order;
    if (licenseNumber) prof.licenseNumber = licenseNumber;
    if (nidNumber) prof.nidNumber = nidNumber;

    await doctor.save();

    return res.status(200).json({
      message: "Professional details updated successfully",
      professional: doctor.professional,
    });
  } catch (error) {
    console.error("Error updating professional details:", error);

    // Handle duplicate licenseNumber/nidNumber
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `Duplicate value for ${field}. It must be unique.`,
      });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfessional };
