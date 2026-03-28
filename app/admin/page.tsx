import { getAllReservations, getAllMessages, supabase } from "@/lib/supabase";
import { Calendar, MessageSquare, Clock, Utensils, ShoppingCart } from "lucide-react";

async function getStats() {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().split(" ")[0].substring(0, 5); // "HH:MM" format

  const [bookings, messages, ordersRes] = await Promise.all([
    getAllReservations(),
    getAllMessages(),
    supabase.from("whatsapp_orders").select("price, status, created_at"),
  ]);

  // --- Sorting & Filtering Logic for "Upcoming" ---
  const upcomingBookings = bookings
    .filter((b) => {
      // 1. Keep if date is in the future
      if (b.date > todayStr) return true;
      // 2. Keep if date is today BUT time is still in the future
      if (b.date === todayStr && b.time >= currentTime) return true;
      return false;
    })
    .sort((a, b) => {
      // Primary sort by Date
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      // Secondary sort by Time
      return a.time.localeCompare(b.time);
    });
  
  return { 
    bookings: upcomingBookings, // Now sorted and filtered
    messages, 
    orders: ordersRes.data || [],
    todayStr
  };
}

export default async function AdminOverview() {
  const { bookings, messages, orders, todayStr } = await getStats();

  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const todayBookingsCount = bookings.filter(b => b.date === todayStr).length;
  const unreadMessages = messages.filter(m => !m.is_read).length;
  
  const todayOrders = orders.filter(o => 
    o.created_at?.startsWith(todayStr) && o.status !== "cancelled"
  );
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  const stats = [
    { icon: Clock, label: "Pending Now", value: pendingCount, color: "#f59e0b", href: "/admin/bookings" },
    { icon: Calendar, label: "Today's Bookings", value: todayBookingsCount, color: "var(--color-primary)", href: "/admin/bookings" },
    { icon: ShoppingCart, label: "Today's Orders", value: todayOrders.length, color: "#3b82f6", href: "/admin/orders" },
    { icon: Utensils, label: "Today's Sales", value: `TZS ${todayRevenue.toLocaleString()}`, color: "#10b981", href: "/admin/orders" },
    { icon: MessageSquare, label: "Unread Chats", value: unreadMessages, color: "var(--color-secondary)", href: "/admin/messages" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <style>{`
        .stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg) !important; border-color: var(--color-primary) !important; }
        .today-row { background-color: rgba(200, 121, 58, 0.05) !important; }
        .today-badge { color: var(--color-primary) !important; font-weight: 800 !important; }
      `}</style>

      {/* Header and Stats Grid remain the same as previous version */}
      <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>Dashboard</h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.25rem" }}>Live Operations</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
        {stats.map(({ icon: Icon, label, value, color, href }) => (
          <a key={label} href={href} className="stat-card" style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "var(--color-surface)", borderRadius: "1.25rem", border: "1px solid var(--color-border)", padding: "1.5rem", textDecoration: "none", transition: "all 0.3s ease" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={22} color={color} /></div>
            <div><p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-text-primary)", margin: 0 }}>{value}</p><p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 500, margin: 0 }}>{label}</p></div>
          </a>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        
        {/* RECENT / UPCOMING BOOKINGS TABLE */}
        <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "1.5rem", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Upcoming Schedule</h2>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{bookings.length} remaining</span>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-background)" }}>
                  {["Guest", "Date", "Guests", "Status"].map(h => (
                    <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.7rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>No upcoming bookings for today.</td></tr>
                ) : (
                  bookings.slice(0, 8).map((b) => {
                    const isToday = b.date === todayStr;
                    return (
                      <tr key={b.id} className={isToday ? "today-row" : ""} style={{ borderTop: "1px solid var(--color-border)" }}>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{b.name}</div>
                          <div style={{ fontSize: "0.75rem", color: isToday ? "var(--color-primary)" : "var(--color-text-muted)", fontWeight: isToday ? 700 : 400 }}>
                            {b.time} {isToday && "• NEXT"}
                          </div>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem" }}>
                          <span className={isToday ? "today-badge" : ""}>{isToday ? "TODAY" : b.date}</span>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", fontSize: "0.85rem" }}>{b.guests} ppl</td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span style={{
                            fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", borderRadius: "20px",
                            backgroundColor: b.status === "confirmed" ? "#dcfce7" : b.status === "cancelled" ? "#fee2e2" : "#fef3c7",
                            color: b.status === "confirmed" ? "#166534" : b.status === "cancelled" ? "#991b1b" : "#92400e",
                            textTransform: "capitalize"
                          }}>{b.status || "pending"}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Messaging & Kitchen Load Section remain from previous code */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
           <div style={{ backgroundColor: "#1a1a1a", color: "white", padding: "1.5rem", borderRadius: "1.5rem" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>Guest Feedback</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.7, lineHeight: 1.5 }}>You have {unreadMessages} unread messages.</p>
              <a href="/admin/messages" style={{ display: "inline-block", marginTop: "1rem", color: "var(--color-primary)", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}>Reply Now →</a>
           </div>

           <div style={{ backgroundColor: "var(--color-surface)", padding: "1.5rem", borderRadius: "1.5rem", border: "1px solid var(--color-border)" }}>
              <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>Kitchen Load</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                <span>Occupancy Forecast</span>
                <span style={{ fontWeight: 700 }}>{Math.min(100, (todayBookingsCount * 15))}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "var(--color-background)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (todayBookingsCount * 15))}%`, height: "100%", backgroundColor: "var(--color-primary)", transition: "width 1s ease-out" }} />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}