"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Calendar, MessageCircle, Clock, Users, Star } from "lucide-react";

/* ─── Quick reassurance items ───────────────────── */
const REASSURANCES = [
  { icon: Clock,   text: "Confirmed within 30 min" },
  { icon: Users,   text: "Groups up to 50 welcome"  },
  { icon: Star,    text: "Special events catered"   },
];

const WHATSAPP_NUMBER = "255700000000";

export default function ReservationCTA() {
  const sectionRef            = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  /* intersection observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* preload background image so it doesn't pop in */
  useEffect(() => {
    const img = new window.Image();
    img.src   = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=85";
    img.onload = () => setImgLoaded(true);
  }, []);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello Savanna Kitchen! 🍽️ I'd like to make a reservation."
  )}`;

  return (
    <section
      ref={sectionRef}
      aria-label="Make a reservation"
      style={{
        position:   "relative",
        overflow:   "hidden",
        paddingTop: "8rem",
        paddingBottom: "8rem",
      }}
    >

      {/* ══════════════════════════════════════════
          BACKGROUND
      ══════════════════════════════════════════ */}

      {/* Solid fallback color while image loads */}
      <div style={{
        position:        "absolute",
        inset:           0,
        backgroundColor: "var(--color-secondary)",
      }} />

      {/* Background image — fades in when loaded */}
      <div
        aria-hidden="true"
        style={{
          position:           "absolute",
          inset:              0,
          backgroundImage:    `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=85')`,
          backgroundSize:     "cover",
          backgroundPosition: "center",
          /* subtle Ken Burns */
          transform:          visible ? "scale(1.04)" : "scale(1)",
          transition:         "transform 10s ease, opacity 0.8s ease",
          opacity:            imgLoaded ? 1 : 0,
        }}
      />

      {/* Multi-layer overlay — left heavy for legibility */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset:    0,
          background: `
            linear-gradient(
              105deg,
              rgba(26, 20, 10, 0.92) 0%,
              rgba(26, 20, 10, 0.72) 45%,
              rgba(44, 74, 62, 0.60) 100%
            )
          `,
        }}
      />

      {/* Bottom fade — blends into footer */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          bottom:     0,
          left:       0,
          right:      0,
          height:     "120px",
          background: "linear-gradient(to bottom, transparent, rgba(26,20,10,0.40))",
          pointerEvents: "none",
        }}
      />

      {/* Decorative grain texture */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          inset:      0,
          opacity:    0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          pointerEvents: "none",
        }}
      />

      {/* ══════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════ */}
      <div
        className="container"
        style={{
          position:      "relative",
          zIndex:        2,
          textAlign:     "center",
          maxWidth:      "760px",
          margin:        "0 auto",
        }}
      >

        {/* ── Eyebrow label ── */}
        <div style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.65s ease 0.05s, transform 0.65s ease 0.05s",
          marginBottom: "1.5rem",
        }}>
          <span style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           "0.6rem",
            fontFamily:    "var(--font-body)",
            fontSize:      "var(--text-xs)",
            fontWeight:    500,
            letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase",
            color:         "var(--color-accent)",
          }}>
            <span style={{ display: "inline-block", width: "24px", height: "1px", backgroundColor: "var(--color-accent)", opacity: 0.6 }} />
            Reserve Your Spot
            <span style={{ display: "inline-block", width: "24px", height: "1px", backgroundColor: "var(--color-accent)", opacity: 0.6 }} />
          </span>
        </div>

        {/* ── Headline ── */}
        <div style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease 0.18s, transform 0.7s ease 0.18s",
          marginBottom: "1.25rem",
        }}>
          <h2 style={{
            fontFamily:  "var(--font-display)",
            fontSize:    "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight:  600,
            color:       "var(--color-text-light)",
            lineHeight:  "var(--leading-tight)",
            margin:      0,
          }}>
            Ready for an Unforgettable
            <br />
            <span style={{
              color:     "var(--color-accent)",
              fontStyle: "italic",
            }}>
              Dining Experience?
            </span>
          </h2>
        </div>

        {/* ── Subtitle ── */}
        <div style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease 0.32s, transform 0.7s ease 0.32s",
          marginBottom: "2.75rem",
        }}>
          <p style={{
            fontFamily:  "var(--font-body)",
            fontSize:    "clamp(1rem, 2vw, 1.15rem)",
            fontWeight:  300,
            color:       "rgba(245, 240, 232, 0.72)",
            lineHeight:  "var(--leading-relaxed)",
            maxWidth:    "520px",
            margin:      "0 auto",
          }}>
            Book your table now and let us prepare a memorable meal
            for you, your family, or your whole team.
          </p>
        </div>

        {/* ── CTA Buttons ── */}
        <div style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease 0.46s, transform 0.7s ease 0.46s",
          display:    "flex",
          flexWrap:   "wrap",
          gap:        "1rem",
          justifyContent: "center",
          marginBottom: "3rem",
        }}>

          {/* Primary — Reserve */}
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
              padding:         "1rem 2.25rem",
              textDecoration:  "none",
              border:          "2px solid transparent",
              boxShadow:       "var(--shadow-xl)",
              transition:      "all var(--transition-base)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "var(--color-primary-dark)";
              el.style.transform       = "translateY(-3px) scale(1.02)";
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

          {/* Secondary — WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
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
              padding:         "1rem 2.25rem",
              textDecoration:  "none",
              border:          "2px solid rgba(255,255,255,0.45)",
              transition:      "all var(--transition-base)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "var(--color-whatsapp)";
              el.style.borderColor     = "var(--color-whatsapp)";
              el.style.transform       = "translateY(-3px)";
              el.style.boxShadow       = "var(--shadow-lg)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "transparent";
              el.style.borderColor     = "rgba(255,255,255,0.45)";
              el.style.transform       = "translateY(0)";
              el.style.boxShadow       = "none";
            }}
          >
            <MessageCircle size={17} />
            WhatsApp Us
          </a>

        </div>

        {/* ── Reassurance strip ── */}
        <div style={{
          opacity:    visible ? 1 : 0,
          transition: "opacity 0.7s ease 0.62s",
        }}>

          {/* Thin divider */}
          <div style={{
            width:           "100%",
            maxWidth:        "320px",
            height:          "1px",
            backgroundColor: "rgba(255,255,255,0.10)",
            margin:          "0 auto 1.5rem",
          }} />

          <div style={{
            display:        "flex",
            flexWrap:       "wrap",
            justifyContent: "center",
            gap:            "0.5rem 2rem",
          }}>
            {REASSURANCES.map(({ icon: Icon, text }) => (
              <span
                key={text}
                style={{
                  display:     "inline-flex",
                  alignItems:  "center",
                  gap:         "0.4rem",
                  fontFamily:  "var(--font-body)",
                  fontSize:    "var(--text-xs)",
                  color:       "rgba(245, 240, 232, 0.50)",
                  whiteSpace:  "nowrap",
                  letterSpacing: "0.02em",
                }}
              >
                <Icon size={13} color="var(--color-accent)" />
                {text}
              </span>
            ))}
          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════
          FLOATING AMBIENT ORBS — decorative
      ══════════════════════════════════════════ */}
      {[
        { size: 320, top: "-80px",  left: "-100px", opacity: 0.06 },
        { size: 240, bottom: "-60px", right: "-80px", opacity: 0.05 },
      ].map((orb, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position:        "absolute",
            width:           `${orb.size}px`,
            height:          `${orb.size}px`,
            borderRadius:    "50%",
            backgroundColor: "var(--color-primary)",
            top:             orb.top,
            left:            orb.left,
            bottom:          orb.bottom,
            right:           orb.right,
            opacity:         orb.opacity,
            filter:          "blur(60px)",
            pointerEvents:   "none",
            animation:       "float 6s ease-in-out infinite",
            animationDelay:  `${i * 2}s`,
          }}
        />
      ))}

    </section>
  );
}