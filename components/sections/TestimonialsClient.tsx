"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

/* ─── Types ─────────────────────────────────────── */
type Testimonial = {
  quote: string;
  name: string;
  detail: string;
  initials: string;
  rating: number;
  tag: string;
};

/* ─── UI Helpers ────────────────────────────────── */
function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={17}
          style={{
            color: i < count ? "var(--color-accent)" : "rgba(255,255,255,0.15)",
            fill: i < count ? "var(--color-accent)" : "transparent",
            transition: "color 0.2s ease",
          }}
        />
      ))}
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div style={{
      width: "48px", height: "48px", borderRadius: "50%",
      backgroundColor: "var(--color-primary)", border: "2px solid var(--color-accent)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, boxShadow: "var(--shadow-dark-sm)",
    }}>
      <span style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "white" }}>
        {initials}
      </span>
    </div>
  );
}

function TestimonialSlide({ testimonial, isActive }: { testimonial: Testimonial; isActive: boolean }) {
  return (
    <div aria-hidden={!isActive} style={{ width: "100%", flexShrink: 0, padding: "0 1rem" }}>
      <div style={{
        maxWidth: "780px", margin: "0 auto", backgroundColor: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: "var(--radius-2xl)", padding: "clamp(2rem, 4vw, 3rem)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "1.5rem", right: "1.5rem",
          backgroundColor: "rgba(232,184,75,0.15)", border: "1px solid rgba(232,184,75,0.30)",
          color: "var(--color-accent)", fontSize: "var(--text-xs)",
          padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)",
        }}>
          {testimonial.tag}
        </div>

        <Quote size={36} style={{ color: "var(--color-primary)", margin: "0 auto 1.25rem", display: "block" }} />
        <div style={{ marginBottom: "1.5rem" }}><StarRating count={testimonial.rating} /></div>

        <blockquote style={{
          fontFamily: "var(--font-accent)", fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)",
          fontStyle: "italic", color: "rgba(245,240,232,0.92)",
          textAlign: "center", marginBottom: "2rem",
        }}>
          "{testimonial.quote}"
        </blockquote>

        <div style={{ width: "60px", height: "1px", backgroundColor: "rgba(232,184,75,0.35)", margin: "0 auto 1.5rem" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.85rem" }}>
          <Avatar initials={testimonial.initials} />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "white", marginBottom: "2px" }}>{testimonial.name}</p>
            <p style={{ fontSize: "var(--text-xs)", color: "rgba(245,240,232,0.45)" }}>{testimonial.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATS = [
  { value: "500+", label: "Happy Guests" },
  { value: "4.9", label: "Average Rating" },
  { value: "98%", label: "Would Return" },
  { value: "3yrs", label: "Serving Dar" },
];

/* ─── Main Component ────────────────────────────── */
export default function TestimonialsClient({ testimonials }: { testimonials: Testimonial[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const go = useCallback((dir: number) => {
    setCurrent(c => (c + dir + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => go(1), 5500);
    return () => clearInterval(interval);
  }, [paused, go]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    setDragging(true);
    setPaused(true);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const delta = dragStart.current - e.clientX;
    if (Math.abs(delta) > 50) go(delta > 0 ? 1 : -1);
    setDragging(false);
    setTimeout(() => setPaused(false), 1500);
  };

  return (
    <section ref={sectionRef} style={{ backgroundColor: "var(--color-secondary)", padding: "6rem 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem', opacity: visible ? 1 : 0, transition: 'all 0.8s' }}>
          <span style={{ color: "var(--color-accent)", textTransform: 'uppercase', fontSize: '0.8rem' }}>— Guest Reviews —</span>
          <h2 style={{ color: 'white', fontSize: '2.5rem', margin: '0.5rem 0' }}>What Our Guests Say</h2>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", marginBottom: "3.5rem" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center", padding: "1rem", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-xl)" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-accent)", margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Carousel */}
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div style={{ overflow: "hidden", cursor: dragging ? "grabbing" : "grab" }}>
            <div
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              style={{
                display: "flex",
                transform: `translateX(-${current * 100}%)`,
                transition: dragging ? "none" : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              {testimonials.map((t, i) => (
                <TestimonialSlide key={i} testimonial={t} isActive={i === current} />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
            <button onClick={() => go(-1)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}><ChevronLeft size={20}/></button>
            
            <div style={{ display: "flex", gap: "8px" }}>
              {testimonials.map((_, i) => (
                <div key={i} onClick={() => setCurrent(i)} style={{ height: "6px", width: i === current ? "20px" : "6px", backgroundColor: i === current ? "var(--color-primary)" : "rgba(255,255,255,0.2)", borderRadius: "3px", cursor: "pointer", transition: "all 0.3s" }} />
              ))}
            </div>

            <button onClick={() => go(1)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}><ChevronRight size={20}/></button>
          </div>

          {/* Progress Bar */}
          <div style={{ width: "100%", maxWidth: "150px", height: "2px", backgroundColor: "rgba(255,255,255,0.1)", margin: "1.5rem auto 0", borderRadius: "2px", overflow: "hidden" }}>
            <div key={`${current}-${paused}`} style={{ height: "100%", backgroundColor: "var(--color-primary)", width: paused ? "0%" : "100%", transition: paused ? "none" : "width 5.5s linear" }} />
          </div>
        </div>
      </div>
    </section>
  );
}