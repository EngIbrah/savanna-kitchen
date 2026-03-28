"use client";

import { urlFor } from "@/lib/sanity";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { supabase } from "@/lib/supabase";
import { 
  Plus, 
  Minus, 
  Send, 
  X, 
  ShoppingBag, 
  ChevronRight,
  MessageSquare,
  Star,
  Search,
  Flame,
  Heart
} from "lucide-react";

/* ─── Types ─────────────────────────────────────── */
type MenuItem = {
  _id: string;
  name: string;
  nameSwahili?: string; // Added for search support
  description: string;
  price: number;
  categories: string[]; // Changed to array
  tags?: string[];      // Changed to array
  isVegetarian: boolean;
  isSpicy: boolean;
  prepTime: string;
  image: SanityImageSource;
};

type CartItem = MenuItem & { 
  quantity: number;
  note?: string; 
};

const CATEGORIES = [
  { label: "All", emoji: "🍽️" },
  { label: "Breakfast", emoji: "🌅" },
  { label: "Lunch", emoji: "☀️" },
  { label: "Dinner", emoji: "🌙" },
  { label: "Drinks", emoji: "🥤" },
  { label: "Desserts", emoji: "🍯" },
];

const PHONE = "255748412022";

/* ─── Icon Mapper ───────────────────────────────── */
const getBadgeIcon = (tag: string) => {
  switch (tag) {
    case "special":  return <Flame size={10} />;
    case "loved":    return <Heart size={10} />;
    case "favorite": return <Star size={10} />;
    default:         return <Star size={10} />;
  }
};

/* ─── Menu Card Component ───────────────────────── */
function MenuCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: "1rem",
        backgroundColor: "var(--color-surface)",
        borderRadius: "1.25rem",
        border: `1.5px solid ${hovered ? "var(--color-primary)" : "var(--color-border)"}`,
        padding: "1rem",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 24px -10px rgba(0,0,0,0.1)" : "none",
        position: "relative"
      }}
    >
      <div style={{ minWidth: "100px", width: "100px", height: "100px", position: "relative" }}>
        <Image
          src={item.image ? urlFor(item.image).width(400).url() : "/placeholder.jpg"}
          alt={item.name}
          fill
          className="rounded-2xl"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {item.tags?.map(tag => (
                <span key={tag} style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "9px", backgroundColor: "var(--color-primary)", color: "white", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                  {getBadgeIcon(tag)} {tag}
                </span>
              ))}
            </div>
            {item.isSpicy && <span title="Spicy">🌶️</span>}
          </div>
          <h3 style={{ fontSize: "1.05rem", margin: "4px 0 2px 0", fontWeight: 700 }}>{item.name}</h3>
          <span style={{ fontSize: "10px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
            {item.categories?.join(" • ")}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
          <p style={{ fontWeight: 800, fontSize: "0.95rem", margin: 0 }}>
            <span style={{ fontSize: "0.7rem", color: "gray", fontWeight: 400 }}>TZS</span> {item.price.toLocaleString()}
          </p>

          <button 
            onClick={() => onAdd(item)}
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
              border: "none",
              padding: "6px 14px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Add <Plus size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Main Menu Component ───────────────────────── */
export default function MenuClient({ items }: { items: MenuItem[] }) {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, note: "" }];
    });
  };

  const updateNote = (id: string, note: string) => {
    setCart((prev) => prev.map((i) => i._id === id ? { ...i, note } : i));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.map((i) => i._id === id ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const recommendations = items
    .filter(item => !cart.find(c => c._id === item._id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    
    try {
     await supabase.from("whatsapp_orders").insert([{ 
     items: cart.map(i => ({
     name: i.name,
     quantity: i.quantity,
     price: i.price,
     note: i.note || ""
  })),
  price: totalPrice, // Still keep this for quick revenue sum!
  status: 'pending' 
}]);

      const message = encodeURIComponent(
        `Hello Savanna Kitchen! 🌿\n\nNew Order:\n${cart.map(i => 
          `• *${i.quantity}x ${i.name}* ${i.note ? `\n   _Note: ${i.note}_` : ''}\n   (TZS ${(i.price * i.quantity).toLocaleString()})`
        ).join("\n")}\n\n*Total: TZS ${totalPrice.toLocaleString()}*`
      );
      
      window.open(`https://wa.me/${PHONE}?text=${message}`, "_blank");
      setCart([]);
      setShowCart(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOrdering(false);
    }
  };

  /* UPDATED FILTERING LOGIC */
  const filtered = items.filter((item) => {
    // Check categories array instead of single string
    const matchCat = activeCat === "All" || (item.categories && item.categories.includes(activeCat));
    
    // Check English and Swahili names
    const searchLower = search.toLowerCase();
    const matchSearch = 
      item.name.toLowerCase().includes(searchLower) || 
      (item.nameSwahili && item.nameSwahili.toLowerCase().includes(searchLower));

    return matchCat && matchSearch;
  });

  return (
    <div className="container" style={{ paddingTop: "120px", paddingBottom: "120px", maxWidth: "1200px", margin: "0 auto", paddingLeft: "1rem", paddingRight: "1rem" }}>
      
      {/* ── Filter & Search Section ── */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
          
          <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
            <Search style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} size={18} />
            <input 
              type="text"
              placeholder="Search dishes or chakula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem 1rem 1rem 3rem",
                borderRadius: "1rem",
                border: "1.5px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", width: "100%", paddingBottom: "10px", justifyContent: "center" }} className="hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCat(cat.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "2rem",
                  border: "none",
                  backgroundColor: activeCat === cat.label ? "var(--color-primary)" : "var(--color-surface)",
                  color: activeCat === cat.label ? "white" : "var(--color-text-primary)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Results */}
      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
        {filtered.map((item) => (
          <MenuCard key={item._id} item={item} onAdd={addToCart} />
        ))}
      </div>

      {/* ... (Floating Bar and Cart Drawer remain the same) */}
      {/* ── Floating Bar ── */}
      {totalItems > 0 && (
        <div onClick={() => setShowCart(true)} style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "500px", backgroundColor: "#1a1a1a", color: "white", padding: "1rem 1.5rem", borderRadius: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.4)", zIndex: 100, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ position: "relative", backgroundColor: "var(--color-primary)", padding: "10px", borderRadius: "12px" }}><ShoppingBag size={20} /></div>
            <div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{totalItems} Items</p>
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>TZS {totalPrice.toLocaleString()}</p>
            </div>
          </div>
          <ChevronRight />
        </div>
      )}

      {/* ── Cart Drawer Overlay ── */}
      {showCart && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", justifyContent: "flex-end" }} onClick={() => setShowCart(false)}>
          <div style={{ width: "100%", maxWidth: "420px", backgroundColor: "#fff", height: "100%", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>Your Plate</h2>
              <X onClick={() => setShowCart(false)} style={{ cursor: "pointer" }} />
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
              {cart.map(item => (
                <div key={item._id} style={{ marginBottom: "2rem", borderBottom: "1px solid #f9f9f9", paddingBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>{item.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f5f5f5", padding: "4px 8px", borderRadius: "8px" }}>
                      <Minus size={14} onClick={() => removeFromCart(item._id)} />
                      <span style={{ fontWeight: 800 }}>{item.quantity}</span>
                      <Plus size={14} onClick={() => addToCart(item)} />
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#fcfcfc", border: "1px solid #eee", padding: "8px", borderRadius: "8px" }}>
                    <MessageSquare size={14} color="#aaa" />
                    <input 
                      placeholder="Special note (e.g. No onions)" 
                      value={item.note}
                      onChange={(e) => updateNote(item._id, e.target.value)}
                      style={{ border: "none", background: "none", fontSize: "12px", width: "100%", outline: "none" }}
                    />
                  </div>
                </div>
              ))}

              {recommendations.length > 0 && (
                <div style={{ marginTop: "2rem", backgroundColor: "#f9fafb", padding: "1rem", borderRadius: "1rem" }}>
                  <p style={{ margin: "0 0 1rem", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "5px" }}>
                    <Star size={14} fill="var(--color-primary)" color="var(--color-primary)" /> Complete Your Meal
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {recommendations.map(rec => (
                      <div key={rec._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "8px", borderRadius: "10px", border: "1px solid #eee" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600 }}>{rec.name}</span>
                        <button onClick={() => addToCart(rec)} style={{ backgroundColor: "var(--color-primary)", color: "white", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "1.5rem", borderTop: "2px solid #f5f5f5" }}>
              <button onClick={handleCheckout} disabled={isOrdering} style={{ width: "100%", backgroundColor: "#25D366", color: "white", border: "none", padding: "1.1rem", borderRadius: "1rem", fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                {isOrdering ? "Placing Order..." : <>Checkout Order (TZS {totalPrice.toLocaleString()}) <Send size={18}/></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}