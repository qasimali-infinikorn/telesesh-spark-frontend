"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { C, LayoutDashboard, FolderOpen, Mic, Tag, Users, Settings, ChevronLeft } from "@/components/admin/shared"
import type { LucideIcon } from "lucide-react"

const NAV_ITEMS = [
  { href: "/admin/dashboard",  label: "Dashboard",   Icon: LayoutDashboard },
  { href: "/admin/resources",  label: "Resources",   Icon: FolderOpen      },
  { href: "/admin/sounds",     label: "Sounds",      Icon: Mic             },
  { href: "/admin/tags",       label: "Tags",        Icon: Tag             },
  { href: "/admin/age-groups", label: "Age Groups",  Icon: Users           },
  { href: "/admin/settings",   label: "Settings",    Icon: Settings        },
]

function SparkLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z"/>
      <path d="M19 1L19.8 3.2L22 4L19.8 4.8L19 7L18.2 4.8L16 4L18.2 3.2Z" opacity="0.7"/>
    </svg>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      fontFamily: "var(--font-nunito)",
      background: C.pageBg,
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, flexShrink: 0,
        background: "#fff",
        borderRight: `1px solid ${C.hairline}`,
        position: "sticky", top: 0, height: "100vh",
        display: "flex", flexDirection: "column",
        boxShadow: "2px 0 12px rgba(40,20,10,0.06)",
        zIndex: 40,
      }}>
        {/* Brand mark */}
        <div style={{ padding: "28px 24px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg, #2DB89E 0%, #34D4B5 100%)",
              color: "#fff", display: "grid", placeItems: "center",
              boxShadow: "0 6px 14px rgba(45,184,158,0.35)",
            }}>
              <SparkLogo />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.ink, letterSpacing: -0.3, lineHeight: 1 }}>
                Telesesh <span style={{ color: C.accent }}>Spark</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, letterSpacing: 1.2, marginTop: 4, textTransform: "uppercase" as const }}>
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: C.hairline, margin: "0 20px 16px" }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <NavItem key={item.href} item={item} active={active} />
            )
          })}
        </nav>

        {/* Back to library */}
        <div style={{ padding: "16px 12px 24px" }}>
          <div style={{ height: 1, background: C.hairline, marginBottom: 16 }} />
          <Link href="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 14px", borderRadius: 12,
                border: `2px solid ${C.hairline}`, background: "#FAF4ED",
                color: C.muted, fontWeight: 800, fontSize: 13.5,
                cursor: "pointer", transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = C.primarySft
                ;(e.currentTarget as HTMLDivElement).style.borderColor = C.primary
                ;(e.currentTarget as HTMLDivElement).style.color = C.primary
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#FAF4ED"
                ;(e.currentTarget as HTMLDivElement).style.borderColor = C.hairline
                ;(e.currentTarget as HTMLDivElement).style.color = C.muted
              }}
            >
              <ChevronLeft size={15} />
              Back to library
            </div>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1, overflowY: "auto",
        background: C.pageBg, minWidth: 0,
      }}>
        {children}
      </main>
    </div>
  )
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({
  item,
  active,
}: {
  item: { href: string; label: string; Icon: LucideIcon }
  active: boolean
}) {
  const [hover, setHover] = useState(false)

  return (
    <Link href={item.href} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "11px 14px", borderRadius: 12, cursor: "pointer",
          background: active ? C.primarySft : hover ? "#FDF8F1" : "transparent",
          color: active ? C.primary : hover ? C.ink : C.muted,
          fontWeight: active ? 800 : 700, fontSize: 14,
          position: "relative", transition: "all 0.15s ease",
        }}
      >
        {/* Active indicator */}
        {active && (
          <div style={{
            position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)",
            width: 4, height: 26, borderRadius: "0 4px 4px 0",
            background: C.primary,
          }} />
        )}
        <span style={{ color: active ? C.primary : hover ? C.ink : C.muted, display: "flex", alignItems: "center" }}>
          <item.Icon size={16} />
        </span>
        {item.label}
      </div>
    </Link>
  )
}
