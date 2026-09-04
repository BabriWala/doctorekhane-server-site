const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function minutes(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(String(value || ""));
  if (!match || +match[1] > 23 || +match[2] > 59) return NaN;
  return +match[1] * 60 + +match[2];
}
function isAvailableSlot(chambers, date, time, chamberId) {
  const day = new Date(date).toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Dhaka" });
  const target = minutes(time);
  return Number.isFinite(target) && (chambers || []).some(chamber => (!chamberId || String(chamber._id) === String(chamberId)) && chamber.day === day && target >= minutes(chamber.from) && target < minutes(chamber.to));
}
module.exports = { minutes, isAvailableSlot };
