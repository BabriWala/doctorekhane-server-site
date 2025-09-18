const Doctor = require("../../models/Doctor");

// @desc    Update doctor's address
// @route   PUT /api/admin/doctor/:doctorId/address
// @access  Admin
const updateDoctorAddress = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { street, city, state, country, zip } = req.body;

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update address
    doctor.personalDetails.address = {
      street: street || doctor.personalDetails.address.street,
      city: city || doctor.personalDetails.address.city,
      state: state || doctor.personalDetails.address.state,
      country: country || doctor.personalDetails.address.country,
      zip: zip || doctor.personalDetails.address.zip,
    };

    // Save doctor
    await doctor.save();

    return res.status(200).json({
      message: "Address updated successfully",
      address: doctor.personalDetails.address,
    });
  } catch (error) {
    console.error("Error updating doctor address:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateDoctorAddress };
