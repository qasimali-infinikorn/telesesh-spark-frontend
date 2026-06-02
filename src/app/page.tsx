"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { TopBar } from "@/components/topbar"
import { RESOURCES, CATEGORY, ALL_TAGS, AGE_GROUPS, SERVICES } from "@/lib/resources"
import type { Resource, CategoryKey } from "@/lib/resources"
import { Eye, Heart, Star, Video, Headphones, FileText, Gamepad2, Search, SearchX } from "lucide-react"

// ─── (TopBar is now the shared @/components/topbar) ──────────────────────────

// ─── CategoryPills ────────────────────────────────────────────────────────────

function CategoryPills({
  category,
  setCategory,
  counts,
}: {
  category: CategoryKey
  setCategory: (k: CategoryKey) => void
  counts: Record<string, number>
}) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
      {(Object.keys(CATEGORY) as CategoryKey[]).map((k) => {
        const c = CATEGORY[k]
        const active = category === k
        return (
          <button
            key={k}
            onClick={() => setCategory(k)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 16px", borderRadius: 16,
              border: "2px solid", borderColor: active ? c.color : "#F4ECE3",
              background: active ? c.soft : "#fff",
              color: active ? c.color : "#6C6580",
              fontWeight: 800, fontSize: 14, cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.18s ease",
            }}
          >
            <c.Icon size={14} />
            {c.label}
            <span style={{
              fontSize: 12, fontWeight: 800,
              padding: "2px 8px", borderRadius: 999,
              background: active ? c.color : "#F4ECE3",
              color: active ? "#fff" : "#9A8B7E",
            }}>
              {k === "all" ? counts.all : counts[k] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── ResourceCard ─────────────────────────────────────────────────────────────

function ResourceCard({
  item,
  isFav,
  onToggleFav,
  animDelay,
}: {
  item: Resource
  isFav: boolean
  onToggleFav: () => void
  animDelay: number
}) {
  const [hover, setHover] = useState(false)
  const c = CATEGORY[item.kind]

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        borderRadius: 28,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hover
          ? "0 18px 40px -12px rgba(40,20,10,0.18), 0 4px 12px rgba(40,20,10,0.06)"
          : "0 6px 18px -8px rgba(40,20,10,0.12), 0 2px 6px rgba(40,20,10,0.04)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.25s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s ease",
        display: "flex", flexDirection: "column",
        border: `1px solid ${hover ? c.soft : "#F4ECE3"}`,
        animation: `fadeIn 0.5s ease ${animDelay}ms both`,
      }}
    >
      {/* Thumbnail */}
      <div style={{
        position: "relative",
        aspectRatio: "5/3",
        background: item.thumbBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
        <div style={{ position: "absolute", bottom: -10, left: -10, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />

        <span style={{ fontSize: 64, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))", position: "relative", zIndex: 1 }}>
          {item.thumbEmoji}
        </span>

        {/* Fav button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav() }}
          style={{
            position: "absolute", top: 14, right: 14, zIndex: 2,
            width: 38, height: 38, borderRadius: 999, border: "none",
            background: isFav ? "#fff" : "rgba(255,255,255,0.85)",
            color: isFav ? c.color : "#9A9AB0",
            cursor: "pointer", display: "grid", placeItems: "center",
            boxShadow: "0 4px 12px rgba(40, 20, 10, 0.12)",
            fontSize: 18,
            transition: "transform 0.18s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Heart size={16} fill={isFav ? c.color : "none"} />
        </button>

        {/* Duration / pages / plays pill */}
        <div style={{
          position: "absolute", bottom: 14, left: 14,
          padding: "6px 12px", borderRadius: 999,
          background: "rgba(42, 47, 74, 0.78)", color: "#fff",
          fontWeight: 700, fontSize: 12, backdropFilter: "blur(6px)",
        }}>
          {item.kind === "video" && <><Video     size={12} /> {item.duration}</>}
          {item.kind === "audio" && <><Headphones size={12} /> {item.duration}</>}
          {item.kind === "doc"   && <><FileText   size={12} /> {item.pages} pages</>}
          {item.kind === "game"  && <><Gamepad2   size={12} /> {item.plays} plays</>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {/* Badge */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 999,
          background: c.soft, color: c.color,
          fontWeight: 700, fontSize: 12, letterSpacing: 0.2, alignSelf: "flex-start",
        }}>
          <c.Icon size={12} /> {item.badge}
        </span>

        <h3 style={{ margin: 0, fontSize: 21, lineHeight: 1.22, color: "#2A2F4A", fontWeight: 800, letterSpacing: -0.2 }}>
          {item.title}
        </h3>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: "#6C6580" }}>
          {item.desc}
        </p>

        {/* View button */}
        <div style={{ marginTop: "auto", paddingTop: 4, display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{
            flex: 1, padding: "14px 18px", borderRadius: 16,
            border: "none", background: c.color, color: "#fff",
            fontWeight: 800, fontSize: 15, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: `0 8px 18px ${c.color}44`,
            fontFamily: "inherit",
          }}>
            <Eye size={16} /> View
          </button>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: c.soft, color: c.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <c.Icon size={22} />
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      padding: "60px 28px", borderRadius: 28, background: "#fff",
      textAlign: "center", border: "2px dashed #F4DCC4", marginTop: 24,
    }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: "#FFE3D2", color: "#D76B3F", display: "grid", placeItems: "center", margin: "0 auto 12px" }}><SearchX size={28} /></div>
      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#2A2F4A" }}>Nothing matches yet</h3>
      <p style={{ margin: "8px 0 0", color: "#6C6580", fontWeight: 600 }}>
        Try clearing a filter or searching for something else.
      </p>
    </div>
  )
}

// ─── MultiDropdown ────────────────────────────────────────────────────────────

function MultiDropdown({
  label,
  icon,
  options,
  selected,
  onToggle,
}: {
  label: string
  icon: React.ReactNode
  options: string[]
  selected: Set<string>
  onToggle: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const count = selected.size

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "11px 14px",
          borderRadius: 12,
          border: "2px solid",
          borderColor: count > 0 ? "#D76B3F" : "#F4ECE3",
          background: count > 0 ? "#FFE3D2" : "#FAF4ED",
          color: count > 0 ? "#D76B3F" : "#6C6580",
          fontWeight: 700, fontSize: 13.5,
          cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.18s ease",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon}
          {label}
          {count > 0 && (
            <span style={{
              padding: "2px 8px", borderRadius: 999,
              background: "#D76B3F", color: "#fff",
              fontWeight: 800, fontSize: 11,
            }}>
              {count}
            </span>
          )}
        </span>
        <svg
          width="14" height="14"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#fff", borderRadius: 14,
          border: "1px solid #F4ECE3",
          boxShadow: "0 12px 32px -8px rgba(40,20,10,0.15)",
          zIndex: 100,
          overflow: "hidden",
          animation: "fadeIn 0.18s ease both",
        }}>
          {options.map((opt) => {
            const active = selected.has(opt)
            return (
              <button
                key={opt}
                onClick={() => onToggle(opt)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px",
                  background: active ? "#FFF5EF" : "transparent",
                  border: "none", borderBottom: "1px solid #F9F2EA",
                  color: active ? "#D76B3F" : "#2A2F4A",
                  fontWeight: active ? 800 : 600, fontSize: 13.5,
                  cursor: "pointer", fontFamily: "inherit",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#FAF4ED" }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent" }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: "2px solid", borderColor: active ? "#D76B3F" : "#D6C8B6",
                  background: active ? "#D76B3F" : "#fff",
                  display: "grid", placeItems: "center",
                  transition: "all 0.15s",
                }}>
                  {active && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                {opt}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  query, setQuery,
  age, toggleAge,
  service, toggleService,
  activeTags, toggleTag,
  favorites, favKind, setFavKind,
}: {
  query: string
  setQuery: (v: string) => void
  age: Set<string>
  toggleAge: (v: string) => void
  service: Set<string>
  toggleService: (v: string) => void
  activeTags: Set<string>
  toggleTag: (v: string) => void
  favorites: Set<string>
  favKind: string | null
  setFavKind: (k: string | null) => void
}) {
  const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 900, color: "#6C6580",
    letterSpacing: 1.2, textTransform: "uppercase" as const,
    marginBottom: 10,
  }

  // Group favorites by kind
  const favsByKind = useMemo(() => {
    const groups: Record<string, number> = {}
    RESOURCES.forEach((r) => {
      if (favorites.has(r.id)) {
        groups[r.kind] = (groups[r.kind] ?? 0) + 1
      }
    })
    return groups
  }, [favorites])

  const hasFavs = Object.keys(favsByKind).length > 0

  return (
    <aside style={{
      width: 340, flexShrink: 0,
      background: "#fff", borderRadius: 24,
      border: "1px solid #F4ECE3",
      boxShadow: "0 6px 18px -8px rgba(40,20,10,0.10)",
      padding: 24,
      position: "sticky", top: 88,
      maxHeight: "calc(100vh - 96px)",
      overflowY: "auto",
      display: "flex", flexDirection: "column", gap: 28,
    }}>
      {/* Search */}
      <div>
        <p style={sectionLabel}>Search</p>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9A8B7E", pointerEvents: "none", display: "grid" }}>
            <Search size={15} />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            style={{
              width: "100%",
              padding: "12px 14px 12px 40px",
              borderRadius: 12,
              border: "2px solid #F4ECE3",
              fontSize: 14,
              fontWeight: 600,
              color: "#2A2F4A",
              background: "#FAF4ED",
              fontFamily: "inherit",
              outline: "none",
              transition: "border-color 0.18s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#D76B3F")}
            onBlur={(e) => (e.target.style.borderColor = "#F4ECE3")}
          />
        </div>
      </div>

      {/* Service */}
      <div>
        <p style={sectionLabel}>Service</p>
        <MultiDropdown
          label="All services"
          icon={<Headphones size={14} />}
          options={SERVICES}
          selected={service}
          onToggle={toggleService}
        />
      </div>

      {/* Age group */}
      <div>
        <p style={sectionLabel}>Age Group</p>
        <MultiDropdown
          label="All ages"
          icon={<Star size={14} />}
          options={AGE_GROUPS}
          selected={age}
          onToggle={toggleAge}
        />
      </div>

      {/* Favorites */}
      {hasFavs && (
        <div>
          <p style={sectionLabel}>Favorites</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* All favorites button */}
            <button
              onClick={() => setFavKind(favKind === "all-favs" ? null : "all-favs")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px", borderRadius: 12,
                border: "2px solid",
                borderColor: favKind === "all-favs" ? "#D76B3F" : "#F4ECE3",
                background: favKind === "all-favs" ? "#FFE3D2" : "#FAF4ED",
                color: favKind === "all-favs" ? "#D76B3F" : "#6C6580",
                fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.18s ease",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Heart size={13} /> All favorites</span>
              <span style={{
                padding: "2px 8px", borderRadius: 999,
                background: favKind === "all-favs" ? "#D76B3F" : "#F4ECE3",
                color: favKind === "all-favs" ? "#fff" : "#9A8B7E",
                fontWeight: 800, fontSize: 11,
              }}>
                {favorites.size}
              </span>
            </button>

            {(Object.entries(favsByKind) as Array<[Resource["kind"], number]>).map(([kind, cnt]) => {
              const c = CATEGORY[kind]
              const isActive = favKind === kind
              return (
                <button
                  key={kind}
                  onClick={() => setFavKind(isActive ? null : kind)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", borderRadius: 12,
                    border: "2px solid",
                    borderColor: isActive ? c.color : "#F4ECE3",
                    background: isActive ? c.soft : "#FAF4ED",
                    color: isActive ? c.color : "#6C6580",
                    fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.18s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><c.Icon size={13} /> {c.label}</span>
                  <span style={{
                    padding: "2px 8px", borderRadius: 999,
                    background: isActive ? c.color : "#F4ECE3",
                    color: isActive ? "#fff" : "#9A8B7E",
                    fontWeight: 800, fontSize: 11,
                  }}>
                    {cnt}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Tags */}
      <div>
        <p style={sectionLabel}>Tags</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {ALL_TAGS.map((tag) => {
            const active = activeTags.has(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "7px 13px", borderRadius: 999,
                  border: "2px solid",
                  borderColor: active ? "#D76B3F" : "#F4ECE3",
                  background: active ? "#FFE3D2" : "#FAF4ED",
                  color: active ? "#D76B3F" : "#6C6580",
                  fontWeight: 700, fontSize: 12.5,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.18s ease",
                }}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear all button — shown if any filter is active */}
      {(query || age.size > 0 || service.size > 0 || activeTags.size > 0 || favKind) && (
        <button
          onClick={() => {
            setQuery("")
            age.forEach(toggleAge)
            service.forEach(toggleService)
            activeTags.forEach(toggleTag)
            setFavKind(null)
          }}
          style={{
            padding: "12px", borderRadius: 12,
            border: "2px solid #F4ECE3", background: "#FAF4ED",
            color: "#9A8B7E", fontWeight: 800, fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ✕ Clear all filters
        </button>
      )}
    </aside>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const { data: session } = useSession()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<CategoryKey>("all")
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set())
  const [age, setAge] = useState<Set<string>>(new Set())
  const [service, setService] = useState<Set<string>>(new Set())
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(RESOURCES.filter((r) => r.fav).map((r) => r.id))
  )
  const [favKind, setFavKind] = useState<string | null>(null)

  const toggleFav = (id: string) =>
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })

  const toggleTag = (tag: string) =>
    setActiveTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) { next.delete(tag) } else { next.add(tag) }
      return next
    })

  const toggleAge = (a: string) =>
    setAge((prev) => {
      const next = new Set(prev)
      if (next.has(a)) { next.delete(a) } else { next.add(a) }
      return next
    })

  const toggleService = (s: string) =>
    setService((prev) => {
      const next = new Set(prev)
      if (next.has(s)) { next.delete(s) } else { next.add(s) }
      return next
    })

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: RESOURCES.length, video: 0, audio: 0, doc: 0, game: 0 }
    RESOURCES.forEach((r) => { c[r.kind]++ })
    return c
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RESOURCES.filter((r) => {
      if (favKind === "all-favs" && !favorites.has(r.id)) return false
      if (favKind && favKind !== "all-favs" && (!favorites.has(r.id) || r.kind !== favKind)) return false
      if (category !== "all" && r.kind !== category) return false
      if (age.size > 0 && !age.has(r.age)) return false
      if (service.size > 0 && !service.has(r.service)) return false
      if (activeTags.size > 0 && !r.tags.some((t) => activeTags.has(t))) return false
      if (q && !(r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q))) return false
      return true
    })
  }, [query, category, activeTags, age, service, favKind, favorites])

  const userName  = session?.user?.name?.split(" ")[0] ?? "there"
  const userEmail = session?.user?.email ?? ""

  return (
    <div style={{ minHeight: "100vh", background: "#FCEDDB", fontFamily: "var(--font-nunito)" }}>
      <TopBar userName={userName} userEmail={userEmail} />

      <div style={{
        maxWidth: 1480,
        margin: "0 auto",
        padding: "28px 32px 80px",
        display: "flex",
        gap: 28,
        alignItems: "flex-start",
      }}>
        {/* MAIN */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Page header */}
          <div style={{ marginBottom: 24, animation: "fadeIn 0.5s ease both" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 12px", borderRadius: 999,
              background: "#fff", color: "#D76B3F",
              fontSize: 12, fontWeight: 800, letterSpacing: 0.6,
              marginBottom: 10, border: "1px solid #F4DCC4",
            }}>
              ✦ RESOURCES
            </div>
            <h1 style={{ margin: 0, fontSize: 38, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.8, lineHeight: 1.05 }}>
              Hi {userName}, ready to spark<br />a great session?
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: 16, color: "#6C6580", fontWeight: 600 }}>
              Pick a resource to share with your learner — videos, songs, printables &amp; games.
            </p>
          </div>

          {/* Category pills */}
          <CategoryPills category={category} setCategory={setCategory} counts={counts} />

          {/* Grid or empty state */}
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
              marginTop: 24,
            }}>
              {filtered.map((item, i) => (
                <ResourceCard
                  key={item.id}
                  item={item}
                  isFav={favorites.has(item.id)}
                  onToggleFav={() => toggleFav(item.id)}
                  animDelay={i * 60}
                />
              ))}
            </div>
          )}
        </main>

        {/* SIDEBAR */}
        <Sidebar
          query={query}
          setQuery={setQuery}
          age={age}
          toggleAge={toggleAge}
          service={service}
          toggleService={toggleService}
          activeTags={activeTags}
          toggleTag={toggleTag}
          favorites={favorites}
          favKind={favKind}
          setFavKind={setFavKind}
        />
      </div>
    </div>
  )
}
