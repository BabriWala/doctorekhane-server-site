const User = require("../models/User");
const TourPackage = require("../models/TourPackage");
const Booking = require("../models/Booking");
const VisaApplication = require("../models/VisaApplication");
const Blog = require("../models/Blog");
const Contact = require("../models/Contact");
const Newsletter = require("../models/Newsletter");

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get current date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get basic counts
    const [
      totalUsers,
      totalPackages,
      totalBookings,
      totalVisaApplications,
      totalBlogs,
      totalContacts,
      totalSubscribers,
    ] = await Promise.all([
      User.countDocuments(),
      TourPackage.countDocuments(),
      Booking.countDocuments(),
      VisaApplication.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Newsletter.countDocuments({ isActive: true }),
    ]);

    // Get monthly statistics
    const monthlyStats = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      VisaApplication.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Contact.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    // Get revenue statistics
    const revenueStats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalCost" },
          paidRevenue: { $sum: "$paidAmount" },
          monthlyRevenue: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfMonth] }, "$totalCost", 0],
            },
          },
        },
      },
    ]);

    // Get booking status distribution
    const bookingStatusStats = await Booking.aggregate([
      {
        $group: {
          _id: "$bookingStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get visa application status distribution
    const visaStatusStats = await VisaApplication.aggregate([
      {
        $group: {
          _id: "$applicationStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get popular packages
    const popularPackages = await Booking.aggregate([
      {
        $group: {
          _id: "$package",
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: "$totalCost" },
        },
      },
      {
        $lookup: {
          from: "tourpackages",
          localField: "_id",
          foreignField: "_id",
          as: "packageInfo",
        },
      },
      {
        $unwind: "$packageInfo",
      },
      {
        $project: {
          title: "$packageInfo.title",
          destination: "$packageInfo.destination",
          bookingCount: 1,
          totalRevenue: 1,
        },
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Get recent activities
    const recentBookings = await Booking.find()
      .populate("user", "name email")
      .populate("package", "title destination")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentVisaApplications = await VisaApplication.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get monthly trends (last 6 months)
    const monthlyTrends = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        return Promise.all([
          Booking.countDocuments({
            createdAt: { $gte: monthStart, $lte: monthEnd },
          }),
          VisaApplication.countDocuments({
            createdAt: { $gte: monthStart, $lte: monthEnd },
          }),
          Booking.aggregate([
            {
              $match: {
                createdAt: { $gte: monthStart, $lte: monthEnd },
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$totalCost" },
              },
            },
          ]),
        ]).then(([bookings, visas, revenue]) => ({
          month: monthStart.toLocaleDateString("bn-BD", {
            year: "numeric",
            month: "long",
          }),
          bookings,
          visas,
          revenue: revenue[0]?.revenue || 0,
        }));
      })
    );

    res.json({
      success: true,
      message: "ড্যাশবোর্ড পরিসংখ্যান",
      data: {
        overview: {
          totalUsers,
          totalPackages,
          totalBookings,
          totalVisaApplications,
          totalBlogs,
          totalContacts,
          totalSubscribers,
        },
        monthly: {
          newUsers: monthlyStats[0],
          newBookings: monthlyStats[1],
          newVisaApplications: monthlyStats[2],
          newContacts: monthlyStats[3],
        },
        revenue: revenueStats[0] || {
          totalRevenue: 0,
          paidRevenue: 0,
          monthlyRevenue: 0,
        },
        bookingStatus: bookingStatusStats,
        visaStatus: visaStatusStats,
        popularPackages,
        recentActivities: {
          bookings: recentBookings,
          visaApplications: recentVisaApplications,
          contacts: recentContacts,
        },
        trends: monthlyTrends.reverse(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ড্যাশবোর্ড ডেটা আনতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Get system information
exports.getSystemInfo = async (req, res) => {
  try {
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: "সিস্টেম তথ্য",
      data: systemInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "সিস্টেম তথ্য আনতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Export data (Admin only)
exports.exportData = async (req, res) => {
  try {
    const { type, format = "json" } = req.query;

    let data = {};

    switch (type) {
      case "users":
        data = await User.find().select("-password");
        break;
      case "bookings":
        data = await Booking.find().populate("user package");
        break;
      case "visa-applications":
        data = await VisaApplication.find().populate("user");
        break;
      case "contacts":
        data = await Contact.find();
        break;
      case "all":
        data = {
          users: await User.find().select("-password"),
          bookings: await Booking.find().populate("user package"),
          visaApplications: await VisaApplication.find().populate("user"),
          contacts: await Contact.find(),
          packages: await TourPackage.find(),
          blogs: await Blog.find().populate("author"),
        };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "অবৈধ এক্সপোর্ট টাইপ",
        });
    }

    if (format === "csv") {
      // In a real application, you would convert to CSV format
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${type}-${Date.now()}.csv`
      );
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${type}-${Date.now()}.json`
      );
    }

    res.json({
      success: true,
      message: "ডেটা এক্সপোর্ট সফল",
      data,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ডেটা এক্সপোর্টে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Clear cache or reset data (Admin only)
exports.clearCache = async (req, res) => {
  try {
    // In a real application, you would clear Redis cache or similar
    // For now, we'll just return a success message

    res.json({
      success: true,
      message: "ক্যাশ সফলভাবে পরিষ্কার করা হয়েছে",
      clearedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ক্যাশ পরিষ্কার করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};
