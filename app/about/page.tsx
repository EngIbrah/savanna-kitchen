"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2, Calendar, Leaf,
  Users, Award, MapPin,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const VALUES = [
  {
    icon:  Leaf,
    title: "Farm to Table",
    desc:  "Every ingredient sourced directly from Tanzanian farms within 24 hours of serving — nothing frozen, nothing imported unnecessarily.",
  },
  {
    icon:  CheckCircle2,
    title: "Authentic Recipes",
    desc:  "Traditional Swahili coast recipes passed down through generations, never compromised, never modernised for convenience.",
  },
  {
    icon:  Users,
    title: "Community First",
    desc:  "We employ locally, source locally, and actively give back to the Dar es Salaam community through partnerships and events.",
  },
  {
    icon:  Award,
    title: "Zero Waste Kitchen",
    desc:  "Committed to sustainable cooking practices, responsible sourcing, and reducing food waste every single day.",
  },
];

const TEAM = [
  {
    name:  "Chef Amina Juma",
    role:  "Head Chef & Co-founder",
    bio:   "20 years crafting authentic Swahili flavors. Trained in Zanzibar, heart in Dar.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=85",
  },
  {
    name:  "Omar Salim",
    role:  "Sous Chef — Grills & Roasts",
    bio:   "Master of the open flame. Omar's nyama choma is the reason guests come back.",
    image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=500&q=85",
  },
  {
    name:  "Fatuma Hassan",
    role:  "Pastry & Desserts Chef",
    bio:   "Turning traditional sweets into modern art. Kaimati will never be the same.",
    image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=500&q=85",
  },
];

const STATS = [
  { value: "2024",  label: "Founded"          },
  { value: "10+",   label: "Years Experience" },
  { value: "40+",   label: "Menu Items"       },
  { value: "500+",  label: "Happy Guests"     },
];

/* ═══════════════════════════════════════════════════
   HOOK — scroll reveal
═══════════════════════════════════════════════════ */
function useReveal(threshold = 0.15) {
  const ref     = useRef<HTMLElement>(null);
  const [v, sv] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) sv(true); },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible: v };
}

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */
export default function AboutPage() {
  const story      = useReveal();
  const statsSection = useReveal();
  const vals       = useReveal(0.12);
  const teamSec    = useReveal(0.1);

  return (
    <div style={{
      minHeight:       "100vh",
      backgroundColor: "var(--color-background)",
    }}>

      {/* ══════════════════════════════════════════
          PAGE HERO
      ══════════════════════════════════════════ */}
      <div style={{
        position:           "relative",
        height:             "clamp(240px, 38vw, 360px)",
        display:            "flex",
        alignItems:         "flex-end",
        justifyContent:     "center",
        paddingBottom:      "2.75rem",
        backgroundImage:    "url('https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1600&q=85')",
        backgroundSize:     "cover",
        backgroundPosition: "center",
        overflow:           "hidden",
      }}>
        <div style={{
          position:   "absolute",
          inset:      0,
          background: "linear-gradient(to bottom, rgba(28,20,10,0.35) 0%, rgba(28,20,10,0.82) 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <span style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           "0.5rem",
            fontFamily:    "var(--font-body)",
            fontSize:      "var(--text-xs)",
            fontWeight:    500,
            letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase",
            color:         "var(--color-accent)",
            marginBottom:  "0.65rem",
          }}>
            <span style={{ display: "inline-block", width: "20px", height: "1px", backgroundColor: "var(--color-accent)", opacity: 0.6 }} />
            Our Story
            <span style={{ display: "inline-block", width: "20px", height: "1px", backgroundColor: "var(--color-accent)", opacity: 0.6 }} />
          </span>
          <h1 style={{
            display:    "block",
            fontFamily: "var(--font-display)",
            fontSize:   "clamp(2.8rem, 7vw, 4.5rem)",
            fontWeight: 600,
            color:      "var(--color-text-light)",
            lineHeight: "var(--leading-tight)",
            margin:     0,
          }}>
            About Us
          </h1>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STORY SECTION
      ══════════════════════════════════════════ */}
      <section
        ref={story.ref}
        style={{
          paddingTop:    "6rem",
          paddingBottom: "6rem",
        }}
      >
        <div
          className="container"
          style={{
            display:       "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap:           "4rem",
            alignItems:    "center",
          }}
        >

          {/* ── Left: image stack ── */}
          <div style={{
            position:   "relative",
            opacity:    story.visible ? 1 : 0,
            transform:  story.visible ? "translateX(0)" : "translateX(-32px)",
            transition: "opacity 0.75s ease, transform 0.75s ease",
          }}>
            {/* Main image */}
            <div style={{
              position:     "relative",
              height:       "clamp(320px, 45vw, 520px)",
              borderRadius: "var(--radius-2xl)",
              overflow:     "hidden",
              boxShadow:    "var(--shadow-xl)",
            }}>
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=85"
                alt="Savanna Kitchen interior"
                fill
                className="object-cover"
                style={{ transition: "transform 6s ease" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
              />
              {/* Inner warm overlay */}
              <div style={{
                position:   "absolute",
                inset:      0,
                background: "linear-gradient(135deg, rgba(200,121,58,0.08) 0%, transparent 60%)",
                pointerEvents: "none",
              }} />
            </div>

            {/* Decorative offset frame */}
            <div
              aria-hidden="true"
              style={{
                position:     "absolute",
                top:          "1.5rem",
                left:         "-1.25rem",
                right:        "1.25rem",
                bottom:       "-1.25rem",
                border:       "2px solid var(--color-border)",
                borderRadius: "var(--radius-2xl)",
                zIndex:       -1,
                pointerEvents: "none",
              }}
            />

            {/* Floating stat card */}
            <div style={{
              position:        "absolute",
              bottom:          "-1.5rem",
              right:           "-1.5rem",
              backgroundColor: "var(--color-surface)",
              borderRadius:    "var(--radius-2xl)",
              padding:         "1.25rem 1.5rem",
              boxShadow:       "var(--shadow-xl)",
              border:          "1px solid var(--color-border)",
              animation:       "float 4s ease-in-out infinite",
              zIndex:          2,
            }}>
              <p style={{
                fontFamily:   "var(--font-accent)",
                fontSize:     "2.2rem",
                fontWeight:   600,
                color:        "var(--color-primary)",
                lineHeight:   1,
                marginBottom: "0.2rem",
              }}>
                10+
              </p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize:   "var(--text-xs)",
                color:      "var(--color-text-secondary)",
                lineHeight: "var(--leading-snug)",
              }}>
                Years of authentic<br />Tanzanian cooking
              </p>
            </div>

            {/* Location badge */}
            <div style={{
              position:        "absolute",
              top:             "1.25rem",
              left:            "1.25rem",
              display:         "inline-flex",
              alignItems:      "center",
              gap:             "0.4rem",
              backgroundColor: "rgba(26,20,10,0.70)",
              backdropFilter:  "blur(8px)",
              borderRadius:    "var(--radius-full)",
              padding:         "0.4rem 0.9rem",
              zIndex:          2,
            }}>
              <MapPin size={12} color="var(--color-accent)" />
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize:   "var(--text-xs)",
                color:      "rgba(245,240,232,0.85)",
                fontWeight: 500,
              }}>
                Msasani, Dar es Salaam
              </span>
            </div>
          </div>

          {/* ── Right: content ── */}
          <div style={{
            opacity:    story.visible ? 1 : 0,
            transform:  story.visible ? "translateX(0)" : "translateX(32px)",
            transition: "opacity 0.75s ease 0.18s, transform 0.75s ease 0.18s",
          }}>
            <span style={{
              display:       "block",
              fontFamily:    "var(--font-body)",
              fontSize:      "var(--text-xs)",
              fontWeight:    500,
              letterSpacing: "var(--tracking-widest)",
              textTransform: "uppercase",
              color:         "var(--color-primary)",
              marginBottom:  "0.85rem",
            }}>
              — Who We Are —
            </span>

            <h2 style={{
              fontFamily:   "var(--font-display)",
              fontSize:     "clamp(2rem, 4vw, 3rem)",
              fontWeight:   600,
              color:        "var(--color-text-primary)",
              lineHeight:   "var(--leading-tight)",
              marginBottom: "1.5rem",
            }}>
              Born from the Heart of{" "}
              <span style={{
                color:     "var(--color-primary)",
                fontStyle: "italic",
              }}>
                Tanzania
              </span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.75rem" }}>
              {[
                "Savanna Kitchen was born from a simple belief — that Tanzania's rich culinary heritage deserves to be celebrated. Founded in 2024 by Chef Amina Juma, our restaurant is a love letter to the flavors of the Swahili coast.",
                "Every dish on our menu tells a story. From the fragrant pilau of Zanzibar to the smoky nyama choma of the mainland, we draw inspiration from every corner of this beautiful country.",
                "Located in the heart of Msasani, Savanna Kitchen is more than a restaurant — it's a gathering place for families, friends, and anyone who appreciates the magic of real Tanzanian food.",
              ].map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily:  "var(--font-body)",
                    fontSize:    "var(--text-base)",
                    color:       "var(--color-text-secondary)",
                    lineHeight:  "var(--leading-relaxed)",
                    margin:      0,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Blockquote */}
            <blockquote style={{
              borderLeft:   "4px solid var(--color-primary)",
              paddingLeft:  "1.25rem",
              marginBottom: "2rem",
              marginLeft:   0,
              marginRight:  0,
            }}>
              <p style={{
                fontFamily:  "var(--font-accent)",
                fontSize:    "1.2rem",
                fontStyle:   "italic",
                color:       "var(--color-text-primary)",
                lineHeight:  "var(--leading-relaxed)",
                marginBottom: "0.5rem",
              }}>
                "Food is the thread that connects us to our roots, our people, and our land."
              </p>
              <cite style={{
                fontFamily:  "var(--font-body)",
                fontSize:    "var(--text-sm)",
                color:       "var(--color-text-muted)",
                fontStyle:   "normal",
                display:     "block",
              }}>
                — Chef Amina Juma, Head Chef & Co-founder
              </cite>
            </blockquote>

            {/* CTA buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <Link
                href="/reservations"
                style={{
                  display:         "inline-flex",
                  alignItems:      "center",
                  gap:             "0.45rem",
                  fontFamily:      "var(--font-body)",
                  fontSize:        "var(--text-sm)",
                  fontWeight:      500,
                  color:           "white",
                  backgroundColor: "var(--color-primary)",
                  borderRadius:    "var(--radius-full)",
                  padding:         "0.8rem 1.75rem",
                  textDecoration:  "none",
                  boxShadow:       "var(--shadow-md)",
                  transition:      "all var(--transition-base)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = "var(--color-primary-dark)";
                  el.style.transform       = "translateY(-2px)";
                  el.style.boxShadow       = "var(--shadow-lg)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = "var(--color-primary)";
                  el.style.transform       = "translateY(0)";
                  el.style.boxShadow       = "var(--shadow-md)";
                }}
              >
                <Calendar size={15} />
                Reserve a Table
              </Link>

              <Link
                href="/menu"
                style={{
                  display:         "inline-flex",
                  alignItems:      "center",
                  gap:             "0.45rem",
                  fontFamily:      "var(--font-body)",
                  fontSize:        "var(--text-sm)",
                  fontWeight:      500,
                  color:           "var(--color-primary)",
                  backgroundColor: "transparent",
                  borderRadius:    "var(--radius-full)",
                  padding:         "0.8rem 1.75rem",
                  textDecoration:  "none",
                  border:          "1.5px solid var(--color-primary)",
                  transition:      "all var(--transition-base)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = "var(--color-primary)";
                  el.style.color           = "white";
                  el.style.transform       = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.backgroundColor = "transparent";
                  el.style.color           = "var(--color-primary)";
                  el.style.transform       = "translateY(0)";
                }}
              >
                View Our Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════ */}
      <section
        ref={statsSection.ref}
        style={{
          backgroundColor: "var(--color-primary)",
          paddingTop:      "3.5rem",
          paddingBottom:   "3.5rem",
        }}
      >
        <div className="container">
          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap:                 "2rem",
            textAlign:           "center",
          }}>
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  opacity:    statsSection.visible ? 1 : 0,
                  transform:  statsSection.visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.55s ease ${i * 100}ms, transform 0.55s ease ${i * 100}ms`,
                }}
              >
                <p style={{
                  fontFamily:   "var(--font-accent)",
                  fontSize:     "clamp(2rem, 4vw, 2.75rem)",
                  fontWeight:   600,
                  color:        "white",
                  lineHeight:   1,
                  marginBottom: "0.3rem",
                }}>
                  {s.value}
                </p>
                <p style={{
                  fontFamily:    "var(--font-body)",
                  fontSize:      "var(--text-xs)",
                  color:         "rgba(255,255,255,0.72)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-wider)",
                }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VALUES SECTION
      ══════════════════════════════════════════ */}
      <section
        ref={vals.ref}
        style={{
          backgroundColor: "var(--color-secondary)",
          paddingTop:      "6rem",
          paddingBottom:   "6rem",
          position:        "relative",
          overflow:        "hidden",
        }}
      >
        {/* Dot texture */}
        <div aria-hidden="true" style={{
          position:        "absolute",
          inset:           0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize:  "24px 24px",
          pointerEvents:   "none",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div
            className="section-header section-header--light"
            style={{
              opacity:    vals.visible ? 1 : 0,
              transform:  vals.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.65s ease, transform 0.65s ease",
            }}
          >
            <span className="label" style={{ color: "var(--color-accent)" }}>
              — What We Stand For —
            </span>
            <h2>Our Values</h2>
            <div
              className="heading-underline"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <p>
              The principles that guide every ingredient we choose,
              every dish we prepare, and every guest we welcome.
            </p>
          </div>

          {/* Value cards grid */}
          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap:                 "1.25rem",
          }}>
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  style={{
                    display:         "flex",
                    gap:             "1rem",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    backdropFilter:  "blur(8px)",
                    borderRadius:    "var(--radius-2xl)",
                    padding:         "1.75rem",
                    border:          "1px solid rgba(255,255,255,0.09)",
                    opacity:         vals.visible ? 1 : 0,
                    transform:       vals.visible ? "translateY(0)" : "translateY(28px)",
                    transition:      `opacity 0.6s ease ${i * 110}ms, transform 0.6s ease ${i * 110}ms`,
                    cursor:          "default",
                  }}
                >
                  {/* Icon circle */}
                  <div style={{
                    width:           "44px",
                    height:          "44px",
                    borderRadius:    "var(--radius-full)",
                    backgroundColor: "rgba(232,184,75,0.15)",
                    border:          "1px solid rgba(232,184,75,0.25)",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    flexShrink:      0,
                    marginTop:       "2px",
                  }}>
                    <Icon size={20} color="var(--color-accent)" />
                  </div>

                  <div>
                    <h3 style={{
                      fontFamily:   "var(--font-display)",
                      fontSize:     "var(--text-lg)",
                      fontWeight:   600,
                      color:        "var(--color-text-light)",
                      marginBottom: "0.5rem",
                      lineHeight:   "var(--leading-snug)",
                    }}>
                      {v.title}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize:   "var(--text-sm)",
                      color:      "rgba(245,240,232,0.62)",
                      lineHeight: "var(--leading-relaxed)",
                    }}>
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TEAM SECTION
      ══════════════════════════════════════════ */}
      <section
        ref={teamSec.ref}
        style={{
          backgroundColor: "var(--color-surface)",
          paddingTop:      "6rem",
          paddingBottom:   "6rem",
        }}
      >
        <div className="container">
          {/* Header */}
          <div
            className="section-header"
            style={{
              opacity:    teamSec.visible ? 1 : 0,
              transform:  teamSec.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.65s ease, transform 0.65s ease",
            }}
          >
            <span className="label">— The People Behind The Food —</span>
            <h2>Meet Our Team</h2>
            <div className="heading-underline" />
            <p>
              The passionate chefs and creatives who make Savanna Kitchen
              what it is — every single day.
            </p>
          </div>

          {/* Team cards */}
          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap:                 "2rem",
          }}>
            {TEAM.map((member, i) => {
              const [hovered,   setHovered]   = useState(false);
              const [imgLoaded, setImgLoaded] = useState(false);

              return (
                <article
                  key={member.name}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  style={{
                    textAlign:  "center",
                    opacity:    teamSec.visible ? 1 : 0,
                    transform:  teamSec.visible ? "translateY(0)" : "translateY(32px)",
                    transition: `opacity 0.6s ease ${i * 130}ms, transform 0.6s ease ${i * 130}ms`,
                    cursor:     "default",
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    position:     "relative",
                    width:        "176px",
                    height:       "176px",
                    margin:       "0 auto 1.25rem",
                  }}>
                    {/* Border ring — animates to primary on hover */}
                    <div style={{
                      position:     "absolute",
                      inset:        "-4px",
                      borderRadius: "50%",
                      border:       `3px solid ${hovered
                        ? "var(--color-primary)"
                        : "var(--color-border)"}`,
                      transition:   "border-color 0.3s ease",
                    }} />

                    {/* Accent dot */}
                    <div style={{
                      position:        "absolute",
                      bottom:          "8px",
                      right:           "8px",
                      width:           "16px",
                      height:          "16px",
                      borderRadius:    "50%",
                      backgroundColor: hovered
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                      border:          "2px solid var(--color-surface)",
                      transition:      "background-color 0.3s ease",
                      zIndex:          1,
                    }} />

                    {/* Image */}
                    <div style={{
                      width:        "100%",
                      height:       "100%",
                      borderRadius: "50%",
                      overflow:     "hidden",
                    }}>
                      {!imgLoaded && (
                        <div className="skeleton" style={{
                          width:  "100%",
                          height: "100%",
                          borderRadius: "50%",
                        }} />
                      )}
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="176px"
                        className="object-cover"
                        onLoad={() => setImgLoaded(true)}
                        style={{
                          transform:  hovered ? "scale(1.06)" : "scale(1)",
                          transition: "transform 0.5s ease",
                          opacity:    imgLoaded ? 1 : 0,
                        }}
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <h3 style={{
                    fontFamily:   "var(--font-display)",
                    fontSize:     "var(--text-xl)",
                    fontWeight:   600,
                    color:        "var(--color-text-primary)",
                    marginBottom: "0.25rem",
                    lineHeight:   "var(--leading-snug)",
                    transition:   "color 0.3s ease",
                    ...(hovered && { color: "var(--color-primary)" }),
                  }}>
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p style={{
                    fontFamily:   "var(--font-body)",
                    fontSize:     "var(--text-sm)",
                    color:        "var(--color-text-muted)",
                    marginBottom: "0.65rem",
                    fontWeight:   500,
                  }}>
                    {member.role}
                  </p>

                  {/* Bio — slides in on hover */}
                  <p style={{
                    fontFamily:  "var(--font-body)",
                    fontSize:    "var(--text-xs)",
                    color:       "var(--color-text-secondary)",
                    lineHeight:  "var(--leading-relaxed)",
                    maxWidth:    "220px",
                    margin:      "0 auto",
                    opacity:     hovered ? 1 : 0,
                    transform:   hovered ? "translateY(0)" : "translateY(6px)",
                    transition:  "opacity 0.3s ease, transform 0.3s ease",
                  }}>
                    {member.bio}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA BAND
      ══════════════════════════════════════════ */}
      <section style={{
        backgroundColor: "var(--color-background)",
        borderTop:       "1px solid var(--color-border)",
        paddingTop:      "4rem",
        paddingBottom:   "4rem",
        textAlign:       "center",
      }}>
        <div className="container" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h3 style={{
            fontFamily:   "var(--font-display)",
            fontSize:     "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight:   600,
            color:        "var(--color-text-primary)",
            marginBottom: "0.75rem",
          }}>
            Come Experience It Yourself
          </h3>
          <p style={{
            fontFamily:   "var(--font-body)",
            fontSize:     "var(--text-base)",
            color:        "var(--color-text-secondary)",
            lineHeight:   "var(--leading-relaxed)",
            marginBottom: "2rem",
          }}>
            Words can only go so far. The real Savanna Kitchen experience
            is at the table — book yours today.
          </p>
          <div style={{
            display:        "flex",
            flexWrap:       "wrap",
            gap:            "1rem",
            justifyContent: "center",
          }}>
            <Link
              href="/reservations"
              style={{
                display:         "inline-flex",
                alignItems:      "center",
                gap:             "0.45rem",
                fontFamily:      "var(--font-body)",
                fontSize:        "var(--text-base)",
                fontWeight:      500,
                color:           "white",
                backgroundColor: "var(--color-primary)",
                borderRadius:    "var(--radius-full)",
                padding:         "0.9rem 2rem",
                textDecoration:  "none",
                boxShadow:       "var(--shadow-md)",
                transition:      "all var(--transition-base)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--color-primary-dark)";
                el.style.transform       = "translateY(-2px)";
                el.style.boxShadow       = "var(--shadow-lg)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--color-primary)";
                el.style.transform       = "translateY(0)";
                el.style.boxShadow       = "var(--shadow-md)";
              }}
            >
              <Calendar size={16} />
              Book a Table
            </Link>
            <Link
              href="/gallery"
              style={{
                display:         "inline-flex",
                alignItems:      "center",
                gap:             "0.45rem",
                fontFamily:      "var(--font-body)",
                fontSize:        "var(--text-base)",
                fontWeight:      500,
                color:           "var(--color-text-secondary)",
                backgroundColor: "transparent",
                borderRadius:    "var(--radius-full)",
                padding:         "0.9rem 2rem",
                textDecoration:  "none",
                border:          "1.5px solid var(--color-border)",
                transition:      "all var(--transition-base)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--color-primary)";
                el.style.color       = "var(--color-primary)";
                el.style.transform   = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--color-border)";
                el.style.color       = "var(--color-text-secondary)";
                el.style.transform   = "translateY(0)";
              }}
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}