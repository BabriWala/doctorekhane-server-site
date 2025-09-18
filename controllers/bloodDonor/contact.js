const BloodDonor = require("../../models/BloodDonor");

// ======================================
//  UPDATE BLOOD DONOR CONTACT
// ======================================
const updateBloodDonorContact = async (req, res) => {
  try {
    const { donorId } = req.params;
    const { phone, email } = req.body;

    // Find the donor by ID
    const donor = await BloodDonor.findById(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    // Initialize contact if it doesn't exist
    if (!donor.contact) {
      donor.contact = {};
    }

    // Check for unique phone/email if provided
    if (phone && phone !== donor.contact.phone) {
      const phoneExists = await BloodDonor.findOne({ "contact.phone": phone });
      if (phoneExists)
        return res.status(400).json({ message: "Phone already exists" });
      donor.contact.phone = phone;
    }

    if (email && email !== donor.contact.email) {
      const emailExists = await BloodDonor.findOne({ "contact.email": email });
      if (emailExists)
        return res.status(400).json({ message: "Email already exists" });
      donor.contact.email = email;
    }

    await donor.save();

    res.status(200).json({
      message: "Blood donor contact updated successfully",
      contact: donor.contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { updateBloodDonorContact };
