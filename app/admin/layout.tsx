"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Leaf,
  LogOut,
  ExternalLink,
  ShoppingBag,
  BarChart3, 
  Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [resBookings, resMessages, resOrders] = await Promise.all([
          supabase
            .from("reservations")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("contact_messages")
            .select("*", { count: "exact", head: true })
            .eq("is_read", false),
          supabase
            .from("whatsapp_orders")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
        ]);

        setPendingCount(resBookings.count || 0);
        setUnreadCount(resMessages.count || 0);
        setOrderCount(resOrders.count || 0);
      } catch (error) {
        console.error("Error fetching admin counts:", error);
      }
    };

    fetchCounts();

    const channel = supabase
      .channel("admin-stats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "whatsapp_orders" },
        () => fetchCounts()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations" },
        () => fetchCounts()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => fetchCounts()
      )
      .subscribe();

    const interval = setInterval(fetchCounts, 120000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [pathname]);

  const NAV = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar, badge: pendingCount },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag, badge: orderCount },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare, badge: unreadCount },
  ];

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--color-background)",
      }}
    >
      <aside
        style={{
          width: "240px",
          backgroundColor: "var(--color-secondary)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "1.5rem 1.25rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Leaf size={15} color="white" />
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--color-text-light)",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Savanna Kitchen
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                color: "rgba(245,240,232,0.45)",
                margin: 0,
              }}
            >
              Admin Panel
            </p>
          </div>
        </div>

        <nav style={{ padding: "1rem 0.75rem", flex: 1 }}>
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href;
            // Determine badge color: Red for messages (urgent), Primary for others
            const badgeBg = label === "Messages" ? "#ef4444" : "var(--color-primary)";
            
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: active ? 600 : 400,
                  color: active ? "white" : "rgba(245,240,232,0.60)",
                  backgroundColor: active ? "rgba(200,121,58,0.25)" : "transparent",
                  borderRadius: "var(--radius-lg)",
                  padding: "0.65rem 0.9rem",
                  marginBottom: "0.2rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  borderLeft: active
                    ? "3px solid var(--color-primary)"
                    : "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <Icon size={17} />
                  {label}
                </div>

                {Number(badge) > 0 && (
                  <span
                    style={{
                      backgroundColor: badgeBg,
                      color: "white",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "10px",
                      minWidth: "18px",
                      textAlign: "center",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            padding: "1rem 0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
            <Link
            href="/studio"
          style={{
           display: "flex",
           alignItems: "center",
             gap: "0.65rem",
         fontFamily: "var(--font-body)",
        fontSize: "var(--text-sm)",
         color: "rgba(245,240,232,0.55)",
          padding: "0.65rem 0.9rem",
          borderRadius: "var(--radius-lg)",
         textDecoration: "none",
         transition: "background 0.2s ease",
    }}
    // Optional: Add a hover effect since it's now an internal link
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(245,240,232,0.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
     <Settings size={16} /> 
       Manage Content
     </Link>

          <a
            href="/"
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "rgba(245,240,232,0.55)",
              padding: "0.65rem 0.9rem",
              borderRadius: "var(--radius-lg)",
              textDecoration: "none",
            }}
          >
            <ExternalLink size={16} /> View Live Site
          </a>

          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "rgba(245,240,232,0.55)",
              backgroundColor: "transparent",
              border: "none",
              padding: "0.65rem 0.9rem",
              borderRadius: "var(--radius-lg)",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: "auto", height: "100vh" }}>{children}</main>
    </div>
  );
}