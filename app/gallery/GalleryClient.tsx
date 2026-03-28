"use client";

import { urlFor } from "@/lib/sanity";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url";

/* ═══════════════════════════════════════════════════
    TYPES & CONFIG
═══════════════════════════════════════════════════ */
type Photo = {
  title: string;
  cat: string;
  span: "tall" | "wide" | "square";
  image: SanityImageSource;
};

const FILTERS = [
  { label: "All", emoji: "🖼️" },
  { label: "Food", emoji: "🍽️" },
  { label: "Ambiance", emoji: "✨" },
  { label: "Events", emoji: "🎉" },
  { label: "Desserts", emoji: "🍯" },
];

const SPAN_RATIO: Record<Photo["span"], string> = {
  tall: "3 / 4",
  wide: "4 / 3",
  square: "1 / 1",
};

/* ═══════════════════════════════════════════════════
    GALLERY CARD COMPONENT
═══════════════════════════════════════════════════ */
function GalleryCard({
  photo,
  onClick,
}: {
  photo: Photo;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`View photo: ${photo.title}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      style={{
        position: "relative",
        aspectRatio: SPAN_RATIO[photo.span] || "1/1",
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        cursor: "pointer",
        border: `1.5px solid ${hovered ? "var(--color-primary)" : "var(--color-border)"}`,
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        breakInside: "avoid",
      }}
    >
      {!imgLoaded && <div className="skeleton" style={{ position: "absolute", inset: 0, backgroundColor: '#eee' }} />}
      
      <Image
        src={urlFor(photo.image).width(900).url()}
        alt={photo.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        onLoad={() => setImgLoaded(true)}
        style={{
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: "transform 0.55s ease",
          opacity: imgLoaded ? 1 : 0,
        }}
      />

      {/* Hover Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: hovered ? "rgba(26,20,10,0.48)" : "rgba(26,20,10,0)",
          transition: "background-color 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{
          width: "48px", height: "48px", borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.25)", display: "flex",
          alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1)" : "scale(0.7)",
          transition: "all 0.3s ease",
        }}>
          <ZoomIn size={20} color="white" />
        </div>
      </div>

      {/* Category Badge */}
      <div style={{
        position: "absolute", top: "0.85rem", left: "0.85rem",
        display: "inline-flex", alignItems: "center", gap: "0.3rem",
        backgroundColor: "rgba(200,121,58,0.85)", backdropFilter: "blur(6px)",
        color: "white", fontSize: "0.75rem", fontWeight: 500,
        padding: "0.25rem 0.65rem", borderRadius: "20px",
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateY(0)" : "translateY(-6px)",
        transition: "all 0.25s ease",
      }}>
        {FILTERS.find((f) => f.label === photo.cat)?.emoji} {photo.cat}
      </div>

      {/* Title Caption */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "2rem 1rem 0.85rem",
        background: "linear-gradient(to top, rgba(26,20,10,0.80), transparent)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.28s ease",
      }}>
        <p style={{ color: "white", fontSize: "0.75rem", margin: 0 }}>{photo.title}</p>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════
    LIGHTBOX COMPONENT
═══════════════════════════════════════════════════ */
function Lightbox({
  photo,
  onClose,
}: {
  photo: Photo;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.94)", display: "flex",
        alignItems: "center", justifyContent: "center",
        padding: "1rem", backdropFilter: "blur(4px)",
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: "1100px", width: "100%" }}>
        <Image
          src={urlFor(photo.image).width(1200).url()}
          alt={photo.title}
          width={1100}
          height={800}
          style={{ width: "100%", height: "auto", maxHeight: "85vh", objectFit: "contain" }}
          priority
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
    MAIN CLIENT PAGE
═══════════════════════════════════════════════════ */
export default function GalleryClient({ photos }: { photos: Photo[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = photos.filter((p) => activeFilter === "All" || p.cat === activeFilter);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background)", padding: "2rem 1rem" }}>
      {/* Filter Bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "3rem", flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setActiveFilter(f.label)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--color-border)",
              backgroundColor: activeFilter === f.label ? "var(--color-primary)" : "white",
              color: activeFilter === f.label ? "white" : "black",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        <style>{`
          .gallery-grid { columns: 1; column-gap: 1.25rem; }
          @media (min-width: 640px)  { .gallery-grid { columns: 2; } }
          @media (min-width: 1024px) { .gallery-grid { columns: 3; } }
          .gallery-grid > * { margin-bottom: 1.25rem; }
        `}</style>

        {filtered.map((photo, i) => (
          <GalleryCard 
            key={i} 
            photo={photo} 
            onClick={() => setLightboxIndex(i)} 
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox 
          photo={filtered[lightboxIndex]} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </div>
  );
}