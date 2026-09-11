const assert = require('node:assert/strict');
const { startSandbox } = require('./test-sandbox');

async function run() {
  const sandbox = await startSandbox();
  const Doctor = require('../models/Doctor');
  const get = async path => { const response = await fetch(sandbox.base + path); assert.equal(response.status, 200); return response.json(); };
  try {
    const fixture = (index, professional, specialization = []) => ({ personalDetails: { firstName: 'Specialty', middleName: index === 1 ? 'Middle' : '', lastName: `Fixture ${index}`, gender: 'Male', phone: `0170000001${index}`, email: `specialty${index}@example.test` }, professional: { status: 'Active', ...professional }, specialization });
    await Doctor.create([
      fixture(1, {}, [{ field: ' Cardiologist ' }]),
      fixture(2, { field: 'Consultant Cardiologist' }),
      fixture(3, { department: 'Cardiology', status: 'Inactive' }),
      fixture(4, { department: 'Neurology' }),
      fixture(5, { field: 'Rare (A+B)' }),
    ]);
    for (const name of ['Cardiology', 'Cardiologist', ' cardiology ']) {
      const response = await get(`/doctor?specialization=${encodeURIComponent(name)}&limit=2`);
      assert.equal(response.totalItems, 3, 'All active matching specialties across the three fields');
      assert.equal(response.totalPages, 2);
      const second = await get(`/doctor?specialization=${encodeURIComponent(name)}&limit=2&page=2`);
      assert.equal(new Set([...response.data, ...second.data].map(item => item.id)).size, 3, 'Pagination exposes every matching doctor');
    }
    for (const query of ['Specialty Middle Fixture 1', 'Specialty Fixture 1', ' middle  specialty fixture 1 ']) {
      const result = await get('/doctor?search=' + encodeURIComponent(query));
      assert.equal(result.totalItems, 1, 'Combined first/middle/last-name search');
      assert.equal(result.data[0].personalDetails.middleName, 'Middle');
    }
    assert.equal((await get('/doctor?search=Specialty%20Missing')).totalItems, 0, 'Every name word must match');
    const options = await get('/doctor/filter-options');
    assert.equal(options.data.specialtyCounts.find(item => item.name === 'Cardiology').count, 3);
    assert.equal((await get('/doctor/specialization/Cardiologist')).length, 3);
    assert.equal((await get('/doctor?specialization=Rare%20(A%2BB)')).totalItems, 1, 'Literal punctuation is escaped');
    assert.equal((await get('/doctor?specialization=Cardiology&search=Fixture')).totalItems, 2, 'Search combines with specialty');
    console.log('PASS specialty aliases, all storage fields, active visibility, pagination, counts, legacy route, literal punctuation, combined search, and full-name searches');
  } finally { await sandbox.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
