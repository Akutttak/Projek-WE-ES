const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.get("/api/homepage", (req, res) => {
  res.json({
    brand: {
      title: "TixQueue Studio",
      subtitle: "Premium Ticketing and Queueing Concept"
    },
    toolbar: [
      { label: "Live Design Concept", active: true },
      { label: "Technical Docs", active: false },
      { label: "Dev HUD: OFF", active: false },
      { label: "Budi Santoso", active: false }
    ],
    steps: [
      { label: "Konser Terbuka", active: true },
      { label: "Antrean Server", active: false },
      { label: "Kursi dan Dokumen", active: false },
      { label: "Pembayaran Segera", active: false }
    ],
    hero: {
      tag: "Live Smart Queue Enabled",
      title: "Dapatkan Tiket Konser Impian Anda Tanpa Server Down",
      description:
        "Menggunakan teknologi alokasi antrean virtual berbasis antrean pintar. Sistem antrean kami memproses ribuan pemesan tiket secara teratur dan aman.",
      searchPlaceholder: "Cari artis, band, atau festival...",
      searchButton: "Cari"
    },
    popular: {
      title: "Penjualan Tiket Terpopuler",
      filterLabel: "Kategori Filter",
      cards: [
        {
          genre: "Pop",
          image: "https://images.unsplash.com/photo-1571266028243-d220c9f29998?auto=format&fit=crop&w=900&q=80",
          alt: "Pop concert crowd",
          stock: 150
        },
        {
          genre: "R&B",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
          alt: "R and B stage show",
          stock: 80
        },
        {
          genre: "Rock",
          image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=900&q=80",
          alt: "Rock DJ performance",
          stock: 200
        },
        {
          genre: "Indie",
          image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
          alt: "Indie music festival",
          stock: 320
        }
      ]
    },
    footer: {
      text: "TixQueue Studio - Virtual Queue Engine for High-Demand Ticket Sales",
      meta: "Status: All systems operational"
    }
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
