const BloodDonor = require("../../models/BloodDonor");

exports.registerBloodDonor = async (req, res, next) => { try {
  if (!req.body.healthConfirm) return res.status(400).json({ success: false, message: "Health confirmation is required" });
  const nameParts = String(req.body.name || "").trim().split(/\s+/);
  if (!nameParts[0]) return res.status(400).json({ success: false, message: "Please provide your name" });
  if (!req.body.gender || !req.body.dob || !req.body.bloodGroup || !req.body.location || !req.body.contactNumber) return res.status(400).json({ success: false, message: "Gender, date of birth, blood group, location and phone are required" });
  if (await BloodDonor.exists({ "contact.phone": req.body.contactNumber })) return res.status(409).json({ success: false, message: "This phone number is already registered" });
  const donor = await BloodDonor.create({
    basicInfo: { firstName: nameParts.shift(), lastName: nameParts.length ? nameParts.pop() : "-", middleName: nameParts.join(" "), gender: req.body.gender, dob: req.body.dob, bloodGroup: req.body.bloodGroup },
    address: { address: req.body.location, city: req.body.location },
    contact: { phone: req.body.contactNumber, email: req.body.email || undefined },
    donationInfo: { isActive: false, notes: `Self-registration pending admin approval. Preferred availability: ${req.body.availability || "not specified"}` },
  });
  res.status(201).json({ success: true, message: "Donor registration submitted for approval", data: { id: donor._id } });
} catch (error) { next(error); } };
