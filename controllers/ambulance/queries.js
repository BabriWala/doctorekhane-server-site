const Ambulance = require("../../models/Ambulance");

// ======================================
// GET ALL AMBULANCES (with optional filters)
// ======================================
const getAllAmbulances = async (req, res) => {
  try {
    const { type, address, isAvailable } = req.query;

    // ✅ pagination params
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (type) filter["basicInfo.type"] = type;
    if (address) filter["address.address"] = address;
    if (isAvailable !== undefined) {
      filter["availability.isAvailable"] = isAvailable === "true";
    }

    // ✅ total count (before pagination)
    const total = await Ambulance.countDocuments(filter);

    // ✅ paginated data
    const ambulances = await Ambulance.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional but recommended

    res.status(200).json({
      success: true,
      ambulances,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
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
// GET AMBULANCES BY Address
// ======================================
const getAmbulancesByAddress = async (req, res) => {
  try {
    const address = (req.query.address || "").trim();
    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "address is required" });
    }

    const ambulances = await Ambulance.find({
      "address.address": { $regex: address, $options: "i" },
    });

    res.status(200).json({ success: true, ambulances });
  } catch (error) {
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
  getAmbulancesByAddress,
  getAvailableAmbulances,
};
