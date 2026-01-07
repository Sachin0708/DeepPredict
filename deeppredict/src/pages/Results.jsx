// src/pages/Results.jsx
import React, { useState } from "react";

/**
 * Results page — displays model snapshots and quick metrics.
 * Expects images to be available at /stock1.jpg, /stock2.jpg, /real-estate.jpg, /e-com.png, /supply-chain.png
 */

const MODELS = [
  {
    id: "stock-1",
    title: "Stock Prediction — Price Chart (1)",
    img: "/stock1.jpg",
    short:
      "Original vs predicted price chart with model backtest. Use for signal generation and evaluation.",
    metrics: {
      recommendation: "Hold",
      sentiment: "Neutral",
      nextForecast: 300.0,
      changePct: -0.33,
    },
  },
  {
    id: "stock-2",
    title: "Stock Prediction — Time Series (2)",
    img: "/stock2.jpg",
    short:
      "Detailed original vs predicted series and next-day forecast. Useful for visual backtesting.",
    metrics: {
      recommendation: "Hold",
      sentiment: "Neutral",
      nextForecast: 305.5,
      changePct: 1.83,
    },
  },
  {
    id: "real-estate",
    title: "Real Estate Valuation",
    img: "/real-estate.jpg",
    short:
      "Property-level valuation and market risk prescription. Contains forecasted price, risk band and recommendation.",
    metrics: {
      recommendation: "Buy",
      sentiment: "Positive",
      nextForecast: 6366000,
      changePct: 8.93,
    },
  },
  {
    id: "ecommerce",
    title: "E-Commerce Demand Forecast",
    img: "/e-com.jpg",
    short:
      "SKU-level demand forecast and inventory signal. Useful for promotions and safety-stock planning.",
    metrics: {
      recommendation: "Reduce Price",
      sentiment: "Positive",
      nextForecast: 63.66,
      changePct: 8.93,
    },
  },
  {
    id: "supply-chain",
    title: "Supply Chain Insights",
    img: "/supply-chain.png",
    short:
      "Shipment counts, forecasted quantity, and scenario charts for supply chain risk assessment.",
    metrics: {
      recommendation: "Hold Orders",
      sentiment: "Neutral",
      nextForecast: 416.67,
      changePct: -33.33,
    },
  },
];

function formatNumber(n) {
  if (n === null || n === undefined) return "-";
  if (typeof n !== "number") return String(n);
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(0) + "k";
  return n.toString();
}

function generateCSV(modelId) {
  const rows = [
    ["timestamp", "metric", "value"],
    ["2025-01-01", "forecast", "100"],
    ["2025-02-01", "forecast", "120"],
    ["2025-03-01", "forecast", "90"],
    ["2025-04-01", "forecast", "140"],
  ];
  return rows.map((r) => r.join(",")).join("\n");
}

export default function Results() {
  const [lightbox, setLightbox] = useState({ open: false, src: "", title: "" });

  function openLightbox(src, title) {
    setLightbox({ open: true, src, title });
  }
  function closeLightbox() {
    setLightbox({ open: false, src: "", title: "" });
  }

  function handleDownload(model) {
    const csv = generateCSV(model.id);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${model.id}_forecast.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="overview-section">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 18px" }}>
        <h2 className="overview-title">Results & Insights</h2>
        <p className="overview-lead">
          Model snapshots, charts and quick recommendations. Click "View Snapshot" to open a larger image. Use "Download Forecast CSV" to get example forecast output.
        </p>

        <div className="overview-grid" role="list">
          {MODELS.map((m) => (
            <article className="overview-card" key={m.id} role="listitem" aria-label={m.title}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 320px" }}>
                  <div
                    style={{
                      width: "100%",
                      height: 220,
                      borderRadius: 10,
                      overflow: "hidden",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02))",
                      border: "1px solid rgba(255,255,255,0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={m.img}
                      alt={`${m.title} snapshot`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => {
                        // fallback placeholder text shown inside the same container
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (!parent.querySelector(".img-fallback")) {
                          const fallback = document.createElement("div");
                          fallback.className = "img-fallback";
                          fallback.style.color = "rgba(255,255,255,0.7)";
                          fallback.style.fontSize = "13px";
                          fallback.style.padding = "18px";
                          fallback.style.textAlign = "center";
                          fallback.innerText = "Image not found — put the file in /public";
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>

                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <button className="btn btn-outline small" onClick={() => handleDownload(m)}>
                      Download Forecast CSV
                    </button>
                    <button className="btn btn-primary small" onClick={() => openLightbox(m.img, m.title)}>
                      View Snapshot
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 220 }}>
                  <h3 className="card-title">{m.title}</h3>
                  <p className="card-blurb">{m.short}</p>

                  <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 140 }}>
                      <div style={{ fontSize: 13, color: "var(--muted)" }}>Overall Recommendation</div>
                      <div style={{ fontWeight: 800, marginTop: 6 }}>{m.metrics.recommendation}</div>
                    </div>

                    <div style={{ minWidth: 110 }}>
                      <div style={{ fontSize: 13, color: "var(--muted)" }}>Sentiment</div>
                      <div style={{ fontWeight: 700, marginTop: 6, color: m.metrics.sentiment === "Positive" ? "#19a974" : (m.metrics.sentiment === "Negative" ? "#ff5b5b" : "#f6c84c") }}>
                        {m.metrics.sentiment}
                      </div>
                    </div>

                    <div style={{ minWidth: 120 }}>
                      <div style={{ fontSize: 13, color: "var(--muted)" }}>Next Forecast</div>
                      <div style={{ fontWeight: 700, marginTop: 6 }}>{formatNumber(m.metrics.nextForecast)}</div>
                    </div>

                    <div style={{ minWidth: 100 }}>
                      <div style={{ fontSize: 13, color: "var(--muted)" }}>Change</div>
                      <div style={{ fontWeight: 700, marginTop: 6 }}>{m.metrics.changePct}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      {lightbox.open && (
        <div
          className="results-lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6,6,10,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: 20,
            cursor: "zoom-out",
          }}
        >
          <div
            style={{
              maxWidth: "92%",
              maxHeight: "90%",
              width: 1000,
              background: "transparent",
              cursor: "auto",
              borderRadius: 8,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ color: "#fff", margin: 0 }}>{lightbox.title}</h3>
              <button onClick={closeLightbox} className="btn btn-ghost small" style={{ background: "rgba(255,255,255,0.06)" }}>
                Close
              </button>
            </div>

            <div style={{ width: "100%", height: "calc(90vh - 80px)", background: "#fff", borderRadius: 8, overflow: "auto" }}>
              <img src={lightbox.src} alt={lightbox.title} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", background: "#fff" }} onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (!parent.querySelector(".img-fallback")) {
                  const fallback = document.createElement("div");
                  fallback.className = "img-fallback";
                  fallback.style.padding = "24px";
                  fallback.style.textAlign = "center";
                  fallback.style.color = "#333";
                  fallback.innerText = "Snapshot not found. Ensure the image is in the /public folder.";
                  parent.appendChild(fallback);
                }
              }} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
