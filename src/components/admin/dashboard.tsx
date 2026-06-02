"use client"

import { ADMIN_RESOURCES, hashId } from "@/lib/admin-data"
import { C, StatCard, Panel, Eye, Star, FolderOpen, TrendingUp } from "./shared"

// ─── Derived data ─────────────────────────────────────────────────────────────

const totalViews   = ADMIN_RESOURCES.reduce((s, r) => s + r.views, 0)
const totalFavs    = ADMIN_RESOURCES.reduce((s, r) => s + r.favCount, 0)
const totalCount   = ADMIN_RESOURCES.length

const byKind = ADMIN_RESOURCES.reduce<Record<string, { views: number; count: number }>>((acc, r) => {
  if (!acc[r.kind]) acc[r.kind] = { views: 0, count: 0 }
  acc[r.kind].views += r.views
  acc[r.kind].count++
  return acc
}, {})

const topByViews = [...ADMIN_RESOURCES].sort((a, b) => b.views - a.views).slice(0, 5)
const topByFavs  = [...ADMIN_RESOURCES].sort((a, b) => b.favCount - a.favCount).slice(0, 5)

// Weekly bar chart — 8 weeks of deterministic data
function weeklyBars() {
  const seed = totalCount * 37 + 11
  return Array.from({ length: 8 }, (_, i) => {
    const h = hashId(`week${i}-${seed}`)
    return 60 + (h % 340)
  })
}
const BARS = weeklyBars()
const MAX_BAR = Math.max(...BARS)

const WEEK_LABELS = ["8w", "7w", "6w", "5w", "4w", "3w", "2w", "Now"]

// Donut data
const DONUT_CATS = [
  { key: "video", label: "Videos",    color: "#2DB89E" },
  { key: "audio", label: "Audio",     color: "#7A5BC9" },
  { key: "doc",   label: "Documents", color: "#E89B1C" },
  { key: "game",  label: "Games",     color: "#E84B6B" },
] as const

function buildConicGradient() {
  const total = DONUT_CATS.reduce((s, c) => s + (byKind[c.key]?.views ?? 0), 0)
  if (total === 0) return `conic-gradient(${C.hairline} 0deg 360deg)`
  let deg = 0
  const parts: string[] = []
  DONUT_CATS.forEach((c) => {
    const share = ((byKind[c.key]?.views ?? 0) / total) * 360
    parts.push(`${c.color} ${deg}deg ${deg + share}deg`)
    deg += share
  })
  return `conic-gradient(${parts.join(",")})`
}

// ─── WeeklyChart ──────────────────────────────────────────────────────────────

function WeeklyChart() {
  return (
    <Panel
      title="Views over time"
      subtitle="Last 8 weeks"
      icon={<TrendingUp size={15} />}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140, paddingBottom: 4 }}>
        {BARS.map((val, i) => {
          const h = Math.round((val / MAX_BAR) * 120)
          const isLast = i === BARS.length - 1
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                title={`~${val} views`}
                style={{
                  width: "100%", height: h,
                  borderRadius: "6px 6px 0 0",
                  background: isLast
                    ? `linear-gradient(180deg, ${C.primary} 0%, #F08A58 100%)`
                    : `linear-gradient(180deg, ${C.accent} 0%, #44C9B3 100%)`,
                  opacity: isLast ? 1 : 0.7,
                  boxShadow: isLast ? `0 6px 14px ${C.primary}44` : "none",
                  transition: "height 0.4s ease",
                  cursor: "default",
                }}
              />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: C.muted }}>{WEEK_LABELS[i]}</span>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

// ─── DonutChart ───────────────────────────────────────────────────────────────

function DonutChart() {
  const totalDonut = DONUT_CATS.reduce((s, c) => s + (byKind[c.key]?.views ?? 0), 0)
  return (
    <Panel
      title="Views by category"
      subtitle="All-time breakdown"
      icon={<Eye size={15} />}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {/* Donut */}
        <div style={{
          width: 110, height: 110, borderRadius: "50%", flexShrink: 0,
          background: buildConicGradient(),
          mask: "radial-gradient(circle at center, transparent 38px, black 39px)",
          WebkitMask: "radial-gradient(circle at center, transparent 38px, black 39px)",
          position: "relative",
        }} />
        {/* Legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {DONUT_CATS.map((c) => {
            const views = byKind[c.key]?.views ?? 0
            const pct   = totalDonut > 0 ? Math.round((views / totalDonut) * 100) : 0
            return (
              <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: C.ink }}>{c.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.muted }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </Panel>
  )
}

// ─── TopList ──────────────────────────────────────────────────────────────────

function TopList({
  title,
  icon,
  items,
  valueKey,
  maxValue,
  valueLabel,
}: {
  title: string
  icon: React.ReactNode
  items: typeof topByViews
  valueKey: "views" | "favCount"
  maxValue: number
  valueLabel: string
}) {
  return (
    <Panel title={title} icon={icon} style={{ flex: 1 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((item, i) => {
          const val = item[valueKey]
          const pct = maxValue > 0 ? (val / maxValue) * 100 : 0
          return (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                background: i === 0 ? C.primary : C.panelBg,
                color: i === 0 ? "#fff" : C.muted,
                display: "grid", placeItems: "center",
                fontSize: 11, fontWeight: 900,
              }}>
                {i + 1}
              </span>
              <div style={{ fontSize: 20, flexShrink: 0 }}>{item.thumbEmoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13.5, fontWeight: 800, color: C.ink,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                  marginBottom: 5,
                }}>
                  {item.title}
                </div>
                <div style={{
                  height: 5, borderRadius: 999,
                  background: C.hairline, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 999,
                    width: `${pct}%`,
                    background: i === 0
                      ? `linear-gradient(90deg, ${C.primary}, #F08A58)`
                      : `linear-gradient(90deg, ${C.accent}, #44C9B3)`,
                  }} />
                </div>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: C.muted, flexShrink: 0 }}>
                {val.toLocaleString()} {valueLabel}
              </span>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div style={{ fontFamily: "var(--font-nunito)", padding: "32px 36px" }}>
      <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, color: C.ink }}>Dashboard</h1>
      <p style={{ margin: "0 0 28px", color: C.muted, fontWeight: 600, fontSize: 14.5 }}>
        Overview of your Telesesh Spark resource library.
      </p>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard
          icon={<Eye size={18} />}
          iconBg="#D4F1EA"
          value={totalViews.toLocaleString()}
          label="Total Views"
          delta="+12% this month"
          deltaPositive
        />
        <StatCard
          icon={<Star size={18} />}
          iconBg="#FFE3D2"
          value={totalFavs.toLocaleString()}
          label="Favorites"
          delta="+8% this month"
          deltaPositive
        />
        <StatCard
          icon={<FolderOpen size={18} />}
          iconBg="#E8DFFF"
          value={totalCount.toString()}
          label="Resources"
          delta={`+${ADMIN_RESOURCES.filter((r) => r.status === "published").length} published`}
          deltaPositive
        />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <WeeklyChart />
        <DonutChart />
      </div>

      {/* Top lists */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <TopList
          title="Top Resources"
          icon={<TrendingUp size={15} />}
          items={topByViews}
          valueKey="views"
          maxValue={topByViews[0]?.views ?? 1}
          valueLabel="views"
        />
        <TopList
          title="Most Favorited"
          icon={<Star size={15} />}
          items={topByFavs}
          valueKey="favCount"
          maxValue={topByFavs[0]?.favCount ?? 1}
          valueLabel="favs"
        />
      </div>
    </div>
  )
}
