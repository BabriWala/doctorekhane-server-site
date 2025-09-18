const User = require("../models/User");

exports.createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const admin = await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL || "admin@azharitravels.com",
        phone: "01700000000",
        password: process.env.ADMIN_PASSWORD || "admin123456",
        role: "admin",
        status: "active",
        emailVerified: true,
      });

      console.log("Default admin created:", admin.email);
    }
  } catch (error) {
    console.error("Error creating default admin:", error.message);
  }
};
