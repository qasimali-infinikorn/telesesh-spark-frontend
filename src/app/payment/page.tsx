"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { PLANS } from "@/lib/plans"
import { Lock, ChevronLeft, Check, CreditCard, User, Shield } from "lucide-react"

function SparkLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" />
      <path d="M19 1L19.8 3.2L22 4L19.8 4.8L19 7L18.2 4.8L16 4L18.2 3.2Z" opacity="0.7" />
    </svg>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "13px 16px",
  borderRadius: 14, border: "2px solid #F0E4D6", background: "#FAF4ED",
  fontSize: 15, fontWeight: 600, color: "#2A2F4A", outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
  transition: "border-color 0.15s, background 0.15s",
}

const label: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 800,
  color: "#6C6580", letterSpacing: 0.6,
  textTransform: "uppercase", marginBottom: 8,
}

function PaymentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan") ?? "pro"
  const plan = PLANS.find(p => p.id === planId) ?? PLANS[1]

  const [form, setForm] = useState({ name: "", number: "", exp: "", cvc: "" })
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const fmtNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
  const fmtExp    = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/(.{2})(.+)/, "$1/$2")

  const valid = form.name.trim() && form.number.replace(/\s/g, "").length >= 15 && form.exp.length >= 4 && form.cvc.length >= 3

  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setDone(true)
    setTimeout(() => router.push("/"), 1800)
  }

  if (done) {
    return (
      <div style={{
        minHeight: "100vh", background: "#FCEDDB",
        fontFamily: "var(--font-nunito)",
        display: "grid", placeItems: "center", padding: 24,
      }}>
        <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease both" }}>
          <div style={{
            width: 88, height: 88, borderRadius: 999, margin: "0 auto 24px",
            background: "#D4F1EA", color: "#2DB89E",
            display: "grid", placeItems: "center",
            boxShadow: "0 12px 28px rgba(45,184,158,0.3)",
          }}>
            <Check size={44} strokeWidth={2.5} />
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: 32, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.6 }}>
            You&apos;re all set!
          </h1>
          <p style={{ margin: "0 0 8px", fontSize: 16, color: "#6C6580", fontWeight: 600 }}>
            Your <strong style={{ color: plan.color }}>{plan.name}</strong> plan is now active.
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "#9A8B7E", fontWeight: 600 }}>
            Taking you to the library…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#FCEDDB",
      fontFamily: "var(--font-nunito)",
    }}>

      {/* Top bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 40px",
        background: "rgba(252,237,219,0.88)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(216,155,92,0.14)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: "linear-gradient(135deg, #2DB89E 0%, #34D4B5 100%)",
            color: "#fff", display: "grid", placeItems: "center",
            boxShadow: "0 5px 12px rgba(45,184,158,0.35)",
          }}>
            <SparkLogo />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.4, lineHeight: 1 }}>
              Telesesh <span style={{ color: "#2DB89E" }}>Spark</span>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9A8B7E", marginTop: 2 }}>
              Secure checkout
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#9A8B7E" }}>
          <Lock size={13} /> SSL encrypted
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px 80px" }}>
        <div style={{
          background: "#fff", borderRadius: 28,
          overflow: "hidden", display: "flex", flexWrap: "wrap",
          boxShadow: "0 24px 64px -20px rgba(40,20,10,0.2)",
          border: "1px solid #F0E4D6",
        }}>

          {/* ── Payment form ── */}
          <div style={{ flex: "1 1 340px", padding: "40px 36px" }}>
            <Link href="/packages" style={{ textDecoration: "none" }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 12,
                border: "2px solid #F0E4D6", background: "#fff",
                color: "#2A2F4A", fontWeight: 800, fontSize: 13.5,
                cursor: "pointer", fontFamily: "inherit", marginBottom: 28,
              }}>
                <ChevronLeft size={15} /> Plans
              </button>
            </Link>

            <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.5 }}>
              Payment details
            </h1>
            <p style={{ margin: "0 0 28px", fontSize: 15, color: "#6C6580", fontWeight: 600 }}>
              Secure checkout — cancel anytime.
            </p>

            <form onSubmit={handlePay} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Name on card */}
              <div>
                <label style={label}>Name on card</label>
                <div style={{ position: "relative" }}>
                  <User size={16} color="#C2A893" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="Faith Lopez"
                    style={{ ...inputStyle, paddingLeft: 44 }}
                    onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }}
                    onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }}
                  />
                </div>
              </div>

              {/* Card number */}
              <div>
                <label style={label}>Card number</label>
                <div style={{ position: "relative" }}>
                  <CreditCard size={16} color="#C2A893" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    value={form.number} onChange={e => set("number", fmtNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    style={{ ...inputStyle, paddingLeft: 44 }}
                    onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }}
                    onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }}
                  />
                </div>
              </div>

              {/* Expiry + CVC */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={label}>Expiry</label>
                  <input
                    value={form.exp} onChange={e => set("exp", fmtExp(e.target.value))}
                    placeholder="MM / YY"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }}
                    onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }}
                  />
                </div>
                <div>
                  <label style={label}>CVC</label>
                  <input
                    value={form.cvc} onChange={e => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="•••"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }}
                    onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!valid || loading}
                style={{
                  padding: "16px", borderRadius: 16, border: "none",
                  background: valid && !loading ? "#D76B3F" : "#F0E4D6",
                  color: valid && !loading ? "#fff" : "#B7AB99",
                  fontWeight: 800, fontSize: 16, cursor: valid && !loading ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: valid && !loading ? "0 10px 24px rgba(215,107,63,0.38)" : "none",
                  transition: "transform 0.15s",
                  marginTop: 4,
                }}
                onMouseEnter={e => { if (valid && !loading) e.currentTarget.style.transform = "translateY(-1px)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)" }}
              >
                {loading
                  ? <><span style={{ width: 18, height: 18, borderRadius: 999, border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Processing…</>
                  : <><Lock size={16} /> Pay ${plan.price} &amp; start my plan</>}
              </button>

              {/* Security note */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#9A8B7E", fontSize: 12.5, fontWeight: 700 }}>
                <Shield size={13} /> Encrypted &amp; secure · Demo only, no real charge
              </div>
            </form>
          </div>

          {/* ── Order summary ── */}
          <div style={{
            flex: "0 0 280px", background: "#FAF4ED",
            padding: "40px 28px", borderLeft: "1px solid #F0E4D6",
          }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#9A8B7E", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 20 }}>
              Order summary
            </div>

            {/* Plan card */}
            <div style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: 18, borderRadius: 18, background: "#fff",
              border: `2px solid ${plan.color}`, marginBottom: 20,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: plan.soft, color: plan.color,
                display: "grid", placeItems: "center", fontSize: 22,
              }}>
                {plan.id === "starter" ? "🌱" : plan.id === "pro" ? "⭐" : "🏥"}
              </div>
              <div>
                <div style={{ fontWeight: 900, color: "#2A2F4A", fontSize: 17 }}>{plan.name}</div>
                <div style={{ fontSize: 12.5, color: "#9A8B7E", fontWeight: 700, marginTop: 2 }}>{plan.tagline}</div>
              </div>
            </div>

            {/* Line items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, fontWeight: 700, color: "#4A4560" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{plan.name} plan</span><span>${plan.price}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Tax</span><span>$0.00</span>
              </div>
              <div style={{ height: 1, background: "#F0E4D6", margin: "6px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 900, color: "#2A2F4A", fontSize: 17 }}>Due today</span>
                <span style={{ fontWeight: 900, color: "#2A2F4A", fontSize: 20 }}>${plan.price}</span>
              </div>
            </div>

            <p style={{ margin: "18px 0 0", fontSize: 12.5, color: "#9A8B7E", fontWeight: 600, lineHeight: 1.55 }}>
              Billed {plan.period}. You can change or cancel your plan anytime from settings.
            </p>

            {/* Features recap */}
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#9A8B7E", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 6 }}>
                What&apos;s included
              </div>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, fontWeight: 700, color: "#4A4560" }}>
                  <span style={{ width: 18, height: 18, borderRadius: 999, background: plan.soft, color: plan.color, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check size={10} strokeWidth={3} />
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentForm />
    </Suspense>
  )
}
