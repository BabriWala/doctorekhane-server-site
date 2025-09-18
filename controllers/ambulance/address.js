// ======================================
//  UPDATE AMBULANCE Address

const Ambulance = require("../../models/Ambulance");

// ======================================
const updateAmbulanceAddress = async (req, res) => {
  try {
    const { ambulanceId } = req.params;

    // Update the Address field of the ambulance
    const ambulance = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      { address: req.body }, // expects city, area, addressLine, latitude, longitude
      { new: true, runValidators: true }
    );

    if (!ambulance) {
      return res
        .status(404)
        .json({ success: false, message: "Ambulance not found" });
    }

    res.status(200).json({
      success: true,
      message: "Ambulance Address updated successfully",
      data: ambulance,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateAmbulanceAddress,
};
