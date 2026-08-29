require("dotenv").config({ quiet: true });

const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:4002/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json().catch(() => ({}));
  return { response, body };
};

const run = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required for the authenticated smoke test");
  }
  const [doctorList, hospitals] = await Promise.all([
    request("/doctor?limit=1&sort=rating&minRating=0"),
    request("/hospital?limit=1&minRating=0"),
  ]);
  const doctorId = doctorList.body.data?.[0]?.id || doctorList.body.data?.[0]?._id;
  if (!doctorList.response.ok || !doctorId || !hospitals.response.ok || !Array.isArray(hospitals.body)) throw new Error("Public discovery endpoints failed");
  const reviews = await request(`/doctor/${doctorId}/reviews?rating=5&sort=helpful`);
  const invalidAppointment = await request("/appointments", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ doctorId, patientName: "Smoke Test", patientPhone: "01700000000", appointmentDate: "2020-01-01", timeSlot: "10:00" }),
  });
  if (!reviews.response.ok || invalidAppointment.response.status !== 400) throw new Error(`Customer endpoints failed: reviews=${reviews.response.status}, appointmentValidation=${invalidAppointment.response.status}`);
  const login = await request("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }),
  });
  if (!login.response.ok) throw new Error(`Login failed with ${login.response.status}`);
  const headers = { authorization: `Bearer ${login.body.accessToken}` };
  const [stats, users] = await Promise.all([
    request("/admin/stats", { headers }),
    request("/users/admin/all?limit=1", { headers }),
  ]);
  if (!stats.response.ok || !users.response.ok) throw new Error(`Protected endpoints failed: stats=${stats.response.status}, users=${users.response.status}`);
  console.log(JSON.stringify({
    login: login.response.status, role: login.body.user?.account?.role,
    stats: stats.response.status, doctors: stats.body.doctors?.total, hospitals: stats.body.hospitals?.total,
    users: users.response.status, userFields: Object.keys(users.body.data?.users?.[0] || {}),
    discovery: doctorList.response.status, hospitals: hospitals.response.status,
    reviews: reviews.response.status, appointmentValidation: invalidAppointment.response.status,
  }));
};

run().catch((error) => { console.error(error.message); process.exit(1); });
