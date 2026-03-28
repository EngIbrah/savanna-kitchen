"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderStatusButton({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/update-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStyle = () => {
    if (currentStatus === "completed") return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" };
    if (currentStatus === "cancelled") return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" };
    return { bg: "#fffbeb", text: "#d97706", border: "#fde68a" };
  };

  const s = getStyle();

  return (
    <select
      value={currentStatus}
      disabled={loading}
      onChange={(e) => updateStatus(e.target.value)}
      style={{
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        cursor: "pointer",
        outline: "none"
      }}
    >
      <option value="pending">⏳ Pending</option>
      <option value="completed">✅ Completed</option>
      <option value="cancelled">❌ Cancelled</option>
    </select>
  );
}