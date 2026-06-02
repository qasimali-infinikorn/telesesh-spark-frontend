"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Invalid email or password.")
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "var(--font-nunito)",
    }}>
      {/* Left brand panel — hidden on mobile */}
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
        {/* Decorative floating circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: 40, left: -80, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", top: "40%", right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: -40, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

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

        {/* Headline */}
        <h2 style={{
          margin: "0 0 20px",
          fontSize: 32,
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1.15,
          letterSpacing: -0.6,
          position: "relative",
          zIndex: 1,
        }}>
          Bright, playful therapy resources — ready for every session.
        </h2>

        <p style={{
          margin: "0 0 40px",
          fontSize: 16,
          color: "rgba(255,255,255,0.82)",
          lineHeight: 1.65,
          fontWeight: 600,
          position: "relative",
          zIndex: 1,
        }}>
          Videos, songs, printables and games that keep autistic learners engaged while you lead the way.
        </p>

        {/* Tag pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 52, position: "relative", zIndex: 1 }}>
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

        {/* Footer */}
        <div style={{
          fontSize: 13.5,
          color: "rgba(255,255,255,0.7)",
          fontWeight: 700,
          position: "relative",
          zIndex: 1,
        }}>
          Trusted by speech, OT &amp; counseling teams 🌈
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
          {/* Label */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 999,
            background: "#FFE3D2",
            color: "#D76B3F",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1,
            marginBottom: 18,
          }}>
            WELCOME BACK 👋
          </div>

          <h1 style={{
            margin: "0 0 8px",
            fontSize: 34,
            fontWeight: 900,
            color: "#2A2F4A",
            letterSpacing: -0.6,
            lineHeight: 1.1,
          }}>
            Log in to Spark
          </h1>
          <p style={{ margin: "0 0 36px", fontSize: 16, color: "#6C6580", fontWeight: 600 }}>
            Pick up right where your sessions left off.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {error && (
              <div style={{
                padding: "12px 16px",
                borderRadius: 14,
                background: "#FFF0F0",
                border: "1px solid #FFD0D0",
                color: "#C0392B",
                fontSize: 14,
                fontWeight: 700,
              }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#2A2F4A", marginBottom: 8, letterSpacing: 0.2 }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9A8B7E",
                  pointerEvents: "none",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 800, color: "#2A2F4A", letterSpacing: 0.2 }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{ fontSize: 13, fontWeight: 700, color: "#D76B3F", textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9A8B7E",
                  pointerEvents: "none",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "14px 48px 14px 48px",
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9A8B7E",
                    padding: 4,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: 16,
                border: "none",
                background: loading ? "#E8C8B8" : "#D76B3F",
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: loading ? "none" : "0 8px 22px rgba(215, 107, 63, 0.35)",
                transition: "all 0.18s ease",
                marginTop: 4,
              }}
            >
              {loading ? "Signing in…" : (
                <>
                  Log in to Spark
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p style={{ marginTop: 28, textAlign: "center", fontSize: 14, color: "#6C6580", fontWeight: 600 }}>
            New to Spark?{" "}
            <Link href="/sign-up" style={{ color: "#D76B3F", fontWeight: 800, textDecoration: "none" }}>
              Create an account
            </Link>
          </p>
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
