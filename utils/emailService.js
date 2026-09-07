const nodemailer = require("nodemailer");
const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

// Create transporter

const emailConfigured = () => Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
exports.sendEmail = async (options) => {
  try {
    if (!emailConfigured()) throw new Error("Email transport is not configured");
    const mailOptions = {
      from: process.env.EMAIL_FROM || `Doctor Ekhane <${process.env.SYSTEM_EMAIL || "support@doctorekhane.com"}>`,
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
exports.hospitalRegistrationEmail = (hospital) => {
  return `
    <h2>Hospital registration received - Doctor Ekhane</h2>
    <p>${escapeHtml(hospital.basicInfo.name)} has been added to the management system.</p>
    <p>Type: ${escapeHtml(hospital.basicInfo.type)}</p>
    <p>Official website: ${process.env.SYSTEM_DOMAIN || "https://doctorekhane.com"}</p>
    <p>Doctor Ekhane Team</p>
  `;
};

exports.emailConfigured = emailConfigured;
