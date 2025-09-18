const Hospital = require("../../models/Hospital");

// ======================================
//  UPDATE HOSPITAL ADDRESS
// ======================================
const updateHospitalAddress = async (req, res) => {
  const { hospitalId } = req.params;
  const newAddress = req.body; // Expecting street, city, state, postalCode, country

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Initialize address if undefined
    if (!hospital.address) {
      hospital.address = {};
    }

    // Merge existing address with new data
    hospital.address = { ...hospital.address.toObject?.(), ...newAddress };

    await hospital.save();

    res.status(200).json({
      message: "Hospital address updated successfully",
      address: hospital.address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { updateHospitalAddress };
