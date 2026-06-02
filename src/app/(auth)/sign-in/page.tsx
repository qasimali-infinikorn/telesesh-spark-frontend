"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (result?.error) { setError("Invalid email or password. Please try again."); return }
    router.push(callbackUrl)
    router.refresh()
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    await signIn("google", { callbackUrl })
  }

  return (
    <div style={{
      width: "100%", maxWidth: 460,
      animation: "fadeIn 0.45s ease both",
      fontFamily: "var(--font-nunito)",
    }}>
      {/* Label */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 14px", borderRadius: 999,
        background: "#FFE3D2", color: "#D76B3F",
        fontSize: 12, fontWeight: 800, letterSpacing: 0.8,
        marginBottom: 20, whiteSpace: "nowrap",
      }}>
        WELCOME BACK 👋
      </div>

      <h1 style={{
        margin: "0 0 8px", fontSize: 36, fontWeight: 900,
        color: "#2A2F4A", letterSpacing: -0.8, lineHeight: 1.1,
      }}>
        Log in to Spark
      </h1>
      <p style={{ margin: "0 0 32px", fontSize: 15.5, color: "#6C6580", fontWeight: 600, lineHeight: 1.5 }}>
        Pick up right where your sessions left off.
      </p>

      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        style={{
          width: "100%", padding: "14px 20px", borderRadius: 16,
          border: "2px solid #E8E0D8", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          fontSize: 15, fontWeight: 700, color: "#2A2F4A",
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 2px 8px rgba(40,20,10,0.06)",
          transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
          marginBottom: 20,
          opacity: googleLoading ? 0.7 : 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#D76B3F"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(40,20,10,0.1)" }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E0D8"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(40,20,10,0.06)" }}
      >
        <GoogleIcon />
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "#F0E4D6" }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#B8A99A" }}>or</span>
        <div style={{ flex: 1, height: 1, background: "#F0E4D6" }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: 14,
            background: "#FFF0EE", border: "1px solid #FCCCC6",
            color: "#C0392B", fontSize: 14, fontWeight: 700,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#2A2F4A", marginBottom: 8 }}>
            Email address
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#C2A893", pointerEvents: "none" }}>
              <MailIcon />
            </span>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@clinic.org"
              style={{
                width: "100%", padding: "14px 16px 14px 46px",
                borderRadius: 14, border: "2px solid #F0E4D6",
                background: "#FAF4ED", fontSize: 15, fontWeight: 600,
                color: "#2A2F4A", outline: "none", fontFamily: "inherit",
                boxSizing: "border-box", transition: "border-color 0.15s, background 0.15s",
              }}
              onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }}
              onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 800, color: "#2A2F4A" }}>Password</label>
            <Link href="/forgot-password" style={{ fontSize: 13, fontWeight: 700, color: "#D76B3F", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#C2A893", pointerEvents: "none" }}>
              <LockIcon />
            </span>
            <input
              type={showPw ? "text" : "password"} required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "14px 48px 14px 46px",
                borderRadius: 14, border: "2px solid #F0E4D6",
                background: "#FAF4ED", fontSize: 15, fontWeight: 600,
                color: "#2A2F4A", outline: "none", fontFamily: "inherit",
                boxSizing: "border-box", transition: "border-color 0.15s, background 0.15s",
              }}
              onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }}
              onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }}
            />
            <button
              type="button" onClick={() => setShowPw(s => !s)}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                border: "none", background: "none", color: "#C2A893",
                cursor: "pointer", display: "grid", placeItems: "center", padding: 4,
              }}
            >
              {showPw ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit" disabled={loading}
          style={{
            width: "100%", padding: "16px 20px", borderRadius: 16, border: "none",
            background: loading ? "#E8C4B4" : "#D76B3F", color: "#fff",
            fontWeight: 800, fontSize: 16, cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: loading ? "none" : "0 10px 24px rgba(215,107,63,0.38)",
            transition: "transform 0.15s, box-shadow 0.15s",
            marginTop: 4,
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 14px 28px rgba(215,107,63,0.45)" }}}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(215,107,63,0.38)" }}
        >
          {loading ? "Signing in…" : <>Log in <ArrowIcon /></>}
        </button>
      </form>

      <p style={{ marginTop: 24, textAlign: "center", color: "#6C6580", fontWeight: 600, fontSize: 14.5 }}>
        New to Spark?{" "}
        <Link href="/sign-up" style={{ color: "#D76B3F", fontWeight: 800, textDecoration: "none" }}>
          Create an account
        </Link>
      </p>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "var(--font-nunito)" }}>

      {/* ── Left brand panel ── */}
      <div style={{
        flex: "0 0 48%", maxWidth: 600,
        background: "linear-gradient(145deg, #2DB89E 0%, #34CBAE 35%, #7A5BC9 100%)",
        display: "flex", flexDirection: "column",
        padding: "52px 56px", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative bubbles */}
        <div style={{ position: "absolute", top: -70, right: -70, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.09)" }} />
        <div style={{ position: "absolute", top: "38%", right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: 30, left: -90, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: -60, right: 60, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 15,
            background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)",
            border: "1.5px solid rgba(255,255,255,0.35)",
            display: "grid", placeItems: "center", fontSize: 24, color: "#fff",
          }}>✦</div>
          <div>
            <div style={{ fontSize: 21, fontWeight: 900, color: "#fff", letterSpacing: -0.4, lineHeight: 1 }}>Telesesh Spark</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>Therapy Resource Library</div>
          </div>
        </div>

        {/* Main content — vertically centered */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{ margin: "0 0 18px", fontSize: 34, fontWeight: 900, color: "#fff", lineHeight: 1.18, letterSpacing: -0.6 }}>
            Bright, playful therapy resources — ready for every session.
          </h2>
          <p style={{ margin: "0 0 36px", fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.65, fontWeight: 600, maxWidth: 400 }}>
            Videos, songs, printables and games that keep autistic learners engaged while you lead the way.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[["🎬","Videos"],["🎵","Audio"],["📄","Docs"],["🎮","Games"]].map(([emoji, label]) => (
              <span key={label} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "9px 18px", borderRadius: 999,
                background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: "#fff", fontWeight: 700, fontSize: 14,
              }}>{emoji} {label}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.68)", fontWeight: 700, position: "relative", zIndex: 1 }}>
          Trusted by speech, OT &amp; counseling teams 🌈
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        background: "#fff", padding: "48px 40px", overflowY: "auto",
      }}>
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .auth-brand { display: none !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Icons ─────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/>
    </svg>
  )
}
function MailIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>
}
function LockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
}
function EyeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
}
function EyeOffIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7c2 0 3.7.5 5.2 1.3M22 12s-3.5 7-10 7c-2 0-3.7-.5-5.2-1.3"/><path d="M3 3l18 18"/></svg>
}
function ArrowIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
}
