// ======================================
//  UPDATE BLOOD DONOR ADDRESS

const BloodDonor = require("../../models/BloodDonor");

// ======================================
const updateBloodDonorAddress = async (req, res) => {
  try {
    const { donorId } = req.params;
    // const { street, city, state, postalCode, country } = req.body;

    // Find the donor by ID
    const donor = await BloodDonor.findByIdAndUpdate(
      donorId,
      { address: req.body }, // expects city, area, addressLine, latitude, longitude
      { new: true, runValidators: true },
    );
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    // Initialize address if it doesn't exist
    if (!donor.address) {
      donor.address = {};
    }

    // Update address fields if provided
    // donor.address.street = street ?? donor.address.street;
    // donor.address.city = city ?? donor.address.city;
    // donor.address.state = state ?? donor.address.state;
    // donor.address.postalCode = postalCode ?? donor.address.postalCode;
    // donor.address.country = country ?? donor.address.country;

    await donor.save();

    res.status(200).json({
      success: true,
      message: "Blood donor address updated successfully",
      data: donor,
      address: donor.address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { updateBloodDonorAddress };
