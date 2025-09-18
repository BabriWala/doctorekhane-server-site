const User = require("../models/User");
const { validationResult } = require("express-validator");
const upload = require("../middleware/upload");

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate(
        "bookings",
        "bookingNumber package travelDates bookingStatus totalCost"
      )
      .populate(
        "visaApplications",
        "visaType destinationCountry applicationStatus createdAt"
      );

    res.json({
      success: true,
      message: "ব্যবহারকারীর প্রোফাইল",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "প্রোফাইল আনতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "ভ্যালিডেশন এরর",
        errors: errors.array(),
      });
    }

    // Fields that users can update
    const allowedFields = ["name", "phone", "passportNumber"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "প্রোফাইল সফলভাবে আপডেট হয়েছে",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "প্রোফাইল আপডেটে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "ছবি ফাইল আবশ্যক",
      });
    }

    // In production, upload to Cloudinary or S3
    const photoUrl = `/uploads/profilePhoto/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: photoUrl },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে",
      data: {
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ছবি আপলোডে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "পাসওয়ার্ড নিশ্চিতকরণ আবশ্যক",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.comparePassword(password))) {
      return res.status(400).json({
        success: false,
        message: "ভুল পাসওয়ার্ড",
      });
    }

    // Check for active bookings
    const activeBookings = await require("../models/Booking").countDocuments({
      user: req.user.id,
      bookingStatus: { $in: ["pending", "confirmed"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: "সক্রিয় বুকিং থাকায় অ্যাকাউন্ট মুছা যাবে না",
      });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: "অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "অ্যাকাউন্ট মুছতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.$or = [
        { name: new RegExp(req.query.search, "i") },
        { email: new RegExp(req.query.search, "i") },
        { phone: new RegExp(req.query.search, "i") },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .populate("bookings", "bookingNumber totalCost bookingStatus")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    // Map users to replace _id with id
    const usersWithId = users.map((user) => {
      const userObj = user.toObject();
      userObj.id = userObj._id;
      delete userObj._id;
      return userObj;
    });

    // Get statistics
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          blockedUsers: {
            $sum: { $cond: [{ $eq: ["$status", "blocked"] }, 1, 0] },
          },
          adminUsers: {
            $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      message: "সকল ব্যবহারকারীর তালিকা",
      data: {
        users: usersWithId,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
        statistics: stats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          blockedUsers: 0,
          adminUsers: 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ব্যবহারকারী তালিকা আনতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Get single user (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("bookings")
      .populate("visaApplications");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি",
      });
    }

    res.json({
      success: true,
      message: "ব্যবহারকারীর বিস্তারিত",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ব্যবহারকারী আনতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Update user status (Admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "অবৈধ স্ট্যাটাস",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি",
      });
    }

    res.json({
      success: true,
      message: `ব্যবহারকারী ${
        status === "active" ? "সক্রিয় করা" : "ব্লক করা"
      } হয়েছে`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "স্ট্যাটাস আপডেটে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ব্যবহারকারী খুঁজে পাওয়া যায়নি",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "অ্যাডমিন ব্যবহারকারী মুছা যাবে না",
      });
    }

    // Check for active bookings
    const activeBookings = await require("../models/Booking").countDocuments({
      user: req.params.id,
      bookingStatus: { $in: ["pending", "confirmed"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: "সক্রিয় বুকিং থাকায় ব্যবহারকারী মুছা যাবে না",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "ব্যবহারকারী সফলভাবে মুছে ফেলা হয়েছে",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ব্যবহারকারী মুছতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Create admin user (Super Admin only)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে",
      });
    }

    const admin = await User.create({
      name,
      email,
      phone,
      password,
      role: "admin",
      status: "active",
      emailVerified: true,
    });

    res.status(201).json({
      success: true,
      message: "অ্যাডমিন ব্যবহারকারী তৈরি হয়েছে",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "অ্যাডমিন তৈরিতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};
