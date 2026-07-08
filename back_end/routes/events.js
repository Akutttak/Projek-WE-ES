const express = require("express");
const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

const router = express.Router();

function buildSearchParams(query) {
  const params = {};

  const entries = Object.entries(query || {});
  for (const [key, value] of entries) {
    if (value === undefined || value === "" || value === null) continue;
    params[key] = value;
  }

  return params;
}

function isPlaceholderApiKey(apiKey) {
  return (
    !apiKey || apiKey === "your_api_key_here" || apiKey.startsWith("your_")
  );
}

router.get("/api/events/search", async (req, res) => {
  try {
    const apiKey = process.env.PREDICTHQ_API_KEY;

    if (isPlaceholderApiKey(apiKey)) {
      return res.status(500).json({
        message: "PREDICTHQ_API_KEY belum diisi dengan key asli.",
        hint: "Gunakan key dari PredictHQ, lalu restart server agar .env terbaca.",
      });
    }

    const params = buildSearchParams(req.query);
    const response = await axios.get("https://api.predicthq.com/v1/events/", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      params,
      timeout: 15000,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const details = error.response?.data || error.message;

    return res.status(status).json({
      message: "Gagal mengambil data dari PredictHQ.",
      details,
    });
  }
});

router.post("/api/events/search", async (req, res) => {
  try {
    const apiKey = process.env.PREDICTHQ_API_KEY;

    if (isPlaceholderApiKey(apiKey)) {
      return res.status(500).json({
        message: "PREDICTHQ_API_KEY belum diisi dengan key asli.",
        hint: "Gunakan key dari PredictHQ, lalu restart server agar .env terbaca.",
      });
    }

    const params = buildSearchParams(req.body);
    const response = await axios.get("https://api.predicthq.com/v1/events/", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      params,
      timeout: 15000,
    });

    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const details = error.response?.data || error.message;

    return res.status(status).json({
      message: "Gagal mengambil data dari PredictHQ.",
      details,
    });
  }
});

module.exports = router;
