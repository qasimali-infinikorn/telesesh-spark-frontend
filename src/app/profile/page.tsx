"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { TopBar } from "@/components/topbar"
import { RESOURCES, CATEGORY } from "@/lib/resources"
import { Eye, Heart, Calendar, Gamepad2, Settings, CreditCard, BookOpen, Star, ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const CATEGORY_MAP = CATEGORY  // now has .Icon property

const STATS: Array<{ label: string; value: string; Icon: LucideIcon; color: string; soft: string }> = [
  { label: "Resources viewed",   value: "47", Icon: Eye,      color: "#2DB89E", soft: "#D4F1EA" },
  { label: "Favorites saved",    value: "12", Icon: Heart,    color: "#E89B1C", soft: "#FFE9C2" },
  { label: "Sessions this week", value: "8",  Icon: Calendar, color: "#7A5BC9", soft: "#E8DFFF" },
  { label: "Games played",       value: "23", Icon: Gamepad2, color: "#E84B6B", soft: "#FFD8E1" },
]

const RECENT = RESOURCES.slice(0, 5)

const BADGES: Array<{ label: string; Icon: LucideIcon; desc: string; color: string; soft: string }> = [
  { label: "Early Adopter",     Icon: Star,     desc: "One of the first 100 users", color: "#E89B1C", soft: "#FFE9C2" },
  { label: "Game Master",       Icon: Gamepad2, desc: "Played 20+ games",           color: "#E84B6B", soft: "#FFD8E1" },
  { label: "Resource Explorer", Icon: Eye,      desc: "Viewed 50+ resources",        color: "#2DB89E", soft: "#D4F1EA" },
]

export default function ProfilePage() {
  const { data: session } = useSession()
  const name    = session?.user?.name  ?? "Therapist"
  const email   = session?.user?.email ?? ""
  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
  const provider = (session?.user as { provider?: string })?.provider

  return (
    <div style={{ minHeight: "100vh", background: "#FCEDDB", fontFamily: "var(--font-nunito)" }}>
      <TopBar userName={name} userEmail={email} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* ── Hero header ── */}
        <div style={{
          background: "#fff", borderRadius: 28, padding: "36px 40px", marginBottom: 24,
          border: "1px solid #F4ECE3", boxShadow: "0 8px 28px -12px rgba(40,20,10,0.1)",
          display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap",
          animation: "fadeIn 0.45s ease both",
        }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 999,
              background: "linear-gradient(135deg, #D76B3F 0%, #E89B1C 100%)",
              color: "#fff", display: "grid", placeItems: "center",
              fontSize: 36, fontWeight: 900,
              boxShadow: "0 12px 28px rgba(215,107,63,0.35)",
            }}>{initials}</div>
            {provider === "google" && (
              <div style={{
                position: "absolute", bottom: 2, right: 2,
                width: 28, height: 28, borderRadius: 999, background: "#fff",
                border: "2px solid #F4ECE3", display: "grid", placeItems: "center", fontSize: 14,
              }}>🔵</div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 999,
              background: "#D4F1EA", color: "#2DB89E",
              fontSize: 11, fontWeight: 800, letterSpacing: 0.8, marginBottom: 8,
            }}>PRO MEMBER ⭐</div>
            <h1 style={{ margin: "0 0 4px", fontSize: 32, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.6 }}>
              {name}
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: "#6C6580", fontWeight: 600 }}>{email}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {["SLPA", "Speech therapy", "Member since Apr 2026"].map(tag => (
                <span key={tag} style={{
                  padding: "5px 12px", borderRadius: 999,
                  background: "#FAF4ED", border: "1px solid #F0E4D6",
                  color: "#6C6580", fontSize: 12.5, fontWeight: 700,
                }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <Link href="/settings" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "12px 20px", borderRadius: 14,
                border: "2px solid #F4DCC4", background: "#fff",
                color: "#D76B3F", fontWeight: 800, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 8,
              }}>⚙ Edit profile</button>
            </Link>
            <Link href="/favorites" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "12px 20px", borderRadius: 14, border: "none",
                background: "#D76B3F", color: "#fff",
                fontWeight: 800, fontSize: 14, cursor: "pointer",
                fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 8px 18px rgba(215,107,63,0.35)",
              }}>★ Favorites</button>
            </Link>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 24 }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Stats grid */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
              animation: "fadeIn 0.5s ease 0.1s both",
            }}>
              {STATS.map(s => (
                <div key={s.label} style={{
                  background: "#fff", borderRadius: 20, padding: "20px 22px",
                  border: "1px solid #F4ECE3", boxShadow: "0 4px 14px -8px rgba(40,20,10,0.08)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, marginBottom: 14,
                    background: s.soft, color: s.color, display: "grid", placeItems: "center",
                  }}><s.Icon size={22} /></div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.8 }}>{s.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#6C6580", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div style={{
              background: "#fff", borderRadius: 24, padding: "24px 26px",
              border: "1px solid #F4ECE3", boxShadow: "0 6px 18px -10px rgba(40,20,10,0.08)",
              animation: "fadeIn 0.5s ease 0.2s both",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: "#2A2F4A" }}>Recent activity</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9A8B7E", marginTop: 2 }}>Resources you&apos;ve explored</div>
                </div>
                <Link href="/" style={{ textDecoration: "none" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#D76B3F" }}>View library →</span>
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {RECENT.map((r, i) => {
                  const c = CATEGORY_MAP[r.kind]
                  return (
                    <div key={r.id} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "12px 14px", borderRadius: 16,
                      background: "#FAF4ED", border: "1px solid #F4ECE3",
                      animation: `fadeIn 0.4s ease ${0.3 + i * 0.06}s both`,
                    }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                        background: r.thumbBg, display: "grid", placeItems: "center", fontSize: 22,
                      }}>{r.thumbEmoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, color: "#2A2F4A", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "3px 9px", borderRadius: 999,
                            background: c.soft, color: c.color,
                            fontSize: 11, fontWeight: 800,
                          }}><c.Icon size={11} /> {r.kind}</span>
                          <span style={{ fontSize: 11.5, color: "#9A8B7E", fontWeight: 600 }}>{i === 0 ? "Today" : i === 1 ? "Yesterday" : `${i + 1} days ago`}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Badges */}
            <div style={{
              background: "#fff", borderRadius: 24, padding: "24px 26px",
              border: "1px solid #F4ECE3", boxShadow: "0 6px 18px -10px rgba(40,20,10,0.08)",
              animation: "fadeIn 0.5s ease 0.15s both",
            }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#2A2F4A", marginBottom: 4 }}>Badges</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9A8B7E", marginBottom: 18 }}>Earned through your sessions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {BADGES.map(b => (
                  <div key={b.label} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 16,
                    background: "linear-gradient(135deg, #FFF9EC 0%, #FFF3D6 100%)",
                    border: "1px solid #F4DCC4",
                  }}>
                    <span style={{ width: 44, height: 44, borderRadius: 12, background: b.soft, color: b.color, display: "grid", placeItems: "center", flexShrink: 0 }}><b.Icon size={20} /></span>
                    <div>
                      <div style={{ fontWeight: 900, color: "#2A2F4A", fontSize: 14.5 }}>{b.label}</div>
                      <div style={{ fontSize: 12.5, color: "#9A8B7E", fontWeight: 600, marginTop: 2 }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan card */}
            <div style={{
              background: "linear-gradient(135deg, #2DB89E 0%, #34CBAE 60%, #7A5BC9 130%)",
              borderRadius: 24, padding: "24px 26px", color: "#fff",
              boxShadow: "0 12px 28px rgba(45,184,158,0.3)",
              animation: "fadeIn 0.5s ease 0.25s both",
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.8, opacity: 0.8, marginBottom: 8 }}>CURRENT PLAN</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 36 }}>⭐</span>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.4 }}>Pro</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, opacity: 0.85 }}>$19 / month</div>
                </div>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, opacity: 0.88, marginBottom: 20, lineHeight: 1.5 }}>
                Unlimited resources · AI game builder · 5 seats · Priority support
              </div>
              <Link href="/billing" style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%", padding: "12px", borderRadius: 14, border: "none",
                  background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)",
                  color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
                  fontFamily: "inherit", outline: "1px solid rgba(255,255,255,0.3)",
                }}>Manage plan →</button>
              </Link>
            </div>

            {/* Quick links */}
            <div style={{
              background: "#fff", borderRadius: 24, padding: "24px 26px",
              border: "1px solid #F4ECE3", boxShadow: "0 6px 18px -10px rgba(40,20,10,0.08)",
              animation: "fadeIn 0.5s ease 0.3s both",
            }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#2A2F4A", marginBottom: 16 }}>Quick links</div>
              {([
                { href: "/favorites", label: "My Favorites",     Icon: Heart,       color: "#E89B1C", soft: "#FFE9C2" },
                { href: "/settings",  label: "Account Settings", Icon: Settings,    color: "#D76B3F", soft: "#FFE3D2" },
                { href: "/billing",   label: "Billing & Plans",   Icon: CreditCard,  color: "#7A5BC9", soft: "#E8DFFF" },
                { href: "/",          label: "Resource Library",  Icon: BookOpen,    color: "#2DB89E", soft: "#D4F1EA" },
              ] as const).map(item => (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 14, marginBottom: 8,
                    transition: "background 0.15s", cursor: "pointer",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#FAF4ED"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}>
                    <span style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: item.soft, color: item.color, display: "grid", placeItems: "center",
                    }}><item.Icon size={17} /></span>
                    <span style={{ fontWeight: 800, color: "#2A2F4A", fontSize: 14 }}>{item.label}</span>
                    <ChevronRight size={16} color="#9A8B7E" style={{ marginLeft: "auto" }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
