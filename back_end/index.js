const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/config");
const models = require("./models/associations");
const syncModels = require("./models/sync");
const { users, admin, transactions } = require("./routes");
const events = require("./routes/events");
const ticketWorker = require("./workers/ticketWorker");
const { default: axios } = require("axios");

const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3010",
    "http://127.0.0.1:3010",
    "null",
  ];
  const isAllowedOrigin =
    requestOrigin &&
    (allowedOrigins.includes(requestOrigin) ||
      requestOrigin.startsWith("http://localhost:") ||
      requestOrigin.startsWith("http://127.0.0.1:"));

  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.get("/api/homepage", async (req, res) => {
  const { Event, TicketType } = require("./models/associations");

  let dbCards = [];
  try {
    const events = await Event.findAll({
      include: [{ model: TicketType, as: "ticket_types" }],
      order: [["event_date", "ASC"]],
    });

    dbCards = events.map((ev) => {
      const ticketTypes = ev.ticket_types || [];
      const totalQuota = ticketTypes.reduce(
        (sum, tt) => sum + (tt.quota || 0),
        0,
      );
      const firstTicketTypeId = ticketTypes.length > 0 ? ticketTypes[0].ticket_type_id : null;
      return {
        genre: ev.title,
        alt: ev.location,
        image: ev.banner_url
          ? `http://localhost:${process.env.PORT || 3010}${ev.banner_url}`
          : "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
        stock: totalQuota,
        event_id: ev.event_id,
        ticket_type_id: firstTicketTypeId,
        event_date: ev.event_date,
        location: ev.location,
      };
    });
  } catch (_err) {
    // fallback to hardcoded if DB unavailable
  }

  res.json({
    brand: {
      title: "TixQueue Studio",
      subtitle: "Premium Ticketing and Queueing Concept",
    },
    toolbar: [
      { label: "Live Design Concept", active: true },
      { label: "Technical Docs", active: false },
      { label: "Dev HUD: OFF", active: false },
      { label: "Budi Santoso", active: false },
    ],
    steps: [
      { label: "Konser Terbuka", active: true },
      { label: "Antrean Server", active: false },
      { label: "Kursi dan Dokumen", active: false },
      { label: "Pembayaran Segera", active: false },
    ],
    hero: {
      tag: "Live Smart Queue Enabled",
      title: "Dapatkan Tiket Konser Impian Anda Tanpa Server Down",
      description:
        "Menggunakan teknologi alokasi antrean virtual berbasis antrean pintar. Sistem antrean kami memproses ribuan pemesan tiket secara teratur dan aman.",
      searchPlaceholder: "Cari artis, band, atau festival...",
      searchButton: "Cari",
    },
    popular: {
      title: "Penjualan Tiket Terpopuler",
      filterLabel: "Kategori Filter",
      cards: dbCards,
    },
    footer: {
      text: "TixQueue Studio - Virtual Queue Engine for High-Demand Ticket Sales",
      meta: "Status: All systems operational",
    },
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

// Register routes SEBELUM server listen
app.use("", users);
app.use("", transactions);
app.use("", events);
if (admin) {
  app.use("", admin);
}



async function startServer() {
  try {
    await connectDB();
    await syncModels();

    // Start the ticket worker untuk process queue jobs
    console.log("🚀 Starting ticket worker...");
    ticketWorker.on("completed", (job) => {
      console.log(`✅ Job ${job.id} completed successfully`);
    });
    ticketWorker.on("failed", (job, err) => {
      console.error(`❌ Job ${job.id} failed:`, err.message);
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
}

startServer();
