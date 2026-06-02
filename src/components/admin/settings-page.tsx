"use client"

import { useState } from "react"
import { C, Panel, AdminIcons } from "./shared"

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    period: "/mo",
    color: "#6C6580",
    soft: "#F4ECE3",
    features: ["5 resources", "Basic analytics", "1 admin user"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/mo",
    color: "#2DB89E",
    soft: "#D4F1EA",
    features: ["Unlimited resources", "Advanced analytics", "3 admin users", "Priority support"],
  },
  {
    id: "clinic",
    name: "Clinic",
    price: "$79",
    period: "/mo",
    color: "#D76B3F",
    soft: "#FFE3D2",
    features: ["Everything in Pro", "Custom branding", "Unlimited admins", "API access", "Dedicated support"],
  },
]

export default function SettingsPage() {
  const [name, setName]           = useState("Alex Johnson")
  const [email, setEmail]         = useState("alex@example.com")
  const [role, setRole]           = useState("Admin")
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw]         = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [pwMsg, setPwMsg]         = useState<{ text: string; ok: boolean } | null>(null)
  const [savMsg, setSavMsg]       = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [planOpen, setPlanOpen]   = useState(false)

  function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault()
    setSavMsg(true)
    setTimeout(() => setSavMsg(false), 2500)
  }

  function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPw) { setPwMsg({ text: "Enter your current password.", ok: false }); return }
    if (newPw.length < 8) { setPwMsg({ text: "New password must be at least 8 characters.", ok: false }); return }
    if (newPw !== confirmPw) { setPwMsg({ text: "Passwords do not match.", ok: false }); return }
    setPwMsg({ text: "Password updated successfully.", ok: true })
    setCurrentPw(""); setNewPw(""); setConfirmPw("")
    setTimeout(() => setPwMsg(null), 3000)
  }

  const currentPlan = PLANS.find((p) => p.id === selectedPlan)!

  return (
    <div style={{ fontFamily: "var(--font-nunito)", padding: "32px 36px", maxWidth: 760 }}>
      <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, color: C.ink }}>Settings</h1>
      <p style={{ margin: "0 0 32px", color: C.muted, fontWeight: 600, fontSize: 14.5 }}>
        Manage your account, security and subscription preferences.
      </p>

      {/* Account Details */}
      <Panel title="Account Details" icon={AdminIcons.User(16)} style={{ marginBottom: 24 }}>
        <form onSubmit={handleSaveAccount} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted }}>
                  {AdminIcons.Mail(16)}
                </span>
                <input
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
                />
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Role</label>
              <select
                value={role} onChange={(e) => setRole(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
              >
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Member Since</label>
              <input
                value="January 15, 2024" readOnly
                style={{ ...inputStyle, background: "#F9F4EF", color: C.muted, cursor: "default" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button type="submit" style={primaryBtn}>Save Changes</button>
            {savMsg && (
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1A8A70", display: "flex", alignItems: "center", gap: 6 }}>
                {AdminIcons.Check(15)} Saved!
              </span>
            )}
          </div>
        </form>
      </Panel>

      {/* Password Reset */}
      <Panel title="Password & Security" icon={AdminIcons.Lock(16)} style={{ marginBottom: 24 }}>
        <form onSubmit={handlePasswordReset} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <input
              type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Enter current password"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>New Password</label>
              <input
                type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 8 characters"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
                onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                style={{
                  ...inputStyle,
                  borderColor: confirmPw && confirmPw !== newPw ? "#E84B6B" : C.hairline,
                }}
                onFocus={(e) => {
                  if (!confirmPw || confirmPw === newPw) e.currentTarget.style.borderColor = C.primary
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = confirmPw && confirmPw !== newPw ? "#E84B6B" : C.hairline
                }}
              />
            </div>
          </div>
          {pwMsg && (
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: pwMsg.ok ? "#D4F1EA" : "#FFD8E1",
              color: pwMsg.ok ? "#1A8A70" : "#B03050",
              fontWeight: 700, fontSize: 13.5,
            }}>
              {pwMsg.text}
            </div>
          )}
          <div>
            <button type="submit" style={primaryBtn}>Update Password</button>
          </div>
        </form>
      </Panel>

      {/* Subscription */}
      <Panel title="Subscription Plan" icon={AdminIcons.StarF(16)}>
        <div style={{
          padding: "16px 20px", borderRadius: 14,
          background: currentPlan.soft, border: `2px solid ${currentPlan.color}20`,
          marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 2 }}>Current plan</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: currentPlan.color }}>{currentPlan.name}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginTop: 2 }}>
              {currentPlan.features.join(" · ")}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: currentPlan.color }}>{currentPlan.price}</span>
            <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{currentPlan.period}</span>
          </div>
        </div>

        <button
          onClick={() => setPlanOpen(!planOpen)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 16px", borderRadius: 12,
            border: `2px solid ${C.hairline}`, background: "#FAF4ED",
            color: C.muted, fontWeight: 800, fontSize: 13.5,
            cursor: "pointer", fontFamily: "inherit", marginBottom: planOpen ? 16 : 0,
          }}
        >
          {planOpen ? "Hide plans" : "Change plan"}
          <span style={{ transform: planOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-flex" }}>
            {AdminIcons.Chevron(14)}
          </span>
        </button>

        {planOpen && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {PLANS.map((plan) => {
              const active = selectedPlan === plan.id
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{
                    borderRadius: 16, padding: "20px 18px",
                    border: `2px solid ${active ? plan.color : C.hairline}`,
                    background: active ? plan.soft : "#FAF4ED",
                    cursor: "pointer", transition: "all 0.18s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: plan.color }}>{plan.name}</div>
                    {active && (
                      <div style={{
                        width: 22, height: 22, borderRadius: 999, background: plan.color,
                        display: "grid", placeItems: "center", color: "#fff",
                      }}>
                        {AdminIcons.Check(12)}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.ink, marginBottom: 12 }}>
                    {plan.price}<span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: plan.color }}>{AdminIcons.Check(12)}</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </Panel>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12.5, fontWeight: 800, color: C.ink,
  marginBottom: 6, letterSpacing: 0.2,
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 12,
  border: `2px solid ${C.hairline}`, background: "#FAF4ED",
  fontSize: 14, fontWeight: 600, color: C.ink,
  fontFamily: "inherit", outline: "none", transition: "border-color 0.18s",
}

const primaryBtn: React.CSSProperties = {
  padding: "12px 24px", borderRadius: 14, border: "none",
  background: C.primary, color: "#fff",
  fontWeight: 800, fontSize: 14, cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 8px 18px rgba(215,107,63,0.35)",
}
