"use client";
import { useState, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { createReservation } from "@/lib/supabase";
import {
  Calendar, Clock, Users, CheckCircle2,
  Phone, ChevronRight, Shield,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════ */
type FormData = {
  name:     string;
  phone:    string;
  guests:   string;
  date:     string;
  time:     string;
  occasion: string;
  requests: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const TIME_SLOTS = [
  { value: "breakfast", label: "🌅  7:00 AM – 9:00 AM",   tag: "Breakfast" },
  { value: "lunch",     label: "☀️  12:00 PM – 2:00 PM",  tag: "Lunch"     },
  { value: "early",     label: "🌇  6:00 PM – 8:00 PM",   tag: "Early Dinner" },
  { value: "late",      label: "🌙  8:00 PM – 10:00 PM",  tag: "Late Dinner"  },
];

const GUEST_OPTIONS = [
  { value: "1-2",  label: "1 – 2 guests"  },
  { value: "3-4",  label: "3 – 4 guests"  },
  { value: "5-6",  label: "5 – 6 guests"  },
  { value: "7-8",  label: "7 – 8 guests"  },
  { value: "9-15", label: "9 – 15 guests" },
  { value: "15+",  label: "15+ guests (event)" },
];

const OCCASIONS = [
  "Birthday Celebration",
  "Anniversary",
  "Business Lunch / Dinner",
  "Family Gathering",
  "Date Night",
  "Other",
];

const REASSURANCES = [
  { icon: Clock,   text: "Confirmed within 30 minutes" },
  { icon: Phone,   text: "WhatsApp confirmation sent"  },
  { icon: Shield,  text: "Free cancellation 24hrs prior" },
];

const WHATSAPP = "255700000000";

/* ═══════════════════════════════════════════════════
   FIELD COMPONENT
═══════════════════════════════════════════════════ */
function Field({
  label,
  required,
  optional,
  error,
  children,
  id,
}: {
  label:    string;
  required?: boolean;
  optional?: boolean;
  error?:   string;
  children: React.ReactNode;
  id:       string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label
        htmlFor={id}
        style={{
          fontFamily:  "var(--font-body)",
          fontSize:    "var(--text-sm)",
          fontWeight:  500,
          color:       "var(--color-text-primary)",
          display:     "flex",
          alignItems:  "center",
          gap:         "0.3rem",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>*</span>
        )}
        {optional && (
          <span style={{
            fontFamily:  "var(--font-body)",
            fontSize:    "var(--text-xs)",
            fontWeight:  400,
            color:       "var(--color-text-muted)",
          }}>
            (optional)
          </span>
        )}
      </label>

      {children}

      {error && (
        <p style={{
          fontFamily:  "var(--font-body)",
          fontSize:    "var(--text-xs)",
          color:       "var(--color-error)",
          display:     "flex",
          alignItems:  "center",
          gap:         "0.3rem",
          margin:      0,
        }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INPUT STYLES HELPER
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
    transition:      "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow:       hasError ? "0 0 0 3px rgba(192,57,43,0.10)" : "none",
    appearance:      "none" as const,
  };
}

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "var(--color-primary)";
  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(200,121,58,0.12)";
  e.currentTarget.style.backgroundColor = "var(--color-surface)";
}

function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, hasError: boolean) {
  e.currentTarget.style.borderColor    = hasError ? "var(--color-error)" : "var(--color-border)";
  e.currentTarget.style.boxShadow      = hasError ? "0 0 0 3px rgba(192,57,43,0.10)" : "none";
  e.currentTarget.style.backgroundColor = "var(--color-surface-warm)";
}

/* ═══════════════════════════════════════════════════
   SUCCESS STATE
═══════════════════════════════════════════════════ */
function SuccessState({ form }: { form: FormData }) {
  const timeLabel = TIME_SLOTS.find(t => t.value === form.time)?.label ?? form.time;
  const waText = encodeURIComponent(
    `Hello Savanna Kitchen! 🍽️\n\nI just made a reservation:\n• Name: ${form.name}\n• Date: ${form.date}\n• Time: ${timeLabel}\n• Guests: ${form.guests}\n\nPlease confirm my table. Thank you!`
  );

  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      textAlign:      "center",
      padding:        "2.5rem 1rem",
    }}>
      {/* Success icon */}
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
        Reservation Received!
      </h3>

      <p style={{
        fontFamily:   "var(--font-body)",
        fontSize:     "var(--text-sm)",
        color:        "var(--color-text-secondary)",
        lineHeight:   "var(--leading-relaxed)",
        maxWidth:     "320px",
        marginBottom: "1.75rem",
      }}>
        Thank you, <strong>{form.name}</strong>! We'll confirm your table via WhatsApp within 30 minutes.
      </p>

      {/* Booking summary card */}
      <div style={{
        width:           "100%",
        backgroundColor: "var(--color-background)",
        borderRadius:    "var(--radius-xl)",
        border:          "1px solid var(--color-border)",
        overflow:        "hidden",
        marginBottom:    "1.75rem",
      }}>
        {[
          { icon: Calendar, label: "Date",   value: form.date       },
          { icon: Clock,    label: "Time",   value: timeLabel        },
          { icon: Users,    label: "Guests", value: form.guests      },
          { icon: Phone,    label: "Phone",  value: form.phone       },
        ].map(({ icon: Icon, label, value }, i, arr) => (
          <div
            key={label}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "0.75rem",
              padding:        "0.85rem 1.1rem",
              borderBottom:   i < arr.length - 1 ? "1px solid var(--color-border)" : "none",
            }}
          >
            <div style={{
              width:           "30px",
              height:          "30px",
              borderRadius:    "var(--radius-full)",
              backgroundColor: "rgba(200,121,58,0.10)",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              flexShrink:      0,
            }}>
              <Icon size={14} color="var(--color-primary)" />
            </div>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize:   "var(--text-xs)",
              color:      "var(--color-text-muted)",
              flex:       1,
              textAlign:  "left",
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize:   "var(--text-sm)",
              fontWeight: 500,
              color:      "var(--color-text-primary)",
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* WhatsApp confirm button */}
      <a
        href={`https://wa.me/${WHATSAPP}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display:         "inline-flex",
          alignItems:      "center",
          gap:             "0.5rem",
          fontFamily:      "var(--font-body)",
          fontSize:        "var(--text-sm)",
          fontWeight:      500,
          color:           "white",
          backgroundColor: "var(--color-whatsapp)",
          borderRadius:    "var(--radius-full)",
          padding:         "0.85rem 1.75rem",
          textDecoration:  "none",
          boxShadow:       "0 4px 16px rgba(37,211,102,0.35)",
          transition:      "all var(--transition-base)",
          marginBottom:    "0.75rem",
          width:           "100%",
          justifyContent:  "center",
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
        Confirm via WhatsApp
      </a>

      <Link
        href="/menu"
        style={{
          fontFamily:     "var(--font-body)",
          fontSize:       "var(--text-sm)",
          color:          "var(--color-text-muted)",
          textDecoration: "none",
          display:        "inline-flex",
          alignItems:     "center",
          gap:            "0.3rem",
          transition:     "color var(--transition-base)",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"}
      >
        Browse our menu while you wait
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════ */
export default function ReservationsPage() {
  const uid = useId();

  const [form,      setForm]      = useState<FormData>({
    name: "", phone: "", guests: "", date: "", time: "", occasion: "", requests: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState<FormErrors>({});

  /* field update + clear error */
  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  /* validation */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim())  e.name   = "Please enter your name";
    if (!form.phone.trim()) e.phone  = "Please enter your WhatsApp number";
    if (!form.guests)       e.guests = "Please select number of guests";
    if (!form.date)         e.date   = "Please select a date";
    if (!form.time)         e.time   = "Please select a time slot";
    setErrors(e);
    /* scroll to first error */
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0];
      document.getElementById(`${uid}-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(e).length === 0;
  };

  /* submit */
 
  const handleSubmit = async (ev: React.FormEvent) => {
  ev.preventDefault();
  if (!validate()) return;
  setLoading(true);

  try {
    await createReservation({
      name:     form.name,
      phone:    form.phone,
      guests:   form.guests,
      date:     form.date,
      time:     TIME_SLOTS.find(t => t.value === form.time)?.label ?? form.time,
      occasion: form.occasion,
      requests: form.requests,
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("Reservation error:", err);
    alert("Something went wrong. Please try WhatsApp instead.");
  } finally {
    setLoading(false);
  }
};

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{
      minHeight:       "100vh",
      backgroundColor: "var(--color-background)",
      paddingTop:      "var(--navbar-height)",
    }}>
      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "6rem" }}
      >

        {/* ── Page header ── */}
        <div
          className="section-header"
          style={{ marginBottom: "3.5rem" }}
        >
          <span className="label">— Book Your Table —</span>
          <h1 style={{
            fontFamily:  "var(--font-display)",
            fontSize:    "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight:  600,
            color:       "var(--color-text-primary)",
            margin:      "0.4rem 0",
          }}>
            Make a Reservation
          </h1>
          <div className="heading-underline" />
          <p>
            Reserve your table and let us prepare an unforgettable
            Tanzanian dining experience for you and your guests.
          </p>
        </div>

        {/* ── Two column layout ── */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
          gap:                 "3rem",
          alignItems:          "start",
        }}>

          {/* ════════════════════════════════════════
              LEFT — image + info panel
          ════════════════════════════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Image with quote */}
            <div style={{
              position:     "relative",
              height:       "clamp(320px, 45vw, 500px)",
              borderRadius: "var(--radius-2xl)",
              overflow:     "hidden",
              boxShadow:    "var(--shadow-xl)",
            }}>
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85"
                alt="Savanna Kitchen fine dining"
                fill
                className="object-cover"
                priority
              />
              <div style={{
                position:   "absolute",
                inset:      0,
                background: "linear-gradient(to top, rgba(26,20,10,0.88) 0%, rgba(26,20,10,0.25) 50%, transparent 100%)",
              }} />

              {/* Quote overlay */}
              <div style={{
                position: "absolute",
                bottom:   0,
                left:     0,
                right:    0,
                padding:  "2rem",
              }}>
                <div style={{
                  fontFamily:   "var(--font-display)",
                  fontSize:     "3.5rem",
                  color:        "var(--color-primary)",
                  lineHeight:   0.8,
                  marginBottom: "0.75rem",
                  display:      "block",
                }}>
                  "
                </div>
                <p style={{
                  fontFamily:   "var(--font-accent)",
                  fontSize:     "clamp(1rem, 2vw, 1.2rem)",
                  fontStyle:    "italic",
                  color:        "var(--color-text-light)",
                  lineHeight:   "var(--leading-relaxed)",
                  marginBottom: "0.75rem",
                }}>
                  Every meal at Savanna Kitchen is a celebration of
                  Tanzania's rich culinary heritage.
                </p>
                <cite style={{
                  fontFamily: "var(--font-body)",
                  fontSize:   "var(--text-xs)",
                  color:      "rgba(245,240,232,0.55)",
                  fontStyle:  "normal",
                  display:    "block",
                }}>
                  — Chef Amina Juma, Head Chef & Co-founder
                </cite>
              </div>
            </div>

            {/* Info cards row */}
            <div style={{
              display:             "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap:                 "0.75rem",
            }}>
              {[
                { icon: Clock,    title: "Hours",     value: "7AM – 11PM" },
                { icon: Users,    title: "Capacity",  value: "Up to 80"   },
                { icon: Calendar, title: "Booking",   value: "Same day ok" },
              ].map(({ icon: Icon, title, value }) => (
                <div
                  key={title}
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderRadius:    "var(--radius-xl)",
                    border:          "1px solid var(--color-border)",
                    padding:         "1rem 0.75rem",
                    textAlign:       "center",
                    boxShadow:       "var(--shadow-sm)",
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
                    margin:          "0 auto 0.5rem",
                  }}>
                    <Icon size={16} color="var(--color-primary)" />
                  </div>
                  <p style={{
                    fontFamily:   "var(--font-body)",
                    fontSize:     "10px",
                    color:        "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "2px",
                  }}>
                    {title}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize:   "var(--text-xs)",
                    fontWeight: 600,
                    color:      "var(--color-text-primary)",
                  }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Reassurances */}
            <div style={{
              backgroundColor: "var(--color-surface)",
              borderRadius:    "var(--radius-xl)",
              border:          "1px solid var(--color-border)",
              padding:         "1.25rem 1.5rem",
              display:         "flex",
              flexDirection:   "column",
              gap:             "0.75rem",
            }}>
              {REASSURANCES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "0.65rem",
                  }}
                >
                  <div style={{
                    width:           "28px",
                    height:          "28px",
                    borderRadius:    "var(--radius-full)",
                    backgroundColor: "rgba(200,121,58,0.10)",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    flexShrink:      0,
                  }}>
                    <Icon size={13} color="var(--color-primary)" />
                  </div>
                  <span style={{
                    fontFamily: "var(--font-body)",
                    fontSize:   "var(--text-sm)",
                    color:      "var(--color-text-secondary)",
                  }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════
              RIGHT — form card
          ════════════════════════════════════════ */}
          <div style={{
            backgroundColor: "var(--color-surface)",
            borderRadius:    "var(--radius-2xl)",
            border:          "1px solid var(--color-border)",
            padding:         "clamp(1.5rem, 4vw, 2.5rem)",
            boxShadow:       "var(--shadow-lg)",
          }}>
            {submitted ? (
              <SuccessState form={form} />
            ) : (
              <>
                <h2 style={{
                  fontFamily:   "var(--font-display)",
                  fontSize:     "var(--text-2xl)",
                  fontWeight:   600,
                  color:        "var(--color-text-primary)",
                  marginBottom: "0.35rem",
                }}>
                  Your Details
                </h2>
                <p style={{
                  fontFamily:   "var(--font-body)",
                  fontSize:     "var(--text-sm)",
                  color:        "var(--color-text-muted)",
                  marginBottom: "1.75rem",
                }}>
                  All fields marked * are required.
                </p>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
                >
                  {/* Full Name */}
                  <Field label="Full Name" required error={errors.name} id={`${uid}-name`}>
                    <input
                      id={`${uid}-name`}
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Amina Hassan"
                      value={form.name}
                      onChange={e => update("name", e.target.value)}
                      style={inputStyle(!!errors.name)}
                      onFocus={onFocus}
                      onBlur={e => onBlur(e, !!errors.name)}
                    />
                  </Field>

                  {/* WhatsApp */}
                  <Field label="WhatsApp Number" required error={errors.phone} id={`${uid}-phone`}>
                    <input
                      id={`${uid}-phone`}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+255 700 000 000"
                      value={form.phone}
                      onChange={e => update("phone", e.target.value)}
                      style={inputStyle(!!errors.phone)}
                      onFocus={onFocus}
                      onBlur={e => onBlur(e, !!errors.phone)}
                    />
                  </Field>

                  {/* Guests + Date row */}
                  <div style={{
                    display:             "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap:                 "1rem",
                  }}>
                    <Field label="Guests" required error={errors.guests} id={`${uid}-guests`}>
                      <select
                        id={`${uid}-guests`}
                        value={form.guests}
                        onChange={e => update("guests", e.target.value)}
                        style={inputStyle(!!errors.guests)}
                        onFocus={onFocus}
                        onBlur={e => onBlur(e, !!errors.guests)}
                      >
                        <option value="">Select</option>
                        {GUEST_OPTIONS.map(g => (
                          <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Date" required error={errors.date} id={`${uid}-date`}>
                      <input
                        id={`${uid}-date`}
                        type="date"
                        min={today}
                        value={form.date}
                        onChange={e => update("date", e.target.value)}
                        style={inputStyle(!!errors.date)}
                        onFocus={onFocus}
                        onBlur={e => onBlur(e, !!errors.date)}
                      />
                    </Field>
                  </div>

                  {/* Time slot — visual buttons */}
                  <Field label="Preferred Time" required error={errors.time} id={`${uid}-time`}>
                    <div style={{
                      display:             "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap:                 "0.5rem",
                    }}>
                      {TIME_SLOTS.map(slot => {
                        const active = form.time === slot.value;
                        return (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => update("time", slot.value)}
                            style={{
                              fontFamily:      "var(--font-body)",
                              fontSize:        "var(--text-xs)",
                              fontWeight:      active ? 600 : 400,
                              color:           active ? "white" : "var(--color-text-secondary)",
                              backgroundColor: active ? "var(--color-primary)" : "var(--color-surface-warm)",
                              border:          `1.5px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
                              borderRadius:    "var(--radius-lg)",
                              padding:         "0.65rem 0.5rem",
                              textAlign:       "left",
                              cursor:          "pointer",
                              transition:      "all var(--transition-base)",
                              lineHeight:      "var(--leading-snug)",
                            }}
                          >
                            <span style={{ display: "block" }}>{slot.label}</span>
                            <span style={{
                              display:   "block",
                              fontSize:  "10px",
                              opacity:   active ? 0.8 : 0.55,
                              marginTop: "2px",
                            }}>
                              {slot.tag}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  {/* Occasion */}
                  <Field label="Occasion" optional id={`${uid}-occasion`}>
                    <select
                      id={`${uid}-occasion`}
                      value={form.occasion}
                      onChange={e => update("occasion", e.target.value)}
                      style={inputStyle(false)}
                      onFocus={onFocus}
                      onBlur={e => onBlur(e, false)}
                    >
                      <option value="">Select occasion</option>
                      {OCCASIONS.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Special requests */}
                  <Field label="Special Requests" optional id={`${uid}-requests`}>
                    <textarea
                      id={`${uid}-requests`}
                      rows={3}
                      placeholder="e.g. birthday cake, dietary requirements, high chair, outdoor seating..."
                      value={form.requests}
                      onChange={e => update("requests", e.target.value)}
                      style={{
                        ...inputStyle(false),
                        resize:     "none",
                        lineHeight: "var(--leading-relaxed)",
                      }}
                      onFocus={onFocus}
                      onBlur={e => onBlur(e, false)}
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
                      backgroundColor: loading ? "var(--color-primary)" : "var(--color-primary)",
                      borderRadius:    "var(--radius-xl)",
                      padding:         "1rem",
                      border:          "none",
                      cursor:          loading ? "wait" : "pointer",
                      opacity:         loading ? 0.8 : 1,
                      boxShadow:       "var(--shadow-md)",
                      transition:      "all var(--transition-base)",
                      marginTop:       "0.5rem",
                    }}
                    onMouseEnter={e => {
                      if (!loading) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.backgroundColor = "var(--color-primary-dark)";
                        el.style.boxShadow       = "var(--shadow-lg)";
                        el.style.transform       = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.backgroundColor = "var(--color-primary)";
                      el.style.boxShadow       = "var(--shadow-md)";
                      el.style.transform       = "translateY(0)";
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="spinner" />
                        Reserving your table...
                      </>
                    ) : (
                      <>
                        <Calendar size={17} />
                        Reserve My Table
                      </>
                    )}
                  </button>

                  {/* Fine print */}
                  <p style={{
                    fontFamily:  "var(--font-body)",
                    fontSize:    "var(--text-xs)",
                    color:       "var(--color-text-muted)",
                    textAlign:   "center",
                    lineHeight:  "var(--leading-relaxed)",
                    margin:      0,
                  }}>
                    WhatsApp confirmation sent within 30 minutes.
                    Free cancellation up to 24 hours before your booking.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}