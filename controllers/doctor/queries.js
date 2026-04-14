const Doctor = require("../../models/Doctor");

// ======================================
//  GET ALL DOCTORS WITH OPTIONAL FILTERS + PAGINATION
// ======================================
const getAllDoctors = async (req, res) => {
  try {
    const { department, field, search } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ Admin check (temporary)
    const isAdmin = req.query.admin === "true";

    let match = {};

    // 🔥 Public vs Admin
    if (!isAdmin) {
      match["professional.status"] = "Active";
    }

    // Filters
    if (department) match["professional.department"] = department;
    if (field) match["professional.field"] = field;

    // Search
    if (search) {
      const regex = new RegExp(search, "i");

      match.$or = [
        { "personalDetails.firstName": regex },
        { "personalDetails.middleName": regex },
        { "personalDetails.lastName": regex },
        { "personalDetails.email": regex },
        { "personalDetails.phone": regex },
      ];
    }

    // ✅ Total count
    const totalItems = await Doctor.countDocuments(match);

    // ✅ Aggregation
    const doctors = await Doctor.aggregate([
      { $match: match },

      {
        $addFields: {
          id: "$_id", // ✅ convert _id → id
          isActive: {
            $cond: [{ $eq: ["$professional.status", "Active"] }, 1, 0],
          },
        },
      },

      {
        $sort: {
          "professional.order": 1, // 🔥 FIRST priority
          isActive: -1, // 🔥 THEN Active first
          createdAt: -1, // 🔥 latest
        },
      },

      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          _id: 0, // ❌ remove _id
          isActive: 0, // optional: hide helper field
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ======================================
//  GET SINGLE DOCTOR BY ID
// ======================================
const getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    return res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ======================================
//  SEARCH DOCTORS BY SPECIALIZATION
// ======================================
const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;

    const doctors = await Doctor.find({
      specialization: {
        $elemMatch: { field: { $regex: specialization, $options: "i" } },
      },
    });

    return res.status(200).json(doctors);
  } catch (error) {
    console.error("Error searching doctors by specialization:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ======================================
//  SEARCH DOCTORS BY CHAMBER CITY
// ======================================
const getDoctorsByChamberCity = async (req, res) => {
  try {
    const { city } = req.params;

    const doctors = await Doctor.find({
      chambers: {
        $elemMatch: { "address.city": { $regex: city, $options: "i" } },
      },
    });

    return res.status(200).json(doctors);
  } catch (error) {
    console.error("Error searching doctors by chamber city:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ======================================
//  SORT DOCTORS BY FIELD
// ======================================
const sortDoctorsByField = async (req, res) => {
  try {
    const { field } = req.params;

    // Only allow sorting by known fields
    const allowedFields = [
      "personalDetails.totalExperience",
      "professional.consultationFee",
      "professional.order",
    ];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        message: `Invalid sort field. Allowed: ${allowedFields.join(", ")}`,
      });
    }

    const doctors = await Doctor.find().sort({ [field]: 1 }); // ascending by default

    return res.status(200).json(doctors);
  } catch (error) {
    console.error("Error sorting doctors:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  getDoctorsByChamberCity,
  sortDoctorsByField,
};
