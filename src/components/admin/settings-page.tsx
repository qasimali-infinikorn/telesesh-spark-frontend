"use client"

import { useState } from "react"
import { C, Panel, User2, Mail, Lock, Check } from "./shared"

export default function SettingsPage() {
  const [name, setName]           = useState("Alex Johnson")
  const [email, setEmail]         = useState("alex@example.com")
  const [role, setRole]           = useState("Admin")
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw]         = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [pwMsg, setPwMsg]         = useState<{ text: string; ok: boolean } | null>(null)
  const [savMsg, setSavMsg]       = useState(false)

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

  return (
    <div style={{ fontFamily: "var(--font-nunito)", padding: "32px 48px", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, color: C.ink }}>Settings</h1>
      <p style={{ margin: "0 0 32px", color: C.muted, fontWeight: 600, fontSize: 14.5 }}>
        Manage your account, security and subscription preferences.
      </p>

      {/* Account Details */}
      <Panel title="Account Details" icon={<User2 size={16} />} style={{ marginBottom: 24 }}>
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
                  <Mail size={16} />
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
                <Check size={15} /> Saved!
              </span>
            )}
          </div>
        </form>
      </Panel>

      {/* Password Reset */}
      <Panel title="Password & Security" icon={<Lock size={16} />} style={{ marginBottom: 24 }}>
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
