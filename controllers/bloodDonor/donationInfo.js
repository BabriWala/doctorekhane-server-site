const BloodDonor = require("../../models/BloodDonor");

// ======================================
//  UPDATE BLOOD DONOR DONATION INFO
// ======================================
const updateBloodDonorDonationInfo = async (req, res) => {
  try {
    const { donorId } = req.params;
    const { lastDonationDate, totalDonations, isActive, notes } = req.body;
    if (totalDonations !== undefined && (!Number.isInteger(Number(totalDonations)) || Number(totalDonations) < 0)) return res.status(400).json({ message: "Total donations must be a non-negative whole number" });
    if (lastDonationDate && (Number.isNaN(new Date(lastDonationDate).getTime()) || new Date(lastDonationDate) > new Date())) return res.status(400).json({ message: "Last donation date must be a valid date in the past" });
    if (isActive !== undefined && ![true, false, "true", "false"].includes(isActive)) return res.status(400).json({ message: "Availability must be true or false" });

    // Find the donor by ID
    const donor = await BloodDonor.findById(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    // Initialize donationInfo if it doesn't exist
    if (!donor.donationInfo) {
      donor.donationInfo = {};
    }

    // Update only provided fields
    if (lastDonationDate !== undefined) donor.donationInfo.lastDonationDate = lastDonationDate || undefined;
    if (totalDonations !== undefined) donor.donationInfo.totalDonations = Number(totalDonations);
    if (isActive !== undefined) donor.donationInfo.isActive = isActive === true || isActive === "true";
    if (notes !== undefined) donor.donationInfo.notes = notes;

    await donor.save();

    res.status(200).json({
      message: "Blood donor donation info updated successfully",
      donationInfo: donor.donationInfo,
    });
  } catch (error) {
    console.error(error);
    if (["ValidationError", "CastError"].includes(error.name)) return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { updateBloodDonorDonationInfo };
