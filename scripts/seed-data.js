const mongoose = require("mongoose");
const TourPackage = require("../models/TourPackage");
const FAQ = require("../models/FAQ");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const seedPackages = [
  {
    title: "কক্সবাজার সমুদ্র সৈকত ট্যুর",
    destination: "কক্সবাজার",
    duration: { days: 3, nights: 2 },
    price: 8500,
    description:
      "বিশ্বের দীর্ঘতম সমুদ্র সৈকত কক্সবাজারে অবিস্মরণীয় ছুটির দিন কাটান।",
    category: "domestic",
    featured: true,
    itinerary: [
      {
        day: 1,
        title: "ঢাকা থেকে কক্সবাজার",
        description:
          "সকালে ঢাকা থেকে যাত্রা শুরু। সন্ধ্যায় কক্সবাজার পৌঁছে হোটেলে চেক-ইন।",
        activities: ["বাস যাত্রা", "হোটেল চেক-ইন", "সমুদ্র সৈকত ভ্রমণ"],
      },
    ],
    inclusions: ["পরিবহন", "হোটেল থাকা", "সকালের নাস্তা"],
    exclusions: ["দুপুর ও রাতের খাবার", "ব্যক্তিগত খরচ"],
  },
];

const seedFAQs = [
  {
    question: "বুকিং কিভাবে করবো?",
    answer:
      "আমাদের ওয়েবসাইটে গিয়ে পছন্দের প্যাকেজ নির্বাচন করে বুক করুন অথবা আমাদের অফিসে যোগাযোগ করুন।",
    category: "booking",
  },
  {
    question: "পেমেন্ট কিভাবে করবো?",
    answer: "আমরা নগদ, কার্ড, ব্যাংক ট্রান্সফার এবং মোবাইল ব্যাংকিং গ্রহণ করি।",
    category: "payment",
  },
];

const seedData = async () => {
  try {
    // Clear existing data
    await TourPackage.deleteMany({});
    await FAQ.deleteMany({});

    // Insert seed data
    await TourPackage.insertMany(seedPackages);
    await FAQ.insertMany(seedFAQs);

    console.log("Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
