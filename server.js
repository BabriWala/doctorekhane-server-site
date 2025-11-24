// ─── IMPORTS ─────────────────────────────────────────────
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const doctorRoutes = require("./routes/doctor");
const hospitalRoutes = require("./routes/hospital");
const bloodDonorRoutes = require("./routes/bloodDonor");
const ambulanceRoutes = require("./routes/ambulance");

// Middleware
const { errorHandler } = require("./middleware/errorHandler");
const { createDefaultAdmin } = require("./utils/createAdmin");

const app = express();

// ─── STATIC & MIDDLEWARE ─────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(helmet());
app.use(compression());
app.use(cookieParser());

// Logging for dev
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── CORS CONFIGURATION ─────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:4001",
  "http://localhost:4000",
  "https://admin.doctorekhane.com",
  "https://doctorekhane.com",
];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      console.log("🌐 Incoming Origin:", origin);

      if (!origin) return callback(null, true); // Postman or curl

      if (allowedOrigins.includes(origin)) {
        console.log("✔ Allowed:", origin);
        return callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        return callback(new Error("CORS Blocked: " + origin));
      }
    },
  })
);

// ─── BODY PARSER ─────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── MONGODB CONNECTION ─────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    createDefaultAdmin(); // Only creates admin if it does not exist
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ─── ROUTES ─────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/blood-donor", bloodDonorRoutes);
app.use("/api/ambulance", ambulanceRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "সার্ভার সফলভাবে চালু আছে",
    data: { status: "healthy", timestamp: new Date().toISOString() },
  });
});

// ─── ERROR HANDLING ─────────────────────────────
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "রুট খুঁজে পাওয়া যায়নি" });
});

// ─── START SERVER ─────────────────────────────
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
