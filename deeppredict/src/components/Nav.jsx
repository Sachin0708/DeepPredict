import React from "react";
import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <header className="nav-bar">
      <div className="nav-container">
        <div className="nav-left">
          <div className="logo-box">DP</div>
          <div className="brand-text">
            <div className="brand-title">DeepPredict</div>
            <div className="brand-sub">AI Forecasting Suite</div>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/overview" className="nav-link">Overview</NavLink>
          <NavLink to="/models" className="nav-link">Models</NavLink>
          <NavLink to="/results" className="nav-link">Results</NavLink>
          <NavLink to="/chatbot" className="nav-link">Chatbot</NavLink>
          <NavLink to="/contact" className="nav-link">Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
