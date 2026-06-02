"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

const ROLES = ["SLPA", "SLP", "OT", "Counselor", "Teacher"] as const
type Role = typeof ROLES[number]

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<Role | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isValid = name.trim() && email.trim() && password.length >= 6 && role !== null && agreed

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setError("")
    setLoading(true)

    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: { name, email, password, password_confirmation: password, role } }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.errors?.join(", ") ?? "Registration failed.")
      setLoading(false)
      return
    }

    const result = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)

    if (result?.error) {
      setError("Account created but sign-in failed. Please sign in manually.")
      router.push("/sign-in")
      return
    }

    router.push("/")
    router.refresh()
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

        <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.7)", fontWeight: 700, position: "relative", zIndex: 1 }}>
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
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 420, animation: "fadeIn 0.5s ease both" }}>
          {/* Label */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 999,
            background: "#D4F1EA",
            color: "#2DB89E",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1,
            marginBottom: 18,
          }}>
            GET STARTED ✨
          </div>

          <h1 style={{
            margin: "0 0 8px",
            fontSize: 34,
            fontWeight: 900,
            color: "#2A2F4A",
            letterSpacing: -0.6,
            lineHeight: 1.1,
          }}>
            Create your account
          </h1>
          <p style={{ margin: "0 0 32px", fontSize: 16, color: "#6C6580", fontWeight: 600 }}>
            Join thousands of therapists using Spark every session.
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

            {/* Full name */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#2A2F4A", marginBottom: 8, letterSpacing: 0.2 }}>
                Full name
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#9A8B7E", pointerEvents: "none" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
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
                  onFocus={(e) => (e.target.style.borderColor = "#2DB89E")}
                  onBlur={(e) => (e.target.style.borderColor = "#F4ECE3")}
                />
              </div>
            </div>

            {/* Email */}
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
                  onFocus={(e) => (e.target.style.borderColor = "#2DB89E")}
                  onBlur={(e) => (e.target.style.borderColor = "#F4ECE3")}
                />
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#2A2F4A", marginBottom: 10, letterSpacing: 0.2 }}>
                Your role
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      padding: "9px 18px",
                      borderRadius: 999,
                      border: "2px solid",
                      borderColor: role === r ? "#2DB89E" : "#F4ECE3",
                      background: role === r ? "#D4F1EA" : "#FAF4ED",
                      color: role === r ? "#2DB89E" : "#6C6580",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.18s ease",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#2A2F4A", marginBottom: 8, letterSpacing: 0.2 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#9A8B7E", pointerEvents: "none" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
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
                  onFocus={(e) => (e.target.style.borderColor = "#2DB89E")}
                  onBlur={(e) => (e.target.style.borderColor = "#F4ECE3")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#9A8B7E",
                    padding: 4, display: "grid", placeItems: "center",
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

            {/* Terms */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <div
                onClick={() => setAgreed(!agreed)}
                style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: "2px solid",
                  borderColor: agreed ? "#2DB89E" : "#D6C8B6",
                  background: agreed ? "#2DB89E" : "#fff",
                  display: "grid", placeItems: "center",
                  flexShrink: 0, cursor: "pointer",
                  transition: "all 0.18s ease",
                  marginTop: 1,
                }}
              >
                {agreed && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 13.5, color: "#6C6580", fontWeight: 600, lineHeight: 1.5 }}>
                I agree to the{" "}
                <a href="#" style={{ color: "#2DB89E", fontWeight: 800, textDecoration: "none" }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" style={{ color: "#2DB89E", fontWeight: 800, textDecoration: "none" }}>Privacy Policy</a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || loading}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: 16,
                border: "none",
                background: !isValid || loading ? "#C8E8E1" : "#2DB89E",
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                cursor: !isValid || loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: !isValid || loading ? "none" : "0 8px 22px rgba(45, 184, 158, 0.35)",
                transition: "all 0.18s ease",
                marginTop: 4,
              }}
            >
              {loading ? "Creating account…" : (
                <>
                  Continue to plans
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p style={{ marginTop: 28, textAlign: "center", fontSize: 14, color: "#6C6580", fontWeight: 600 }}>
            Already have an account?{" "}
            <Link href="/sign-in" style={{ color: "#2DB89E", fontWeight: 800, textDecoration: "none" }}>
              Log in
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
