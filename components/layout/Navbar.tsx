"use client";
import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf, Calendar } from "lucide-react";

/* ─── Navigation links ──────────────────────────── */
const NAV_LINKS = [
  { href: "/",          label: "Home"    },
  { href: "/menu",      label: "Menu"    },
  { href: "/about",     label: "About"   },
  //{ href: "/gallery",   label: "Gallery" },
  { href: "/contact",   label: "Contact" },
];

/* ─── Types ─────────────────────────────────────── */
type Lang = "en" | "sw";

export default function Navbar() {
  const pathname               = usePathname();
  const isHome                 = pathname === "/";
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [lang,        setLang]        = useState<Lang>("en");

  /* scroll listener */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* close mobile menu on route change */
  useLayoutEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* ── derived state ── */
  const isTransparent = isHome && !scrolled;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ════════════════════════════════════════════
          DESKTOP / TABLET NAVBAR
      ════════════════════════════════════════════ */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position:   "fixed",
          top:        0,
          left:       0,
          right:      0,
          zIndex:     "var(--z-navbar)",
          height:     "var(--navbar-height)",
          transition: "background-color 350ms ease, box-shadow 350ms ease, backdrop-filter 350ms ease",
          backgroundColor: isTransparent
            ? "transparent"
            : "var(--color-background)",
          boxShadow: isTransparent
            ? "none"
            : "var(--shadow-sm)",
          borderBottom: isTransparent
            ? "none"
            : "1px solid var(--color-border)",
          backdropFilter: isTransparent ? "none" : "blur(12px)",
        }}
      >
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* ── Logo ── */}
          <Link
            href="/"
            aria-label="Savanna Kitchen — Home"
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "0.5rem",
              textDecoration: "none",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width:           "34px",
                height:          "34px",
                borderRadius:    "50%",
                backgroundColor: "var(--color-primary)",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                transition:      "transform var(--transition-spring), box-shadow var(--transition-base)",
                boxShadow:       "var(--shadow-md)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform  = "scale(1.12) rotate(-8deg)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform  = "scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
              }}
            >
              <Leaf size={16} color="white" />
            </div>
            {/* Wordmark */}
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize:   "1.2rem",
              fontWeight: 600,
              color:      "var(--color-primary)",
              lineHeight: 1,
            }}>
              Savanna
            </span>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize:   "0.8rem",
              fontWeight: 300,
              color:      isTransparent
                ? "var(--color-text-light)"
                : "var(--color-text-secondary)",
              transition: "color var(--transition-base)",
              letterSpacing: "0.04em",
            }}>
              Kitchen
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: "2rem" }}
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="nav-link"
                  style={{
                    fontFamily:  "var(--font-body)",
                    fontSize:    "var(--text-sm)",
                    fontWeight:  active ? 600 : 400,
                    color: active
                      ? "var(--color-primary)"
                      : isTransparent
                        ? "var(--color-text-light)"
                        : "var(--color-text-secondary)",
                    transition:     "color var(--transition-base)",
                    textDecoration: "none",
                    paddingBottom:  "2px",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Right side: lang toggle + CTA ── */}
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: "1rem" }}
          >
            {/* Language toggle pill */}
            <div
              style={{
                display:         "flex",
                alignItems:      "center",
                gap:             "2px",
                backgroundColor: isTransparent
                  ? "rgba(255,255,255,0.15)"
                  : "var(--color-surface-warm)",
                border:          `1px solid ${isTransparent ? "rgba(255,255,255,0.25)" : "var(--color-border)"}`,
                borderRadius:    "var(--radius-full)",
                padding:         "3px",
                backdropFilter:  "blur(8px)",
                transition:      "background-color var(--transition-base), border-color var(--transition-base)",
              }}
            >
              {(["en", "sw"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-label={`Switch to ${l === "en" ? "English" : "Kiswahili"}`}
                  style={{
                    fontFamily:     "var(--font-body)",
                    fontSize:       "var(--text-xs)",
                    fontWeight:     lang === l ? 600 : 400,
                    padding:        "0.25rem 0.75rem",
                    borderRadius:   "var(--radius-full)",
                    border:         "none",
                    cursor:         "pointer",
                    transition:     "all var(--transition-base)",
                    backgroundColor: lang === l
                      ? "var(--color-primary)"
                      : "transparent",
                    color: lang === l
                      ? "white"
                      : isTransparent
                        ? "rgba(245,240,232,0.8)"
                        : "var(--color-text-secondary)",
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Reserve Table CTA */}
            <Link
              href="/reservations"
              style={{
                display:         "inline-flex",
                alignItems:      "center",
                gap:             "0.4rem",
                fontFamily:      "var(--font-body)",
                fontSize:        "var(--text-sm)",
                fontWeight:      500,
                color:           "white",
                backgroundColor: "var(--color-primary)",
                borderRadius:    "var(--radius-full)",
                padding:         "0.6rem 1.3rem",
                border:          "none",
                textDecoration:  "none",
                boxShadow:       "var(--shadow-md)",
                transition:      "background-color var(--transition-base), box-shadow var(--transition-base), transform var(--transition-fast)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--color-primary-dark)";
                el.style.boxShadow       = "var(--shadow-lg)";
                el.style.transform       = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--color-primary)";
                el.style.boxShadow       = "var(--shadow-md)";
                el.style.transform       = "translateY(0)";
              }}
            >
              <Calendar size={14} />
              Reserve Table
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            style={{
              padding:    "0.5rem",
              border:     "none",
              background: "none",
              cursor:     "pointer",
              color: isTransparent
                ? "var(--color-text-light)"
                : "var(--color-primary)",
              transition: "color var(--transition-base)",
            }}
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════════
          MOBILE MENU — full screen slide-in overlay
      ════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        style={{
          position:        "fixed",
          inset:           0,
          zIndex:          "calc(var(--z-navbar) + 1)",
          backgroundColor: "rgba(26, 20, 10, 0.5)",
          backdropFilter:  "blur(4px)",
          opacity:         mobileOpen ? 1 : 0,
          pointerEvents:   mobileOpen ? "auto" : "none",
          transition:      "opacity 300ms ease",
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position:        "fixed",
          top:             0,
          right:           0,
          bottom:          0,
          zIndex:          "calc(var(--z-navbar) + 2)",
          width:           "min(360px, 88vw)",
          backgroundColor: "var(--color-secondary)",
          transform:       mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition:      "transform 350ms cubic-bezier(0.32, 0, 0.15, 1)",
          display:         "flex",
          flexDirection:   "column",
          overflowY:       "auto",
        }}
      >
        {/* Drawer header */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "1.5rem 1.75rem",
          borderBottom:   "1px solid rgba(255,255,255,0.08)",
        }}>
          {/* Logo in drawer */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width:           "28px",
              height:          "28px",
              borderRadius:    "50%",
              backgroundColor: "var(--color-primary)",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
            }}>
              <Leaf size={14} color="white" />
            </div>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize:   "1.1rem",
              fontWeight: 600,
              color:      "var(--color-text-light)",
            }}>
              Savanna Kitchen
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            style={{
              padding:    "0.4rem",
              border:     "1px solid rgba(255,255,255,0.15)",
              borderRadius: "var(--radius-md)",
              background: "rgba(255,255,255,0.05)",
              cursor:     "pointer",
              color:      "var(--color-text-light)",
              display:    "flex",
              alignItems: "center",
              transition: "background var(--transition-base)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav
          aria-label="Mobile navigation"
          style={{ padding: "1.5rem 1.75rem", flex: 1 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {NAV_LINKS.map(({ href, label }, i) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    fontFamily:     "var(--font-display)",
                    fontSize:       "1.6rem",
                    fontWeight:     active ? 600 : 400,
                    color:          active
                      ? "var(--color-accent)"
                      : "var(--color-text-light)",
                    padding:        "0.85rem 0",
                    borderBottom:   "1px solid rgba(255,255,255,0.07)",
                    textDecoration: "none",
                    transition:     "color var(--transition-base), padding-left var(--transition-base)",
                    animationDelay: `${i * 40}ms`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color       = "var(--color-accent)";
                    (e.currentTarget as HTMLElement).style.paddingLeft = "0.5rem";
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color       = "var(--color-text-light)";
                      (e.currentTarget as HTMLElement).style.paddingLeft = "0";
                    }
                  }}
                >
                  {label}
                  {active && (
                    <span style={{
                      width:           "6px",
                      height:          "6px",
                      borderRadius:    "50%",
                      backgroundColor: "var(--color-accent)",
                      flexShrink:      0,
                    }} />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Drawer footer */}
        <div style={{
          padding:      "1.5rem 1.75rem",
          borderTop:    "1px solid rgba(255,255,255,0.08)",
          display:      "flex",
          flexDirection: "column",
          gap:          "1rem",
        }}>
          {/* Reserve button */}
          <Link
            href="/reservations"
            style={{
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              gap:             "0.5rem",
              fontFamily:      "var(--font-body)",
              fontSize:        "var(--text-base)",
              fontWeight:      500,
              color:           "white",
              backgroundColor: "var(--color-primary)",
              borderRadius:    "var(--radius-xl)",
              padding:         "1rem",
              textDecoration:  "none",
              boxShadow:       "var(--shadow-md)",
            }}
          >
            <Calendar size={18} />
            Reserve a Table
          </Link>

          {/* Language toggle */}
          <div style={{
            display:      "flex",
            borderRadius: "var(--radius-xl)",
            overflow:     "hidden",
            border:       "1px solid rgba(255,255,255,0.15)",
          }}>
            {([
              { value: "en" as Lang, label: "🇬🇧  English"   },
              { value: "sw" as Lang, label: "🇹🇿  Kiswahili" },
            ]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setLang(value)}
                style={{
                  flex:            1,
                  fontFamily:      "var(--font-body)",
                  fontSize:        "var(--text-sm)",
                  fontWeight:      lang === value ? 600 : 400,
                  padding:         "0.75rem",
                  border:          "none",
                  cursor:          "pointer",
                  transition:      "all var(--transition-base)",
                  backgroundColor: lang === value
                    ? "var(--color-primary)"
                    : "rgba(255,255,255,0.05)",
                  color: lang === value
                    ? "white"
                    : "rgba(245,240,232,0.6)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Contact quick links */}
          <div style={{
            display:        "flex",
            justifyContent: "center",
            gap:            "1rem",
            paddingTop:     "0.5rem",
          }}>
            <a
              href="https://wa.me/255700000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:     "var(--font-body)",
                fontSize:       "var(--text-xs)",
                color:          "rgba(245,240,232,0.5)",
                textDecoration: "none",
                letterSpacing:  "0.05em",
              }}
            >
              WhatsApp Us
            </a>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <a
              href="tel:+255700000000"
              style={{
                fontFamily:     "var(--font-body)",
                fontSize:       "var(--text-xs)",
                color:          "rgba(245,240,232,0.5)",
                textDecoration: "none",
                letterSpacing:  "0.05em",
              }}
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}