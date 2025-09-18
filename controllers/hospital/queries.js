const Hospital = require("../../models/Hospital");

// ======================================
//  GET ALL HOSPITALS (with optional filters)
// ======================================
const getAllHospitals = async (req, res) => {
  try {
    const { city, type, status } = req.query;

    const query = {};
    if (city) query["address.city"] = city;
    if (type) query["basicInfo.type"] = type;
    if (status) query["basicInfo.status"] = status;

    const hospitals = await Hospital.find(query).sort({ createdAt: -1 });
    res.status(200).json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
//  GET SINGLE HOSPITAL BY ID
// ======================================
const getHospitalById = async (req, res) => {
  const { hospitalId } = req.params;
  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.status(200).json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
//  SEARCH HOSPITALS BY CITY
// ======================================
const searchHospitalsByCity = async (req, res) => {
  const { city } = req.params;
  try {
    const hospitals = await Hospital.find({ "address.city": city });
    res.status(200).json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
//  SEARCH HOSPITALS BY TYPE
// ======================================
const searchHospitalsByType = async (req, res) => {
  const { type } = req.params;
  try {
    const hospitals = await Hospital.find({ "basicInfo.type": type });
    res.status(200).json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
//  SORT HOSPITALS BY FIELD
//  Example: establishedYear, name
// ======================================
const sortHospitalsByField = async (req, res) => {
  const { field } = req.params;
  try {
    // Ensure field is a valid path
    const validFields = ["basicInfo.establishedYear", "basicInfo.name"];
    const sortField = validFields.includes(`basicInfo.${field}`)
      ? `basicInfo.${field}`
      : null;

    if (!sortField) {
      return res.status(400).json({ message: "Invalid sort field" });
    }

    const hospitals = await Hospital.find().sort({ [sortField]: 1 });
    res.status(200).json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllHospitals,
  getHospitalById,
  searchHospitalsByCity,
  searchHospitalsByType,
  sortHospitalsByField,
};
