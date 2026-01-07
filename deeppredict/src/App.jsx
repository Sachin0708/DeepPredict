// src/App.jsx
import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Overview from "./pages/Overview";
import Models from "./pages/Models";
import Results from "./pages/Results";
import Chatbot from "./pages/Chatbot";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

export default function App() {
  return (
    <>
      {/* Top white nav bar */}
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
            {/* Home is now /home, login is / */}
            <NavLink to="/home" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/overview" className="nav-link">
              Overview
            </NavLink>
            <NavLink to="/models" className="nav-link">
              Models
            </NavLink>
            <NavLink to="/results" className="nav-link">
              Results
            </NavLink>
            <NavLink to="/chatbot" className="nav-link">
              Chatbot
            </NavLink>
            <NavLink to="/contact" className="nav-link">
              Contact
            </NavLink>
            <NavLink to="/" end className="nav-link">
              Login
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          {/* Login loads first at "/" */}
          <Route path="/" element={<Login />} />

          {/* Rest of the app */}
          <Route path="/home" element={<Home />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/models" element={<Models />} />
          <Route path="/results" element={<Results />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </>
  );
}
