"use client";
import { useState, useId } from "react";
import Link from "next/link";
import { createContactMessage } from "@/lib/supabase";
import {
  MapPin, Phone, Mail, Clock,
  Instagram, Facebook, Twitter,
  CheckCircle2, Send, Calendar,
  MessageSquare,
} from "lucide-react";


/* ═══════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════ */
type FormData = {
  name:    string;
  email:   string;
  phone:   string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const CONTACT_ITEMS = [
  {
    icon:   Phone,
    label:  "Phone / WhatsApp",
    value:  "+255 700 000 000",
    href:   "https://wa.me/255700000000",
    detail: "Tap to open WhatsApp",
  },
  {
    icon:   Mail,
    label:  "Email",
    value:  "hello@savannakitchen.co.tz",
    href:   "mailto:hello@savannakitchen.co.tz",
    detail: "We reply within 2 hours",
  },
  {
    icon:   MapPin,
    label:  "Location",
    value:  "Msasani Peninsula, Dar es Salaam",
    href:   "https://maps.google.com/?q=Msasani+Peninsula+Dar+es+Salaam",
    detail: "Get directions →",
  },
  {
    icon:   Clock,
    label:  "Opening Hours",
    value:  "Mon–Fri: 7AM – 10PM",
    value2: "Sat–Sun: 8AM – 11PM",
    href:   null,
    detail: null,
  },
];

const SOCIALS = [
  { icon: Instagram, href: "#",  label: "Instagram", color: "#E1306C" },
  { icon: Facebook,  href: "#",  label: "Facebook",  color: "#1877F2" },
  { icon: Twitter,   href: "#",  label: "Twitter",   color: "#1DA1F2" },
];

const SUBJECTS = [
  "General Enquiry",
  "Table Reservation",
  "Private Event / Group Booking",
  "Feedback / Complaint",
  "Partnership / Collaboration",
  "Media / Press",
  "Other",
];

const WHATSAPP = "255700000000";

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width:           "100%",
    fontFamily:      "var(--font-body)",
    fontSize:        "var(--text-sm)",
    color:           "var(--color-text-primary)",
    backgroundColor: "var(--color-surface-warm)",
    border:          `1.5px solid ${hasError ? "var(--color-error)" : "var(--color-border)"}`,
    borderRadius:    "var(--radius-xl)",
    padding:         "0.75rem 1rem",
    outline:         "none",
    transition:      "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
    boxShadow:       hasError ? "0 0 0 3px rgba(192,57,43,0.10)" : "none",
    appearance:      "none" as const,
  };
}

function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  const el = e.currentTarget;
  el.style.borderColor     = "var(--color-primary)";
  el.style.boxShadow       = "0 0 0 3px rgba(200,121,58,0.12)";
  el.style.backgroundColor = "var(--color-surface)";
}

function handleBlur(
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  hasError: boolean
) {
  const el = e.currentTarget;
  el.style.borderColor     = hasError ? "var(--color-error)" : "var(--color-border)";
  el.style.boxShadow       = hasError ? "0 0 0 3px rgba(192,57,43,0.10)" : "none";
  el.style.backgroundColor = "var(--color-surface-warm)";
}

/* ═══════════════════════════════════════════════════
   FIELD WRAPPER
═══════════════════════════════════════════════════ */
function Field({
  label, required, optional, error, id, children,
}: {
  label:    string;
  required?: boolean;
  optional?: boolean;
  error?:   string;
  id:       string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label htmlFor={id} style={{
        fontFamily:  "var(--font-body)",
        fontSize:    "var(--text-sm)",
        fontWeight:  500,
        color:       "var(--color-text-primary)",
        display:     "flex",
        alignItems:  "center",
        gap:         "0.3rem",
      }}>
        {label}
        {required && <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>*</span>}
        {optional && (
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", fontWeight: 400, color: "var(--color-text-muted)" }}>
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-error)", margin: 0 }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUCCESS STATE
═══════════════════════════════════════════════════ */
function SuccessState({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      textAlign:      "center",
      padding:        "3rem 1rem",
    }}>
      <div style={{
        width:           "72px",
        height:          "72px",
        borderRadius:    "50%",
        backgroundColor: "#f0fdf4",
        border:          "2px solid #bbf7d0",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        marginBottom:    "1.25rem",
        animation:       "scale-pop 0.4s ease both",
      }}>
        <CheckCircle2 size={34} color="#16a34a" />
      </div>

      <h3 style={{
        fontFamily:   "var(--font-display)",
        fontSize:     "var(--text-2xl)",
        fontWeight:   600,
        color:        "var(--color-text-primary)",
        marginBottom: "0.5rem",
      }}>
        Message Sent!
      </h3>

      <p style={{
        fontFamily:   "var(--font-body)",
        fontSize:     "var(--text-sm)",
        color:        "var(--color-text-secondary)",
        lineHeight:   "var(--leading-relaxed)",
        maxWidth:     "280px",
        marginBottom: "2rem",
      }}>
        Thank you, <strong>{name}</strong>! We'll get back to you within 2 hours during opening hours.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
        <a
          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Savanna Kitchen! I just sent a message via your website.")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            gap:             "0.5rem",
            fontFamily:      "var(--font-body)",
            fontSize:        "var(--text-sm)",
            fontWeight:      500,
            color:           "white",
            backgroundColor: "var(--color-whatsapp)",
            borderRadius:    "var(--radius-xl)",
            padding:         "0.9rem",
            textDecoration:  "none",
            transition:      "all var(--transition-base)",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundColor = "var(--color-whatsapp-dark)";
            el.style.transform       = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundColor = "var(--color-whatsapp)";
            el.style.transform       = "translateY(0)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Also chat on WhatsApp
        </a>

        <button
          onClick={onReset}
          style={{
            fontFamily:      "var(--font-body)",
            fontSize:        "var(--text-sm)",
            color:           "var(--color-text-muted)",
            backgroundColor: "transparent",
            border:          "1.5px solid var(--color-border)",
            borderRadius:    "var(--radius-xl)",
            padding:         "0.9rem",
            cursor:          "pointer",
            transition:      "all var(--transition-base)",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--color-primary)";
            el.style.color       = "var(--color-primary)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--color-border)";
            el.style.color       = "var(--color-text-muted)";
          }}
        >
          Send another message
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */
export default function ContactPage() {
  const uid = useId();

  const [form, setForm]       = useState<FormData>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim())    e.name    = "Please enter your name";
    if (!form.message.trim()) e.message = "Please enter your message";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  
const handleSubmit = async (ev: React.FormEvent) => {
  ev.preventDefault();
  if (!validate()) return;
  setLoading(true);

  try {
    await createContactMessage({
      name:    form.name,
      email:   form.email   || undefined,
      phone:   form.phone   || undefined,
      subject: form.subject || undefined,
      message: form.message,
    });
    setSent(true);
  } catch (err) {
    console.error("Message error:", err);
    alert("Something went wrong. Please try WhatsApp instead.");
  } finally {
    setLoading(false);
  }
};

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setErrors({});
    setSent(false);
  };

  /* live open status */
  const isOpen = (() => {
    const now = new Date();
    const day = now.getDay();
    const h   = now.getHours();
    return day === 0 || day === 6 ? h >= 8 && h < 23 : h >= 7 && h < 22;
  })();

  return (
    <div style={{
      minHeight:       "100vh",
      backgroundColor: "var(--color-background)",
      paddingTop:      "var(--navbar-height)",
    }}>

      {/* ══════════════════════════════════════════
          PAGE HEADER
      ══════════════════════════════════════════ */}
      <div style={{
        textAlign:     "center",
        paddingTop:    "4rem",
        paddingBottom: "3rem",
        paddingLeft:   "1rem",
        paddingRight:  "1rem",
      }}>
        <span style={{
          display:       "inline-flex",
          alignItems:    "center",
          gap:           "0.5rem",
          fontFamily:    "var(--font-body)",
          fontSize:      "var(--text-xs)",
          fontWeight:    500,
          letterSpacing: "var(--tracking-widest)",
          textTransform: "uppercase",
          color:         "var(--color-primary)",
          marginBottom:  "0.85rem",
        }}>
          <span style={{ display: "inline-block", width: "20px", height: "1px", backgroundColor: "var(--color-primary)", opacity: 0.5 }} />
          Get In Touch
          <span style={{ display: "inline-block", width: "20px", height: "1px", backgroundColor: "var(--color-primary)", opacity: 0.5 }} />
        </span>

        <h1 style={{
          fontFamily:   "var(--font-display)",
          fontSize:     "clamp(2.2rem, 5vw, 3.2rem)",
          fontWeight:   600,
          color:        "var(--color-text-primary)",
          marginBottom: "0.5rem",
          lineHeight:   "var(--leading-tight)",
        }}>
          Contact Us
        </h1>

        <div style={{
          width:           "56px",
          height:          "2px",
          backgroundColor: "var(--color-primary)",
          margin:          "0 auto 1.25rem",
          borderRadius:    "var(--radius-full)",
        }} />

        <p style={{
          fontFamily:  "var(--font-body)",
          fontSize:    "var(--text-lg)",
          color:       "var(--color-text-secondary)",
          maxWidth:    "500px",
          margin:      "0 auto",
          lineHeight:  "var(--leading-relaxed)",
        }}>
          Have a question, a special request, or want to plan a group event?
          We'd love to hear from you.
        </p>
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <div
        className="container"
        style={{ paddingBottom: "6rem" }}
      >
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
          gap:                 "2.5rem",
          alignItems:          "start",
        }}>

          {/* ════════════════════════════════════════
              LEFT — contact info + map
          ════════════════════════════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Contact info card */}
            <div style={{
              backgroundColor: "var(--color-surface)",
              borderRadius:    "var(--radius-2xl)",
              border:          "1px solid var(--color-border)",
              padding:         "2rem",
              boxShadow:       "var(--shadow-md)",
            }}>
              <div style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                marginBottom:   "1.5rem",
              }}>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   "var(--text-2xl)",
                  fontWeight: 600,
                  color:      "var(--color-text-primary)",
                  margin:     0,
                }}>
                  Find Us
                </h2>

                {/* Live open badge */}
                <div style={{
                  display:         "inline-flex",
                  alignItems:      "center",
                  gap:             "0.4rem",
                  backgroundColor: isOpen
                    ? "rgba(45,106,79,0.10)"
                    : "rgba(192,57,43,0.10)",
                  border:          `1px solid ${isOpen ? "rgba(45,106,79,0.30)" : "rgba(192,57,43,0.28)"}`,
                  borderRadius:    "var(--radius-full)",
                  padding:         "0.3rem 0.75rem",
                }}>
                  <span style={{
                    width:           "7px",
                    height:          "7px",
                    borderRadius:    "50%",
                    backgroundColor: isOpen ? "#4ade80" : "#f87171",
                    display:         "inline-block",
                    animation:       isOpen ? "whatsapp-pulse 2s ease-out infinite" : "none",
                  }} />
                  <span style={{
                    fontFamily: "var(--font-body)",
                    fontSize:   "var(--text-xs)",
                    fontWeight: 500,
                    color:      isOpen ? "#15803d" : "#b91c1c",
                  }}>
                    {isOpen ? "Open Now" : "Closed"}
                  </span>
                </div>
              </div>

              {/* Contact items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", marginBottom: "1.75rem" }}>
                {CONTACT_ITEMS.map(({ icon: Icon, label, value, value2, href, detail }) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    {/* Icon circle */}
                    <div style={{
                      width:           "42px",
                      height:          "42px",
                      borderRadius:    "var(--radius-full)",
                      backgroundColor: "rgba(200,121,58,0.10)",
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      flexShrink:      0,
                    }}>
                      <Icon size={18} color="var(--color-primary)" />
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontFamily:    "var(--font-body)",
                        fontSize:      "10px",
                        fontWeight:    500,
                        color:         "var(--color-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "var(--tracking-wider)",
                        marginBottom:  "3px",
                      }}>
                        {label}
                      </p>

                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          style={{
                            fontFamily:     "var(--font-body)",
                            fontSize:       "var(--text-sm)",
                            fontWeight:     500,
                            color:          "var(--color-text-primary)",
                            textDecoration: "none",
                            display:        "block",
                            transition:     "color var(--transition-base)",
                          }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"}
                        >
                          {value}
                          {detail && (
                            <span style={{
                              display:    "block",
                              fontSize:   "var(--text-xs)",
                              color:      "var(--color-primary)",
                              marginTop:  "2px",
                              fontWeight: 400,
                            }}>
                              {detail}
                            </span>
                          )}
                        </a>
                      ) : (
                        <div>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
                            {value}
                          </p>
                          {value2 && (
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-text-primary)", margin: "2px 0 0" }}>
                              {value2}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", backgroundColor: "var(--color-border)", marginBottom: "1.5rem" }} />

              {/* Social row */}
              <div>
                <p style={{
                  fontFamily:    "var(--font-body)",
                  fontSize:      "var(--text-xs)",
                  fontWeight:    500,
                  color:         "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-wider)",
                  marginBottom:  "0.85rem",
                }}>
                  Follow Us
                </p>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  {SOCIALS.map(({ icon: Icon, href, label, color }) => (
                     <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width:           "40px",
                        height:          "40px",
                        borderRadius:    "var(--radius-full)",
                        border:          "1.5px solid var(--color-border)",
                        backgroundColor: "var(--color-surface-warm)",
                        display:         "flex",
                        alignItems:      "center",
                        justifyContent:  "center",
                        color:           "var(--color-text-muted)",
                        textDecoration:  "none",
                        transition:      "all var(--transition-base)",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.backgroundColor = color;
                        el.style.borderColor     = color;
                        el.style.color           = "white";
                        el.style.transform       = "translateY(-2px)";
                        el.style.boxShadow       = `0 4px 12px ${color}40`;
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.backgroundColor = "var(--color-surface-warm)";
                        el.style.borderColor     = "var(--color-border)";
                        el.style.color           = "var(--color-text-muted)";
                        el.style.transform       = "translateY(0)";
                        el.style.boxShadow       = "none";
                      }}
                    >
                      <Icon size={17} />
                    </a>
                  ))}

                  {/* WhatsApp social icon */}
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    aria-label="Chat on WhatsApp"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width:           "40px",
                      height:          "40px",
                      borderRadius:    "var(--radius-full)",
                      border:          "1.5px solid var(--color-border)",
                      backgroundColor: "var(--color-surface-warm)",
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      color:           "var(--color-text-muted)",
                      textDecoration:  "none",
                      transition:      "all var(--transition-base)",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = "var(--color-whatsapp)";
                      el.style.borderColor     = "var(--color-whatsapp)";
                      el.style.color           = "white";
                      el.style.transform       = "translateY(-2px)";
                      el.style.boxShadow       = "0 4px 12px rgba(37,211,102,0.35)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = "var(--color-surface-warm)";
                      el.style.borderColor     = "var(--color-border)";
                      el.style.color           = "var(--color-text-muted)";
                      el.style.transform       = "translateY(0)";
                      el.style.boxShadow       = "none";
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div style={{
              borderRadius: "var(--radius-2xl)",
              overflow:     "hidden",
              border:       "1px solid var(--color-border)",
              boxShadow:    "var(--shadow-md)",
              height:       "260px",
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63704.11714068527!2d39.2082613!3d-6.7923690!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b0f4b3b3b3b%3A0x0!2sMsasani%2C+Dar+es+Salaam!5e0!3m2!1sen!2stz!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Savanna Kitchen — Msasani, Dar es Salaam"
              />
            </div>

            {/* Directions button */}
            <a
              href="https://maps.google.com/?q=Msasani+Peninsula+Dar+es+Salaam"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                gap:             "0.5rem",
                fontFamily:      "var(--font-body)",
                fontSize:        "var(--text-sm)",
                fontWeight:      500,
                color:           "var(--color-primary)",
                backgroundColor: "transparent",
                borderRadius:    "var(--radius-xl)",
                padding:         "0.85rem",
                textDecoration:  "none",
                border:          "1.5px solid var(--color-primary)",
                transition:      "all var(--transition-base)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--color-primary)";
                el.style.color           = "white";
                el.style.transform       = "translateY(-1px)";
                el.style.boxShadow       = "var(--shadow-md)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "transparent";
                el.style.color           = "var(--color-primary)";
                el.style.transform       = "translateY(0)";
                el.style.boxShadow       = "none";
              }}
            >
              <MapPin size={17} />
              Get Directions on Google Maps
            </a>

            {/* Quick action cards */}
            <div style={{
              display:             "grid",
              gridTemplateColumns: "1fr 1fr",
              gap:                 "0.75rem",
            }}>
              {[
                {
                  icon:  Calendar,
                  title: "Make a Reservation",
                  desc:  "Book your table online",
                  href:  "/reservations",
                  ext:   false,
                },
                {
                  icon:  MessageSquare,
                  title: "WhatsApp Us",
                  desc:  "Fastest way to reach us",
                  href:  `https://wa.me/${WHATSAPP}`,
                  ext:   true,
                },
              ].map(({ icon: Icon, title, desc, href, ext }) => (
                <Link
                  key={title}
                  href={href}
                  target={ext ? "_blank" : undefined}
                  rel={ext ? "noopener noreferrer" : undefined}
                  style={{
                    display:         "flex",
                    flexDirection:   "column",
                    gap:             "0.5rem",
                    backgroundColor: "var(--color-surface)",
                    borderRadius:    "var(--radius-xl)",
                    border:          "1px solid var(--color-border)",
                    padding:         "1.1rem",
                    textDecoration:  "none",
                    transition:      "all var(--transition-base)",
                    boxShadow:       "var(--shadow-sm)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--color-primary)";
                    el.style.transform   = "translateY(-2px)";
                    el.style.boxShadow   = "var(--shadow-md)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--color-border)";
                    el.style.transform   = "translateY(0)";
                    el.style.boxShadow   = "var(--shadow-sm)";
                  }}
                >
                  <div style={{
                    width:           "34px",
                    height:          "34px",
                    borderRadius:    "var(--radius-full)",
                    backgroundColor: "rgba(200,121,58,0.10)",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                  }}>
                    <Icon size={16} color="var(--color-primary)" />
                  </div>
                  <div>
                    <p style={{
                      fontFamily:   "var(--font-body)",
                      fontSize:     "var(--text-sm)",
                      fontWeight:   600,
                      color:        "var(--color-text-primary)",
                      marginBottom: "2px",
                    }}>
                      {title}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize:   "var(--text-xs)",
                      color:      "var(--color-text-muted)",
                    }}>
                      {desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════
              RIGHT — contact form
          ════════════════════════════════════════ */}
          <div style={{
            backgroundColor: "var(--color-surface)",
            borderRadius:    "var(--radius-2xl)",
            border:          "1px solid var(--color-border)",
            padding:         "clamp(1.5rem, 4vw, 2.5rem)",
            boxShadow:       "var(--shadow-lg)",
          }}>
            {sent ? (
              <SuccessState name={form.name} onReset={resetForm} />
            ) : (
              <>
                <div style={{ marginBottom: "1.75rem" }}>
                  <h2 style={{
                    fontFamily:   "var(--font-display)",
                    fontSize:     "var(--text-2xl)",
                    fontWeight:   600,
                    color:        "var(--color-text-primary)",
                    marginBottom: "0.35rem",
                  }}>
                    Send a Message
                  </h2>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize:   "var(--text-sm)",
                    color:      "var(--color-text-muted)",
                  }}>
                    We respond within 2 hours during opening hours.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
                >
                  {/* Name */}
                  <Field label="Full Name" required error={errors.name} id={`${uid}-name`}>
                    <input
                      id={`${uid}-name`}
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => update("name", e.target.value)}
                      style={inputStyle(!!errors.name)}
                      onFocus={handleFocus}
                      onBlur={e => handleBlur(e, !!errors.name)}
                    />
                  </Field>

                  {/* Email + Phone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <Field label="Email" optional error={errors.email} id={`${uid}-email`}>
                      <input
                        id={`${uid}-email`}
                        type="email"
                        autoComplete="email"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={e => update("email", e.target.value)}
                        style={inputStyle(!!errors.email)}
                        onFocus={handleFocus}
                        onBlur={e => handleBlur(e, !!errors.email)}
                      />
                    </Field>

                    <Field label="Phone / WhatsApp" optional error={errors.phone} id={`${uid}-phone`}>
                      <input
                        id={`${uid}-phone`}
                        type="tel"
                        autoComplete="tel"
                        placeholder="+255 7XX XXX XXX"
                        value={form.phone}
                        onChange={e => update("phone", e.target.value)}
                        style={inputStyle(!!errors.phone)}
                        onFocus={handleFocus}
                        onBlur={e => handleBlur(e, !!errors.phone)}
                      />
                    </Field>
                  </div>

                  {/* Subject */}
                  <Field label="Subject" optional id={`${uid}-subject`}>
                    <select
                      id={`${uid}-subject`}
                      value={form.subject}
                      onChange={e => update("subject", e.target.value)}
                      style={inputStyle(false)}
                      onFocus={handleFocus}
                      onBlur={e => handleBlur(e, false)}
                    >
                      <option value="">Select a subject</option>
                      {SUBJECTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Message */}
                  <Field label="Message" required error={errors.message} id={`${uid}-message`}>
                    <textarea
                      id={`${uid}-message`}
                      rows={5}
                      placeholder="How can we help you? Tell us as much as you'd like..."
                      value={form.message}
                      onChange={e => update("message", e.target.value)}
                      style={{
                        ...inputStyle(!!errors.message),
                        resize:     "none",
                        lineHeight: "var(--leading-relaxed)",
                      }}
                      onFocus={handleFocus}
                      onBlur={e => handleBlur(e, !!errors.message)}
                    />
                  </Field>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      gap:             "0.5rem",
                      width:           "100%",
                      fontFamily:      "var(--font-body)",
                      fontSize:        "var(--text-base)",
                      fontWeight:      500,
                      color:           "white",
                      backgroundColor: "var(--color-primary)",
                      borderRadius:    "var(--radius-xl)",
                      padding:         "1rem",
                      border:          "none",
                      cursor:          loading ? "wait" : "pointer",
                      opacity:         loading ? 0.8 : 1,
                      boxShadow:       "var(--shadow-md)",
                      transition:      "all var(--transition-base)",
                    }}
                    onMouseEnter={e => {
                      if (!loading) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.backgroundColor = "var(--color-primary-dark)";
                        el.style.transform       = "translateY(-1px)";
                        el.style.boxShadow       = "var(--shadow-lg)";
                      }
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = "var(--color-primary)";
                      el.style.transform       = "translateY(0)";
                      el.style.boxShadow       = "var(--shadow-md)";
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="spinner" />
                        Sending your message...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "0.75rem",
                  }}>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                      or reach us directly
                    </span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
                  </div>

                  {/* WhatsApp alternative */}
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Savanna Kitchen! I have a question.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      gap:             "0.6rem",
                      fontFamily:      "var(--font-body)",
                      fontSize:        "var(--text-sm)",
                      fontWeight:      500,
                      color:           "white",
                      backgroundColor: "var(--color-whatsapp)",
                      borderRadius:    "var(--radius-xl)",
                      padding:         "0.9rem",
                      textDecoration:  "none",
                      boxShadow:       "0 4px 16px rgba(37,211,102,0.28)",
                      transition:      "all var(--transition-base)",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = "var(--color-whatsapp-dark)";
                      el.style.transform       = "translateY(-1px)";
                      el.style.boxShadow       = "0 6px 20px rgba(37,211,102,0.40)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = "var(--color-whatsapp)";
                      el.style.transform       = "translateY(0)";
                      el.style.boxShadow       = "0 4px 16px rgba(37,211,102,0.28)";
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
