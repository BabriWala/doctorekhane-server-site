const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const BloodDonor = require("../models/BloodDonor");
const Ambulance = require("../models/Ambulance");

const remove = (Model, label) => async (req, res, next) => {
  try {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: `${label} not found` });
    res.json({ success: true, message: `${label} deleted` });
  } catch (error) { next(error); }
};

exports.deleteDoctor = remove(Doctor, "Doctor");
exports.deleteHospital = remove(Hospital, "Hospital");
exports.deleteBloodDonor = remove(BloodDonor, "Blood donor");
exports.deleteAmbulance = remove(Ambulance, "Ambulance");
