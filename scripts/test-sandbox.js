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
if (require.main === module) startSandbox(4012).then(() => console.log('ISOLATED TEST API READY: http://localhost:4012/api; admin@example.test / TestOnly!12345')).catch(error => { console.error(error); process.exit(1); });
