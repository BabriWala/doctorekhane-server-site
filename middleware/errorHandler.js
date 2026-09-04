exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);
  if (err.name === "MulterError") error = { message: err.code === "LIMIT_FILE_SIZE" ? "File exceeds the 8 MB upload limit" : "Invalid upload", statusCode: err.code === "LIMIT_FILE_SIZE" ? 413 : 400 };

  if (err.name === "VersionError") error = {message:"This record changed. Refresh and try again.",statusCode:409};

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "রিসোর্স খুঁজে পাওয়া যায়নি";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const slot = err.message?.includes('unique_active_appointment_slot');
    const ambulance = err.message?.includes('unique_active_ambulance');
    const message = slot ? "This appointment slot is no longer available" : ambulance ? "This ambulance is already reserved" : "ডুপ্লিকেট ডেটা পাওয়া গেছে";
    error = { message, statusCode: slot || ambulance ? 409 : 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "সার্ভার এরর",
  });
};
