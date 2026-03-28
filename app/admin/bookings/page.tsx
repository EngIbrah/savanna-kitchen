import { getAllReservations } from "@/lib/supabase"; // Use your helper
import { Phone } from "lucide-react";
import StatusButton from "./StatusButton";

export default async function BookingsPage() {
  // Use the admin-powered function instead of the public client
  const bookings = await getAllReservations(); 

  return (
    <div style={{ padding: "2.5rem 2rem" }}> {/* Added padding-top fix here too */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "0.25rem" }}>
          Reservations
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
          {bookings?.length ?? 0} total bookings
        </p>
      </div>

      <div style={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-2xl)", border: "1px solid var(--color-border)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        {!bookings?.length ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
             <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>📅</p>
             <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}>
               No reservations found in the database.
             </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-background)" }}>
                  {["Guest", "Date", "Time", "Guests", "Occasion", "Contact", "Action"].map(h => (
                    <th key={h} style={{ padding: "1rem 1.25rem", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", borderBottom: "1px solid var(--color-border)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>{b.name}</p>
                      {b.requests && <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>{b.requests}</p>}
                    </td>
                    <td style={{ padding: "1rem 1.25rem", fontSize: "14px" }}>{b.date}</td>
                    <td style={{ padding: "1rem 1.25rem", fontSize: "14px" }}>{b.time}</td>
                    <td style={{ padding: "1rem 1.25rem", fontSize: "14px" }}>{b.guests}</td>
                    <td style={{ padding: "1rem 1.25rem", fontSize: "14px" }}>{b.occasion || "—"}</td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <a 
                        href={`https://wa.me/${b.phone?.replace(/\D/g, "")}`} 
                        target="_blank" 
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", backgroundColor: "#25D366", color: "white", padding: "0.4rem 0.8rem", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: 600 }}
                      >
                        <Phone size={12} /> WhatsApp
                      </a>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <
                        StatusButton id={b.id!} 
                        currentStatus={b.status || "pending"} 
                        phone={b.phone}
                        guestName={b.name}
                        bookingDate={b.date}
                        bookingTime={b.time}
                      />
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}