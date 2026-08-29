const Hospital = require("../../models/Hospital");

// ======================================
//  CREATE HOSPITAL BASIC INFORMATION
// ======================================
const createHospitalBasicInfo = async (req, res) => {
  const {
    name,
    registrationNumber,
    type,
    establishedYear,
    description,
    facilities,
    status,
    phone,
    email,
    services,
    insurance,
    is24Hours,
    emergencyPhone,
    ambulancePhone,
    bedCount,
    visitingHours,
  } = req.body;

  try {
    // Check if hospital with the same name already exists
    const existingHospital = await Hospital.findOne({ "basicInfo.name": name });
    if (existingHospital) {
      return res
        .status(400)
        .json({ message: "Hospital with this name already exists" });
    }

    // Create new hospital with basicInfo
    const hospital = new Hospital({
      basicInfo: {
        name,
        registrationNumber,
        type,
        establishedYear,
        description,
        facilities,
        status,
        services,
        insurance,
        is24Hours,
        emergencyPhone,
        ambulancePhone,
        bedCount,
        visitingHours,
      },
      contact: { phone, email },
    });

    await hospital.save();

    res.status(201).json({
      message: "Hospital created successfully",
      hospital,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
//  UPDATE HOSPITAL BASIC INFORMATION
// ======================================
const updateHospitalBasicInfo = async (req, res) => {
  const { hospitalId } = req.params;
  const updates = req.body;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Update the basicInfo fields
    hospital.basicInfo = { ...hospital.basicInfo.toObject(), ...updates };
    await hospital.save();

    res.status(200).json({
      message: "Hospital basic information updated successfully",
      basicInfo: hospital.basicInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createHospitalBasicInfo,
  updateHospitalBasicInfo,
};
