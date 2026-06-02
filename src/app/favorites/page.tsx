"use client"

import { useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { TopBar } from "@/components/topbar"
import { RESOURCES, CATEGORY } from "@/lib/resources"
import type { CategoryKey } from "@/lib/resources"

const CATEGORY_KEYS = Object.keys(CATEGORY) as CategoryKey[]

export default function FavoritesPage() {
  const { data: session } = useSession()
  const name  = session?.user?.name  ?? "there"
  const email = session?.user?.email ?? ""

  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(RESOURCES.filter(r => r.fav).map(r => r.id))
  )
  const [activeKind, setActiveKind] = useState<CategoryKey | "all">("all")
  const [query, setQuery] = useState("")

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const favItems = useMemo(() =>
    RESOURCES.filter(r => {
      if (!favorites.has(r.id)) return false
      if (activeKind !== "all" && r.kind !== activeKind) return false
      if (query && !r.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    }),
    [favorites, activeKind, query]
  )

  const countByKind = useMemo(() => {
    const c: Record<string, number> = { all: 0 }
    RESOURCES.forEach(r => { if (favorites.has(r.id)) { c.all = (c.all || 0) + 1; c[r.kind] = (c[r.kind] || 0) + 1 } })
    return c
  }, [favorites])

  return (
    <div style={{ minHeight: "100vh", background: "#FCEDDB", fontFamily: "var(--font-nunito)" }}>
      <TopBar userName={name.split(" ")[0]} userEmail={email} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32, animation: "fadeIn 0.45s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "#FFE9C2", color: "#E89B1C", fontSize: 12, fontWeight: 800, letterSpacing: 0.8, marginBottom: 12 }}>
            ★ FAVORITES
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: 38, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.8, lineHeight: 1.05 }}>
            Your saved resources
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: "#6C6580", fontWeight: 600 }}>
            {favorites.size} resource{favorites.size !== 1 ? "s" : ""} saved across your sessions.
          </p>
        </div>

        {/* Filter bar */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "16px 20px", marginBottom: 28,
          border: "1px solid #F4ECE3", boxShadow: "0 4px 14px -8px rgba(40,20,10,0.08)",
          display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#C2A893", fontSize: 16 }}>🔍</span>
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search favorites…"
              style={{
                width: "100%", padding: "11px 14px 11px 42px",
                borderRadius: 14, border: "2px solid #F0E4D6", background: "#FAF4ED",
                fontSize: 14.5, fontWeight: 600, color: "#2A2F4A", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box" as const,
                transition: "border-color 0.15s",
              }}
              onFocus={e => { e.target.style.borderColor = "#D76B3F"; e.target.style.background = "#fff" }}
              onBlur={e => { e.target.style.borderColor = "#F0E4D6"; e.target.style.background = "#FAF4ED" }}
            />
          </div>

          {/* Category filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["all", ...CATEGORY_KEYS.filter(k => k !== "all")] as (CategoryKey | "all")[]).map(k => {
              const cat = k === "all" ? { label: "All", color: "#D76B3F", soft: "#FFE3D2", emoji: "✦" } : CATEGORY[k]
              const active = activeKind === k
              const count = countByKind[k] || 0
              if (k !== "all" && !count) return null
              return (
                <button key={k} onClick={() => setActiveKind(k)} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 14px", borderRadius: 12,
                  border: "2px solid", borderColor: active ? cat.color : "#F0E4D6",
                  background: active ? cat.soft : "#fff",
                  color: active ? cat.color : "#6C6580",
                  fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                }}>
                  {"Icon" in cat ? <cat.Icon size={13} /> : null} {cat.label}
                  <span style={{ padding: "2px 7px", borderRadius: 999, background: active ? cat.color : "#F0E4D6", color: active ? "#fff" : "#9A8B7E", fontSize: 11, fontWeight: 800 }}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Grid or empty state */}
        {favItems.length === 0 ? (
          <div style={{
            padding: "80px 32px", borderRadius: 28, background: "#fff",
            textAlign: "center", border: "2px dashed #F4DCC4",
            animation: "fadeIn 0.4s ease both",
          }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>★</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900, color: "#2A2F4A" }}>
              {favorites.size === 0 ? "No favorites yet" : "Nothing matches"}
            </h3>
            <p style={{ margin: "0 0 24px", color: "#6C6580", fontWeight: 600, fontSize: 15 }}>
              {favorites.size === 0
                ? "Tap the ★ on any resource card to save it here."
                : "Try a different filter or clear the search."}
            </p>
            <Link href="/" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "14px 28px", borderRadius: 16, border: "none",
                background: "#D76B3F", color: "#fff",
                fontWeight: 800, fontSize: 15, cursor: "pointer",
                fontFamily: "inherit", boxShadow: "0 10px 24px rgba(215,107,63,0.35)",
              }}>Browse the library →</button>
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 22,
          }}>
            {favItems.map((item, i) => {
              const c = CATEGORY[item.kind]
              const [hover, setHover] = [false, () => {}] // placeholder — use state in component
              return <FavCard key={item.id} item={item} cat={c} onUnfav={() => toggleFav(item.id)} animDelay={i * 55} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

import type { LucideIcon } from "lucide-react"
import { Heart as HeartIcon, Video, Headphones, FileText, Gamepad2 } from "lucide-react"

const KIND_ICONS: Record<string, LucideIcon> = { video: Video, audio: Headphones, doc: FileText, game: Gamepad2 }

function FavCard({ item, cat, onUnfav, animDelay }: {
  item: { id: string; kind: string; title: string; desc: string; badge: string; thumbBg: string; thumbEmoji: string; duration?: string; pages?: number; plays?: string }
  cat: { label: string; color: string; soft: string; Icon?: LucideIcon }
  onUnfav: () => void
  animDelay: number
}) {
  const [hover, setHover] = useState(false)
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff", borderRadius: 24, overflow: "hidden",
        boxShadow: hover ? "0 18px 40px -12px rgba(40,20,10,0.16)" : "0 6px 18px -8px rgba(40,20,10,0.1)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.25s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s ease",
        border: `1px solid ${hover ? cat.soft : "#F4ECE3"}`,
        animation: `fadeIn 0.45s ease ${animDelay}ms both`,
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        position: "relative", aspectRatio: "5/3",
        background: item.thumbBg, display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
        <span style={{ fontSize: 60, position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.12))" }}>{item.thumbEmoji}</span>

        {/* Un-fav button */}
        <button onClick={e => { e.stopPropagation(); onUnfav() }} style={{
          position: "absolute", top: 12, right: 12, zIndex: 2,
          width: 36, height: 36, borderRadius: 999, border: "none",
          background: "#fff", color: "#E84B6B",
          cursor: "pointer", display: "grid", placeItems: "center",
          boxShadow: "0 4px 10px rgba(40,20,10,0.12)",
          transition: "transform 0.18s",
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
          <HeartIcon size={16} fill="#E84B6B" />
        </button>

        <div style={{
          position: "absolute", bottom: 12, left: 12,
          padding: "5px 11px", borderRadius: 999,
          background: "rgba(42, 47, 74, 0.78)", color: "#fff",
          fontWeight: 700, fontSize: 12, backdropFilter: "blur(6px)",
        }}>
          {(() => {
            const KI = KIND_ICONS[item.kind]
            const label = item.kind === "doc" ? `${item.pages} pages` : item.kind === "game" ? `${item.plays} plays` : (item.duration ?? "")
            return KI ? <><KI size={11} /> {label}</> : null
          })()}
        </div>
      </div>

      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5, alignSelf: "flex-start",
          padding: "5px 11px", borderRadius: 999,
          background: cat.soft, color: cat.color,
          fontWeight: 700, fontSize: 11.5,
        }}>{"Icon" in cat && cat.Icon ? <cat.Icon size={11} /> : null} {item.badge}</span>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "#2A2F4A", lineHeight: 1.25, letterSpacing: -0.2 }}>{item.title}</h3>
        <p style={{ margin: 0, fontSize: 13.5, color: "#6C6580", lineHeight: 1.5 }}>{item.desc}</p>
        <button style={{
          marginTop: "auto", padding: "13px", borderRadius: 14, border: "none",
          background: cat.color, color: "#fff", fontWeight: 800, fontSize: 14,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: `0 8px 18px ${cat.color}44`,
        }}>👁 View resource</button>
      </div>
    </article>
  )
}
