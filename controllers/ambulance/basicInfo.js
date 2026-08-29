// ======================================
//  CREATE NEW AMBULANCE

const Ambulance = require("../../models/Ambulance");

// ======================================
const createAmbulance = async (req, res) => {
  try {
    const ambulance = new Ambulance({
      basicInfo: req.body, // expects vehicleNumber, type, driverName, driverLicense
    });

    await ambulance.save();

    res.status(201).json({
      success: true,
      message: "Ambulance created successfully",
      data: ambulance,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ======================================
//  UPDATE AMBULANCE BASIC INFO
// ======================================
const updateAmbulanceBasicInfo = async (req, res) => {
  try {
    const { ambulanceId } = req.params;

    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      return res
        .status(404)
        .json({ success: false, message: "Ambulance not found" });
    }

    Object.entries(req.body).forEach(([key, value]) => {
      if (value !== undefined) ambulance.basicInfo[key] = value;
    });
    await ambulance.save();
    res.status(200).json({
      success: true,
      message: "Ambulance basic info updated successfully",
      data: ambulance,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAmbulance,
  updateAmbulanceBasicInfo,
};
