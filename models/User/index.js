const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── Main User Schema ─────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    personalDetails: {
      name: { type: String, required: true },
      email: {
        type: String,
        // required: true,
        unique: true,
        lowercase: true,
        index: true,
      },
      phone: { type: String },
    },

    account: {
      role: {
        type: String,
        enum: ["admin", "superadmin", "user"],
        default: "user",
      },
      password: { type: String },
      resetPasswordToken: { type: String },
      resetPasswordExpire: { type: Date },
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  { timestamps: true }
);

// ─── Middleware & Methods ─────────────────────────────────────────────

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
    delete user.account.password;
    delete user.account.resetPasswordToken;
    delete user.account.resetPasswordExpire;
  }

  return user;
};

// ─── Export ─────────────────────────────────────────────

module.exports = mongoose.model("User", userSchema);
