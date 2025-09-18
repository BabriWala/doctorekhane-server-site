// ======================================
//  UPDATE AMBULANCE CONTACT

const Ambulance = require("../../models/Ambulance");

// ======================================
const updateAmbulanceContact = async (req, res) => {
  try {
    const { ambulanceId } = req.params;

    // Find the ambulance and update the contact info
    const ambulance = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      { contact: req.body }, // expects phone, alternatePhone, email
      { new: true, runValidators: true }
    );

    if (!ambulance) {
      return res
        .status(404)
        .json({ success: false, message: "Ambulance not found" });
    }

    res.status(200).json({
      success: true,
      message: "Ambulance contact updated successfully",
      data: ambulance,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateAmbulanceContact,
};
