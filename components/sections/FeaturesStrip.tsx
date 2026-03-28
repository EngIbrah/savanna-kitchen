"use client";
import { useEffect, useRef, useState } from "react";
import { Leaf, UtensilsCrossed, Zap, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Feature data ──────────────────────────────── */
type Feature = {
  icon:        LucideIcon;
  title:       string;
  description: string;
  stat:        string;
  statLabel:   string;
};

const FEATURES: Feature[] = [
  {
    icon:        Leaf,
    title:       "Farm Fresh Daily",
    description: "Ingredients sourced every morning from local Tanzanian farms and coastal markets — never frozen, always vibrant.",
    stat:        "100%",
    statLabel:   "Local sourcing",
  },
  {
    icon:        UtensilsCrossed,
    title:       "Authentic Recipes",
    description: "Traditional Swahili coast recipes passed down through generations, prepared exactly as they were meant to be.",
    stat:        "40+",
    statLabel:   "Heritage dishes",
  },
  {
    icon:        Zap,
    title:       "Fast Service",
    description: "Your order ready in under 20 minutes, guaranteed — whether you dine in or order directly via WhatsApp.",
    stat:        "<20",
    statLabel:   "Minutes to serve",
  },
  {
    icon:        MapPin,
    title:       "Heart of Dar",
    description: "Located in Msasani Peninsula with easy parking, outdoor seating and instant WhatsApp ordering for the whole area.",
    stat:        "5★",
    statLabel:   "Customer rating",
  },
];

/* ─── Single feature card ───────────────────────── */
function FeatureCard({
  feature,
  index,
  visible,
}: {
  feature: Feature;
  index:   number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        /* entrance animation */
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${index * 120}ms,
                     transform 0.65s ease ${index * 120}ms,
                     box-shadow 0.25s ease,
                     border-color 0.25s ease`,

        /* card base */
        backgroundColor: "var(--color-surface)",
        border:          `1.5px solid ${hovered ? "var(--color-primary)" : "var(--color-border)"}`,
        borderRadius:    "var(--radius-2xl)",
        padding:         "2rem",
        position:        "relative",
        overflow:        "hidden",
        cursor:          "default",

        /* shadow */
        boxShadow: hovered
          ? "var(--shadow-lg)"
          : "var(--shadow-sm)",

        /* lift on hover */
        marginTop: hovered ? "-4px" : "0px",
      }}
    >

      {/* ── Decorative corner accent ── */}
      <div
        aria-hidden="true"
        style={{
          position:        "absolute",
          top:             0,
          right:           0,
          width:           "80px",
          height:          "80px",
          background:      `radial-gradient(circle at top right,
            rgba(200, 121, 58, ${hovered ? "0.12" : "0.06"}) 0%,
            transparent 70%)`,
          transition:      "all 0.35s ease",
          borderRadius:    "0 var(--radius-2xl) 0 0",
        }}
      />

      {/* ── Top row: icon + stat ── */}
      <div style={{
        display:        "flex",
        alignItems:     "flex-start",
        justifyContent: "space-between",
        marginBottom:   "1.25rem",
      }}>

        {/* Icon circle */}
        <div style={{
          width:           "52px",
          height:          "52px",
          borderRadius:    "var(--radius-full)",
          backgroundColor: hovered
            ? "var(--color-primary)"
            : "rgba(200, 121, 58, 0.10)",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          transition:      "background-color 0.25s ease, transform 0.25s ease",
          transform:       hovered ? "rotate(-8deg) scale(1.08)" : "rotate(0deg) scale(1)",
          flexShrink:      0,
        }}>
          <Icon
            size={22}
            color={hovered ? "white" : "var(--color-primary)"}
            style={{ transition: "color 0.25s ease" }}
          />
        </div>

        {/* Stat pill — top right */}
        <div style={{
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "flex-end",
          gap:             "1px",
        }}>
          <span style={{
            fontFamily:  "var(--font-accent)",
            fontSize:    "1.4rem",
            fontWeight:  600,
            color:       hovered
              ? "var(--color-primary)"
              : "var(--color-text-secondary)",
            lineHeight:  1,
            transition:  "color 0.25s ease",
          }}>
            {feature.stat}
          </span>
          <span style={{
            fontFamily:    "var(--font-body)",
            fontSize:      "var(--text-xs)",
            color:         "var(--color-text-muted)",
            letterSpacing: "0.04em",
            whiteSpace:    "nowrap",
          }}>
            {feature.statLabel}
          </span>
        </div>
      </div>

      {/* ── Title ── */}
      <h3 style={{
        fontFamily:   "var(--font-display)",
        fontSize:     "var(--text-xl)",
        fontWeight:   600,
        color:        "var(--color-text-primary)",
        marginBottom: "0.6rem",
        lineHeight:   "var(--leading-snug)",
      }}>
        {feature.title}
      </h3>

      {/* ── Description ── */}
      <p style={{
        fontFamily:  "var(--font-body)",
        fontSize:    "var(--text-sm)",
        color:       "var(--color-text-secondary)",
        lineHeight:  "var(--leading-relaxed)",
        marginBottom: "1.5rem",
      }}>
        {feature.description}
      </p>

      {/* ── Bottom progress bar — decorative ── */}
      <div style={{
        position:        "absolute",
        bottom:          0,
        left:            0,
        right:           0,
        height:          "3px",
        backgroundColor: "var(--color-border-subtle)",
        overflow:        "hidden",
        borderRadius:    "0 0 var(--radius-2xl) var(--radius-2xl)",
      }}>
        <div style={{
          height:          "100%",
          backgroundColor: "var(--color-primary)",
          borderRadius:    "var(--radius-full)",
          width:           hovered ? "100%" : "0%",
          transition:      "width 0.4s ease",
        }} />
      </div>

    </article>
  );
}

/* ─── Section ───────────────────────────────────── */
export default function FeaturesStrip() {
  const sectionRef              = useRef<HTMLElement>(null);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Why choose Savanna Kitchen"
      style={{
        backgroundColor: "var(--color-background)",
        paddingTop:      "5rem",
        paddingBottom:   "5rem",
      }}
    >
      <div className="container">

        {/* ── Section header ── */}
        <div
          className="section-header"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.65s ease, transform 0.65s ease",
          }}
        >
          <span className="label">— Why Choose Us —</span>
          <h2>The Savanna Difference</h2>
          <div className="heading-underline" />
          <p>
            Every detail crafted to give you the most authentic,
            delicious and effortless Tanzanian dining experience.
          </p>
        </div>

        {/* ── Cards grid ── */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap:                 "1.5rem",
        }}>
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={i}
              visible={visible}
            />
          ))}
        </div>

        {/* ── Bottom trust strip ── */}
        <div
          style={{
            marginTop:      "3.5rem",
            padding:        "1.25rem 2rem",
            backgroundColor: "var(--color-secondary)",
            borderRadius:   "var(--radius-2xl)",
            display:        "flex",
            flexWrap:       "wrap",
            alignItems:     "center",
            justifyContent: "center",
            gap:            "0.5rem 2.5rem",
            opacity:        visible ? 1 : 0,
            transform:      visible ? "translateY(0)" : "translateY(16px)",
            transition:     "opacity 0.65s ease 0.5s, transform 0.65s ease 0.5s",
          }}
        >
          {[
            "🍽️  Dine In",
            "📦  Takeaway",
            "📱  WhatsApp Orders",
            "🎉  Private Events",
            "🌿  Vegetarian Options",
          ].map((item) => (
            <span
              key={item}
              style={{
                fontFamily:    "var(--font-body)",
                fontSize:      "var(--text-sm)",
                color:         "rgba(245, 240, 232, 0.75)",
                whiteSpace:    "nowrap",
                letterSpacing: "0.02em",
              }}
            >
              {item}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}