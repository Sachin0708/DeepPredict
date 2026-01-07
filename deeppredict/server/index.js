// server/index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const upload = multer();
const app = express();

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const MODEL = process.env.MODEL_NAME || "llama3";
const PORT = process.env.PORT || 3001;

// Allow local dev origin
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json({ limit: "2mb" }));

const DOMAIN_KB = {
  arima:
    "ARIMA: AutoRegressive Integrated Moving Average, suitable for univariate time-series with trend/seasonality after differencing. Steps: stationarity test (ADF), difference, select p,d,q by AIC/ACF/PACF, fit, validate with rolling-window backtest.",
  ecommerce:
    "E-commerce: SKU-level demand forecasting requires handling promotions, price elasticity, and hierarchy. Use promo flags, calendar features, and hierarchical reconciliation.",
  stock:
    "Stock prediction: price series are noisy; prefer signal-generation, risk-adjusted metrics, technical indicators, volumes, sentiment, strict walk-forward validation.",
  realestate:
    "Real estate: hedonic valuation uses location, area, bedrooms, age, amenities. Spatial effects matter; include geospatial encodings and regional cross-validation.",
  supplychain:
    "Supply chain: multi-echelon forecasting requires modeling lead-times, variability, safety stock. Use probabilistic forecasts, scenario analysis, multi-period planning.",
};

function buildPrompt(userMessage) {
  const kbText = Object.entries(DOMAIN_KB)
    .map(([k, v]) => `### ${k.toUpperCase()}\n${v}`)
    .join("\n\n");

  const systemInstructions = `
You are DeepPredict Assistant — a decision-support assistant for forecasting and business analytics.

When the user asks for a trading/decision recommendation (Buy/Hold/Sell),
you MUST FIRST RETURN exactly one JSON object with:

{
  "recommendation": "Buy" | "Hold" | "Sell" | "No action",
  "confidence": 0.0-1.0,
  "risk_score": 0-100,
  "rationale": "short explanation",
  "steps": ["step 1", "step 2"],
  "note": "optional"
}

If the user asks general questions or explanations (no prescription),
reply normally in plain text.

DO NOT return JSON when analyzing images unless user explicitly asks for JSON; prefer normal text for image analysis.
`;

  return `
${systemInstructions}

DOMAIN KNOWLEDGE:
${kbText}

USER:
${userMessage}

ASSISTANT:
(Return EXACTLY ONE JSON object for prescriptions, otherwise plain text.)
`;
}

async function callOllama(prompt) {
  const url = `${OLLAMA_HOST}/api/generate`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    const err = new Error(`Ollama ${resp.status}: ${txt}`);
    err.raw = txt;
    throw err;
  }
  return resp.json();
}

/* POST /api/chat */
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body?.message;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message string" });
    }

    const prompt = buildPrompt(message);
    const data = await callOllama(prompt);

    let reply = "";
    if (typeof data === "string") reply = data;
    else if (data?.response) reply = data.response;
    else if (Array.isArray(data?.choices)) reply = data.choices.map((c) => c.text || c.content || "").join("\n").trim();
    else if (data?.text) reply = data.text;
    else reply = JSON.stringify(data);

    return res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "server_error", details: err.message || String(err) });
  }
});

/* POST /api/image  (accept image + optional message) */
app.post("/api/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // optional text message provided by the user alongside the image
    const userMessage = (req.body?.message || "").trim();

    // Convert small images to base64 (if huge, Ollama may reject; consider resizing)
    const base64 = req.file.buffer.toString("base64");

    // Build a prompt that clearly instructs the model to respond in plain text
    // and to reference the user's attached message (if any)
    let prompt = `
You are DeepPredict Assistant. The user uploaded an image and may have asked a specific question.
IMPORTANT: For images, ALWAYS respond in NORMAL TEXT (do NOT return JSON unless explicitly requested).
Provide clear observations, likely explanations, and suggested next steps.

Image is attached as base64 below.
`;

    if (userMessage) {
      prompt += `\nUser question/context: "${userMessage}"\n\n`;
    }

    prompt += `\nIMAGE(base64):\n${base64}\n\nPlease analyze the image and answer the user's question if provided.`;
    const data = await callOllama(prompt);

    const reply = data?.response || data?.text || "No interpretation received.";
    return res.json({ reply });
  } catch (err) {
    console.error("Image analysis error:", err);
    res.status(500).json({ error: "image_error", details: err.message || String(err) });
  }
});

/* GET /api/health */
app.get("/api/health", async (req, res) => {
  try {
    let modelsList = null;
    try {
      const r = await fetch(`${OLLAMA_HOST}/api/tags`);
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j.models)) modelsList = j.models;
      }
    } catch {}
    if (!modelsList) {
      try {
        const r2 = await fetch(`${OLLAMA_HOST}/api/models`);
        if (r2.ok) {
          const j2 = await r2.json();
          if (Array.isArray(j2.models)) modelsList = j2.models;
        }
      } catch {}
    }
    return res.json({ ok: true, ollama: !!modelsList, models: modelsList || [] });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || "health_error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ DeepPredict Proxy running at http://localhost:${PORT}`);
  console.log(`➡ Ollama Host: ${OLLAMA_HOST}`);
  console.log(`➡ Model: ${MODEL}`);
});
