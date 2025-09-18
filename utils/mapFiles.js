// Helper to map files
const mapFiles = (files) =>
  files.map((file) => ({
    url: `/uploads/${file.filename}`,
    name: file.originalname,
  }));

module.exports = mapFiles;
