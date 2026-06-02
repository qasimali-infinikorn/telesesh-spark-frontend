"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { TopBar } from "@/components/topbar"

const C = {
  coral: "#D76B3F", coralSoft: "#FFE3D2",
  teal: "#2DB89E", tealSoft: "#D4F1EA",
  ink: "#2A2F4A", muted: "#6C6580",
  hairline: "#F0E4D6", page: "#FAF4ED",
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 24, padding: "28px 30px", marginBottom: 18,
      border: "1px solid #F4ECE3", boxShadow: "0 6px 18px -10px rgba(40,20,10,0.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <span style={{
          width: 36, height: 36, borderRadius: 10, fontSize: 18,
          background: "#FFE3D2", display: "grid", placeItems: "center", flexShrink: 0,
        }}>{icon}</span>
        <span style={{ fontSize: 17, fontWeight: 900, color: C.ink }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "13px 16px",
  borderRadius: 14, border: "2px solid #F0E4D6", background: "#FAF4ED",
  fontSize: 15, fontWeight: 600, color: C.ink, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
  transition: "border-color 0.15s, background 0.15s",
}

const fieldLabel: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 800, color: C.muted,
  letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8,
}

const primaryBtn: React.CSSProperties = {
  padding: "12px 22px", borderRadius: 14, border: "none",
  background: C.coral, color: "#fff", fontWeight: 800, fontSize: 14.5,
  cursor: "pointer", fontFamily: "inherit",
  display: "inline-flex", alignItems: "center", gap: 8,
  boxShadow: `0 8px 18px ${C.coral}44`,
}


export default function SettingsPage() {
  const { data: session } = useSession()
  const sessionName  = session?.user?.name  ?? "Faith Lopez"
  const sessionEmail = session?.user?.email ?? "faith@clinic.org"
  const provider     = (session?.user as { provider?: string })?.provider

  const [profile, setProfile] = useState({ name: sessionName, email: sessionEmail, role: "SLPA", clinic: "", bio: "" })
  const set = (k: string, v: string) => setProfile(p => ({ ...p, [k]: v }))

  const [pw, setPw] = useState({ cur: "", next: "", confirm: "" })
  const setP = (k: string, v: string) => setPw(p => ({ ...p, [k]: v }))
  const pwValid = pw.cur && pw.next.length >= 6 && pw.next === pw.confirm

  const [notif, setNotif] = useState({ email: true, updates: true, tips: false })
  const toggleNotif = (k: keyof typeof notif) => setNotif(p => ({ ...p, [k]: !p[k] }))

  const [savedProfile, setSavedProfile] = useState(false)
  const [savedPw, setSavedPw]           = useState(false)
  const [savedNotif, setSavedNotif]     = useState(false)

  const saveWith = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true)
    setTimeout(() => setter(false), 2500)
  }

  const initials = profile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div style={{ minHeight: "100vh", background: "#FCEDDB", fontFamily: "var(--font-nunito)" }}>
      <TopBar userName={profile.name.split(" ")[0]} userEmail={profile.email} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 32, animation: "fadeIn 0.45s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "#FFE3D2", color: "#D76B3F", fontSize: 12, fontWeight: 800, letterSpacing: 0.8, marginBottom: 12 }}>
            ⚙ SETTINGS
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 34, fontWeight: 900, color: C.ink, letterSpacing: -0.8 }}>Account Settings</h1>
          <p style={{ margin: 0, fontSize: 15, color: C.muted, fontWeight: 600 }}>Manage your profile, password, and preferences.</p>
        </div>

        {/* ── Profile section ── */}
        <Section title="Profile" icon="👤">
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 80, height: 80, borderRadius: 999,
                background: "linear-gradient(135deg, #D76B3F 0%, #E89B1C 100%)",
                color: "#fff", display: "grid", placeItems: "center",
                fontSize: 28, fontWeight: 900,
                boxShadow: "0 10px 24px rgba(215,107,63,0.3)",
              }}>{initials}</div>
            </div>
            <div>
              <div style={{ fontWeight: 900, color: C.ink, fontSize: 18 }}>{profile.name}</div>
              <div style={{ fontSize: 13.5, color: C.muted, fontWeight: 600, marginTop: 2 }}>{profile.email}</div>
              {provider === "google" && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, padding: "4px 10px", borderRadius: 999, background: "#E8F0FE", color: "#4285F4", fontSize: 12, fontWeight: 800 }}>
                  🔵 Connected via Google
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={fieldLabel}>Full name</label>
              <input value={profile.name} onChange={e => set("name", e.target.value)} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = C.page }} />
            </div>
            <div>
              <label style={fieldLabel}>Email address</label>
              <input type="email" value={profile.email} onChange={e => set("email", e.target.value)} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = C.page }} />
            </div>
            <div>
              <label style={fieldLabel}>Role</label>
              <div style={{ position: "relative" }}>
                <select value={profile.role} onChange={e => set("role", e.target.value)} style={{ ...inputStyle, appearance: "none", paddingRight: 38, cursor: "pointer" }}>
                  {["SLPA", "SLP", "OT", "Counselor", "Teacher"].map(r => <option key={r}>{r}</option>)}
                </select>
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9A8B7E" }}>▾</span>
              </div>
            </div>
            <div>
              <label style={fieldLabel}>Clinic / Organisation</label>
              <input value={profile.clinic} onChange={e => set("clinic", e.target.value)} placeholder="e.g. Sunshine Clinic" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = C.page }} />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={fieldLabel}>Bio (optional)</label>
            <textarea value={profile.bio} onChange={e => set("bio", e.target.value)} rows={3} placeholder="A short note about your practice…" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }}
              onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.background = "#fff" }}
              onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = C.page }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => saveWith(setSavedProfile)} style={primaryBtn}>💾 Save changes</button>
            {savedProfile && <span style={{ color: "#1A6B53", fontWeight: 800, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>✓ Saved!</span>}
          </div>
        </Section>

        {/* ── Password section ── */}
        {!provider && (
          <Section title="Change password" icon="🔒">
            <div style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={fieldLabel}>Current password</label>
                <input type="password" value={pw.cur} onChange={e => setP("cur", e.target.value)} placeholder="••••••••" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.background = "#fff" }}
                  onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = C.page }} />
              </div>
              <div>
                <label style={fieldLabel}>New password</label>
                <input type="password" value={pw.next} onChange={e => setP("next", e.target.value)} placeholder="At least 6 characters" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.background = "#fff" }}
                  onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = C.page }} />
              </div>
              <div>
                <label style={fieldLabel}>Confirm new password</label>
                <input type="password" value={pw.confirm} onChange={e => setP("confirm", e.target.value)} placeholder="Re-enter new password" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.background = "#fff" }}
                  onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = C.page }} />
                {pw.next && pw.confirm && pw.next !== pw.confirm && (
                  <p style={{ margin: "6px 0 0", fontSize: 12.5, fontWeight: 700, color: "#E84B6B" }}>Passwords don&apos;t match.</p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  disabled={!pwValid}
                  onClick={() => { if (pwValid) { setPw({ cur: "", next: "", confirm: "" }); saveWith(setSavedPw) } }}
                  style={{ ...primaryBtn, background: pwValid ? C.coral : "#F0E4D6", color: pwValid ? "#fff" : "#B7AB99", cursor: pwValid ? "pointer" : "not-allowed", boxShadow: pwValid ? `0 8px 18px ${C.coral}44` : "none" }}>
                  🔒 Update password
                </button>
                {savedPw && <span style={{ color: "#1A6B53", fontWeight: 800, fontSize: 14 }}>✓ Updated!</span>}
              </div>
            </div>
          </Section>
        )}

        {/* ── Notifications ── */}
        <Section title="Notifications" icon="🔔">
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
            {[
              { key: "email"   as const, label: "Session reminders",    desc: "Get an email when it's time for a session" },
              { key: "updates" as const, label: "New resources",        desc: "Notify me when new content is added" },
              { key: "tips"    as const, label: "Therapist tips",       desc: "Weekly tips and best practices" },
            ].map(item => (
              <div key={item.key} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 18px", borderRadius: 16,
                background: "#FAF4ED", border: "1px solid #F0E4D6",
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: C.ink, fontSize: 14.5 }}>{item.label}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, marginTop: 3 }}>{item.desc}</div>
                </div>
                <button onClick={() => toggleNotif(item.key)} style={{
                  width: 52, height: 30, borderRadius: 999, border: "none",
                  background: notif[item.key] ? C.coral : "#D6CFC0",
                  position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
                }}>
                  <span style={{
                    position: "absolute", top: 3,
                    left: notif[item.key] ? 25 : 3,
                    width: 24, height: 24, borderRadius: 999, background: "#fff",
                    transition: "left 0.2s",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
            <button onClick={() => saveWith(setSavedNotif)} style={primaryBtn}>💾 Save preferences</button>
            {savedNotif && <span style={{ color: "#1A6B53", fontWeight: 800, fontSize: 14 }}>✓ Saved!</span>}
          </div>
        </Section>

        {/* ── Connected accounts ── */}
        <Section title="Connected accounts" icon="🔗">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderRadius: 16, background: "#FAF4ED", border: "1px solid #F0E4D6", maxWidth: 480 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28 }}>🔵</span>
              <div>
                <div style={{ fontWeight: 800, color: C.ink, fontSize: 14.5 }}>Google</div>
                <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, marginTop: 2 }}>
                  {provider === "google" ? `Connected as ${sessionEmail}` : "Not connected"}
                </div>
              </div>
            </div>
            <button style={{
              padding: "8px 16px", borderRadius: 12,
              border: `2px solid ${provider === "google" ? "#F0E4D6" : "#2DB89E"}`,
              background: provider === "google" ? "#fff" : "#D4F1EA",
              color: provider === "google" ? "#E84B6B" : "#2DB89E",
              fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}>{provider === "google" ? "Disconnect" : "Connect"}</button>
          </div>
        </Section>

        {/* ── Danger zone ── */}
        <div style={{
          background: "#fff", borderRadius: 24, padding: "28px 30px",
          border: "2px solid #FFD8E1", boxShadow: "0 6px 18px -10px rgba(40,20,10,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "#FFD8E1", display: "grid", placeItems: "center", fontSize: 18 }}>⚠️</span>
            <span style={{ fontSize: 17, fontWeight: 900, color: "#E84B6B" }}>Danger zone</span>
          </div>
          <p style={{ margin: "0 0 18px", fontSize: 14.5, color: C.muted, fontWeight: 600, lineHeight: 1.55 }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button style={{
            padding: "12px 22px", borderRadius: 14, border: "2px solid #FFD8E1",
            background: "#fff", color: "#E84B6B", fontWeight: 800, fontSize: 14.5,
            cursor: "pointer", fontFamily: "inherit",
          }}>🗑 Delete my account</button>
        </div>
      </div>
    </div>
  )
}
