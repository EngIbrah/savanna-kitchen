"use client";
import { useState, useEffect, useRef } from "react";

/* ─── Config ────────────────────────────────────── */
const PHONE   = "255748412022";
const MESSAGE = encodeURIComponent(
  "Hello Savanna Kitchen! 🍽️ I'd like to place an order."
);
const WA_LINK = `https://wa.me/${PHONE}?text=${MESSAGE}`;

/* ─── WhatsApp SVG icon ─────────────────────────── */
function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─── Main component ────────────────────────────── */
export default function WhatsAppButton() {
  const [visible,  setVisible]  = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const [clicked,  setClicked]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const lastScrollY              = useRef(0);
  const hideTimer                = useRef<ReturnType<typeof setTimeout>>();

  /* ── Entrance delay ── */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(t);
  }, []);

  /* ── Scroll: hide when scrolling down fast, show on scroll up ── */
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const delta   = current - lastScrollY.current;

      /* mark as scrolled past hero */
      setScrolled(current > window.innerHeight * 0.5);

      /* hide on aggressive scroll down, reveal on scroll up */
      if (delta > 60) {
        setHidden(true);
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setHidden(false), 1500);
      } else if (delta < -10) {
        setHidden(false);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(hideTimer.current);
    };
  }, []);

  /* ── Click animation reset ── */
  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  /* ── Derived visibility ── */
  const isVisible = visible && !hidden;

  return (
    <>
      {/* ════════════════════════════════════════════
          MAIN BUTTON
      ════════════════════════════════════════════ */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order or enquire via WhatsApp"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          /* positioning */
          position:   "fixed",
          bottom:     "1.75rem",
          right:      "1.75rem",
          zIndex:     "var(--z-top)",

          /* entrance + hide transitions */
          opacity:    isVisible ? 1 : 0,
          transform:  isVisible
            ? clicked
              ? "translateY(0) scale(0.92)"
              : hovered
                ? "translateY(-4px) scale(1.08)"
                : "translateY(0) scale(1)"
            : "translateY(24px) scale(0.9)",
          transition: `
            opacity   0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
            transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)
          `,
          pointerEvents: isVisible ? "auto" : "none",

          /* no default link styling */
          textDecoration: "none",
          display:        "block",
        }}
      >
        {/* ── Outer wrapper for tooltip + button ── */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>

          {/* ── Tooltip ── */}
          <div
            aria-hidden="true"
            style={{
              position:        "absolute",
              right:           "calc(100% + 14px)",
              top:             "50%",
              transform:       "translateY(-50%)",
              backgroundColor: "var(--color-surface)",
              borderRadius:    "var(--radius-lg)",
              padding:         "0.6rem 1rem",
              boxShadow:       "var(--shadow-lg)",
              border:          "1px solid var(--color-border)",
              whiteSpace:      "nowrap",
              pointerEvents:   "none",

              /* animate in/out */
              opacity:         hovered ? 1 : 0,
              transform:       hovered
                ? "translateY(-50%) translateX(0)"
                : "translateY(-50%) translateX(6px)",
              transition:      "opacity 0.22s ease, transform 0.22s ease",
            }}
          >
            {/* Tooltip text */}
            <p style={{
              fontFamily:  "var(--font-body)",
              fontSize:    "var(--text-sm)",
              fontWeight:  600,
              color:       "var(--color-text-primary)",
              margin:      0,
              lineHeight:  1.2,
            }}>
              Order via WhatsApp
            </p>
            <p style={{
              fontFamily:  "var(--font-body)",
              fontSize:    "var(--text-xs)",
              color:       "var(--color-text-muted)",
              margin:      "3px 0 0",
              lineHeight:  1,
            }}>
              Usually replies in minutes
            </p>

            {/* Arrow pointing right */}
            <span
              aria-hidden="true"
              style={{
                position:    "absolute",
                right:       "-7px",
                top:         "50%",
                transform:   "translateY(-50%)",
                width:       0,
                height:      0,
                borderTop:   "7px solid transparent",
                borderBottom: "7px solid transparent",
                borderLeft:  "7px solid var(--color-surface)",
                display:     "block",
              }}
            />
            {/* Arrow border (matches card border) */}
            <span
              aria-hidden="true"
              style={{
                position:    "absolute",
                right:       "-8px",
                top:         "50%",
                transform:   "translateY(-50%)",
                width:       0,
                height:      0,
                borderTop:   "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft:  `8px solid var(--color-border)`,
                display:     "block",
                zIndex:      -1,
              }}
            />
          </div>

          {/* ── Button circle ── */}
          <div style={{ position: "relative" }}>

            {/* Pulse ring 1 — slower, wider */}
            <span
              aria-hidden="true"
              style={{
                position:        "absolute",
                inset:           0,
                borderRadius:    "50%",
                backgroundColor: "var(--color-whatsapp)",
                opacity:         hovered ? 0 : 0.35,
                animation:       "whatsapp-pulse 2.8s ease-out infinite",
                transition:      "opacity 0.3s ease",
              }}
            />

            {/* Pulse ring 2 — faster, tighter */}
            <span
              aria-hidden="true"
              style={{
                position:        "absolute",
                inset:           0,
                borderRadius:    "50%",
                backgroundColor: "var(--color-whatsapp)",
                opacity:         hovered ? 0 : 0.20,
                animation:       "whatsapp-pulse 2.8s ease-out infinite 0.9s",
                transition:      "opacity 0.3s ease",
              }}
            />

            {/* Main circle */}
            <div style={{
              position:        "relative",
              width:           "58px",
              height:          "58px",
              borderRadius:    "50%",
              backgroundColor: "var(--color-whatsapp)",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              boxShadow:       hovered
                ? "0 8px 28px rgba(37, 211, 102, 0.55)"
                : "0 4px 16px rgba(37, 211, 102, 0.40)",
              transition:      "box-shadow 0.25s ease",
              /* subtle inner highlight ring */
              border:          "1.5px solid rgba(255,255,255,0.20)",
            }}>
              <WhatsAppIcon size={26} />
            </div>

          </div>
        </div>
      </a>

      {/* ════════════════════════════════════════════
          SCROLL-TO-TOP COMPANION BUTTON
          Appears after user scrolls past the hero
      ════════════════════════════════════════════ */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll back to top"
        style={{
          /* positioning — sits just above WhatsApp button */
          position:   "fixed",
          bottom:     "5.75rem",
          right:      "1.75rem",
          zIndex:     "var(--z-top)",

          /* visibility */
          opacity:    scrolled && !hidden ? 1 : 0,
          transform:  scrolled && !hidden
            ? "translateY(0) scale(1)"
            : "translateY(10px) scale(0.85)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          pointerEvents: scrolled && !hidden ? "auto" : "none",

          /* button style */
          width:           "40px",
          height:          "40px",
          borderRadius:    "50%",
          border:          "1.5px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
          boxShadow:       "var(--shadow-md)",
          cursor:          "pointer",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          color:           "var(--color-text-secondary)",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.backgroundColor = "var(--color-primary)";
          el.style.borderColor     = "var(--color-primary)";
          el.style.color           = "white";
          el.style.transform       = "translateY(-2px) scale(1)";
          el.style.boxShadow       = "var(--shadow-lg)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.backgroundColor = "var(--color-surface)";
          el.style.borderColor     = "var(--color-border)";
          el.style.color           = "var(--color-text-secondary)";
          el.style.transform       = "translateY(0) scale(1)";
          el.style.boxShadow       = "var(--shadow-md)";
        }}
      >
        {/* Up chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}