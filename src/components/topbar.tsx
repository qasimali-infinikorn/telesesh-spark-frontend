"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

interface TopBarProps {
  userName: string
  userEmail?: string
}

export function TopBar({ userName, userEmail }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const initials = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const navLinks = [
    { href: "/", label: "Library", emoji: "📚" },
    { href: "/favorites", label: "Favorites", emoji: "★" },
    { href: "/profile", label: "Profile", emoji: "👤" },
    { href: "/settings", label: "Settings", emoji: "⚙" },
    { href: "/billing", label: "Billing", emoji: "💳" },
  ]

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 32px",
      background: "rgba(252, 237, 219, 0.88)",
      backdropFilter: "blur(14px)",
      borderBottom: "1px solid rgba(216, 155, 92, 0.15)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      {/* Left: logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "linear-gradient(135deg, #2DB89E 0%, #34D4B5 100%)",
          color: "#fff", display: "grid", placeItems: "center",
          boxShadow: "0 6px 14px rgba(45,184,158,0.35)", fontSize: 18,
        }}>✦</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.4, lineHeight: 1 }}>
            Telesesh <span style={{ color: "#2DB89E" }}>Spark</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9A8B7E", letterSpacing: 0.3, marginTop: 2 }}>
            Resource Library
          </div>
        </div>
      </Link>

      {/* Center nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {navLinks.slice(0, 2).map(link => {
          const active = pathname === link.href
          return (
            <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "8px 16px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                color: active ? "#D76B3F" : "#6C6580",
                background: active ? "#FFE3D2" : "transparent",
                transition: "all 0.15s",
              }}>
                {link.label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Right: admin + user avatar dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/admin" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "9px 16px", borderRadius: 12, border: "none",
            background: "#2A2F4A", color: "#fff",
            fontWeight: 800, fontSize: 13, cursor: "pointer",
            fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 6,
            boxShadow: "0 6px 14px rgba(42,47,74,0.22)",
          }}>
            ⚙ Admin
          </button>
        </Link>

        {/* User avatar + dropdown */}
        <div ref={ref} style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "6px 12px 6px 6px", borderRadius: 40,
              border: "2px solid",
              borderColor: open ? "#D76B3F" : "#F4DCC4",
              background: "#fff", cursor: "pointer",
              transition: "border-color 0.15s",
              fontFamily: "inherit",
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 999,
              background: "linear-gradient(135deg, #D76B3F, #E89B1C)",
              color: "#fff", display: "grid", placeItems: "center",
              fontSize: 13, fontWeight: 900, flexShrink: 0,
            }}>
              {initials}
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#2A2F4A", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userName}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A8B7E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 100,
              background: "#fff", borderRadius: 18, border: "1px solid #F4ECE3",
              boxShadow: "0 16px 40px -12px rgba(40,20,10,0.2)",
              padding: 6, minWidth: 220,
              animation: "fadeIn 0.15s ease",
            }}>
              {/* User header */}
              <div style={{ padding: "10px 12px 14px", borderBottom: "1px solid #F4ECE3", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 999, flexShrink: 0,
                    background: "linear-gradient(135deg, #D76B3F, #E89B1C)",
                    color: "#fff", display: "grid", placeItems: "center",
                    fontSize: 15, fontWeight: 900,
                  }}>{initials}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, color: "#2A2F4A", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
                    {userEmail && <div style={{ fontSize: 12, color: "#9A8B7E", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</div>}
                  </div>
                </div>
              </div>

              {/* Links */}
              {[
                { href: "/profile",   label: "My Profile",  emoji: "👤", desc: "View your profile" },
                { href: "/favorites", label: "Favorites",   emoji: "★",  desc: "Your saved resources" },
                { href: "/settings",  label: "Settings",    emoji: "⚙",  desc: "Account & preferences" },
                { href: "/billing",   label: "Billing",     emoji: "💳", desc: "Plan & payments" },
              ].map(item => {
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: "none" }} onClick={() => setOpen(false)}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 12px", borderRadius: 12,
                      background: active ? "#FFE3D2" : "transparent",
                      transition: "background 0.12s", cursor: "pointer",
                    }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "#FAF4ED" }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "transparent" }}>
                      <span style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: active ? "#D76B3F" : "#FAF4ED",
                        color: active ? "#fff" : "#6C6580",
                        display: "grid", placeItems: "center", fontSize: 16,
                      }}>{item.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: active ? "#D76B3F" : "#2A2F4A" }}>{item.label}</div>
                        <div style={{ fontSize: 11.5, color: "#9A8B7E", fontWeight: 600 }}>{item.desc}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}

              <div style={{ height: 1, background: "#F4ECE3", margin: "4px 0" }} />

              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/sign-in" }) }}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 12, border: "none",
                  background: "transparent", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 12, color: "#E84B6B",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FFD8E1")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ width: 34, height: 34, borderRadius: 10, background: "#FFD8E1", display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0 }}>🚪</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>Sign out</div>
                  <div style={{ fontSize: 11.5, color: "#9A8B7E", fontWeight: 600 }}>See you next session</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
