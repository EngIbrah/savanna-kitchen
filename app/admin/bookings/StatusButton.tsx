"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Send } from "lucide-react";

interface StatusButtonProps {
  id: string;
  currentStatus: string;
  guestName?: string;
  bookingDate?: string;
  bookingTime?: string;
  phone?: string;
}

export default function StatusButton({
  id,
  currentStatus,
  guestName = "Guest",
  bookingDate = "",
  bookingTime = "",
  phone = "",
}: StatusButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Handle Database Update
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/update-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle WhatsApp Confirmation Message
  const sendWhatsAppConfirmation = () => {
    if (!phone) return alert("No phone number available");
    
    const cleanPhone = phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hello ${guestName}! 🌿\n\nThis is Savanna Kitchen. We are happy to confirm your reservation for *${bookingDate}* at *${bookingTime}*.\n\nWe look forward to serving you! 🍽️`
    );
    
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  const getStatusColors = () => {
    switch (currentStatus) {
      case "confirmed": return { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" };
      case "cancelled": return { color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" };
      default: return { color: "#b45309", bg: "#fffbeb", border: "#fde68a" };
    }
  };

  const { color, bg, border } = getStatusColors();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {/* Status Dropdown */}
      <div style={{ position: "relative" }}>
        <select
          value={currentStatus}
          onChange={handleChange}
          disabled={loading}
          style={{
            appearance: "none",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            fontWeight: 700,
            color: color,
            backgroundColor: bg,
            border: `1px solid ${border}`,
            borderRadius: "8px",
            padding: "0.5rem 2rem 0.5rem 0.8rem",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s",
          }}
        >
          <option value="pending">⏳ Pending</option>
          <option value="confirmed">✓ Confirmed</option>
          <option value="cancelled">✕ Cancelled</option>
        </select>
        <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color }}>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Quick WhatsApp Confirm Button (Only shows if confirmed) */}
      {currentStatus === "confirmed" && (
        <button
          onClick={sendWhatsAppConfirmation}
          title="Send Confirmation Text"
          style={{
            backgroundColor: "#25D366",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Send size={14} />
        </button>
      )}
    </div>
  );
}