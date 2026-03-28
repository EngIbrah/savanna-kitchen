"use client";
import Link from "next/link";
import {
  Leaf, MapPin, Phone, Mail, Clock,
  Instagram, Facebook, Twitter,
  ArrowUpRight, Heart,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Home",         href: "/"             },
  { label: "Menu",         href: "/menu"         },
  { label: "About",        href: "/about"        },
  { label: "Gallery",      href: "/gallery"      },
  { label: "Reservations", href: "/reservations" },
  { label: "Contact",      href: "/contact"      },
];

const HOURS = [
  { day: "Monday – Friday", time: "7:00 AM – 10:00 PM" },
  { day: "Saturday",        time: "8:00 AM – 11:00 PM" },
  { day: "Sunday",          time: "8:00 AM – 11:00 PM" },
];

const CONTACT = [
  {
    icon:  Phone,
    label: "+255 748 412 022",
    href:  "https://wa.me/255748412022",
    title: "Call or WhatsApp us",
  },
  {
    icon:  Mail,
    label: "hello@savannakitchen.co.tz",
    href:  "mailto:hello@savannakitchen.co.tz",
    title: "Email us",
  },
  {
    icon:  MapPin,
    label: "Msasani Peninsula, Dar es Salaam",
    href:  "https://maps.google.com/?q=Msasani+Dar+es+Salaam",
    title: "Get directions",
  },
];

const SOCIALS = [
  { icon: Instagram, href: "#", label: "Follow us on Instagram" },
  { icon: Facebook,  href: "#", label: "Follow us on Facebook"  },
  { icon: Twitter,   href: "#", label: "Follow us on X/Twitter" },
];

/* ─── Column heading ────────────────────────────── */
function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
      <h4 style={{
        fontFamily:    "var(--font-accent)",
        fontSize:      "0.95rem",
        fontWeight:    600,
        color:         "var(--color-accent)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom:  "0.5rem",
        lineHeight:    1,
      }}>
        {children}
      </h4>
      <div style={{
        width: "32px",
        height: "2px",
        backgroundColor: "var(--color-accent)",
        opacity: 0.45,
        borderRadius: "var(--radius-full)",
        margin: "0 auto"
      }} />
    </div>
  );
}

/* ─── Social button ─────────────────────────────── */
function SocialBtn({ icon: Icon, href, label }: { icon: React.ElementType; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backdropFilter: "blur(6px)",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(245,240,232,0.5)",
        textDecoration: "none",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = "var(--color-primary)";
        el.style.borderColor = "var(--color-primary)";
        el.style.color = "white";
        el.style.transform = "translateY(-3px) scale(1.08)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = "rgba(255,255,255,0.05)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.color = "rgba(245,240,232,0.5)";
        el.style.transform = "translateY(0)";
      }}
    >
      <Icon size={16} />
    </a>
  );
}

/* ─── Contact row ───────────────────────────────── */
function ContactRow({ icon: Icon, label, href, title }: { icon: React.ElementType; label: string; href: string; title: string }) {
  return (
    <a
      href={href}
      title={title}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "0.9rem",
        justifyContent: "center",
        textDecoration: "none",
        transition: "opacity 0.3s ease",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
    >
      <div style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: "rgba(200,121,58,0.14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Icon size={14} color="var(--color-primary)" />
      </div>
      <span style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        color: "rgba(245,240,232,0.68)",
        lineHeight: 1.4,
      }}>{label}</span>
    </a>
  );
}

/* ─── Footer nav link ───────────────────────────── */
function FooterNavLink({ label, href }: { label: string; href: string }) {
  return (
    <li style={{ marginBottom: "0.65rem" }}>
      <Link
        href={href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "rgba(245,240,232,0.55)",
          textDecoration: "none",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.color = "var(--color-primary)";
          el.style.gap = "0.6rem";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.color = "rgba(245,240,232,0.55)";
          el.style.gap = "0.4rem";
        }}
      >
        <ArrowUpRight size={12} style={{ opacity: 0.45, flexShrink: 0 }} />
        {label}
      </Link>
    </li>
  );
}

/* ─── Hours row ─────────────────────────────────── */
function HourRow({ day, time }: { day: string; time: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.65rem",
      paddingBottom: "0.8rem",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      marginBottom: "0.8rem",
      justifyContent: "center",
      textAlign: "center"
    }}>
      <div style={{
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        backgroundColor: "rgba(200,121,58,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Clock size={12} color="var(--color-primary)" />
      </div>
      <div>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          color: "rgba(245,240,232,0.35)",
          marginBottom: "2px",
        }}>{day}</p>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "rgba(245,240,232,0.75)",
        }}>{time}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN FOOTER
═══════════════════════════════════════════════════ */
export default function Footer() {
  const isOpenNow = (() => {
    const now  = new Date();
    const day  = now.getDay();
    const hour = now.getHours();
    if (day === 0 || day === 6) return hour >= 8 && hour < 23;
    return hour >= 7 && hour < 22;
  })();

  return (
    <footer
      style={{
        background: `
          radial-gradient(circle at 20% 10%, rgba(200,121,58,0.10), transparent 40%),
          radial-gradient(circle at 80% 90%, rgba(45,106,79,0.10), transparent 40%),
          linear-gradient(to bottom, #121212, #0b0b0b)
        `,
        backdropFilter: "blur(10px)",
        color: "var(--color-text-light)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        padding: "4rem 2rem 2rem",
      }}
    >
      {/* ── Top gradient bar ── */}
      <div style={{
        height: "2px",
        background: "linear-gradient(90deg, transparent, var(--color-primary), var(--color-accent), var(--color-primary), transparent)",
        marginBottom: "2rem"
      }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "4rem 3rem", justifyItems: "center" }}>
        {/* Col 1: Brand */}
        <div>
          <Link href="/" aria-label="Savanna Kitchen — go to homepage" style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", textDecoration: "none", justifyContent: "center", marginBottom: "1rem" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={16} color="white" />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 600, color: "var(--color-text-light)" }}>Savanna Kitchen</span>
          </Link>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "rgba(245,240,232,0.5)", lineHeight: 1.5, maxWidth: "250px", margin: "0 auto 1.25rem" }}>
            Fresh ingredients, authentic Tanzanian recipes, and unforgettable dining in the heart of Dar es Salaam.
          </p>
          {/* Open status */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", backgroundColor: isOpenNow ? "rgba(45,106,79,0.22)" : "rgba(192,57,43,0.18)", border: `1px solid ${isOpenNow ? "rgba(45,106,79,0.38)" : "rgba(192,57,43,0.32)"}`, borderRadius: "var(--radius-full)", padding: "0.3rem 0.85rem", marginBottom: "1.4rem", justifyContent: "center", margin: "0 auto" }}>
            <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", backgroundColor: isOpenNow ? "#4ade80" : "#f87171", animation: isOpenNow ? "whatsapp-pulse 2.2s ease-out infinite" : "none" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500, color: isOpenNow ? "rgba(134,239,172,0.9)" : "rgba(252,165,165,0.9)" }}>{isOpenNow ? "Open Now" : "Currently Closed"}</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            {SOCIALS.map(s => <SocialBtn key={s.label} {...s} />)}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <ColHeading>Quick Links</ColHeading>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {NAV_LINKS.map(link => <FooterNavLink key={link.label} {...link} />)}
          </ul>
        </div>

        {/* Col 3: Hours */}
        <div>
          <ColHeading>Opening Hours</ColHeading>
          {HOURS.map(h => <HourRow key={h.day} {...h} />)}
        </div>

        {/* Col 4: Contact */}
        <div>
          <ColHeading>Get In Touch</ColHeading>
          {CONTACT.map(item => <ContactRow key={item.label} {...item} />)}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.2rem", fontSize: "0.75rem", color: "rgba(245,240,232,0.5)" }}>
        <p>© {new Date().getFullYear()} Savanna Kitchen. All rights reserved.</p>
      </div>
    </footer>
  );
}