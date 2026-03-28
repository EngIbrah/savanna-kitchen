"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { ShoppingBag, ArrowRight, Flame, Heart, Star, Plus } from "lucide-react";

/* ─── Types ─────────────────────────────────────── */
type Dish = {
  _id: string;
  name: string;
  nameSwahili?: string;     // Added
  description: string;
  descriptionSwahili?: string; // Added
  price: number;            // Changed to number to match Sanity
  categories: string[];     // Changed to array
  tags: string[];           // Changed from badge to tags array
  image: any; 
  prepTime: string;
};

const WHATSAPP_NUMBER = "255748412022";

/* ─── Icon Mapper ───────────────────────────────── */
const getBadgeIcon = (tagValue: string) => {
  switch (tagValue) {
    case "special":  return <Flame size={11} />;
    case "loved":    return <Heart size={11} />;
    case "favorite": return <Star size={11} />;
    default:         return <Star size={11} />;
  }
};

/* ─── Dish Card ─────────────────────────────────── */
function DishCard({ 
  dish, 
  index, 
  visible,
  onAddToCart 
}: { 
  dish: Dish; 
  index: number; 
  visible: boolean;
  onAddToCart?: (dish: any) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const handleOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrdering(true);
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hello Savanna Kitchen! 🍽️\nI'd like to order: *${dish.name}*\nPrice: TZS ${dish.price.toLocaleString()}`
    )}`;
    setTimeout(() => {
      window.open(waLink, "_blank", "noopener,noreferrer");
      setOrdering(false);
    }, 450);
  };

  const imageProps = dish.image ? urlFor(dish.image).width(800).url() : null;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(36px) scale(0.97)",
        transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms, border-color 0.3s ease`,
        backgroundColor: "var(--color-background)",
        borderRadius: "var(--radius-2xl)",
        border: `1.5px solid ${hovered ? "var(--color-primary)" : "var(--color-border)"}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: hovered ? "var(--shadow-xl)" : "var(--shadow-sm)",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", backgroundColor: "var(--color-surface)" }}>
        {imageProps ? (
          <Image
            src={imageProps}
            alt={dish.name}
            fill
            className="object-cover"
            onLoad={() => setImgLoaded(true)}
            style={{
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)",
              opacity: imgLoaded ? 1 : 0,
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>
            <span style={{ fontSize: "var(--text-xs)" }}>No Image</span>
          </div>
        )}
        
        {/* Floating Add to Cart Button */}
        <button
          onClick={() => onAddToCart && onAddToCart(dish)}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "white",
            color: "var(--color-primary)",
            border: "none",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 10,
            transform: hovered ? "scale(1.1)" : "scale(1)",
            transition: "all 0.2s ease"
          }}
          title="Add to Cart"
        >
          <Plus size={20} strokeWidth={3} />
        </button>

        {/* Updated: Overlay Multi-Badges */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem", zIndex: 10 }}>
          {dish.tags?.map((tagValue) => (
            <div 
              key={tagValue}
              style={{ 
                display: "flex", 
                gap: "0.4rem", 
                alignItems: "center", 
                backgroundColor: "var(--color-primary)", 
                color: "#1a1a1a", 
                padding: "0.3rem 0.7rem", 
                borderRadius: "var(--radius-full)", 
                fontSize: "10px", 
                fontWeight: 700,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {getBadgeIcon(tagValue)} {tagValue.toUpperCase()}
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: "0.8rem", right: "1rem", color: "#1a1a1a", fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-accent)",backgroundColor: "rgba(255, 255, 255, 0.9)", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
          <span style={{ fontSize: "0.8rem" }}>TZS</span> {dish.price.toLocaleString()}
        </div>
      </div>

      <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Updated: Joins multiple categories with a dot */}
        <span style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
          {dish.categories?.join(" • ")}
        </span>
        
        <h3 style={{ margin: "0.4rem 0", fontSize: "1.25rem", color: "var(--color-text-primary)" }}>{dish.name}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "1.5rem", flex: 1 }}>{dish.description}</p>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            onClick={handleOrder}
            disabled={ordering}
            style={{
              flex: 1, padding: "0.8rem", borderRadius: "var(--radius-xl)", cursor: "pointer",
              backgroundColor: hovered ? "var(--color-primary)" : "transparent",
              color: hovered ? "white" : "var(--color-primary)",
              border: `2px solid ${hovered ? "var(--color-primary)" : "var(--color-border)"}`,
              transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
              fontWeight: 600
            }}
          >
            {ordering ? "Connecting..." : <><ShoppingBag size={16} /> Order Now</>}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Main Section ──────────────────────────────── */
export default function FeaturedDishesClient({ dishes }: { dishes: Dish[] }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  const handleAddToCart = (dish: Dish) => {
    // This is where you would connect to your global cart state/context
    console.log("Adding to cart:", dish.name);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "6rem 0", backgroundColor: "var(--color-surface)" }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s" }}>
          <span className="label">— From Our Kitchen —</span>
          <h2 style={{ fontSize: "2.5rem", margin: "0.5rem 0" }}>Our Signature Dishes</h2>
          <div className="heading-underline" style={{ margin: "0.5rem auto 1.5rem" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
          {dishes && dishes.length > 0 ? (
            dishes.map((dish, i) => (
              <DishCard 
                key={dish._id || i} 
                dish={dish} 
                index={i} 
                visible={visible} 
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>
              No dishes found in the featured list.
            </div>
          )}
        </div>

        <div style={{ marginTop: "4rem", textAlign: "center", opacity: visible ? 1 : 0, transition: "opacity 0.8s 0.6s" }}>
          <Link href="/menu" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            View Full Menu <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}