"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function MarkReadButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkRead = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        router.refresh(); // This updates the page and sidebar badge
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMarkRead}
      disabled={loading}
      style={{
        backgroundColor: "transparent",
        color: loading ? "var(--color-text-muted)" : "var(--color-primary)",
        border: "1px solid var(--color-primary)",
        borderRadius: "8px",
        padding: "6px 12px",
        fontSize: "12px",
        fontWeight: 600,
        cursor: loading ? "wait" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        opacity: loading ? 0.6 : 1,
      }}
    >
      <CheckCircle size={14} />
      {loading ? "Marking..." : "Mark as Read"}
    </button>
  );
}