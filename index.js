import express from "express";
import crypto from "crypto";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const API_KEY = process.env.BINANCE_KEY;
const API_SECRET = process.env.BINANCE_SECRET;

const BASE_URL = "https://fapi.binance.com";

function sign(query) {
  return crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");
}

app.get("/futures/account", async (req, res) => {
  try {
    const timestamp = Date.now();
    const query = `timestamp=${timestamp}`;
    const signature = sign(query);

    const url = `${BASE_URL}/fapi/v2/account?${query}&signature=${signature}`;

    let result = await fetch(url, {
      headers: { "X-MBX-APIKEY": API_KEY }
    });

    result = await result.json();
    res.json(result);
  } catch (error) {
    res.json({ error: error.toString() });
  }
});

app.get("/", (req, res) => {
  res.send("Binance Proxy Running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});

export default app;
