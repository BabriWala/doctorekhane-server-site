jest.mock("../models/Appointment", () => ({ findById: jest.fn(), exists: jest.fn(), findByIdAndUpdate: jest.fn() }));
jest.mock("../models/Doctor", () => ({ findById: jest.fn() }));
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { updateAppointment } = require("../controllers/appointmentController");

describe("appointment rescheduling", () => {
  let res;
  beforeEach(() => {
    jest.clearAllMocks();
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Appointment.findById.mockResolvedValue({ _id: "appointment", doctor: "doctor", chamberId: "chamber", appointmentDate: new Date("2099-01-05T10:00:00+06:00"), timeSlot: "10:00" });
    Doctor.findById.mockResolvedValue({ chambers: [{ _id: "chamber", day: "Monday", from: "09:00", to: "12:00" }] });
  });
  test("rejects times outside published hours without writing", async () => {
    await updateAppointment({ params: { id: "appointment" }, body: { timeSlot: "18:00" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(Appointment.findByIdAndUpdate).not.toHaveBeenCalled();
  });
  test("rejects a slot held by another appointment", async () => {
    Appointment.exists.mockResolvedValue({ _id: "other" });
    await updateAppointment({ params: { id: "appointment" }, body: { timeSlot: "11:00" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
    expect(Appointment.findByIdAndUpdate).not.toHaveBeenCalled();
  });
});
