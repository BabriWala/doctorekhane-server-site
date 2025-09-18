const Hospital = require("../../models/Hospital");

// ======================================
//  UPDATE HOSPITAL CONTACT
// ======================================
const updateHospitalContact = async (req, res) => {
  const { hospitalId } = req.params;
  const newContact = req.body; // Expecting phone, email, website

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Initialize contact if undefined
    if (!hospital.contact) {
      hospital.contact = {};
    }

    // Merge existing contact with new data
    hospital.contact = { ...hospital.contact.toObject?.(), ...newContact };

    await hospital.save();

    res.status(200).json({
      message: "Hospital contact updated successfully",
      contact: hospital.contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { updateHospitalContact };
