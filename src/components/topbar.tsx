"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  BookOpen, Heart, User2, Settings, CreditCard,
  LayoutDashboard, LogOut, ChevronDown,
  ICON_SM,
} from "@/lib/icons"

// Custom sparkle logo mark — tighter than Lucide Sparkles at small sizes
function SparkLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 L13.5 8.5 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 8.5 Z" />
      <path d="M19 1 L19.8 3.2 L22 4 L19.8 4.8 L19 7 L18.2 4.8 L16 4 L18.2 3.2 Z" opacity="0.7" />
    </svg>
  )
}

interface TopBarProps {
  userName: string
  userEmail?: string
}

const NAV_LINKS = [
  { href: "/",          label: "Library",   Icon: BookOpen },
  { href: "/favorites", label: "Favorites", Icon: Heart    },
]

const DROPDOWN_LINKS = [
  { href: "/profile",   label: "My Profile",      Icon: User2,          desc: "View your profile"      },
  { href: "/favorites", label: "Favorites",        Icon: Heart,          desc: "Your saved resources"   },
  { href: "/settings",  label: "Settings",         Icon: Settings,       desc: "Account & preferences"  },
  { href: "/billing",   label: "Billing",          Icon: CreditCard,     desc: "Plan & payments"        },
]

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

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 32px",
      background: "rgba(252, 237, 219, 0.9)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(216, 155, 92, 0.14)",
      position: "sticky", top: 0, zIndex: 50,
    }}>

      {/* ── Logo ── */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: "linear-gradient(135deg, #2DB89E 0%, #34D4B5 100%)",
          color: "#fff", display: "grid", placeItems: "center",
          boxShadow: "0 5px 12px rgba(45,184,158,0.35)",
        }}>
          <SparkLogo size={18} />
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.4, lineHeight: 1 }}>
            Telesesh <span style={{ color: "#2DB89E" }}>Spark</span>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9A8B7E", letterSpacing: 0.3, marginTop: 2 }}>
            Therapy Resource Library
          </div>
        </div>
      </Link>

      {/* ── Center nav ── */}
      <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {NAV_LINKS.map(({ href, label, Icon }) => {
          const active = pathname === href || (href === "/" && pathname === "/")
          return (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "8px 14px", borderRadius: 11, fontSize: 13.5, fontWeight: 700,
                color: active ? "#D76B3F" : "#6C6580",
                background: active ? "#FFE3D2" : "transparent",
                transition: "all 0.15s",
              }}>
                <Icon size={ICON_SM} />
                {label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* ── Right: admin + user dropdown ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/admin" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "8px 14px", borderRadius: 11, border: "none",
            background: "#2A2F4A", color: "#fff",
            fontWeight: 800, fontSize: 13, cursor: "pointer",
            fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 12px rgba(42,47,74,0.2)",
          }}>
            <LayoutDashboard size={ICON_SM} />
            Admin
          </button>
        </Link>

        {/* User avatar + dropdown */}
        <div ref={ref} style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "5px 10px 5px 5px", borderRadius: 40,
              border: "2px solid",
              borderColor: open ? "#D76B3F" : "#F4DCC4",
              background: "#fff", cursor: "pointer",
              transition: "border-color 0.15s", fontFamily: "inherit",
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 999, flexShrink: 0,
              background: "linear-gradient(135deg, #D76B3F 0%, #E89B1C 100%)",
              color: "#fff", display: "grid", placeItems: "center",
              fontSize: 12, fontWeight: 900,
            }}>
              {initials}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#2A2F4A", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {userName}
            </span>
            <ChevronDown
              size={13}
              color="#9A8B7E"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}
            />
          </button>

          {open && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 100,
              background: "#fff", borderRadius: 18, border: "1px solid #F4ECE3",
              boxShadow: "0 16px 40px -12px rgba(40,20,10,0.18)",
              padding: 6, minWidth: 224,
              animation: "fadeIn 0.15s ease",
            }}>
              {/* User header */}
              <div style={{ padding: "10px 12px 12px", borderBottom: "1px solid #F4ECE3", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 999, flexShrink: 0,
                    background: "linear-gradient(135deg, #D76B3F 0%, #E89B1C 100%)",
                    color: "#fff", display: "grid", placeItems: "center",
                    fontSize: 14, fontWeight: 900,
                  }}>{initials}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, color: "#2A2F4A", fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
                    {userEmail && <div style={{ fontSize: 11.5, color: "#9A8B7E", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</div>}
                  </div>
                </div>
              </div>

              {DROPDOWN_LINKS.map(({ href, label, Icon, desc }) => {
                const active = pathname === href
                return (
                  <Link key={href} href={href} style={{ textDecoration: "none" }} onClick={() => setOpen(false)}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 11,
                      padding: "9px 10px", borderRadius: 11,
                      background: active ? "#FFE3D2" : "transparent",
                      transition: "background 0.12s", cursor: "pointer",
                    }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "#FAF4ED" }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "transparent" }}>
                      <span style={{
                        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                        background: active ? "#D76B3F" : "#FAF4ED",
                        color: active ? "#fff" : "#6C6580",
                        display: "grid", placeItems: "center",
                      }}>
                        <Icon size={ICON_SM + 2} />
                      </span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13.5, color: active ? "#D76B3F" : "#2A2F4A" }}>{label}</div>
                        <div style={{ fontSize: 11, color: "#9A8B7E", fontWeight: 600 }}>{desc}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}

              <div style={{ height: 1, background: "#F4ECE3", margin: "4px 0" }} />

              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/sign-in" }) }}
                style={{
                  width: "100%", padding: "9px 10px", borderRadius: 11, border: "none",
                  background: "transparent", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 11, color: "#E84B6B",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#FFD8E1")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ width: 32, height: 32, borderRadius: 9, background: "#FFD8E1", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <LogOut size={ICON_SM + 2} color="#E84B6B" />
                </span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13.5 }}>Sign out</div>
                  <div style={{ fontSize: 11, color: "#9A8B7E", fontWeight: 600 }}>See you next session</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
