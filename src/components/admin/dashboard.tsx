"use client"

import { ADMIN_RESOURCES, hashId } from "@/lib/admin-data"
import { CATEGORY } from "@/lib/resources"
import {
  Eye, Star, FolderOpen, TrendingUp, Plus, Video, Headphones,
  FileText, Gamepad2, ArrowRight,
} from "./shared"
import { Heart } from "lucide-react"
import Link from "next/link"

// ─── Derived data ──────────────────────────────────────────────────────────────

const totalViews = ADMIN_RESOURCES.reduce((s, r) => s + r.views, 0)
const totalFavs  = ADMIN_RESOURCES.reduce((s, r) => s + r.favCount, 0)
const totalCount = ADMIN_RESOURCES.length
const published  = ADMIN_RESOURCES.filter(r => r.status === "published").length

const byKind = ADMIN_RESOURCES.reduce<Record<string, { views: number; count: number }>>((acc, r) => {
  if (!acc[r.kind]) acc[r.kind] = { views: 0, count: 0 }
  acc[r.kind].views  += r.views
  acc[r.kind].count  += 1
  return acc
}, {})

const topByViews = [...ADMIN_RESOURCES].sort((a, b) => b.views    - a.views   ).slice(0, 5)
const topByFavs  = [...ADMIN_RESOURCES].sort((a, b) => b.favCount - a.favCount).slice(0, 5)

// Weekly chart — 8 weeks, deterministic from resource count
const WEEK_BARS = (() => {
  const seed = totalCount * 37 + 11
  return Array.from({ length: 8 }, (_, i) => 120 + (hashId(`week${i}-${seed}`) % 280))
})()
const WEEK_MAX = Math.max(...WEEK_BARS)
const WEEK_LABELS = ["8w", "7w", "6w", "5w", "4w", "3w", "2w", "Now"]

// Donut
const DONUT_CATS = [
  { key: "video", label: "Videos",    color: "#2DB89E", soft: "#D4F1EA" },
  { key: "audio", label: "Audio",     color: "#7A5BC9", soft: "#E8DFFF" },
  { key: "doc",   label: "Documents", color: "#E89B1C", soft: "#FFE9C2" },
  { key: "game",  label: "Games",     color: "#E84B6B", soft: "#FFD8E1" },
] as const

const donutTotal = DONUT_CATS.reduce((s, c) => s + (byKind[c.key]?.views ?? 0), 0)

function buildConic() {
  if (!donutTotal) return `conic-gradient(#F0E4D6 0deg 360deg)`
  let deg = 0
  const segs = DONUT_CATS.map(c => {
    const share = ((byKind[c.key]?.views ?? 0) / donutTotal) * 360
    const seg = `${c.color} ${deg}deg ${deg + share}deg`
    deg += share
    return seg
  })
  return `conic-gradient(${segs.join(",")})`
}

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${n}`

// Category icon map
const CAT_ICONS = {
  video: Video, audio: Headphones, doc: FileText, game: Gamepad2,
} as const

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, delta, positive, Icon, accent, soft,
}: {
  label: string; value: string; sub?: string; delta: string; positive?: boolean
  Icon: typeof Eye; accent: string; soft: string
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 22, padding: "24px 26px",
      border: `1px solid #F0E4D6`,
      boxShadow: "0 4px 16px -8px rgba(40,20,10,0.1)",
      display: "flex", flexDirection: "column", gap: 16,
      position: "relative", overflow: "hidden",
    }}>
      {/* Accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 5, borderRadius: "22px 0 0 22px", background: accent }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", paddingLeft: 6 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          background: soft, color: accent,
          display: "grid", placeItems: "center",
          boxShadow: `0 4px 10px ${accent}22`,
        }}>
          <Icon size={20} />
        </div>
        <span style={{
          padding: "5px 10px", borderRadius: 999,
          fontSize: 11.5, fontWeight: 800, letterSpacing: 0.2,
          background: positive ? "#D4F1EA" : "#FFD8E1",
          color: positive ? "#1A7A60" : "#B03050",
        }}>
          {delta}
        </span>
      </div>

      <div style={{ paddingLeft: 6 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#2A2F4A", letterSpacing: -1, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#6C6580", marginTop: 5 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, fontWeight: 600, color: accent, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  )
}

// ─── Weekly bar chart ─────────────────────────────────────────────────────────

function WeeklyChart() {
  const gridLines = [25, 50, 75, 100]
  return (
    <div style={{
      background: "#fff", borderRadius: 22, padding: "24px 28px",
      border: "1px solid #F0E4D6",
      boxShadow: "0 4px 16px -8px rgba(40,20,10,0.1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#2A2F4A" }}>Views over time</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9A8B7E", marginTop: 2 }}>Last 8 weeks</div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 16, fontSize: 12, fontWeight: 700, color: "#9A8B7E",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "#2DB89E", display: "inline-block" }} />
            Previous weeks
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "#D76B3F", display: "inline-block" }} />
            This week
          </span>
        </div>
      </div>

      <div style={{ position: "relative", height: 200 }}>
        {/* Grid lines */}
        {gridLines.map(pct => (
          <div key={pct} style={{
            position: "absolute", left: 0, right: 0,
            bottom: `${pct}%`,
            borderTop: "1px dashed #F0E4D6",
          }}>
            <span style={{
              position: "absolute", right: "calc(100% + 6px)", top: -8,
              fontSize: 9.5, fontWeight: 700, color: "#C2A893", whiteSpace: "nowrap",
            }}>
              {Math.round((WEEK_MAX * pct) / 100)}
            </span>
          </div>
        ))}

        {/* Bars */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "flex-end", gap: 10, paddingRight: 8,
        }}>
          {WEEK_BARS.map((val, i) => {
            const h = Math.round((val / WEEK_MAX) * 180)
            const isLast = i === WEEK_BARS.length - 1
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                {/* Value label */}
                <div style={{ fontSize: 10, fontWeight: 800, color: isLast ? "#D76B3F" : "#2DB89E", marginBottom: 4 }}>
                  {fmt(val)}
                </div>
                <div
                  title={`~${val} views`}
                  style={{
                    width: "100%", height: h,
                    borderRadius: "8px 8px 3px 3px",
                    background: isLast
                      ? "linear-gradient(180deg, #D76B3F 0%, #E89B1C 100%)"
                      : "linear-gradient(180deg, #2DB89E 0%, #34D4B5 100%)",
                    boxShadow: isLast
                      ? "0 8px 20px rgba(215,107,63,0.35)"
                      : "0 4px 10px rgba(45,184,158,0.2)",
                    transition: "height 0.4s ease",
                  }}
                />
                <span style={{ fontSize: 10.5, fontWeight: 700, color: isLast ? "#D76B3F" : "#9A8B7E" }}>
                  {WEEK_LABELS[i]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Donut chart ──────────────────────────────────────────────────────────────

function DonutChart() {
  return (
    <div style={{
      background: "#fff", borderRadius: 22, padding: "24px 28px",
      border: "1px solid #F0E4D6",
      boxShadow: "0 4px 16px -8px rgba(40,20,10,0.1)",
    }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#2A2F4A" }}>Views by category</div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9A8B7E", marginTop: 2 }}>All-time breakdown</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {/* Donut with center label */}
        <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
          <div style={{
            width: 140, height: 140, borderRadius: "50%",
            background: buildConic(),
            mask: "radial-gradient(circle at center, transparent 44px, black 45px)",
            WebkitMask: "radial-gradient(circle at center, transparent 44px, black 45px)",
          }} />
          {/* Center total */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.5 }}>{fmt(donutTotal)}</div>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: "#9A8B7E", letterSpacing: 0.4, textTransform: "uppercase" }}>views</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {DONUT_CATS.map(c => {
            const views = byKind[c.key]?.views ?? 0
            const pct   = donutTotal > 0 ? Math.round((views / donutTotal) * 100) : 0
            return (
              <div key={c.key}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 4, background: c.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#2A2F4A" }}>{c.label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: "#6C6580" }}>{fmt(views)}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: c.color,
                    background: c.soft, padding: "2px 6px", borderRadius: 999,
                  }}>{pct}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 999, background: "#F0E4D6", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: 999 }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Top list ─────────────────────────────────────────────────────────────────

const RANK_STYLES = [
  { bg: "linear-gradient(135deg, #E89B1C, #F5B942)", color: "#fff", shadow: "0 4px 10px rgba(232,155,28,0.4)" },
  { bg: "linear-gradient(135deg, #9A9AB0, #B8B8C8)", color: "#fff", shadow: "0 4px 10px rgba(154,154,176,0.3)" },
  { bg: "linear-gradient(135deg, #CD7F32, #E09850)", color: "#fff", shadow: "0 4px 10px rgba(205,127,50,0.3)" },
]

function TopList({
  title, icon, items, valueKey, maxValue, valueLabel, accentColor,
}: {
  title: string; icon: React.ReactNode
  items: typeof topByViews
  valueKey: "views" | "favCount"; maxValue: number; valueLabel: string; accentColor: string
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 22, padding: "24px 26px",
      border: "1px solid #F0E4D6",
      boxShadow: "0 4px 16px -8px rgba(40,20,10,0.1)", flex: 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <span style={{
          width: 32, height: 32, borderRadius: 10,
          background: "#FFE3D2", color: "#D76B3F",
          display: "grid", placeItems: "center",
        }}>{icon}</span>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#2A2F4A" }}>{title}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((item, i) => {
          const val   = item[valueKey]
          const pct   = maxValue > 0 ? (val / maxValue) * 100 : 0
          const rank  = RANK_STYLES[i] ?? { bg: "#FAF4ED", color: "#9A8B7E", shadow: "none" }
          const CatIcon = CAT_ICONS[item.kind as keyof typeof CAT_ICONS] ?? FileText
          const cat   = CATEGORY[item.kind]

          return (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 11 }}>
              {/* Rank badge */}
              <div style={{
                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                background: rank.bg, color: rank.color,
                display: "grid", placeItems: "center",
                fontSize: 11, fontWeight: 900,
                boxShadow: rank.shadow,
              }}>
                {i + 1}
              </div>

              {/* Category icon circle — replaces emoji */}
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: cat?.soft ?? "#FAF4ED",
                color: cat?.color ?? "#6C6580",
                display: "grid", placeItems: "center",
                boxShadow: `0 2px 6px ${cat?.color ?? "#ccc"}22`,
              }}>
                <CatIcon size={16} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13.5, fontWeight: 800, color: "#2A2F4A",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  marginBottom: 6,
                }}>
                  {item.title}
                </div>
                <div style={{ height: 6, borderRadius: 999, background: "#F0E4D6", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`, borderRadius: 999,
                    background: i === 0
                      ? `linear-gradient(90deg, ${accentColor}, ${accentColor}CC)`
                      : `linear-gradient(90deg, #2DB89E, #34D4B5)`,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>

              <span style={{
                fontSize: 12.5, fontWeight: 800,
                color: i === 0 ? accentColor : "#6C6580",
                flexShrink: 0, minWidth: 60, textAlign: "right",
              }}>
                {val.toLocaleString()} {valueLabel}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Quick actions ────────────────────────────────────────────────────────────

function QuickActions() {
  const actions = [
    { href: "/admin/resources", label: "Add Resource", Icon: Plus,       color: "#D76B3F", soft: "#FFE3D2" },
    { href: "/admin/sounds",    label: "Add Sound",    Icon: Headphones,  color: "#7A5BC9", soft: "#E8DFFF" },
    { href: "/admin/tags",      label: "Manage Tags",  Icon: TrendingUp,  color: "#2DB89E", soft: "#D4F1EA" },
  ]
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {actions.map(a => (
        <Link key={a.href} href={a.href} style={{ textDecoration: "none", flex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "14px 18px", borderRadius: 16,
            background: "#fff", border: `1px solid #F0E4D6`,
            boxShadow: "0 2px 8px rgba(40,20,10,0.06)",
            cursor: "pointer", transition: "all 0.18s ease",
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = a.color
              ;(e.currentTarget as HTMLDivElement).style.background = a.soft
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#F0E4D6"
              ;(e.currentTarget as HTMLDivElement).style.background = "#fff"
            }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: a.soft, color: a.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <a.Icon size={16} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#2A2F4A", flex: 1 }}>{a.label}</span>
            <ArrowRight size={14} color="#9A8B7E" />
          </div>
        </Link>
      ))}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  return (
    <div style={{ fontFamily: "var(--font-nunito)", padding: "36px 40px", maxWidth: 1400 }}>

      {/* ── Page header ── */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: 32, gap: 16, flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#9A8B7E", letterSpacing: 0.8, marginBottom: 6, textTransform: "uppercase" }}>
            {today}
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 30, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.6 }}>
            Dashboard
          </h1>
          <p style={{ margin: 0, color: "#6C6580", fontWeight: 600, fontSize: 14.5 }}>
            Your Telesesh Spark library — {published} resources published, {(totalViews / 1000).toFixed(1)}k total views.
          </p>
        </div>
        <Link href="/admin/resources" style={{ textDecoration: "none" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "13px 22px", borderRadius: 14, border: "none",
            background: "#D76B3F", color: "#fff",
            fontWeight: 800, fontSize: 14, cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 8px 20px rgba(215,107,63,0.35)",
          }}>
            <Plus size={16} /> Add Resource
          </button>
        </Link>
      </div>

      {/* ── 4 KPI cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <KpiCard
          label="Total Views" value={fmt(totalViews)} delta="+12% this month" positive
          Icon={Eye} accent="#2DB89E" soft="#D4F1EA"
        />
        <KpiCard
          label="Favorites" value={fmt(totalFavs)} delta="+8% this month" positive
          Icon={Heart} accent="#E84B6B" soft="#FFD8E1"
        />
        <KpiCard
          label="Resources" value={`${totalCount}`} sub={`${published} published`}
          delta={`+${totalCount - published} drafts`} positive
          Icon={FolderOpen} accent="#7A5BC9" soft="#E8DFFF"
        />
        <KpiCard
          label="Avg. Views/Resource" value={fmt(Math.round(totalViews / Math.max(totalCount, 1)))}
          delta="per resource" positive
          Icon={TrendingUp} accent="#E89B1C" soft="#FFE9C2"
        />
      </div>

      {/* ── Charts ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 24 }}>
        <WeeklyChart />
        <DonutChart />
      </div>

      {/* ── Top lists ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <TopList
          title="Top Resources" icon={<TrendingUp size={16} />}
          items={topByViews} valueKey="views"
          maxValue={topByViews[0]?.views ?? 1} valueLabel="views"
          accentColor="#D76B3F"
        />
        <TopList
          title="Most Favorited" icon={<Star size={16} />}
          items={topByFavs} valueKey="favCount"
          maxValue={topByFavs[0]?.favCount ?? 1} valueLabel="favs"
          accentColor="#E84B6B"
        />
      </div>

      {/* ── Quick actions ── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#9A8B7E", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>
          Quick actions
        </div>
        <QuickActions />
      </div>
    </div>
  )
}
