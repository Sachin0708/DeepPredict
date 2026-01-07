import React from "react";

/**
 * Overview section for DeepPredict.
 * This component renders a heading and three feature cards explaining
 * the platform's capabilities: Unified Pipelines, Modular Tools, and
 * Enterprise-grade Evaluation.
 *
 * (This is original content — do not copy from any screenshot.)
 */
export default function Overview() {
  const cards = [
    {
      key: "pipeline",
      title: "Unified Forecasting Pipeline",
      blurb:
        "A single, repeatable pipeline for data ingestion, cleaning, feature engineering, and forecasting. Supports time series, panel data, and cross-sectional datasets with built-in preprocessing and validation.",
      bullets: [
        "Automated data validation & cleaning",
        "Feature stores & rolling-window transforms",
        "Pluggable models and ensembling",
      ],
      icon: (
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="3" fill="#fff" opacity="0.06" />
          <path d="M6 9h4v6H6zM11 7h3v8h-3zM15 10h3v5h-3z" fill="#ffffff" />
        </svg>
      ),
    },
    {
      key: "modular",
      title: "Modular & Extensible Tools",
      blurb:
        "Design experiments using reusable modules — model, trainer, evaluator, visualizer. Swap implementations without rewriting orchestration logic for quick iteration.",
      bullets: [
        "Model & trainer abstractions",
        "Metric-driven experiment config",
        "Easy custom module development",
      ],
      icon: (
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
          <circle cx="12" cy="7" r="3" fill="#ffffff" />
          <rect x="4" y="13" width="16" height="6" rx="2" fill="#ffffff" opacity="0.08" />
        </svg>
      ),
    },
    {
      key: "evaluation",
      title: "Robust Evaluation & Reporting",
      blurb:
        "Comprehensive backtesting, cross-validation and scenario analysis plus reproducible report generation. Export interactive charts and shareable experiment summaries.",
      bullets: [
        "Walk-forward and backtest engines",
        "Confidence intervals & error decomposition",
        "Auto-generated experiment reports",
      ],
      icon: (
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
          <path d="M3 13h18v8H3z" fill="#fff" opacity="0.06" />
          <path d="M6 10l3-3 4 4 5-5 2 2-7 7-7-5z" fill="#ffffff" />
        </svg>
      ),
    },
  ];

  return (
    <section aria-labelledby="overview-heading" className="overview-section">
      <div className="container">
        <h2 id="overview-heading" className="overview-title">
          Platform overview
        </h2>
        <p className="overview-lead">
          DeepPredict provides a complete toolkit to turn raw data into production-ready forecasts and actionable business recommendations. The platform focuses on reproducibility, modularity, and clear evaluation so teams can iterate quickly while keeping experiments auditable.
        </p>

        <div className="overview-grid" role="list">
          {cards.map((c) => (
            <article key={c.key} role="listitem" className="overview-card">
              <div className="card-icon" aria-hidden="true">
                {c.icon}
              </div>

              <div className="card-body">
                <h3 className="card-title">{c.title}</h3>
                <p className="card-blurb">{c.blurb}</p>

                <ul className="card-features" aria-label={`${c.title} features`}>
                  {c.bullets.map((b, i) => (
                    <li key={i} className="card-feature">
                      <span className="feature-dot" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
