require("dotenv").config();
const { connectDB, sequelize } = require("../config/config");
const syncModels = require("../models/sync");
const Event = require("../models/Event");

const eventSeedData = [
  {
    title: "Indie Music Night",
    description: "Live performance by local indie bands in a cozy rooftop venue.",
    location: "Bandung Creative Hub",
    event_date: new Date("2026-08-15T19:00:00"),
    age_restriction: 17,
    banner_url: "https://example.com/images/indie-music-night.jpg",
  },
  {
    title: "Tech Innovation Summit",
    description: "A full-day summit covering AI, cloud, and startup growth.",
    location: "Jakarta Convention Center",
    event_date: new Date("2026-08-22T09:00:00"),
    age_restriction: 0,
    banner_url: "https://example.com/images/tech-innovation-summit.jpg",
  },
  {
    title: "Street Food Festival",
    description: "Enjoy authentic street snacks and live cooking demos.",
    location: "Yogyakarta Heritage Square",
    event_date: new Date("2026-09-01T16:00:00"),
    age_restriction: 0,
    banner_url: "https://example.com/images/street-food-festival.jpg",
  },
  {
    title: "Open Mic Comedy Night",
    description: "Stand-up comedy performances from rising local comedians.",
    location: "Semarang Comedy Club",
    event_date: new Date("2026-09-05T20:00:00"),
    age_restriction: 18,
    banner_url: "https://example.com/images/open-mic-comedy.jpg",
  },
  {
    title: "Art & Craft Expo",
    description: "Discover handmade crafts, art installations, and workshops.",
    location: "Surabaya Expo Hall",
    event_date: new Date("2026-09-12T10:00:00"),
    age_restriction: 0,
    banner_url: "https://example.com/images/art-craft-expo.jpg",
  },
  {
    title: "Midnight Movie Screening",
    description: "An outdoor cinema experience under the stars.",
    location: "Bali Beach Garden",
    event_date: new Date("2026-09-18T21:00:00"),
    age_restriction: 13,
    banner_url: "https://example.com/images/midnight-movie-screening.jpg",
  },
  {
    title: "Wellness Yoga Retreat",
    description: "A calming retreat with yoga sessions and healthy food.",
    location: "Ubud Wellness Center",
    event_date: new Date("2026-09-25T07:00:00"),
    age_restriction: 0,
    banner_url: "https://example.com/images/yoga-retreat.jpg",
  },
  {
    title: "Gaming Arena Festival",
    description: "Competitive gaming tournaments and cosplay showcases.",
    location: "Bekasi Esports Arena",
    event_date: new Date("2026-10-03T12:00:00"),
    age_restriction: 13,
    banner_url: "https://example.com/images/gaming-arena-festival.jpg",
  },
  {
    title: "Coffee & Books Fair",
    description: "Meet authors, sip specialty coffee, and browse local books.",
    location: "Malang Literary Cafe",
    event_date: new Date("2026-10-10T11:00:00"),
    age_restriction: 0,
    banner_url: "https://example.com/images/coffee-books-fair.jpg",
  },
  {
    title: "New Year Countdown Party",
    description: "Celebrate the year-end with music, lights, and fireworks.",
    location: "Senayan Park",
    event_date: new Date("2026-12-31T22:00:00"),
    age_restriction: 18,
    banner_url: "https://example.com/images/new-year-countdown.jpg",
  },
];

async function seedEvents() {
  for (const payload of eventSeedData) {
    const existing = await Event.findOne({ where: { title: payload.title } });

    if (existing) {
      await existing.update(payload);
      console.log("Event updated:", payload.title);
      continue;
    }

    await Event.create(payload);
    console.log("Event created:", payload.title);
  }
}

async function run() {
  try {
    await connectDB();
    await syncModels();
    await seedEvents();
    console.log("Event seeder completed successfully.");
  } catch (error) {
    console.error("Event seeder failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
