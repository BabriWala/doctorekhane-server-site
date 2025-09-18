const nodemailer = require("nodemailer");

// Create transporter

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true if port is 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
exports.sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `Azhari Travels <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

// Email templates
exports.bookingConfirmationEmail = (booking, user) => {
  return `
    <h2>বুকিং নিশ্চিতকরণ - Azhari Travels</h2>
    <p>প্রিয় ${user.name},</p>
    <p>আপনার বুকিং সফলভাবে নিশ্চিত হয়েছে।</p>
    <h3>বুকিং বিবরণ:</h3>
    <ul>
      <li>বুকিং নম্বর: ${booking.bookingNumber}</li>
      <li>প্যাকেজ: ${booking.package.title}</li>
      <li>ভ্রমণকারী: ${booking.numberOfTravelers} জন</li>
      <li>মোট খরচ: ৳${booking.totalCost}</li>
    </ul>
    <p>ধন্যবাদ,<br>Azhari Travels Team</p>
  `;
};
