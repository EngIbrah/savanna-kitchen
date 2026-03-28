import { supabaseAdmin } from "@/lib/supabase";
import { MessageSquare, Clock } from "lucide-react";
import MarkReadButton from "@/components/MarkReadButton"; // Import the new button

export default async function MessagesPage() {
  if (!supabaseAdmin) {
    return <div style={{ padding: "2rem" }}>Admin client not configured.</div>;
  }

  const { data: messages } = await supabaseAdmin
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700 }}>
          Inquiries
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          {messages?.length ?? 0} messages received
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {!messages || messages.length === 0 ? (
          <div style={{ padding: "5rem", textAlign: "center", opacity: 0.5 }}>
            <MessageSquare size={48} style={{ margin: "0 auto 1rem" }} />
            <p>No messages in your inbox.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "1rem",
              border: m.is_read ? "1px solid var(--color-border)" : "1px solid var(--color-primary)",
              padding: "1.5rem",
              opacity: m.is_read ? 0.8 : 1,
              position: "relative"
            }}>
              {/* Red dot for unread */}
              {!m.is_read && (
                <div style={{
                  position: "absolute", left: "-5px", top: "50%", transform: "translateY(-50%)",
                  width: "10px", height: "10px", backgroundColor: "#ef4444", borderRadius: "50%"
                }} />
              )}

              {/* ... existing header details (Name, Email, Phone, Time) ... */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{m.name}</h3>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "4px" }}>
                     <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{m.email}</span>
                     <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{m.phone}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-text-muted)", fontSize: "11px" }}>
                  <Clock size={12} />
                  {new Date(m.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Message Body */}
              <div style={{ backgroundColor: "var(--color-background)", padding: "1rem", borderRadius: "8px", fontSize: "14px", borderLeft: "4px solid var(--color-primary)" }}>
                {m.message}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <a 
                   href={`https://wa.me/${m.phone?.replace(/\D/g, "")}`} 
                   target="_blank" 
                   style={{ backgroundColor: "#25D366", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", textDecoration: "none", fontWeight: 600 }}
                >
                  Reply via WhatsApp
                </a>

                {/* Show the Mark as Read button only if it's currently unread */}
                {!m.is_read && <MarkReadButton id={m.id} />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}