const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const { Prescription, PortalMessage, Reminder } = require('../models/PortalRecord');
const wrap = fn => async (req, res, next) => { try { await fn(req, res); } catch (error) { next(error); } };
const fail = (res, code, message) => res.status(code).json({ success: false, message });
const scope = req => req.user.account.role === 'doctor' ? { doctor: req.user.doctorProfile } : { user: req.user._id };
const doctorOnly = req => req.user.account.role === 'doctor' && req.user.doctorProfile;
const pageOptions = req => ({ page: Math.max(parseInt(req.query.page) || 1, 1), limit: Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50) });
async function paginate(Model, filter, req, populate) {
  const { page, limit } = pageOptions(req);
  let query = Model.find(filter).sort({ createdAt: -1, _id: 1 }).skip((page - 1) * limit).limit(limit);
  if (populate) query = query.populate(populate);
  const [data, totalItems] = await Promise.all([query, Model.countDocuments(filter)]);
  return { success: true, data, pagination: { currentPage: page, totalItems, totalPages: Math.ceil(totalItems / limit), pageSize: limit } };
}
exports.access = (req, res, next) => {
  if (!['doctor', 'user'].includes(req.user.account.role)) return fail(res, 403, 'Use an assigned doctor or patient account for this portal');
  if (req.user.account.role === 'doctor' && !req.user.doctorProfile) return fail(res, 403, 'No doctor profile is linked to this account');
  next();
};
exports.provision = wrap(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email || !mongoose.isValidObjectId(req.body.doctorId)) return fail(res, 400, 'Email and an existing doctor profile are required');
  const doctor = await Doctor.findById(req.body.doctorId);
  if (!doctor) return fail(res, 404, 'Doctor not found');
  let user = await User.findOne({ 'personalDetails.email': email });
  if (user && (!['user', 'doctor'].includes(user.account.role) || (user.doctorProfile && String(user.doctorProfile) !== String(doctor._id)))) return fail(res, 409, 'This account cannot be linked to the selected doctor');
  if (await User.exists({ doctorProfile: doctor._id, ...(user ? { _id: { $ne: user._id } } : {}) })) return fail(res, 409, 'This doctor already has a linked account');
  if (!user) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !req.body.name || !/^(\+88)?01[3-9]\d{8}$/.test(req.body.phone || '') || String(req.body.password || '').length < 8) return fail(res, 400, 'New accounts require a name, valid phone/email and a password of at least eight characters');
    user = new User({ personalDetails: { name: req.body.name, email, phone: req.body.phone }, account: { role: 'doctor', password: req.body.password } });
  }
  user.account.role = 'doctor'; user.doctorProfile = doctor._id; await user.save();
  res.status(201).json({ success: true, message: 'Doctor account linked; existing account passwords are never changed', data: user.toJSON() });
});
exports.profile = wrap(async (req, res) => {
  if (!doctorOnly(req)) return fail(res, 403, 'Doctor access required');
  const doctor = await Doctor.findById(req.user.doctorProfile);
  if (!doctor) return fail(res, 404, 'Linked doctor profile no longer exists');
  res.json({ success: true, data: doctor });
});
exports.updateProfile = wrap(async (req, res) => {
  if (!doctorOnly(req)) return fail(res, 403, 'Doctor access required');
  const doctor = await Doctor.findById(req.user.doctorProfile);
  if (!doctor) return fail(res, 404, 'Doctor not found');
  for (const field of ['phone', 'about']) if (req.body[field] !== undefined) doctor.personalDetails[field] = req.body[field];
  if (req.body.consultationFee !== undefined) {
    if (!Number.isFinite(Number(req.body.consultationFee)) || Number(req.body.consultationFee)<0) return fail(res,400,'Fee must be a non-negative number');
    doctor.professional.consultationFee = Number(req.body.consultationFee);
  }
  if (req.body.chambers !== undefined) {
    if (!Array.isArray(req.body.chambers) || req.body.chambers.length > 50) return fail(res, 400, 'Provide at most 50 chamber schedules');
    const { minutes } = require('../utils/appointmentSlots');
    if (req.body.chambers.some(c => !Number.isFinite(minutes(c.from)) || !Number.isFinite(minutes(c.to)) || minutes(c.to) <= minutes(c.from))) return fail(res, 400, 'Chamber closing time must be later than opening time');
    doctor.chambers = req.body.chambers.map(c => ({ ...(c._id ? {_id:c._id} : {}), day:c.day, from:c.from, to:c.to, chamberName:c.chamberName, contactNumber:c.contactNumber, address:c.address }));
  }
  await doctor.save(); res.json({ success: true, data: doctor });
});
exports.appointments = wrap(async (req, res) => {
  const filter = scope(req); if (req.query.status) filter.status = req.query.status;
  res.json(await paginate(Appointment, filter, req, { path:'doctor', select:'personalDetails professional slug' }));
});
exports.updateAppointment = wrap(async (req, res) => {
  if (!doctorOnly(req)) return fail(res, 403, 'Doctor access required');
  if (!['confirmed','completed','cancelled','no-show'].includes(req.body.status)) return fail(res,400,'Invalid appointment status');
  const item = await Appointment.findOneAndUpdate({ _id:req.params.id, ...scope(req) }, { status:req.body.status }, { new:true, runValidators:true });
  if (!item) return fail(res,404,'Appointment not found');
  res.json({success:true,data:item});
});
exports.stats = wrap(async (req, res) => {
  const filter = scope(req);
  const [total, upcoming, completed, revenue] = await Promise.all([
    Appointment.countDocuments(filter), Appointment.countDocuments({...filter,status:{$in:['pending','confirmed']}}), Appointment.countDocuments({...filter,status:'completed'}),
    Appointment.aggregate([{$match:{...filter,paymentStatus:'paid'}},{$group:{_id:null,total:{$sum:'$fee'}}}]),
  ]);
  res.json({ success:true,data:{total,upcoming,completed,recordedPaidFees:revenue[0]?.total || 0} });
});
exports.reviews = wrap(async (req,res) => {
  if (!doctorOnly(req)) return fail(res,403,'Doctor access required');
  res.json(await paginate(Review,{targetType:'Doctor',target:req.user.doctorProfile,status:'approved'},req));
});
async function ownedAppointment(req,id) { return Appointment.findOne({_id:id,...scope(req)}); }
exports.prescriptions = wrap(async (req,res) => {
  const ids = await Appointment.find(scope(req)).distinct('_id');
  res.json(await paginate(Prescription,{appointment:{$in:ids}},req,{path:'appointment',select:'appointmentNumber patient appointmentDate'}));
});
exports.createPrescription = wrap(async (req,res) => {
  if (!doctorOnly(req)) return fail(res,403,'Doctor access required');
  const appointment = await ownedAppointment(req,req.body.appointmentId);
  if (!appointment) return fail(res,404,'Appointment not found');
  if (!String(req.body.instructions || '').trim() && !req.file) return fail(res,400,'Instructions or an attachment are required');
  if (req.file) {
    const bytes = req.file.buffer;
    const valid = (req.file.mimetype === 'application/pdf' && bytes.subarray(0,5).toString() === '%PDF-') || (req.file.mimetype === 'image/png' && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) || (req.file.mimetype === 'image/jpeg' && bytes[0]===255 && bytes[1]===216 && bytes[2]===255);
    if (!valid) return fail(res,400,'Only valid PDF, PNG or JPEG attachments are accepted');
  }
  const item = await Prescription.create({appointment:appointment._id,doctor:req.user.doctorProfile,instructions:req.body.instructions,attachment:req.file?.buffer,fileName:req.file?.originalname,mimeType:req.file?.mimetype});
  res.status(201).json({success:true,data:{_id:item._id,instructions:item.instructions,fileName:item.fileName}});
});
exports.downloadPrescription = wrap(async (req,res) => {
  const item = await Prescription.findById(req.params.id).select('+attachment');
  if (!item || !await ownedAppointment(req,item.appointment) || !item.attachment) return fail(res,404,'Attachment not found');
  res.set('Cache-Control','no-store'); res.set('Content-Type',item.mimeType); res.set('X-Content-Type-Options','nosniff');
  res.attachment(String(item.fileName || 'prescription').replace(/[^a-zA-Z0-9._-]/g,'_')); res.type(item.mimeType); res.send(item.attachment);
});
exports.messages = wrap(async (req,res) => {
  if (!await ownedAppointment(req,req.params.id)) return fail(res,404,'Appointment not found');
  res.json(await paginate(PortalMessage,{appointment:req.params.id},req));
});
exports.sendMessage = wrap(async (req,res) => {
  if (!await ownedAppointment(req,req.params.id)) return fail(res,404,'Appointment not found');
  if (!String(req.body.text || '').trim()) return fail(res,400,'Message is required');
  const data = await PortalMessage.create({appointment:req.params.id,sender:req.user._id,senderRole:req.user.account.role,text:req.body.text});
  res.status(201).json({success:true,data});
});
exports.reminders = wrap(async (req,res) => res.json(await paginate(Reminder,{user:req.user._id},req)));
exports.createReminder = wrap(async (req,res) => {
  if (!req.body.title || !Number.isFinite(new Date(req.body.dueAt).getTime())) return fail(res,400,'Title and valid date/time required');
  res.status(201).json({success:true,data:await Reminder.create({user:req.user._id,title:req.body.title,dueAt:req.body.dueAt})});
});
exports.updateReminder = wrap(async (req,res) => {
  if (typeof req.body.completed !== 'boolean') return fail(res,400,'Completed must be true or false');
  const data=await Reminder.findOneAndUpdate({_id:req.params.id,user:req.user._id},{completed:req.body.completed},{new:true});
  if(!data)return fail(res,404,'Reminder not found'); res.json({success:true,data});
});
