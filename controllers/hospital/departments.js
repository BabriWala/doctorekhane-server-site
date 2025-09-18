const Hospital = require("../../models/Hospital");

// ======================================
//  ADD DEPARTMENT
// ======================================
const addDepartment = async (req, res) => {
  const { hospitalId } = req.params;
  const { name } = req.body; // Expecting department name

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Add new department
    hospital.departments.push({ name });
    await hospital.save();

    res.status(201).json({
      message: "Department added successfully",
      departments: hospital.departments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
//  UPDATE DEPARTMENT
// ======================================
const updateDepartment = async (req, res) => {
  const { hospitalId, departmentId } = req.params;
  const { name } = req.body;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const department = hospital.departments.id(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    department.name = name || department.name;

    await hospital.save();

    res.status(200).json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================================
//  DELETE DEPARTMENT
// ======================================
const deleteDepartment = async (req, res) => {
  const { hospitalId, departmentId } = req.params;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const department = hospital.departments.id(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    department.remove();
    await hospital.save();

    res.status(200).json({
      message: "Department deleted successfully",
      departments: hospital.departments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addDepartment,
  updateDepartment,
  deleteDepartment,
};
