require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB, sequelize } = require("../config/config");
const syncModels = require("../models/sync");
const User = require("../models/User");

async function seedUserAccounts() {
  const adminPassword = process.env.SEED_USER_PASSWORD || "SeedAdmin123!";
  const demoPassword = process.env.SEED_SECOND_USER_PASSWORD || "DemoUser123!";

  const usersToSeed = [
    {
      nik: process.env.SEED_USER_NIK || "1234567890123456",
      full_name: process.env.SEED_USER_FULL_NAME || "Seed Admin",
      email: (process.env.SEED_USER_EMAIL || "seed.admin@tixqueue.local").toLowerCase(),
      password: await bcrypt.hash(adminPassword, 10),
      birth_date: process.env.SEED_USER_BIRTH_DATE || "2000-01-01",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      nik: process.env.SEED_SECOND_USER_NIK || "2101990000000002",
      full_name: process.env.SEED_SECOND_USER_FULL_NAME || "Demo User",
      email: (process.env.SEED_SECOND_USER_EMAIL || "demo.user@tixqueue.local").toLowerCase(),
      password: await bcrypt.hash(demoPassword, 10),
      birth_date: process.env.SEED_SECOND_USER_BIRTH_DATE || "1998-05-15",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  for (const payload of usersToSeed) {
    const existing = await User.findOne({ where: { email: payload.email } });

    if (existing) {
      await existing.update(payload);
      console.log("Seeder user updated:", payload.email);
      continue;
    }

    await User.create(payload);
    console.log("Seeder user created:", payload.email);
  }
}

async function run() {
  try {
    await connectDB();
    await syncModels();
    await seedUserAccounts();
    console.log("User seeder completed successfully.");
  } catch (error) {
    console.error("User seeder failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
