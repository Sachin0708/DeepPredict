// src/pages/Login.jsx
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "deeppredict_logged_in";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // On mount, read login flag from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setSuccess(true);
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !pwd.trim()) {
      setMessage("Please enter both email and password.");
      return;
    }

    // DEMO ONLY: treat any non-empty credentials as success
    setSuccess(true);
    setMessage("");
    window.localStorage.setItem(STORAGE_KEY, "true");
  }

  return (
    <section className="auth-wrapper">
      <div className="auth-card">
        {!success && (
          <>
            <h2 className="auth-title">Sign in to DeepPredict</h2>
            <p className="auth-sub">
              Access your forecasting workspaces, saved models, and analytics dashboards.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-label">
                Email
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="auth-label">
                Password
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                />
              </label>

              <div className="auth-row">
                <label className="auth-remember">
                  <input type="checkbox" /> <span>Remember me</span>
                </label>
                <button type="button" className="auth-link-btn">
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn btn-primary auth-submit">
                Sign in
              </button>

              {message && <div className="auth-message">{message}</div>}
            </form>

            <div className="auth-footer">
              <span>Don’t have an account?</span>
              <button type="button" className="auth-link-btn">
                Request access
              </button>
            </div>
          </>
        )}

        {success && (
          <div className="auth-success">
            <div className="auth-success-icon">
              <span>✓</span>
            </div>
            <h2 className="auth-success-title">Login successful</h2>
            <p className="auth-success-text">
              Welcome back! You’re now signed in to <strong>DeepPredict</strong>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
