"use client"

import { useState } from "react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "var(--font-nunito)",
    }}>
      {/* Left brand panel */}
      <div style={{
        flex: "0 0 480px",
        background: "linear-gradient(145deg, #2DB89E 0%, #5E4FC9 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 52px",
        position: "relative",
        overflow: "hidden",
      }} className="auth-brand-panel">
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: 40, left: -80, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", top: "40%", right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 52, position: "relative", zIndex: 1 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(8px)",
            display: "grid", placeItems: "center",
            fontSize: 26, color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
          }}>
            ✦
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>
              Telesesh Spark
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
              Therapy Resource Library
            </div>
          </div>
        </div>

        <h2 style={{ margin: "0 0 20px", fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: -0.6, position: "relative", zIndex: 1 }}>
          Bright, playful therapy resources — ready for every session.
        </h2>

        <p style={{ margin: "0 0 40px", fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.65, fontWeight: 600, position: "relative", zIndex: 1 }}>
          Videos, songs, printables and games that keep autistic learners engaged while you lead the way.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, position: "relative", zIndex: 1 }}>
          {[
            { emoji: "🎬", label: "Videos" },
            { emoji: "🎵", label: "Audio" },
            { emoji: "📄", label: "Docs" },
            { emoji: "🎮", label: "Games" },
          ].map(({ emoji, label }) => (
            <span key={label} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
            }}>
              {emoji} {label}
            </span>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        padding: "48px 32px",
      }}>
        <div style={{ width: "100%", maxWidth: 420, animation: "fadeIn 0.5s ease both" }}>
          {/* Back to login */}
          <Link href="/sign-in" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#6C6580",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            marginBottom: 36,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to login
          </Link>

          {sent ? (
            /* Sent state */
            <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease both" }}>
              {/* Teal checkmark circle */}
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "#D4F1EA",
                display: "grid", placeItems: "center",
                margin: "0 auto 24px",
              }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2DB89E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>

              <h1 style={{ margin: "0 0 12px", fontSize: 30, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.5 }}>
                Check your inbox!
              </h1>
              <p style={{ margin: "0 0 32px", fontSize: 16, color: "#6C6580", fontWeight: 600, lineHeight: 1.6 }}>
                We&apos;ve sent a password reset link to{" "}
                <strong style={{ color: "#2A2F4A" }}>{email}</strong>.
                Check your spam folder if it doesn&apos;t arrive within a few minutes.
              </p>

              <Link href="/sign-in" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "15px 28px",
                borderRadius: 16,
                background: "#2DB89E",
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                textDecoration: "none",
                boxShadow: "0 8px 22px rgba(45, 184, 158, 0.35)",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to login
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Lock icon in coral soft circle */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "#FFE3D2",
                display: "grid", placeItems: "center",
                marginBottom: 24,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D76B3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              <h1 style={{ margin: "0 0 12px", fontSize: 30, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.5, lineHeight: 1.1 }}>
                Forgot password?
              </h1>
              <p style={{ margin: "0 0 32px", fontSize: 16, color: "#6C6580", fontWeight: 600, lineHeight: 1.6 }}>
                No worries! Enter your email below and we&apos;ll send you a reset link to get back into your account.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#2A2F4A", marginBottom: 8, letterSpacing: 0.2 }}>
                    Email address
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#9A8B7E", pointerEvents: "none" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@clinic.com"
                      style={{
                        width: "100%",
                        padding: "14px 16px 14px 48px",
                        borderRadius: 14,
                        border: "2px solid #F4ECE3",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#2A2F4A",
                        background: "#FAF4ED",
                        fontFamily: "inherit",
                        outline: "none",
                        transition: "border-color 0.18s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#D76B3F")}
                      onBlur={(e) => (e.target.style.borderColor = "#F4ECE3")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  style={{
                    width: "100%",
                    padding: "16px 24px",
                    borderRadius: 16,
                    border: "none",
                    background: loading || !email.trim() ? "#E8C8B8" : "#D76B3F",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 16,
                    cursor: loading || !email.trim() ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    boxShadow: loading || !email.trim() ? "none" : "0 8px 22px rgba(215, 107, 63, 0.35)",
                    transition: "all 0.18s ease",
                  }}
                >
                  {loading ? "Sending…" : (
                    <>
                      Send reset link
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <p style={{ marginTop: 28, textAlign: "center", fontSize: 14, color: "#6C6580", fontWeight: 600 }}>
                Remember it?{" "}
                <Link href="/sign-in" style={{ color: "#D76B3F", fontWeight: 800, textDecoration: "none" }}>
                  Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  )
}
