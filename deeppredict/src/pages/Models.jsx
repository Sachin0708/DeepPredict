import React from "react";

const modelsData = [
  {
    id: "m1",
    title: "AI Stock Prediction",
    tag: "Finance",
    short: "Advanced deep learning models for accurate short- and long-term stock forecasting.",
    bullets: [
      "Market-aware time-series forecasting",
      "Volatility & risk integration",
      "Multi-asset prediction"
    ]
  },
  {
    id: "m2",
    title: "Supply Chain Management",
    tag: "SCM",
    short: "Demand planning and inventory optimization for end-to-end supply chain intelligence.",
    bullets: [
      "Demand forecasting",
      "Inventory optimization",
      "Logistics cost reduction"
    ]
  },
  {
    id: "m3",
    title: "E-Commerce Analytics",
    tag: "E-Comm",
    short: "Customer insights, churn prediction, and product-level analytics powered by AI.",
    bullets: [
      "Customer behavior modeling",
      "Product recommendation insights",
      "Sales & conversion forecasting"
    ]
  },
  {
    id: "m4",
    title: "Real Estate Forecasting",
    tag: "Real Estate",
    short: "Property price prediction and market trend analysis for real estate insights.",
    bullets: [
      "Price forecasting models",
      "Market trend analysis",
      "Location-specific valuation"
    ]
  }
];

export default function Models() {

  const openModel = (id) => {
    if (id === "m1") {
      window.open("https://perdurable-abby-unnarratable.ngrok-free.dev", "_blank");
    } 
    else if (id === "m2") {
      window.open("https://supply-chain-management-mb6w.onrender.com", "_blank");
    }
    else if (id === "m3") {
      window.open("https://e-commerce-sales-prediction.vercel.app", "_blank");
    }
    else if (id === "m4") {
      window.open("https://ominous-postpuerperal-shea.ngrok-free.dev/", "_blank");
    }
  };

  return (
    <section className="models-section">
      <div className="models-container">
        <div className="models-header">
          <h2 className="models-title">Models</h2>
          <p className="models-lead">
            Explore the production-ready models powering DeepPredict. Each card summarizes model purpose,
            strengths and usage notes.
          </p>
        </div>

        <div className="models-grid">
          {modelsData.map((m) => (
            <article key={m.id} className="model-card">
              <div className="model-card-head">
                <h3 className="model-title">{m.title}</h3>
                <span className="model-tag">{m.tag}</span>
              </div>

              <p className="model-short">{m.short}</p>

              <ul className="model-bullets">
                {m.bullets.map((b, idx) => (
                  <li key={idx} className="model-bullet">
                    <span className="bullet-check">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="model-actions">
                <a href="#" className="btn btn-outline">View docs</a>

                <button
                  className="btn btn-primary"
                  onClick={() => openModel(m.id)}
                >
                  Use model
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="models-note">
          Want these wired into routes or a dynamic API? Import <code>Models</code> into the page where you'd like it to appear.
        </div>
      </div>
    </section>
  );
}
