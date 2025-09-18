const BloodDonor = require("../../models/BloodDonor");

// ======================================
//  UPDATE BLOOD DONOR DONATION INFO
// ======================================
const updateBloodDonorDonationInfo = async (req, res) => {
  try {
    const { donorId } = req.params;
    const { lastDonationDate, isActive, notes } = req.body;

    // Find the donor by ID
    const donor = await BloodDonor.findById(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    // Initialize donationInfo if it doesn't exist
    if (!donor.donationInfo) {
      donor.donationInfo = {};
    }

    // Update only provided fields
    if (lastDonationDate)
      donor.donationInfo.lastDonationDate = lastDonationDate;
    if (typeof isActive === "boolean") donor.donationInfo.isActive = isActive;
    if (notes) donor.donationInfo.notes = notes;

    await donor.save();

    res.status(200).json({
      message: "Blood donor donation info updated successfully",
      donationInfo: donor.donationInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { updateBloodDonorDonationInfo };
