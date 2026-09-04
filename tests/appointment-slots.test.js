const { isAvailableSlot } = require("../utils/appointmentSlots");
const chambers = [{ _id: "one", day: "Monday", from: "18:00", to: "20:00" }];
test("published chamber hours are enforced", () => {
  expect(isAvailableSlot(chambers, "2026-09-07T12:00:00+06:00", "18:00", "one")).toBe(true);
  expect(isAvailableSlot(chambers, "2026-09-07T12:00:00+06:00", "20:00", "one")).toBe(false);
  expect(isAvailableSlot(chambers, "2026-09-08T12:00:00+06:00", "18:00", "one")).toBe(false);
  expect(isAvailableSlot(chambers, "2026-09-07T12:00:00+06:00", "18:00", "other")).toBe(false);
  expect(isAvailableSlot(chambers, "2026-09-07T12:00:00+06:00", "25:00", "one")).toBe(false);
});
