const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });
const User = require("../models/User");

const envPath = path.resolve(__dirname, "..", ".env");
const credentialsPath = process.env.ADMIN_CREDENTIALS_FILE || "/root/doctorekhane-admin-credentials.txt";

const setEnvValue = (content, key, value) => {
  const line = `${key}=${value}`;
  const expression = new RegExp(`^${key}=.*$`, "m");
  return expression.test(content) ? content.replace(expression, line) : `${content.trimEnd()}\n${line}\n`;
};

const run = async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  const email = process.env.ADMIN_EMAIL || "admin@doctorekhane.com";
  const password = crypto.randomBytes(24).toString("base64url");
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await User.findOne({ "personalDetails.email": email }).select("+account.password");
  if (!admin) throw new Error("Configured admin account was not found");
  admin.account.password = password;
  await admin.save();
  let envContent = fs.readFileSync(envPath, "utf8");
  envContent = setEnvValue(envContent, "ADMIN_EMAIL", email);
  envContent = setEnvValue(envContent, "ADMIN_PASSWORD", password);
  fs.writeFileSync(envPath, envContent, { mode: 0o600 });
  fs.chmodSync(envPath, 0o600);
  fs.writeFileSync(credentialsPath, `Doctor Ekhane admin\nEmail: ${email}\nPassword: ${password}\n`, { mode: 0o600 });
  fs.chmodSync(credentialsPath, 0o600);
  console.log(`Admin password rotated. Credentials saved with root-only permissions at ${credentialsPath}`);
  await mongoose.disconnect();
};

run().catch(async (error) => { console.error(error.message); await mongoose.disconnect().catch(() => {}); process.exit(1); });
