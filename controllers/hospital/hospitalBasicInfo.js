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
    accreditations,
    address,
    website,
  } = req.body;

  try {
    if (!String(name || "").trim() || !type || !String(phone || "").trim() || !String(email || "").trim()) return res.status(400).json({ message: "Hospital name, type, phone and email are required" });
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
        registrationNumber: String(registrationNumber || "").trim() || undefined,
        type,
        establishedYear: establishedYear === "" || establishedYear == null ? undefined : Number(establishedYear),
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
        accreditations,
      },
      address,
      contact: { phone, email, website },
    });

    await hospital.save();

    res.status(201).json({
      message: "Hospital created successfully",
      hospital,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError" || error.name === "CastError") return res.status(400).json({ message: error.message });
    if (error?.code === 11000) return res.status(409).json({ message: "Hospital name or registration number already exists" });
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

    const allowed = ["name", "registrationNumber", "type", "establishedYear", "description", "facilities", "status", "services", "insurance", "accreditations", "is24Hours", "emergencyPhone", "ambulancePhone", "bedCount", "visitingHours"];
    for (const field of allowed) if (updates[field] !== undefined) hospital.basicInfo[field] = field === "registrationNumber" ? (String(updates[field] || "").trim() || undefined) : field === "establishedYear" ? (updates[field] === "" ? undefined : Number(updates[field])) : updates[field];
    if (updates.phone !== undefined) hospital.contact.phone = updates.phone;
    if (updates.email !== undefined) hospital.contact.email = updates.email;
    if (updates.website !== undefined) hospital.contact.website = updates.website;
    if (updates.address && typeof updates.address === "object") hospital.address.set(updates.address);
    await hospital.save();

    res.status(200).json({
      message: "Hospital basic information updated successfully",
      hospital,
    });
  } catch (error) {
    console.error(error);
    if (error?.code === 11000) return res.status(409).json({ message: "Hospital name or registration number already exists" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createHospitalBasicInfo,
  updateHospitalBasicInfo,
};
