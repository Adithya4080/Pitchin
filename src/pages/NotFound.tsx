import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nf-root { animation: fadeUp 0.45s ease both; }
        .nf-btn-primary {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.01em;
          background: #F5A623;
          color: #0D0F14;
          border: none;
          border-radius: 8px;
          padding: 0.7rem 1.6rem;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .nf-btn-primary:hover { background: #f0a020; }
        .nf-btn-primary:active { transform: scale(0.97); }
        .nf-btn-ghost {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: 0.01em;
          background: transparent;
          color: #c9bfa8;
          border: 1px solid rgba(245,166,35,0.45);
          border-radius: 8px;
          padding: 0.7rem 1.6rem;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
        }
        .nf-btn-ghost:hover { border-color: #F5A623; color: #F1EDE3; }
        .nf-btn-ghost:active { transform: scale(0.97); }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0D0F14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Ambient glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 40% at 50% 42%, rgba(245,166,35,0.10) 0%, transparent 70%)",
        }} />

        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04,
          backgroundImage: "linear-gradient(#F5A623 1px, transparent 1px), linear-gradient(90deg, #F5A623 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />

        <div className="nf-root" style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          maxWidth: "560px", width: "100%",
        }}>

          {/* Eyebrow */}
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.72rem", letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#c88a2a",
            fontWeight: 600, marginBottom: "2rem",
          }}>
            Deck #404&nbsp;·&nbsp;Due diligence failed
          </p>

          {/* 404 */}
          <div style={{ position: "relative", marginBottom: "0.5rem", userSelect: "none" }} aria-hidden="true">
            {/* Ghost offset layer */}
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(7rem, 22vw, 11rem)", fontWeight: 700,
              letterSpacing: "-0.04em", lineHeight: 1,
              color: "rgba(245,166,35,0.10)", display: "block",
              position: "absolute", top: 0, left: 0,
              transform: "translate(7px, 7px)",
            }}>404</span>
            {/* Main outlined 404 */}
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(7rem, 22vw, 11rem)", fontWeight: 700,
              letterSpacing: "-0.04em", lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "2px #c88a2a",
              display: "block",
              position: "relative",
            }}>404</span>
          </div>

          {/* Divider */}
          <div style={{ width: "4rem", height: "1px", background: "#c88a2a", opacity: 0.5, marginBottom: "2rem" }} />

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 600,
            color: "#F1EDE3", letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: "1rem",
          }}>
            This pitch didn't make it to the room.
          </h1>

          {/* Catchphrase */}
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.9rem",
            color: "#c88a2a",
            fontStyle: "italic",
            lineHeight: 1.5,
            marginBottom: "0.85rem",
          }}>
            "Investors ghosted this URL before it even loaded."
          </p>

          {/* Body */}
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.93rem",
            color: "rgba(241,237,227,0.45)", lineHeight: 1.7,
            maxWidth: "34ch", marginBottom: "2.5rem",
          }}>
            The page you're looking for has moved, been deleted, or never existed.
            Let's get you back on track.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button className="nf-btn-primary" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <button className="nf-btn-ghost" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          </div>

          {/* Footer */}
          <p style={{
            marginTop: "4rem",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.68rem", letterSpacing: "0.2em",
            textTransform: "uppercase",  color: "#E6C88A", opacity: 0.8, 
          }}>
            Pitchin — Where great pitches land
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFound;