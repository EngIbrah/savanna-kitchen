// app/admin/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:       "100vh",
      backgroundColor: "var(--color-background)",
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      padding:         "1.5rem",
    }}>
      <div style={{
        width:           "100%",
        maxWidth:        "400px",
        backgroundColor: "var(--color-surface)",
        borderRadius:    "var(--radius-2xl)",
        border:          "1px solid var(--color-border)",
        padding:         "2.5rem",
        boxShadow:       "var(--shadow-xl)",
      }}>
        {/* Logo */}
        <div style={{
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          marginBottom:   "2rem",
          gap:            "0.75rem",
        }}>
          <div style={{
            width:           "52px",
            height:          "52px",
            borderRadius:    "50%",
            backgroundColor: "var(--color-primary)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            boxShadow:       "var(--shadow-md)",
          }}>
            <Leaf size={24} color="white" />
          </div>
          <div style={{ textAlign: "center" }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize:   "var(--text-2xl)",
              fontWeight: 600,
              color:      "var(--color-text-primary)",
              margin:     0,
            }}>
              Savanna Kitchen
            </h1>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize:   "var(--text-sm)",
              color:      "var(--color-text-muted)",
              marginTop:  "0.25rem",
            }}>
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{
              fontFamily:   "var(--font-body)",
              fontSize:     "var(--text-sm)",
              fontWeight:   500,
              color:        "var(--color-text-primary)",
              marginBottom: "0.4rem",
              display:      "flex",
              alignItems:   "center",
              gap:          "0.4rem",
            }}>
              <Lock size={14} color="var(--color-primary)" />
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{
                width:           "100%",
                fontFamily:      "var(--font-body)",
                fontSize:        "var(--text-sm)",
                color:           "var(--color-text-primary)",
                backgroundColor: "var(--color-surface-warm)",
                border:          `1.5px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
                borderRadius:    "var(--radius-xl)",
                padding:         "0.8rem 1rem",
                outline:         "none",
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(200,121,58,0.12)";
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = error ? "var(--color-error)" : "var(--color-border)";
                e.currentTarget.style.boxShadow   = "none";
              }}
            />
            {error && (
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize:   "var(--text-xs)",
                color:      "var(--color-error)",
                marginTop:  "0.35rem",
              }}>
                ⚠ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              gap:             "0.5rem",
              width:           "100%",
              fontFamily:      "var(--font-body)",
              fontSize:        "var(--text-base)",
              fontWeight:      500,
              color:           "white",
              backgroundColor: "var(--color-primary)",
              borderRadius:    "var(--radius-xl)",
              padding:         "0.9rem",
              border:          "none",
              cursor:          loading ? "wait" : "pointer",
              opacity:         loading ? 0.8 : 1,
              boxShadow:       "var(--shadow-md)",
              transition:      "all 0.2s ease",
            }}
          >
            {loading ? <div className="spinner" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}