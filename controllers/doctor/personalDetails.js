const Doctor = require("../../models/Doctor");

// --- Create new doctor ---
const createDoctor = async (req, res) => {
  try {
    const {
      personalDetails,
      education,
      experience,
      specialization,
      chambers,
      professional,
    } = req.body;

    if (
      !personalDetails ||
      !personalDetails.firstName ||
      !personalDetails.lastName
    ) {
      return res.status(400).json({
        message: "Personal details (firstName & lastName) are required",
      });
    }

    // if (
    //   !professional ||
    //   !professional.licenseNumber ||
    //   !professional.nidNumber
    // ) {
    //   return res.status(400).json({
    //     message:
    //       "Professional details (licenseNumber & nidNumber) are required",
    //   });
    // }

    const doctor = new Doctor({
      personalDetails,
      education: education || [],
      experience: experience || [],
      specialization: specialization || [],
      chambers: chambers || [],
      professional,
    });

    await doctor.save();

    return res.status(201).json({
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Update personal details ---
const updatePersonalDetails = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const {
      firstName,
      middleName,
      lastName,
      gender,
      // dob,
      phone,
      email,
      profilePicture,
      about,
      totalExperience,
      address,
    } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const pd = doctor.personalDetails;

    pd.firstName = firstName || pd.firstName;
    pd.middleName = middleName || pd.middleName;
    pd.lastName = lastName || pd.lastName;
    pd.gender = gender || pd.gender;
    // pd.dob = dob || pd.dob;
    pd.phone = phone || pd.phone;
    pd.email = email || pd.email;
    pd.profilePicture = profilePicture || pd.profilePicture;
    pd.about = about || pd.about;
    pd.totalExperience = totalExperience || pd.totalExperience;

    // Update address if provided
    if (address) {
      pd.address = {
        street: address.street || pd.address.street,
        city: address.city || pd.address.city,
        state: address.state || pd.address.state,
        country: address.country || pd.address.country,
        zip: address.zip || pd.address.zip,
      };
    }

    await doctor.save();

    return res.status(200).json({
      message: "Personal details updated successfully",
      personalDetails: doctor.personalDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createDoctor, updatePersonalDetails };
