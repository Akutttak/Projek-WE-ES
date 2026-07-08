require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB, sequelize } = require("../config/config");
const syncModels = require("../models/sync");
const User = require("../models/User");

async function seedUserAccount() {
  const plainPassword = process.env.SEED_USER_PASSWORD || "SeedAdmin123!";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const payload = {
    nik: process.env.SEED_USER_NIK || "1234567890123456",
    full_name: process.env.SEED_USER_FULL_NAME || "Seed Admin",
    email: (process.env.SEED_USER_EMAIL || "seed.admin@tixqueue.local").toLowerCase(),
    password: hashedPassword,
    birth_date: process.env.SEED_USER_BIRTH_DATE || "2000-01-01",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const existing = await User.findOne({ where: { email: payload.email } });

  if (existing) {
    await existing.update(payload);
    console.log("Seeder user updated:", payload.email);
    return;
  }

  await User.create(payload);
  console.log("Seeder user created:", payload.email);
}

async function run() {
  try {
    await connectDB();
    await syncModels();
    await seedUserAccount();
    console.log("User seeder completed successfully.");
  } catch (error) {
    console.error("User seeder failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
