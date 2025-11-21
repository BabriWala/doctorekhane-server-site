const User = require("../models/User");

exports.createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@doctorekhane.com";

    if (!adminEmail) {
      console.warn(
        "⚠️ ADMIN_EMAIL not set in .env, skipping default admin creation."
      );
      return;
    }

    // Check if admin with this email already exists
    const adminExists = await User.findOne({
      "personalDetails.email": adminEmail,
    });

    if (!adminExists) {
      const admin = await User.create({
        personalDetails: {
          name: "Admin",
          email: adminEmail,
          phone: "01700000000",
        },
        account: {
          role: "admin",
          password: process.env.ADMIN_PASSWORD || "admin123456",
        },
        status: "active",
        emailVerified: true,
      });

      console.log("✅ Default admin created:", admin.personalDetails.email);
    } else {
      console.log(
        "ℹ️ Admin already exists:",
        adminExists.personalDetails.email
      );
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error.message);
  }
};
