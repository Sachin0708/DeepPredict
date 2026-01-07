import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1 className="hero-title">DeepPredict</h1>

        <p className="hero-sub">
          An end-to-end platform for forecasting & AI-driven business analytics.
          Explore curated models for time-series, e-commerce, stock and
          real-estate forecasting, plus a business analytics chatbot.
        </p>

        <div className="hero-actions">
          <Link to="/models" className="btn btn-outline">Explore Models</Link>
          <Link to="/chatbot" className="btn btn-primary">Try Chatbot</Link>
          <Link to="/results" className="btn btn-ghost">View Results</Link>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-image-box">
          {/* public/hero.png -> available at /hero.png */}
          <img src="/hero.png" className="hero-img" alt="DeepPredict Illustration" />
        </div>
      </div>
    </section>
  );
}
