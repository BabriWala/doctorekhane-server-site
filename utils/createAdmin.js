const User = require("../models/User");

exports.createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const admin = await User.create({
        personalDetails: {
          name: "Admin",
          email: process.env.ADMIN_EMAIL || "admin@doctorekhnae.com",
          phone: "01700000000",
        },
        account: {
          role: "admin",
          password: process.env.ADMIN_PASSWORD || "admin123456",
        },
        status: "active",
        emailVerified: true,
      });

      // console.log(admin);
      console.log("Default admin created:", admin.personalDetails.email);
    }
  } catch (error) {
    console.error("Error creating default admin:", error.message);
  }
};
