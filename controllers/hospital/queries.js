const Hospital = require("../../models/Hospital");

// ======================================
//  GET ALL HOSPITALS (with optional filters)
// ======================================
const getAllHospitals = async (req, res) => {
  try {
    const { city, type, department, insurance, search } = req.query;

    const query = {};
    const isAdmin = ["admin", "superadmin"].includes(req.user?.account?.role);
    if (!isAdmin) query["basicInfo.status"] = "Active";
    if (city) query["address.city"] = { $regex: String(city).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    if (type) query["basicInfo.type"] = type;
    if (req.query.status && isAdmin) query["basicInfo.status"] = req.query.status;
    if (department) query["departments.name"] = { $regex: String(department).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    if (insurance) query["basicInfo.insurance"] = insurance;
    if (Number(req.query.minRating) > 0) query["basicInfo.ratingAverage"] = { $gte: Number(req.query.minRating) };
    if (req.query.is24Hours !== undefined) query["basicInfo.is24Hours"] = req.query.is24Hours === "true";
    if (search) {
      const regex = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ "basicInfo.name": regex }, { "basicInfo.description": regex }, { "address.street": regex }, { "address.city": regex }, { "departments.name": regex }, { "basicInfo.services": regex }];
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const sort = req.query.sort === "rating" ? { "basicInfo.ratingAverage": -1 } : req.query.sort === "name" ? { "basicInfo.name": 1 } : { createdAt: -1 };
    const [hospitals, totalItems] = await Promise.all([Hospital.find(query).sort(sort).skip((page - 1) * limit).limit(limit).lean(), Hospital.countDocuments(query)]);
    res.setHeader("X-Total-Count", String(totalItems));
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
    const isAdmin = ["admin", "superadmin"].includes(req.user?.account?.role);
    const hospital = await Hospital.findOne({ _id: hospitalId, ...(isAdmin ? {} : { "basicInfo.status": "Active" }) }).populate({
      path: "departments.doctors",
      select: "personalDetails professional specialization slug ratingAverage reviewCount telemedicine",
      match: isAdmin ? {} : { "professional.status": "Active" },
    });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.status(200).json(hospital);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getHospitalFilters = async (_req, res) => {
  try {
    const active = { "basicInfo.status": "Active" };
    const [cities, departments, insurance, types] = await Promise.all([
      Hospital.distinct("address.city", active), Hospital.distinct("departments.name", active),
      Hospital.distinct("basicInfo.insurance", active), Hospital.distinct("basicInfo.type", active),
    ]);
    const clean = (items) => items.filter(Boolean).sort((a, b) => a.localeCompare(b));
    res.json({ success: true, data: { cities: clean(cities), departments: clean(departments), insurance: clean(insurance), types: clean(types) } });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to load hospital filters" }); }
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
  getHospitalFilters,
};
