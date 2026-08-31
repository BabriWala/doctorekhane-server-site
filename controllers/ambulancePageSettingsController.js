const AmbulancePageSettings = require("../models/AmbulancePageSettings");

const defaults = {
  key: "ambulance-page",
  title: "অ্যাম্বুলেন্স সার্ভিস",
  subtitle: "জরুরি অ্যাম্বুলেন্স কল করুন বা নির্ধারিত বুকিং করুন",
  emergencyTitle: "জরুরি অবস্থায়",
  emergencyDescription: "তাৎক্ষণিক সাহায্যের জন্য নিচের নম্বরে কল করুন",
  emergencyPhone: "",
  bookingTitle: "অ্যাম্বুলেন্স বুকিং",
  bookingDescription: "আপনার প্রয়োজন অনুযায়ী অ্যাম্বুলেন্স বুক করুন",
  tipsTitle: "জরুরি পরিস্থিতিতে করণীয়",
  emergencyTips: [
    "রোগীকে শান্ত রাখুন এবং আতঙ্কিত হবেন না",
    "রোগীর শ্বাস-প্রশ্বাস ও নাড়ি পরীক্ষা করুন",
    "প্রয়োজনে প্রাথমিক চিকিৎসা দিন",
    "অ্যাম্বুলেন্স আসা পর্যন্ত রোগীর পাশে থাকুন",
    "রোগীর পরিচয়পত্র ও প্রয়োজনীয় কাগজপত্র প্রস্তুত রাখুন",
  ],
  providersTitle: "উপলব্ধ অ্যাম্বুলেন্স সার্ভিস",
  serviceTypes: ["Basic", "Advanced", "ICU"],
};

const getOrCreate = () =>
  AmbulancePageSettings.findOneAndUpdate(
    { key: "ambulance-page" },
    { $setOnInsert: defaults },
    { new: true, upsert: true, runValidators: true },
  );

exports.getSettings = async (_req, res, next) => {
  try {
    const settings = await getOrCreate();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const allowed = [
      "title", "subtitle", "emergencyTitle", "emergencyDescription",
      "emergencyPhone", "bookingTitle", "bookingDescription", "tipsTitle",
      "emergencyTips", "providersTitle", "serviceTypes",
    ];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const settings = await getOrCreate();
    settings.set(updates);
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
