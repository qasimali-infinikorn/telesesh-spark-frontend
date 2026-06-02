"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { TopBar } from "@/components/topbar"

const PLANS = [
  {
    id: "starter", name: "Starter", emoji: "🌱", price: 0, period: "free forever",
    color: "#2DB89E", soft: "#D4F1EA", tagline: "For trying things out",
    features: ["Up to 20 resources", "Core games & flip cards", "1 therapist seat", "Community support"],
  },
  {
    id: "pro", name: "Pro", emoji: "⭐", price: 19, period: "per month",
    color: "#D76B3F", soft: "#FFE3D2", tagline: "For busy practices", popular: true,
    features: ["Unlimited resources", "All games + AI game builder", "Up to 5 therapist seats", "Custom uploads & branding", "Priority support"],
  },
  {
    id: "clinic", name: "Clinic", emoji: "🏥", price: 49, period: "per month",
    color: "#7A5BC9", soft: "#E8DFFF", tagline: "For whole teams",
    features: ["Everything in Pro", "Unlimited seats", "Admin dashboard & analytics", "SSO & HIPAA agreement", "Dedicated success manager"],
  },
]

const HISTORY = [
  { id: "inv_001", date: "May 1, 2026",  amount: "$19.00", status: "Paid",    plan: "Pro" },
  { id: "inv_002", date: "Apr 1, 2026",  amount: "$19.00", status: "Paid",    plan: "Pro" },
  { id: "inv_003", date: "Mar 1, 2026",  amount: "$19.00", status: "Paid",    plan: "Pro" },
  { id: "inv_004", date: "Feb 1, 2026",  amount: "$0.00",  status: "Free",    plan: "Starter" },
]

export default function BillingPage() {
  const { data: session } = useSession()
  const name  = session?.user?.name  ?? "there"
  const email = session?.user?.email ?? ""

  const [currentPlan, setCurrentPlan] = useState("pro")
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showPayment, setShowPayment] = useState<null | typeof PLANS[0]>(null)
  const [paymentData, setPaymentData] = useState({ name: "", number: "", exp: "", cvc: "" })
  const [paid, setPaid] = useState(false)

  const plan = PLANS.find(p => p.id === currentPlan) ?? PLANS[1]

  const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
  const fmtExp  = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/(.{2})(.+)/, "$1/$2")
  const payValid = paymentData.name.trim() && paymentData.number.replace(/\s/g, "").length >= 15 && paymentData.exp.length >= 4 && paymentData.cvc.length >= 3

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px",
    borderRadius: 14, border: "2px solid #F0E4D6", background: "#FAF4ED",
    fontSize: 15, fontWeight: 600, color: "#2A2F4A", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
    transition: "border-color 0.15s, background 0.15s",
  }

  const fieldLabel: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 800, color: "#6C6580",
    letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8,
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FCEDDB", fontFamily: "var(--font-nunito)" }}>
      <TopBar userName={name.split(" ")[0]} userEmail={email} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32, animation: "fadeIn 0.45s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "#E8DFFF", color: "#7A5BC9", fontSize: 12, fontWeight: 800, letterSpacing: 0.8, marginBottom: 12 }}>
            💳 BILLING
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 34, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.8 }}>Billing & Plans</h1>
          <p style={{ margin: 0, fontSize: 15, color: "#6C6580", fontWeight: 600 }}>Manage your subscription and payment details.</p>
        </div>

        {/* Current plan card */}
        <div style={{
          background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}CC 100%)`,
          borderRadius: 28, padding: "32px 36px", marginBottom: 24, color: "#fff",
          boxShadow: `0 16px 40px -12px ${plan.color}66`,
          animation: "fadeIn 0.5s ease 0.1s both",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, opacity: 0.8, marginBottom: 10 }}>CURRENT PLAN</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <span style={{ fontSize: 44 }}>{plan.emoji}</span>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.6 }}>{plan.name}</div>
                <div style={{ fontSize: 15, fontWeight: 600, opacity: 0.85 }}>
                  ${plan.price} / {plan.period}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.88, lineHeight: 1.5 }}>
              Renews June 1, 2026 · Billed monthly
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => setShowUpgrade(s => !s)} style={{
              padding: "12px 22px", borderRadius: 14,
              border: "2px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
              color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}>
              {showUpgrade ? "Hide plans" : "Change plan"}
            </button>
            <button style={{
              padding: "12px 22px", borderRadius: 14, border: "none",
              background: "rgba(255,255,255,0.92)", color: plan.color,
              fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}>Download invoice</button>
          </div>
        </div>

        {/* Plan picker */}
        {showUpgrade && (
          <div style={{
            marginBottom: 24, animation: "fadeIn 0.3s ease both",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#6C6580", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 16 }}>
              Available plans
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {PLANS.map(p => {
                const active = p.id === currentPlan
                return (
                  <div key={p.id} style={{
                    position: "relative", background: "#fff", borderRadius: 24, padding: 24,
                    border: "3px solid", borderColor: active ? p.color : "#F0E4D6",
                    boxShadow: active ? `0 16px 36px -12px ${p.color}55` : "0 6px 18px -10px rgba(40,20,10,0.1)",
                    transform: active ? "translateY(-3px)" : "translateY(0)",
                    transition: "all 0.2s",
                  }}>
                    {p.popular && (
                      <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", borderRadius: 999, background: p.color, color: "#fff", fontWeight: 800, fontSize: 11, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                        MOST POPULAR
                      </span>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ fontSize: 34 }}>{p.emoji}</span>
                      {active && <span style={{ fontSize: 11, fontWeight: 800, color: p.color, background: p.soft, padding: "3px 10px", borderRadius: 999 }}>ACTIVE</span>}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#2A2F4A", marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: "#6C6580", fontWeight: 700, marginBottom: 14 }}>{p.tagline}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 18 }}>
                      <span style={{ fontSize: 34, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.8 }}>${p.price}</span>
                      <span style={{ fontSize: 13, color: "#9A8B7E", fontWeight: 700 }}>/ {p.period}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                      {p.features.map(f => (
                        <div key={f} style={{ display: "flex", gap: 8, fontSize: 13, fontWeight: 700, color: "#4A4560" }}>
                          <span style={{ width: 18, height: 18, borderRadius: 999, background: p.soft, color: p.color, display: "grid", placeItems: "center", flexShrink: 0, fontSize: 10 }}>✓</span>
                          {f}
                        </div>
                      ))}
                    </div>
                    <button
                      disabled={active}
                      onClick={() => { if (!active) { if (p.price === 0) { setCurrentPlan(p.id); setShowUpgrade(false) } else { setShowPayment(p) } } }}
                      style={{
                        width: "100%", padding: "11px", borderRadius: 13, border: "none",
                        background: active ? "#F4ECE3" : p.color, color: active ? "#B7AB99" : "#fff",
                        fontWeight: 800, fontSize: 14, cursor: active ? "default" : "pointer", fontFamily: "inherit",
                        boxShadow: active ? "none" : `0 8px 18px ${p.color}44`,
                      }}>
                      {active ? "Current plan" : p.price === 0 ? "Downgrade to Free" : `Upgrade to ${p.name}`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Payment form overlay */}
        {showPayment && (
          <div onClick={() => { if (!paid) setShowPayment(null) }} style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(27, 34, 56, 0.55)", backdropFilter: "blur(6px)",
            display: "grid", placeItems: "center", padding: 24,
            animation: "fadeIn 0.18s ease",
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              width: "100%", maxWidth: 820, background: "#fff", borderRadius: 28,
              overflow: "hidden", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.4)",
              display: "flex", flexWrap: "wrap",
              animation: "fadeIn 0.22s ease",
            }}>
              {paid ? (
                <div style={{ flex: 1, padding: "52px 44px", textAlign: "center" }}>
                  <div style={{ width: 76, height: 76, borderRadius: 999, background: "#D4F1EA", color: "#2DB89E", display: "grid", placeItems: "center", margin: "0 auto 18px", fontSize: 36 }}>✓</div>
                  <h2 style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.5 }}>You&apos;re all set!</h2>
                  <p style={{ margin: "0 0 24px", color: "#6C6580", fontWeight: 600, lineHeight: 1.55 }}>
                    Your {showPayment.name} plan is now active. Enjoy unlimited access!
                  </p>
                  <button onClick={() => { setCurrentPlan(showPayment.id); setShowPayment(null); setShowUpgrade(false); setPaid(false); setPaymentData({ name: "", number: "", exp: "", cvc: "" }) }}
                    style={{ padding: "14px 28px", borderRadius: 16, border: "none", background: "#D76B3F", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 10px 24px rgba(215,107,63,0.35)" }}>
                    Continue →
                  </button>
                </div>
              ) : (
                <>
                  {/* Form */}
                  <div style={{ flex: "1 1 320px", padding: "36px 32px" }}>
                    <button onClick={() => setShowPayment(null)} style={{ border: "2px solid #F0E4D6", background: "#fff", color: "#2A2F4A", borderRadius: 12, padding: "8px 14px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 13.5 }}>
                      ← Back
                    </button>
                    <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.5 }}>Payment details</h2>
                    <p style={{ margin: "0 0 24px", color: "#6C6580", fontWeight: 600 }}>Secure checkout · cancel anytime.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div>
                        <label style={fieldLabel}>Name on card</label>
                        <input value={paymentData.name} onChange={e => setPaymentData(d => ({ ...d, name: e.target.value }))} placeholder="Faith Lopez" style={inputStyle}
                          onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }} onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }} />
                      </div>
                      <div>
                        <label style={fieldLabel}>Card number</label>
                        <input value={paymentData.number} onChange={e => setPaymentData(d => ({ ...d, number: fmtCard(e.target.value) }))} placeholder="4242 4242 4242 4242" style={inputStyle}
                          onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }} onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <label style={fieldLabel}>Expiry</label>
                          <input value={paymentData.exp} onChange={e => setPaymentData(d => ({ ...d, exp: fmtExp(e.target.value) }))} placeholder="MM/YY" style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }} onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }} />
                        </div>
                        <div>
                          <label style={fieldLabel}>CVC</label>
                          <input value={paymentData.cvc} onChange={e => setPaymentData(d => ({ ...d, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="123" style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }} onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }} />
                        </div>
                      </div>
                      <button disabled={!payValid} onClick={() => { if (payValid) setPaid(true) }} style={{
                        padding: "15px", borderRadius: 16, border: "none",
                        background: payValid ? "#D76B3F" : "#F0E4D6",
                        color: payValid ? "#fff" : "#B7AB99",
                        fontWeight: 800, fontSize: 15, cursor: payValid ? "pointer" : "not-allowed",
                        fontFamily: "inherit", marginTop: 4,
                        boxShadow: payValid ? "0 10px 24px rgba(215,107,63,0.38)" : "none",
                      }}>
                        🔒 Pay ${showPayment.price} & upgrade
                      </button>
                      <p style={{ textAlign: "center", fontSize: 12.5, color: "#9A8B7E", fontWeight: 700, margin: 0 }}>
                        🔒 Encrypted & secure · Demo only, no real charge
                      </p>
                    </div>
                  </div>
                  {/* Summary */}
                  <div style={{ flex: "0 0 260px", background: "#FAF4ED", padding: "36px 28px", borderLeft: "1px solid #F0E4D6" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: "#9A8B7E", letterSpacing: 0.6, marginBottom: 16 }}>ORDER SUMMARY</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 16, background: "#fff", border: `2px solid ${showPayment.color}`, marginBottom: 18 }}>
                      <span style={{ fontSize: 30 }}>{showPayment.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 900, color: "#2A2F4A", fontSize: 16 }}>{showPayment.name}</div>
                        <div style={{ fontSize: 12.5, color: "#9A8B7E", fontWeight: 700 }}>{showPayment.tagline}</div>
                      </div>
                    </div>
                    {[
                      { label: showPayment.name + " plan", value: `$${showPayment.price}` },
                      { label: "Tax",                      value: "$0.00" },
                    ].map(r => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: "#4A4560", marginBottom: 8 }}>
                        <span>{r.label}</span><span>{r.value}</span>
                      </div>
                    ))}
                    <div style={{ height: 1, background: "#F0E4D6", margin: "10px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, color: "#2A2F4A", fontSize: 16 }}>
                      <span>Due today</span><span>${showPayment.price}</span>
                    </div>
                    <p style={{ marginTop: 14, fontSize: 12.5, color: "#9A8B7E", fontWeight: 600, lineHeight: 1.5 }}>
                      Billed {showPayment.period}. Cancel anytime from settings.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Payment history */}
        <div style={{
          background: "#fff", borderRadius: 24, overflow: "hidden",
          border: "1px solid #F4ECE3", boxShadow: "0 6px 18px -10px rgba(40,20,10,0.08)",
          animation: "fadeIn 0.5s ease 0.2s both",
        }}>
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #F4ECE3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#2A2F4A" }}>Payment history</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9A8B7E", marginTop: 2 }}>All your past invoices</div>
            </div>
          </div>
          <div style={{ padding: "14px 20px", background: "#FAF4ED", borderBottom: "1px solid #F4ECE3", display: "grid", gridTemplateColumns: "1fr 1fr 100px 120px 100px", gap: 12, fontSize: 11.5, fontWeight: 800, color: "#9A8B7E", letterSpacing: 0.6, textTransform: "uppercase" }}>
            <span>Invoice</span><span>Date</span><span>Plan</span><span>Amount</span><span style={{ textAlign: "right" }}>Status</span>
          </div>
          {HISTORY.map((inv) => (
            <div key={inv.id} style={{
              padding: "16px 20px", borderBottom: "1px solid #FAF4ED",
              display: "grid", gridTemplateColumns: "1fr 1fr 100px 120px 100px", gap: 12, alignItems: "center",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#FDF8F1"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}>
              <span style={{ fontWeight: 800, color: "#2A2F4A", fontSize: 13.5 }}>#{inv.id.split("_")[1]}</span>
              <span style={{ fontWeight: 700, color: "#6C6580", fontSize: 13.5 }}>{inv.date}</span>
              <span style={{ fontWeight: 700, color: "#6C6580", fontSize: 13.5 }}>{inv.plan}</span>
              <span style={{ fontWeight: 900, color: "#2A2F4A", fontSize: 14 }}>{inv.amount}</span>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800,
                  background: inv.status === "Paid" ? "#EAF8F2" : "#FAF4ED",
                  color: inv.status === "Paid" ? "#1A6B53" : "#9A8B7E",
                }}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cancel subscription */}
        <div style={{
          marginTop: 20, padding: "24px 28px", borderRadius: 22,
          background: "#fff", border: "2px solid #FFD8E1",
          boxShadow: "0 6px 18px -10px rgba(40,20,10,0.06)",
          animation: "fadeIn 0.5s ease 0.3s both",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <div style={{ fontWeight: 900, color: "#E84B6B", fontSize: 16, marginBottom: 4 }}>Cancel subscription</div>
            <div style={{ fontSize: 13.5, color: "#9A8B7E", fontWeight: 600, lineHeight: 1.5 }}>
              Your plan stays active until the end of the billing period.
            </div>
          </div>
          <button style={{
            padding: "11px 22px", borderRadius: 14,
            border: "2px solid #FFD8E1", background: "#fff",
            color: "#E84B6B", fontWeight: 800, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit",
          }}>Cancel plan</button>
        </div>
      </div>
    </div>
  )
}
