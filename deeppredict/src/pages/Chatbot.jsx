// src/pages/Chatbot.jsx
import React, { useEffect, useRef, useState } from "react";

const VITE_API_BASE = import.meta.env.VITE_API_BASE ?? undefined;
const API_BASE = VITE_API_BASE !== undefined ? VITE_API_BASE : "http://localhost:3001";
const API_URL = (API_BASE === "" ? "" : API_BASE) + "/api/chat";
const API_IMAGE_URL = (API_BASE === "" ? "" : API_BASE) + "/api/image";
const HEALTH_URL = (API_BASE === "" ? "" : API_BASE) + "/api/health";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "Hello — upload a snapshot and add your question (or type a question) and press the up-arrow to send both.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const attachRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    // health check optional
    (async () => {
      try {
        const resp = await fetch(HEALTH_URL);
        if (resp.ok) await resp.json();
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, previewData]);

  // close attach menu on outside click / escape
  useEffect(() => {
    function onDocClick(e) {
      if (attachOpen && attachRef.current && !attachRef.current.contains(e.target)) {
        setAttachOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setAttachOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [attachOpen]);

  function addMessage(from, text, meta) {
    setMessages((m) => [...m, { from, text, meta }]);
  }

  function onFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setAttachOpen(false);

    const reader = new FileReader();
    reader.onload = () => setPreviewData(reader.result);
    reader.readAsDataURL(file);

    // reset file input so same file can be selected again if removed
    if (fileRef.current) fileRef.current.value = "";
  }

  function clearPendingFile() {
    setPendingFile(null);
    setPreviewData(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function sendMessage(e) {
    e?.preventDefault();
    const text = inputRef.current?.value?.trim();

    if (!text && !pendingFile) return; // nothing to send

    // show user's message immediately
    addMessage("user", text || (pendingFile ? "(Image + no text)" : ""), pendingFile ? { image: true } : undefined);

    inputRef.current.value = "";
    setLoading(true);

    try {
      if (pendingFile) {
        const form = new FormData();
        form.append("image", pendingFile);
        if (text) form.append("message", text);

        const resp = await fetch(API_IMAGE_URL, { method: "POST", body: form });
        if (!resp.ok) {
          const err = await resp.json().catch(() => null);
          addMessage("bot", err?.error || `Image server error: ${resp.status}`);
        } else {
          const data = await resp.json();
          addMessage("bot", data.reply || "No response");
        }
        clearPendingFile();
      } else {
        const resp = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        if (!resp.ok) {
          addMessage("bot", `Server error: ${resp.status}`);
        } else {
          const data = await resp.json();
          const raw = data.reply || "No response";

          // try parse JSON block only if present
          let parsed = null;
          try {
            const codeMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            const jsonText = codeMatch ? codeMatch[1] : raw;
            parsed = JSON.parse(jsonText);
          } catch {
            parsed = null;
          }

          if (parsed && typeof parsed === "object") {
            addMessage("bot", raw, { structured: parsed });
          } else {
            addMessage("bot", raw);
          }
        }
      }
    } catch (err) {
      console.error("Send error:", err);
      addMessage("bot", "Unable to contact server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function renderStructured(meta) {
    if (!meta?.structured) return null;
    const s = meta.structured;
    return (
      <div className="assistant-structured" aria-live="polite">
        <div className="rec-row">
          <div className={`pill rec-${(s.recommendation || "none").toLowerCase()}`}>{s.recommendation}</div>
          {s.confidence !== undefined && <div className="small muted">Confidence: {Math.round(s.confidence * 100)}%</div>}
          {s.risk_score !== undefined && <div className="small muted">Risk: {s.risk_score}/100</div>}
        </div>
        {s.rationale && <div className="rationale">{s.rationale}</div>}
        {Array.isArray(s.steps) && (
          <ol className="steps">{s.steps.map((st, i) => <li key={i}>{st}</li>)}</ol>
        )}
        {s.note && <div className="muted small">{s.note}</div>}
      </div>
    );
  }

  return (
    <section className="page-section" aria-labelledby="chat-heading">
      <h2 id="chat-heading">AI Business Analytics Chatbot</h2>
      <p className="lead">Upload a snapshot, add your question, then press the up-arrow to send both.</p>

      <div className="chat-card">
        <div className="chat-window" ref={containerRef} role="log" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`chat-row ${m.from === "bot" ? "bot" : "user"}`}>
              <div className={`bubble ${m.from === "bot" ? "bubble-bot" : "bubble-user"}`}>
                {m.meta?.image && <div className="img-fallback">(Image uploaded)</div>}
                <div className="bubble-text">{m.text}</div>
                {m.meta?.structured && renderStructured(m.meta)}
              </div>
            </div>
          ))}

          {previewData && (
            <div className="chat-row user">
              <div className="bubble bubble-user">
                <div style={{ marginBottom: 8, fontWeight: 700 }}>Preview</div>
                <img src={previewData} alt="preview" style={{ maxWidth: 360, borderRadius: 8, display: "block" }} />
              </div>
            </div>
          )}

          {loading && (
            <div className="chat-row bot">
              <div className="bubble bubble-bot">
                <div className="bubble-text">Analyzing…</div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-controls" style={{ marginTop: 12 }}>
          {/* hidden file input */}
          <input ref={fileRef} type="file" accept="image/*" onChange={onFileSelected} style={{ display: "none" }} />

          {/* pill input with plus inside and circular up-arrow send */}
          <form className="chat-input-pill" onSubmit={sendMessage} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
            <div ref={attachRef} style={{ position: "relative" }}>
              <button
                type="button"
                className="plus-inside-pill"
                onClick={() => setAttachOpen((s) => !s)}
                aria-haspopup="menu"
                aria-expanded={attachOpen}
                aria-label="Add attachments"
              >
                +
              </button>

              {attachOpen && (
                <div className="attach-menu" role="menu" aria-label="Attachment menu">
                  <button
                    type="button"
                    className="attach-item"
                    onClick={() => {
                      if (fileRef.current) fileRef.current.click();
                      setAttachOpen(false);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 3l4 4-10 10a4 4 0 0 1-5.657 0 4 4 0 0 1 0-5.657L15 1z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add photos & files
                  </button>
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              className="pill-input"
              placeholder="should i buy AAPL?"
              aria-label="Message"
              autoComplete="off"
            />

            <button type="submit" className="send-circle" aria-label="Send" disabled={loading}>
              {/* up arrow / send icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2l-7 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
