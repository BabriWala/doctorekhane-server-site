const Doctor = require("../../models/Doctor");

// --- Add new chamber ---
const addChamber = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const chamberData = req.body; // expect day, from, to, chamberName, address, contactNumber, order

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.chambers.push(chamberData);
    await doctor.save();

    return res.status(201).json({
      message: "Chamber added successfully",
      chambers: doctor.chambers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Update chamber slot ---
const updateChamber = async (req, res) => {
  try {
    const { doctorId, chamberId } = req.params;
    const updateData = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const chamber = doctor.chambers.id(chamberId);
    if (!chamber) return res.status(404).json({ message: "Chamber not found" });

    Object.assign(chamber, updateData);
    await doctor.save();

    return res.status(200).json({ message: "Chamber updated", chamber });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Delete chamber slot ---
const deleteChamber = async (req, res) => {
  try {
    const { doctorId, chamberId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // check if chamber exists
    const chamber = doctor.chambers.id(chamberId);
    if (!chamber) return res.status(404).json({ message: "Chamber not found" });

    // remove by pulling from array
    doctor.chambers.pull({ _id: chamberId });

    await doctor.save();

    return res.status(200).json({ message: "Chamber deleted" });
  } catch (error) {
    console.error("Error deleting chamber:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Update chamber address separately ---
const updateChamberAddress = async (req, res) => {
  try {
    const { doctorId, chamberId } = req.params;
    const { street, city, state, country, zip } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const chamber = doctor.chambers.id(chamberId);
    if (!chamber) return res.status(404).json({ message: "Chamber not found" });

    chamber.address = {
      street: street || chamber.address.street,
      city: city || chamber.address.city,
      state: state || chamber.address.state,
      country: country || chamber.address.country,
      zip: zip || chamber.address.zip,
    };

    await doctor.save();

    return res.status(200).json({
      message: "Chamber address updated successfully",
      address: chamber.address,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addChamber,
  updateChamber,
  deleteChamber,
  updateChamberAddress,
};
