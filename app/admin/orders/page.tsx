import { supabaseAdmin } from "@/lib/supabase";
import { ShoppingBag, Clock, Utensils, MessageCircle } from "lucide-react";
import OrderStatusButton from "./OrderStatusButton"

export default async function AdminOrdersPage() {
  if (!supabaseAdmin) return null;

  const { data: orders } = await supabaseAdmin
    .from("whatsapp_orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>Incoming Orders</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>Manage kitchen workflow</p>
        </div>
        <div style={{ backgroundColor: "var(--color-primary)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
          {orders?.length || 0} TOTAL
        </div>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {!orders || orders.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", opacity: 0.3 }}>
            <ShoppingBag size={40} style={{ margin: "0 auto 1rem" }} />
            <p>No orders yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "1rem",
              border: "1px solid var(--color-border)",
              padding: "1rem 1.25rem",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "1.5rem",
              alignItems: "center",
              transition: "transform 0.2s ease"
            }}>
              
              {/* Left Side: The Food Content */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                  <Clock size={14} color="var(--color-text-muted)" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-muted)" }}>
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {order.items && Array.isArray(order.items) ? (
                    order.items.map((item: any, idx: number) => (
                      <div key={idx} style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        backgroundColor: "var(--color-background)", 
                        padding: "4px 10px", 
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)"
                      }}>
                        <span style={{ fontWeight: 800, color: "var(--color-primary)", marginRight: "6px", fontSize: "0.9rem" }}>{item.quantity}x</span>
                        <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{item.name}</span>
                        {item.note && (
                          <div style={{ marginLeft: "8px", color: "#f59e0b" }} title={item.note}>
                            <MessageCircle size={14} fill="#f59e0b20" />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{order.item_name}</span>
                  )}
                </div>
                
                {/* Global order notes if any of the items have them */}
                {order.items?.some((i: any) => i.note) && (
                  <div style={{ fontSize: "0.75rem", color: "#f59e0b", marginTop: "4px", fontWeight: 500 }}>
                    * Special instructions included
                  </div>
                )}
              </div>

              {/* Right Side: Price & Action */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", borderLeft: "1px solid var(--color-border)", paddingLeft: "1.5rem" }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--color-text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total</p>
                  <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                    {order.price.toLocaleString()}
                  </p>
                </div>
                <OrderStatusButton id={order.id} currentStatus={order.status} />
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}