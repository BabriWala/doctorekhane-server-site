const mongoose = require("mongoose");
const TourPackage = require("../models/TourPackage");
const FAQ = require("../models/FAQ");
const Gallery = require("../models/Gallery");
const Blog = require("../models/Blog");
const User = require("../models/User");
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
      {
        day: 2,
        title: "কক্সবাজার দর্শনীয় স্থান",
        description: "হিমছড়ি, ইনানী বিচ এবং মহেশখালী দ্বীপ ভ্রমণ।",
        activities: ["হিমছড়ি ভ্রমণ", "ইনানী বিচ", "মহেশখালী দ্বীপ"],
      },
      {
        day: 3,
        title: "কক্সবাজার থেকে ঢাকা",
        description: "সকালে শেষ কেনাকাটা এবং দুপুরে ঢাকার উদ্দেশ্যে যাত্রা।",
        activities: ["কেনাকাটা", "ঢাকা ফেরত"],
      },
    ],
    inclusions: ["পরিবহন", "হোটেল থাকা", "সকালের নাস্তা", "গাইড সার্ভিস"],
    exclusions: ["দুপুর ও রাতের খাবার", "ব্যক্তিগত খরচ", "এন্ট্রি ফি"],
    images: [
      {
        url: "/placeholder.svg?height=400&width=600",
        caption: "কক্সবাজার সূর্যাস্ত",
        isMain: true,
      },
    ],
  },
  {
    title: "সুন্দরবন ম্যানগ্রোভ ট্যুর",
    destination: "সুন্দরবন",
    duration: { days: 2, nights: 1 },
    price: 6500,
    description:
      "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবনে বাঘ ও প্রকৃতি দেখার অভিজ্ঞতা।",
    category: "domestic",
    featured: true,
    itinerary: [
      {
        day: 1,
        title: "ঢাকা থেকে সুন্দরবন",
        description: "সকালে ঢাকা থেকে খুলনা। খুলনা থেকে লঞ্চে সুন্দরবন।",
        activities: ["বাস যাত্রা", "লঞ্চ ভ্রমণ", "বন বিভাগ অনুমতি"],
      },
    ],
    inclusions: ["পরিবহন", "লঞ্চ থাকা", "সব খাবার", "বন বিভাগ ফি"],
    exclusions: ["ব্যক্তিগত খরচ", "বীমা"],
    images: [
      {
        url: "/placeholder.svg?height=400&width=600",
        caption: "সুন্দরবনের ম্যানগ্রোভ বন",
        isMain: true,
      },
    ],
  },
];

const seedFAQs = [
  {
    question: "বুকিং কিভাবে করবো?",
    answer:
      "আমাদের ওয়েবসাইটে গিয়ে পছন্দের প্যাকেজ নির্বাচন করে বুক করুন অথবা আমাদের অফিসে যোগাযোগ করুন।",
    category: "booking",
    order: 1,
  },
  {
    question: "পেমেন্ট কিভাবে করবো?",
    answer: "আমরা নগদ, কার্ড, ব্যাংক ট্রান্সফার এবং মোবাইল ব্যাংকিং গ্রহণ করি।",
    category: "payment",
    order: 2,
  },
  {
    question: "বুকিং বাতিল করা যাবে?",
    answer:
      "ভ্রমণের ৭ দিন আগে পর্যন্ত বুকিং বাতিল করা যাবে। বাতিলের ক্ষেত্রে কিছু চার্জ প্রযোজ্য।",
    category: "booking",
    order: 3,
  },
  {
    question: "ভিসা প্রক্রিয়ায় কত সময় লাগে?",
    answer: "ভিসার ধরন অনুযায়ী ৭-৩০ কার্যদিবস সময় লাগতে পারে।",
    category: "visa",
    order: 4,
  },
];

const seedGallery = [
  {
    title: "কক্সবাজার সূর্যাস্ত",
    imageUrl: "/placeholder.svg?height=400&width=600",
    caption: "কক্সবাজারের অপরূপ সূর্যাস্ত",
    category: "destinations",
    tags: ["কক্সবাজার", "সূর্যাস্ত", "সমুদ্র"],
  },
  {
    title: "সুন্দরবনের বাঘ",
    imageUrl: "/placeholder.svg?height=400&width=600",
    caption: "সুন্দরবনের রয়েল বেঙ্গল টাইগার",
    category: "destinations",
    tags: ["সুন্দরবন", "বাঘ", "বন্যপ্রাণী"],
  },
];

const seedData = async () => {
  try {
    console.log("Starting data seeding...");

    // Clear existing data
    await TourPackage.deleteMany({});
    await FAQ.deleteMany({});
    await Gallery.deleteMany({});
    await Blog.deleteMany({});

    console.log("Cleared existing data");

    // Create admin user if not exists
    const adminExists = await User.findOne({ role: "admin" });
    let adminUser;

    if (!adminExists) {
      adminUser = await User.create({
        name: "Admin",
        email: "admin@azharitravels.com",
        phone: "01700000000",
        password: "admin123456",
        role: "admin",
        status: "active",
        emailVerified: true,
      });
      console.log("Created admin user");
    } else {
      adminUser = adminExists;
    }

    // Insert seed data
    const packages = await TourPackage.insertMany(seedPackages);
    console.log(`Inserted ${packages.length} tour packages`);

    const faqs = await FAQ.insertMany(seedFAQs);
    console.log(`Inserted ${faqs.length} FAQs`);

    // Add admin user reference to gallery items
    const galleryWithUser = seedGallery.map((item) => ({
      ...item,
      uploadedBy: adminUser._id,
    }));

    const gallery = await Gallery.insertMany(galleryWithUser);
    console.log(`Inserted ${gallery.length} gallery images`);

    // Create sample blog posts
    const sampleBlogs = [
      {
        title: "কক্সবাজার ভ্রমণের সেরা সময়",
        category: "travel_tips",
        content: `কক্সবাজার ভ্রমণের জন্য সবচেয়ে ভালো সময় হলো অক্টোবর থেকে মার্চ মাস পর্যন্ত। এই সময়ে আবহাওয়া থাকে মনোরম এবং সমুদ্র থাকে শান্ত।

## কেন এই সময়টা সেরা?

১. **আবহাওয়া**: শীতকালে কক্সবাজারের আবহাওয়া থাকে মনোরম
২. **সমুদ্রের অবস্থা**: এই সময় সমুদ্র থাকে শান্ত
৩. **পর্যটক সংখ্যা**: তুলনামূলক কম ভিড়

## এড়িয়ে চলুন

- বর্ষাকাল (জুন-সেপ্টেম্বর)
- গ্রীষ্মকাল (এপ্রিল-মে)`,
        excerpt: "কক্সবাজার ভ্রমণের সেরা সময় এবং টিপস জানুন।",
        author: adminUser._id,
        status: "published",
        featured: true,
        tags: ["কক্সবাজার", "ভ্রমণ টিপস", "সময়"],
        coverImage: {
          url: "/placeholder.svg?height=300&width=500",
          caption: "কক্সবাজার ভ্রমণ গাইড",
        },
      },
      {
        title: "ভিসা আবেদনের সহজ নিয়ম",
        category: "guides",
        content: `ভিসা আবেদন করা অনেকের কাছে জটিল মনে হলেও সঠিক তথ্য জানলে এটি খুবই সহজ।

## প্রয়োজনীয় কাগজপত্র

১. **পাসপোর্ট**: কমপক্ষে ৬ মাস মেয়াদ থাকতে হবে
২. **ছবি**: পাসপোর্ট সাইজ সাদা ব্যাকগ্রাউন্ড
৩. **ব্যাংক স্টেটমেন্ট**: শেষ ৩ মাসের
৪. **চাকরির সার্টিফিকেট**: বর্তমান চাকরির

## আবেদন প্রক্রিয়া

- অনলাইনে ফর্ম পূরণ
- প্রয়োজনীয় কাগজ জমা
- ফি পরিশোধ
- ইন্টারভিউ (প্রয়োজনে)`,
        excerpt: "ভিসা আবেদনের সহজ পদ্ধতি এবং প্রয়োজনীয় কাগজপত্র।",
        author: adminUser._id,
        status: "published",
        tags: ["ভিসা", "আবেদন", "গাইড"],
        coverImage: {
          url: "/placeholder.svg?height=300&width=500",
          caption: "ভিসা আবেদন গাইড",
        },
      },
    ];

    const blogs = await Blog.insertMany(sampleBlogs);
    console.log(`Inserted ${blogs.length} blog posts`);

    console.log("✅ Data seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Tour Packages: ${packages.length}`);
    console.log(`- FAQs: ${faqs.length}`);
    console.log(`- Gallery Images: ${gallery.length}`);
    console.log(`- Blog Posts: ${blogs.length}`);
    console.log(`- Admin User: ${adminUser.email}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
