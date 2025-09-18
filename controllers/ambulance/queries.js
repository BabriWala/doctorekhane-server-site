const Ambulance = require("../../models/Ambulance");

// ======================================
// GET ALL AMBULANCES (with optional filters)
// ======================================
const getAllAmbulances = async (req, res) => {
  try {
    const { type, city, isAvailable } = req.query;
    const filter = {};

    if (type) filter["basicInfo.type"] = type;
    if (city) filter["address.city"] = city;
    if (isAvailable !== undefined)
      filter["availability.isAvailable"] = isAvailable === "true";

    const ambulances = await Ambulance.find(filter);
    res.status(200).json({ success: true, ambulances });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================
// GET SINGLE AMBULANCE BY ID
// ======================================
const getAmbulanceById = async (req, res) => {
  try {
    const { ambulanceId } = req.params;
    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance)
      return res
        .status(404)
        .json({ success: false, message: "Ambulance not found" });

    res.status(200).json({ success: true, ambulance });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================
// GET AMBULANCES BY TYPE
// ======================================
const getAmbulancesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const ambulances = await Ambulance.find({ "basicInfo.type": type });

    res.status(200).json({ success: true, ambulances });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================
// GET AMBULANCES BY CITY
// ======================================
const getAmbulancesByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const ambulances = await Ambulance.find({ "address.city": city });

    res.status(200).json({ success: true, ambulances });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================
// GET AVAILABLE AMBULANCES
// ======================================
const getAvailableAmbulances = async (req, res) => {
  try {
    const ambulances = await Ambulance.find({
      "availability.isAvailable": true,
    });
    res.status(200).json({ success: true, ambulances });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllAmbulances,
  getAmbulanceById,
  getAmbulancesByType,
  getAmbulancesByCity,
  getAvailableAmbulances,
};
