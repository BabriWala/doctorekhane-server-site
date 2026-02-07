// ======================================
//  GET ALL BLOOD DONORS (with optional filters)

const BloodDonor = require("../../models/BloodDonor");

// ======================================
const getAllBloodDonors = async (req, res) => {
  try {
    const { bloodGroup, address, isActive } = req.query;

    // ✅ pagination params
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    if (bloodGroup) filter["basicInfo.bloodGroup"] = bloodGroup;
    if (address) filter["address.address"] = address;
    if (isActive !== undefined)
      filter["donationInfo.isActive"] = isActive === "true";

    // ✅ total count (before pagination)
    const total = await BloodDonor.countDocuments(filter);

    // ✅ paginated data
    const donors = await BloodDonor.find(filter)
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
    res.status(500).json({ message: "Server error", error });
  }
};

// ======================================
//  GET SINGLE BLOOD DONOR BY ID
// ======================================
const getBloodDonorById = async (req, res) => {
  try {
    const { donorId } = req.params;
    const donor = await BloodDonor.findById(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    res.status(200).json(donor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ======================================
//  GET DONORS BY BLOOD GROUP
// ======================================
const getBloodDonorsByBloodGroup = async (req, res) => {
  try {
    const { bloodGroup } = req.params;
    const donors = await BloodDonor.find({
      "basicInfo.bloodGroup": bloodGroup,
    });
    res.status(200).json({ count: donors.length, donors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ======================================
//  GET DONORS BY CITY
// ======================================
const getBloodDonorsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const donors = await BloodDonor.find({ "address.city": city });
    res.status(200).json({ count: donors.length, donors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ======================================
//  GET ACTIVE DONORS
// ======================================
const getActiveBloodDonors = async (req, res) => {
  try {
    const donors = await BloodDonor.find({ "donationInfo.isActive": true });
    res.status(200).json({ count: donors.length, donors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllBloodDonors,
  getBloodDonorById,
  getBloodDonorsByBloodGroup,
  getBloodDonorsByCity,
  getActiveBloodDonors,
};
