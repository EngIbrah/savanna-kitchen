import { supabaseAdmin } from "@/lib/supabase";
import { TrendingUp, PieChart, Clock, ArrowUpRight } from "lucide-react";

async function getAnalyticsData() {
  if (!supabaseAdmin) return null;

  const { data: orders } = await supabaseAdmin
    .from("whatsapp_orders")
    .select("price, items, created_at, status")
    .neq("status", "cancelled"); // Don't count lost money

  if (!orders) return null;

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // 1. Revenue Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  const todayRevenue = orders
    .filter(o => o.created_at.startsWith(todayStr))
    .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  // 2. Top Dishes (Flattening the JSON items)
  const dishCounts: Record<string, number> = {};
  orders.forEach(order => {
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        dishCounts[item.name] = (dishCounts[item.name] || 0) + item.quantity;
      });
    }
  });
  const topDishes = Object.entries(dishCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // 3. Busy Times (Hourly grouping)
  const hourlyTraffic: Record<number, number> = {};
  orders.forEach(o => {
    const hour = new Date(o.created_at).getHours();
    hourlyTraffic[hour] = (hourlyTraffic[hour] || 0) + 1;
  });

  return { totalRevenue, todayRevenue, topDishes, hourlyTraffic, totalOrders: orders.length };
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();
  if (!data) return <p>Loading analytics...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Business Insights</h1>
        <p style={{ color: "var(--color-text-muted)" }}>Performance overview for Savanna Kitchen</p>
      </header>

      {/* --- ROW 1: KEY STATS --- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <StatBox label="Today's Revenue" value={`TZS ${data.todayRevenue.toLocaleString()}`} icon={ArrowUpRight} color="#10b981" />
        <StatBox label="Total Sales (All Time)" value={`TZS ${data.totalRevenue.toLocaleString()}`} icon={TrendingUp} color="var(--color-primary)" />
        <StatBox label="Lifetime Orders" value={data.totalOrders} icon={PieChart} color="#3b82f6" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* --- TOP DISHES --- */}
        <section style={{ backgroundColor: "var(--color-surface)", padding: "1.5rem", borderRadius: "1.5rem", border: "1px solid var(--color-border)" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Popular Items</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {data.topDishes.map(([name, count], i) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontWeight: 800, color: "var(--color-text-muted)", width: "20px" }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{name}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{count} sold</span>
                  </div>
                  <div style={{ height: "6px", backgroundColor: "var(--color-background)", borderRadius: "3px" }}>
                    <div style={{ width: `${(count / data.totalOrders) * 100}%`, height: "100%", backgroundColor: "var(--color-primary)", borderRadius: "3px" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- PEAK HOURS --- */}
        <section style={{ backgroundColor: "var(--color-surface)", padding: "1.5rem", borderRadius: "1.5rem", border: "1px solid var(--color-border)" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Peak Order Times</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "150px", paddingBottom: "20px" }}>
            {[10, 12, 14, 16, 18, 20, 22].map(hour => {
              const count = data.hourlyTraffic[hour] || 0;
              const height = (count / Math.max(...Object.values(data.hourlyTraffic))) * 100;
              return (
                <div key={hour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "100%", height: `${height}%`, backgroundColor: "#3b82f630", borderTop: "3px solid #3b82f6", borderRadius: "4px 4px 0 0" }} />
                  <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", fontWeight: 700 }}>{hour}h</span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textAlign: "center", marginTop: "1rem" }}>
            <Clock size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} /> 
            Orders are highest during dinner (18:00 - 20:00).
          </p>
        </section>

      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }: any) {
  return (
    <div style={{ backgroundColor: "var(--color-surface)", padding: "1.5rem", borderRadius: "1.5rem", border: "1px solid var(--color-border)" }}>
      <div style={{ color, marginBottom: "0.5rem" }}><Icon size={24} /></div>
      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>{value}</p>
    </div>
  );
}