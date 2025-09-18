const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { imageSchema } = require("../Service/imageSchema");
const { personalDetailsSchema } = require("./personalDetailsSchema");
const { accountSchema } = require("./accountSchema");
const { documentSchema } = require("./documentSchema");
const { transactionSchema } = require("./transactionSchema");

//
// ─── Main User Schema ─────────────────────────────────────────────
//

const userSchema = new mongoose.Schema(
  {
    personalDetails: personalDetailsSchema,
    account: accountSchema,

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    // Uncomment when needed
    // processingStatus: {
    //   type: String,
    //   enum: ["pending", "processing", "completed", "rejected"],
    //   default: "pending",
    // },
    // agreementAmount: { type: Number, default: 0 },

    // Relations
    // bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    // visaApplications: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "VisaApplication" },
    // ],

    // Embedded Schemas
    // documents: [documentSchema],
    // transactions: [transactionSchema],
  },
  { timestamps: true }
);

//
// ─── Middleware & Methods ─────────────────────────────────────────────
//

// 🔑 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("account.password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.account.password = await bcrypt.hash(this.account.password, salt);
  next();
});

// 🔑 Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.account.password);
};

// 🔑 Transform JSON output (hide sensitive fields)
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  if (user.account) {
    delete user.account.password; // remove password hash
    delete user.account.resetPasswordToken;
    delete user.account.resetPasswordExpire;
  }

  return user;
};

//
// ─── Export ─────────────────────────────────────────────
//

module.exports = mongoose.model("User", userSchema);
