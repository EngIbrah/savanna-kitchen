"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Calendar, UtensilsCrossed, ChevronDown } from "lucide-react";

/* ─── Trust badges ──────────────────────────────── */
const BADGES = [
  { icon: "🌿", text: "Farm Fresh Daily"         },
  { icon: "⚡", text: "Ready in 20 Minutes"       },
  { icon: "📍", text: "Msasani, Dar es Salaam"    },
  { icon: "⭐", text: "Rated #1 in Dar es Salaam" },
];

/* ─── Background images — cycle through these ───── */
const BG_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80",
];

export default function HeroSection() {
  const [mounted,    setMounted]    = useState(false);
  const [bgIndex,    setBgIndex]    = useState(0);
  const [bgFading,   setBgFading]   = useState(false);
  const intervalRef                 = useRef<ReturnType<typeof setInterval>>();

  /* mount trigger — stagger entrance animations */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* background image crossfade cycle every 6s */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setBgFading(true);
      setTimeout(() => {
        setBgIndex(i => (i + 1) % BG_IMAGES.length);
        setBgFading(false);
      }, 700);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, []);

  /* scroll to next section */
  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      aria-label="Welcome to Savanna Kitchen"
      style={{
        position:       "relative",
        minHeight:      "100svh",       /* svh handles mobile browser chrome */
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        overflow:       "hidden",
      }}
    >

      {/* ══════════════════════════════════════════
          BACKGROUND — crossfade slideshow
      ══════════════════════════════════════════ */}
      {BG_IMAGES.map((src, i) => (
        <div
          key={src}
          aria-hidden="true"
          style={{
            position:           "absolute",
            inset:              0,
            backgroundImage:    `url('${src}')`,
            backgroundSize:     "cover",
            backgroundPosition: "center",
            backgroundRepeat:   "no-repeat",
            opacity:            i === bgIndex ? (bgFading ? 0 : 1) : 0,
            transition:         "opacity 700ms ease-in-out",
            /* subtle Ken Burns zoom */
            transform:          i === bgIndex ? "scale(1.04)" : "scale(1)",
            transitionProperty: "opacity, transform",
            transitionDuration: i === bgIndex ? "700ms, 8000ms" : "700ms, 0ms",
          }}
        />
      ))}

      {/* ── Gradient overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          inset:      0,
          background: `
            linear-gradient(
              135deg,
              rgba(28, 20, 10, 0.82) 0%,
              rgba(28, 20, 10, 0.55) 50%,
              rgba(44, 74, 62, 0.50) 100%
            )
          `,
        }}
      />

      {/* ── Bottom fade — blends into next section ── */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          bottom:     0,
          left:       0,
          right:      0,
          height:     "180px",
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.85))",
          zIndex:     2,
        }}
      />

      {/* ══════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════ */}
      <div
        style={{
          position:  "relative",
          zIndex:    3,
          textAlign: "center",
          padding:   "0 1.5rem",
          maxWidth:  "860px",
          margin:    "0 auto",
          /* push content up slightly so bottom fade doesn't hide it */
          paddingBottom: "6rem",
        }}
      >

        {/* ── Eyebrow label ── */}
        <div style={{
          opacity:   mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s",
        }}>
          <span style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            "0.6rem",
            fontFamily:     "var(--font-body)",
            fontSize:       "var(--text-xs)",
            fontWeight:     500,
            letterSpacing:  "var(--tracking-widest)",
            textTransform:  "uppercase",
            color:          "var(--color-accent)",
            marginBottom:   "1.5rem",
          }}>
            {/* Decorative lines either side of label */}
            <span style={{ display: "inline-block", width: "28px", height: "1px", backgroundColor: "var(--color-accent)", opacity: 0.6 }} />
            Est. 2024 &nbsp;•&nbsp; Dar es Salaam, Tanzania
            <span style={{ display: "inline-block", width: "28px", height: "1px", backgroundColor: "var(--color-accent)", opacity: 0.6 }} />
          </span>
        </div>

        {/* ── Main headline ── */}
        <div style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.7s ease 0.28s, transform 0.7s ease 0.28s",
          marginBottom: "1.5rem",
        }}>
          <h1 style={{
            fontFamily:  "var(--font-display)",
            fontWeight:  600,
            lineHeight:  "var(--leading-tight)",
            color:       "var(--color-text-light)",
            margin:      0,
            /* fluid font size: 44px → 72px */
            fontSize:    "clamp(2.75rem, 6vw, 4.5rem)",
          }}>
            Where African Flavors
            <br />
            <span style={{
              color:      "var(--color-accent)",
              fontStyle:  "italic",
              /* slightly larger for emphasis */
              fontSize:   "clamp(3rem, 7vw, 5rem)",
            }}>
              Come Alive
            </span>
          </h1>
        </div>

        {/* ── Subtitle ── */}
        <div style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.7s ease 0.46s, transform 0.7s ease 0.46s",
          marginBottom: "2.5rem",
        }}>
          <p style={{
            fontFamily:  "var(--font-body)",
            fontSize:    "clamp(1.05rem, 2.2vw, 1.3rem)",
            fontWeight:  400,
            lineHeight:  "var(--leading-relaxed)",
            color:       "rgba(245, 240, 232, 0.78)",
            maxWidth:    "520px",
            margin:      "0 auto",
          }}>
            Fresh ingredients, authentic recipes, and unforgettable dining
            experiences in the heart of Dar es Salaam.
          </p>
        </div>

        {/* ── CTA Buttons ── */}
        <div style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.7s ease 0.62s, transform 0.7s ease 0.62s",
          display:    "flex",
          flexWrap:   "wrap",
          gap:        "1rem",
          justifyContent: "center",
          marginBottom: "3rem",
        }}>
          {/* Primary CTA */}
          <Link
            href="/reservations"
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              gap:             "0.5rem",
              fontFamily:      "var(--font-body)",
              fontSize:        "var(--text-base)",
              fontWeight:      500,
              color:           "white",
              backgroundColor: "var(--color-primary)",
              borderRadius:    "var(--radius-full)",
              padding:         "0.9rem 2rem",
              textDecoration:  "none",
              boxShadow:       "var(--shadow-xl)",
              border:          "2px solid transparent",
              transition:      "all var(--transition-base)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "var(--color-primary-dark)";
              el.style.transform       = "translateY(-2px) scale(1.02)";
              el.style.boxShadow       = "var(--shadow-2xl)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "var(--color-primary)";
              el.style.transform       = "translateY(0) scale(1)";
              el.style.boxShadow       = "var(--shadow-xl)";
            }}
          >
            <Calendar size={17} />
            Reserve a Table
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/menu"
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              gap:             "0.5rem",
              fontFamily:      "var(--font-body)",
              fontSize:        "var(--text-base)",
              fontWeight:      500,
              color:           "white",
              backgroundColor: "transparent",
              borderRadius:    "var(--radius-full)",
              padding:         "0.9rem 2rem",
              textDecoration:  "none",
              border:          "2px solid rgba(255,255,255,0.55)",
              transition:      "all var(--transition-base)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor     = "rgba(255,255,255,0.9)";
              el.style.backgroundColor = "rgba(255,255,255,0.10)";
              el.style.transform       = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor     = "rgba(255,255,255,0.55)";
              el.style.backgroundColor = "transparent";
              el.style.transform       = "translateY(0)";
            }}
          >
            <UtensilsCrossed size={17} />
            View Our Menu
          </Link>
        </div>

        {/* ── Trust badges strip ── */}
        <div style={{
          opacity:    mounted ? 1 : 0,
          transform:  mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.80s, transform 0.7s ease 0.80s",
        }}>
          {/* Thin divider line */}
          <div style={{
            width:           "100%",
            maxWidth:        "360px",
            height:          "1px",
            backgroundColor: "rgba(255,255,255,0.12)",
            margin:          "0 auto 1.25rem",
          }} />

          <div style={{
            display:        "flex",
            flexWrap:       "wrap",
            justifyContent: "center",
            gap:            "0.5rem 1.75rem",
          }}>
            {BADGES.map(({ icon, text }) => (
              <span
                key={text}
                style={{
                  display:     "inline-flex",
                  alignItems:  "center",
                  gap:         "0.35rem",
                  fontFamily:  "var(--font-body)",
                  fontSize:    "1.0rem",
                  fontWeight:  600,
                  color:       "rgba(255, 255, 255, 0.85)",
                  letterSpacing: "0.03em",
                  whiteSpace:  "nowrap",
                }}
              >
                <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════
          SLIDESHOW DOTS — bottom center
      ══════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        style={{
          position:       "absolute",
          bottom:         "5.5rem",
          left:           "50%",
          transform:      "translateX(-50%)",
          zIndex:         4,
          display:        "flex",
          gap:            "6px",
          opacity:        mounted ? 1 : 0,
          transition:     "opacity 0.5s ease 1.2s",
        }}
      >
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setBgIndex(i)}
            aria-label={`Background image ${i + 1}`}
            style={{
              width:           i === bgIndex ? "20px" : "6px",
              height:          "6px",
              borderRadius:    "var(--radius-full)",
              border:          "none",
              cursor:          "pointer",
              padding:         0,
              backgroundColor: i === bgIndex
                ? "var(--color-accent)"
                : "rgba(255,255,255,0.35)",
              transition:      "all 0.4s ease",
            }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          SCROLL INDICATOR
      ══════════════════════════════════════════ */}
      <button
        onClick={scrollDown}
        aria-label="Scroll to content"
        style={{
          position:        "absolute",
          bottom:          "2rem",
          left:            "50%",
          transform:       "translateX(-50%)",
          zIndex:          4,
          background:      "none",
          border:          "none",
          cursor:          "pointer",
          padding:         "0.5rem",
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          gap:             "4px",
          opacity:         mounted ? 0.5 : 0,
          transition:      "opacity 0.5s ease 1.4s",
          animation:       "float 2.5s ease-in-out infinite",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.9"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "0.5"}
      >
        <span style={{
          fontFamily:    "var(--font-body)",
          fontSize:      "10px",
          letterSpacing: "var(--tracking-widest)",
          textTransform: "uppercase",
          color:         "white",
        }}>
          Scroll
        </span>
        <ChevronDown size={20} color="white" />
      </button>

    </section>
  );
}