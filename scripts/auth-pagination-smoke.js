require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const User = require("../models/User");

const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:4002/api";
const email = `smoke-${Date.now()}@example.com`;

const run = async () => {
  let registered = false;
  try {
    const registration = await fetch(`${baseUrl}/auth/register`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Customer Smoke Test", email, phone: "01712345678", password: "SmokeTest123!" }) });
    if (registration.status !== 200) throw new Error(`Registration failed: ${registration.status} ${await registration.text()}`);
    registered = true;
    const cookie = registration.headers.get("set-cookie");
    const refresh = await fetch(`${baseUrl}/auth/refresh-token`, { method: "POST", headers: { cookie } });
    if (!refresh.ok) throw new Error(`Session refresh failed: ${refresh.status}`);
    const login = await fetch(`${baseUrl}/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: email.toUpperCase(), password: "SmokeTest123!" }) });
    if (!login.ok) throw new Error(`Login failed: ${login.status}`);
    const [donors, doctors, ambulances, hospitals] = await Promise.all([
      fetch(`${baseUrl}/blood-donor?page=1&limit=2&isActive=true`).then((r) => r.json()),
      fetch(`${baseUrl}/doctor?page=1&limit=2`).then((r) => r.json()),
      fetch(`${baseUrl}/ambulance?page=1&limit=2`).then((r) => r.json()),
      fetch(`${baseUrl}/hospital?page=1&limit=2`).then(async (r) => ({ total: r.headers.get("x-total-count"), items: await r.json() })),
    ]);
    if (!donors.pagination || !doctors.totalPages || !ambulances.pagination || hospitals.total === null) throw new Error("Pagination metadata missing");
    console.log(JSON.stringify({ registration: registration.status, refresh: refresh.status, login: login.status, pagination: { donors: donors.pagination, doctors: doctors.totalPages, ambulances: ambulances.pagination, hospitals: hospitals.total } }));
  } finally {
    if (registered) { await mongoose.connect(process.env.MONGODB_URI); await User.deleteOne({ "personalDetails.email": email }); await mongoose.disconnect(); }
  }
};

run().catch((error) => { console.error(error.message); process.exitCode = 1; });
