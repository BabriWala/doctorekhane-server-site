// Isolated fixtures only: never reads the production database URI.
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
async function startSandbox(port = 0) {
  const database = await MongoMemoryServer.create();
  Object.assign(process.env, {
    MONGODB_URI: database.getUri('doctorekhane_test'), NODE_ENV: 'test',
    JWT_SECRET: 'isolated-test-access-secret', JWT_REFRESH_SECRET: 'isolated-test-refresh-secret',
    ADMIN_EMAIL: 'admin@example.test', ADMIN_PASSWORD: 'TestOnly!12345',
    RATE_LIMIT_MAX: '10000', FRONTEND_URL: 'http://localhost:4013', ADMIN_URL: 'http://localhost:4011',
  });
  const app = require('../server');
  await app.databaseReady;
  const Doctor = require('../models/Doctor');
  const doctor = await Doctor.create({ personalDetails: { firstName: 'Demo', lastName: 'Cardiologist', gender: 'Male', phone: '01700000001', email: 'doctor@example.test' }, professional: { status: 'Active', department: 'Cardiology', consultationFee: 500 }, specialization: [{ field: 'Cardiology' }], chambers: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => ({day, from: '09:00', to:'17:00', chamberName:'Test Clinic', contactNumber:'01700000001', address:{state:'Dhaka',city:'Dhaka'}})) });
  const server = await new Promise(resolve => { const listener = app.listen(port, '127.0.0.1', () => resolve(listener)); });
  return { base: `http://127.0.0.1:${server.address().port}/api`, doctor, close: async () => { await new Promise(resolve => server.close(resolve)); await mongoose.disconnect(); await database.stop(); } };
}
module.exports = { startSandbox };
if (require.main === module) startSandbox(4012).then(async sandbox => {
  const User=require('../models/User');
  await User.create({personalDetails:{name:'Portal Test Doctor',email:'doctor-ui@example.test',phone:'01700000016'},account:{role:'doctor',password:'TestOnly!12345'},doctorProfile:sandbox.doctor._id});
  const patient=await User.create({personalDetails:{name:'Portal Test Patient',email:'patient-ui@example.test',phone:'01700000017'},account:{role:'user',password:'TestOnly!12345'}});
  const date=new Date(Date.now()+2*86400000).toISOString().slice(0,10);
  await require('../models/Appointment').create({doctor:sandbox.doctor._id,user:patient._id,patient:{name:'Portal Test Patient',phone:'01700000017'},appointmentDate:new Date(date+'T10:00:00+06:00'),timeSlot:'10:00'});
  console.log('ISOLATED TEST API READY: port4012; doctor-ui@example.test / patient-ui@example.test / admin@example.test; password TestOnly!12345');
}).catch(error => { console.error(error); process.exit(1); });
