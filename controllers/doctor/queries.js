const Doctor = require("../../models/Doctor");

// ======================================
//  GET ALL DOCTORS WITH OPTIONAL FILTERS
// ======================================
const getAllDoctors = async (req, res) => {
  try {
    const { status, department, field } = req.query;

    let filter = {};

    if (status) filter["professional.status"] = status;
    if (department) filter["professional.department"] = department;
    if (field) filter["professional.field"] = field;

    const doctors = await Doctor.find(filter);

    return res.status(200).json(doctors);
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
