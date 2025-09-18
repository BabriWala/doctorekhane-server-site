// ======================================
//  UPDATE AMBULANCE AVAILABILITY

const Ambulance = require("../../models/Ambulance");

// ======================================
const updateAmbulanceAvailability = async (req, res) => {
  try {
    const { ambulanceId } = req.params;

    // Update the availability field of the ambulance
    const ambulance = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      { availability: req.body }, // expects isAvailable, lastServiceDate, notes
      { new: true, runValidators: true }
    );

    if (!ambulance) {
      return res
        .status(404)
        .json({ success: false, message: "Ambulance not found" });
    }

    res.status(200).json({
      success: true,
      message: "Ambulance availability updated successfully",
      data: ambulance,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateAmbulanceAvailability,
};
