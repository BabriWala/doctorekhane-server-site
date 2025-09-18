// ======================================
//  CREATE BLOOD DONOR BASIC INFO

const BloodDonor = require("../../models/BloodDonor");

// ======================================
const createBloodDonorBasicInfo = async (req, res) => {
  try {
    const { firstName, middleName, lastName, gender, dob, bloodGroup } =
      req.body;

    // Validation
    if (!firstName || !lastName || !gender || !dob || !bloodGroup) {
      return res
        .status(400)
        .json({ message: "All required fields are mandatory." });
    }

    const donor = new BloodDonor({
      basicInfo: {
        firstName,
        middleName,
        lastName,
        gender,
        dob,
        bloodGroup,
      },
    });

    await donor.save();
    res
      .status(201)
      .json({ message: "Blood donor created successfully", donor });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate entry detected." });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

// ======================================
//  UPDATE BLOOD DONOR BASIC INFO
// ======================================
const updateBloodDonorBasicInfo = async (req, res) => {
  try {
    const { donorId } = req.params;
    const { firstName, middleName, lastName, gender, dob, bloodGroup } =
      req.body;

    const donor = await BloodDonor.findById(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    donor.basicInfo.firstName = firstName || donor.basicInfo.firstName;
    donor.basicInfo.middleName = middleName || donor.basicInfo.middleName;
    donor.basicInfo.lastName = lastName || donor.basicInfo.lastName;
    donor.basicInfo.gender = gender || donor.basicInfo.gender;
    donor.basicInfo.dob = dob || donor.basicInfo.dob;
    donor.basicInfo.bloodGroup = bloodGroup || donor.basicInfo.bloodGroup;

    await donor.save();
    res
      .status(200)
      .json({ message: "Blood donor updated successfully", donor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createBloodDonorBasicInfo,
  updateBloodDonorBasicInfo,
};
