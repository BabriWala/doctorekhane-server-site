jest.mock("../models/BloodDonor", () => ({ findById: jest.fn() }));
const BloodDonor = require("../models/BloodDonor");
const { updateBloodDonorDonationInfo } = require("../controllers/bloodDonor/donationInfo");
const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });
beforeEach(() => jest.clearAllMocks());
test("donation form saves count, availability, notes and date together", async () => {
  const donor = { donationInfo: {}, save: jest.fn().mockResolvedValue() };
  BloodDonor.findById.mockResolvedValue(donor);
  const res = response();
  await updateBloodDonorDonationInfo({ params: { donorId: "donor" }, body: { totalDonations: 4, isActive: "false", notes: "Updated", lastDonationDate: "2020-01-02" } }, res);
  expect(donor.save).toHaveBeenCalledTimes(1);
  expect(donor.donationInfo).toEqual({ totalDonations: 4, isActive: false, notes: "Updated", lastDonationDate: "2020-01-02" });
  expect(res.status).toHaveBeenCalledWith(200);
});
test.each([-1, 1.5, "bad"])("rejects invalid donation count %s", async count => {
  const res = response();
  await updateBloodDonorDonationInfo({ params: { donorId: "donor" }, body: { totalDonations: count } }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(BloodDonor.findById).not.toHaveBeenCalled();
});
