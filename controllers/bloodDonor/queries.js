// ======================================
//  GET ALL BLOOD DONORS (with optional filters)

const BloodDonor = require("../../models/BloodDonor");

// ======================================
const getAllBloodDonors = async (req, res) => {
  try {
    const { bloodGroup, address, isActive, search } = req.query;

    // ✅ pagination params
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 100);
    const skip = (page - 1) * limit;

    let filter = {};

    if (bloodGroup) filter["basicInfo.bloodGroup"] = bloodGroup;
    if (address) filter.$or = [{ "address.city": { $regex: address, $options: "i" } }, { "address.address": { $regex: address, $options: "i" } }];
    if (search) {
      const regex = { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
      const searchConditions = [{ "basicInfo.firstName": regex }, { "basicInfo.middleName": regex }, { "basicInfo.lastName": regex }, { "address.city": regex }, { "address.address": regex }];
      filter.$and = [{ $or: searchConditions }];
    }
    if (isActive !== undefined)
      filter["donationInfo.isActive"] = isActive === "true";

    // ✅ total count (before pagination)
    const [total, donors, locations] = await Promise.all([
      BloodDonor.countDocuments(filter),
      BloodDonor.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      BloodDonor.distinct("address.city", { "donationInfo.isActive": true }),
    ]);

    res.status(200).json({
      success: true,
      donors,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: limit,
      },
      filters: { locations: locations.filter(Boolean).sort() },
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

    res.status(200).json({ success: true, donor });
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
