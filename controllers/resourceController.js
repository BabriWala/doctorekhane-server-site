const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const BloodDonor = require("../models/BloodDonor");
const Ambulance = require("../models/Ambulance");

const remove = (Model, label) => async (req, res, next) => {
  try {
    const document = await Model.findById(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: `${label} not found` });
    if (label === "Doctor" && await require("../models/Appointment").exists({ doctor: document._id })) return res.status(409).json({ success: false, message: "Doctor has appointment history. Mark the profile inactive instead of deleting it." });
    if (label === "Ambulance" && await require("../models/AmbulanceRequest").exists({ ambulance: document._id, status: { $in: ["assigned", "dispatched"] } })) return res.status(409).json({ success: false, message: "Ambulance has an active request and cannot be deleted." });
    await document.deleteOne();
    res.json({ success: true, message: `${label} deleted` });
  } catch (error) { next(error); }
};

exports.deleteDoctor = remove(Doctor, "Doctor");
exports.deleteHospital = remove(Hospital, "Hospital");
exports.deleteBloodDonor = remove(BloodDonor, "Blood donor");
exports.deleteAmbulance = remove(Ambulance, "Ambulance");
