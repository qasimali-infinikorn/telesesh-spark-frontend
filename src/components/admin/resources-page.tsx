"use client"

import { useState, useMemo } from "react"
import { ADMIN_RESOURCES, fmtDate } from "@/lib/admin-data"
import type { AdminResource } from "@/lib/admin-data"
import { CATEGORY } from "@/lib/resources"
import type { CategoryKey } from "@/lib/resources"
import { C, RowBtn, Confirm, AdminIcons } from "./shared"
import ResourceForm from "./resource-form"

type Kind = "video" | "audio" | "doc" | "game"

// ─── TypePickerModal ──────────────────────────────────────────────────────────

const TYPE_CARDS: { kind: Kind; label: string; emoji: string; desc: string; color: string; soft: string }[] = [
  { kind: "video", label: "Video",    emoji: "🎬", desc: "Upload or embed a video resource", color: "#2DB89E", soft: "#D4F1EA" },
  { kind: "audio", label: "Audio",    emoji: "🎵", desc: "Audio clips, songs or narrations",  color: "#7A5BC9", soft: "#E8DFFF" },
  { kind: "doc",   label: "Document", emoji: "📄", desc: "PDFs, worksheets or printables",    color: "#E89B1C", soft: "#FFE9C2" },
  { kind: "game",  label: "Game",     emoji: "🎮", desc: "Interactive HTML5 games",           color: "#E84B6B", soft: "#FFD8E1" },
]

function TypePickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (k: Kind) => void
  onClose: () => void
}) {
  const [hovered, setHovered] = useState<Kind | null>(null)
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(42,47,74,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 28, padding: "36px 40px",
          width: 520, boxShadow: "0 32px 80px -16px rgba(40,20,10,0.3)",
          fontFamily: "var(--font-nunito)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: C.ink }}>Choose Resource Type</div>
            <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginTop: 2 }}>What kind of resource are you adding?</div>
          </div>
          <button type="button" onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 10, border: "none",
            background: C.panelBg, color: C.muted,
            cursor: "pointer", display: "grid", placeItems: "center", fontFamily: "inherit",
          }}>
            {AdminIcons.Close(15)}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {TYPE_CARDS.map((card) => {
            const isHov = hovered === card.kind
            return (
              <button
                key={card.kind}
                type="button"
                onClick={() => onSelect(card.kind)}
                onMouseEnter={() => setHovered(card.kind)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "22px 20px", borderRadius: 18, cursor: "pointer",
                  border: `2px solid ${isHov ? card.color : C.hairline}`,
                  background: isHov ? card.soft : "#FAF4ED",
                  textAlign: "left", fontFamily: "inherit",
                  transition: "all 0.18s ease",
                  display: "flex", flexDirection: "column", gap: 8,
                }}
              >
                <div style={{ fontSize: 32 }}>{card.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: isHov ? card.color : C.ink }}>{card.label}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, lineHeight: 1.4 }}>{card.desc}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── ResourcesPage ─────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const [resources, setResources] = useState<AdminResource[]>(ADMIN_RESOURCES)
  const [search, setSearch]       = useState("")
  const [filter, setFilter]       = useState<"all" | Kind>("all")
  const [showTypePicker, setShowTypePicker] = useState(false)
  const [formKind, setFormKind]   = useState<Kind | null>(null)
  const [editItem, setEditItem]   = useState<AdminResource | null>(null)
  const [deleteId, setDeleteId]   = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return resources.filter((r) => {
      if (filter !== "all" && r.kind !== filter) return false
      if (q && !(r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q))) return false
      return true
    })
  }, [resources, search, filter])

  function handleAddSelect(kind: Kind) {
    setShowTypePicker(false)
    setFormKind(kind)
    setEditItem(null)
  }

  function handleSave({ status, form }: { status: "published" | "draft"; form: { title: string; desc: string; tags: string[]; thumbEmoji: string; thumbBg: string; services: string[]; ages: string[] } }) {
    if (editItem) {
      setResources((prev) =>
        prev.map((r) =>
          r.id === editItem.id
            ? {
                ...r, status,
                title: form.title || r.title,
                desc: form.desc || r.desc,
                tags: form.tags.length ? form.tags : r.tags,
                thumbEmoji: form.thumbEmoji,
                thumbBg: form.thumbBg,
                service: form.services[0] ?? r.service,
                age: form.ages[0] ?? r.age,
              }
            : r
        )
      )
    } else if (formKind) {
      const id = `new-${Date.now()}`
      const newResource: AdminResource = {
        id, kind: formKind,
        title: form.title || "Untitled Resource",
        desc: form.desc || "",
        tags: form.tags,
        thumbEmoji: form.thumbEmoji,
        thumbBg: form.thumbBg,
        badge: formKind.charAt(0).toUpperCase() + formKind.slice(1),
        age: form.ages[0] ?? "Preschool",
        service: form.services[0] ?? "Speech therapy",
        dateAdded: new Date().toISOString().split("T")[0],
        status, views: 0, favCount: 0,
      }
      setResources((prev) => [newResource, ...prev])
    }
    setFormKind(null)
    setEditItem(null)
  }

  function handleDelete(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id))
    setDeleteId(null)
  }

  const toDelete = resources.find((r) => r.id === deleteId)

  const FILTERS: { key: "all" | Kind; label: string; emoji: string }[] = [
    { key: "all",   label: "All",       emoji: "✨" },
    { key: "video", label: "Videos",    emoji: "🎬" },
    { key: "audio", label: "Audio",     emoji: "🎵" },
    { key: "doc",   label: "Documents", emoji: "📄" },
    { key: "game",  label: "Games",     emoji: "🎮" },
  ]

  return (
    <div style={{ fontFamily: "var(--font-nunito)", padding: "32px 36px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, color: C.ink }}>Resources</h1>
          <p style={{ margin: 0, color: C.muted, fontWeight: 600, fontSize: 14.5 }}>
            Manage all therapy resources — videos, audio, documents and games.
          </p>
        </div>
        <button
          onClick={() => setShowTypePicker(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 20px", borderRadius: 14, border: "none",
            background: C.primary, color: "#fff",
            fontWeight: 800, fontSize: 14, cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 8px 18px rgba(215,107,63,0.35)",
          }}
        >
          {AdminIcons.Plus(16)} Add Resource
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20, flexWrap: "wrap" as const }}>
        <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 380 }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: C.muted, pointerEvents: "none" }}>
            {AdminIcons.Search(16)}
          </span>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources…"
            style={{
              width: "100%", padding: "11px 14px 11px 40px",
              borderRadius: 12, border: `2px solid ${C.hairline}`,
              background: "#FAF4ED", fontSize: 14, fontWeight: 600, color: C.ink,
              fontFamily: "inherit", outline: "none", transition: "border-color 0.18s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
          {FILTERS.map((f) => {
            const active = filter === f.key
            const catColor = f.key !== "all" ? CATEGORY[f.key as CategoryKey].color : C.primary
            const catSoft  = f.key !== "all" ? CATEGORY[f.key as CategoryKey].soft  : C.primarySft
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 12,
                  border: `2px solid ${active ? catColor : C.hairline}`,
                  background: active ? catSoft : "#FAF4ED",
                  color: active ? catColor : C.muted,
                  fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s ease",
                }}
              >
                {f.emoji} {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: C.card, borderRadius: 20,
        border: `1px solid ${C.hairline}`,
        boxShadow: "0 6px 18px -10px rgba(40,20,10,0.1)",
        overflow: "hidden",
      }}>
        {/* Header row */}
        <div style={{
          display: "grid", gridTemplateColumns: "52px 1fr 120px 130px 110px",
          padding: "12px 20px",
          borderBottom: `1px solid ${C.hairline}`,
          background: C.panelBg,
        }}>
          {["", "Title", "Category", "Date Added", "Actions"].map((h, i) => (
            <span key={i} style={{ fontSize: 11.5, fontWeight: 900, color: C.muted, letterSpacing: 0.6, textTransform: "uppercase" as const }}>
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔎</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>No resources found</div>
            <div style={{ fontSize: 13.5, color: C.muted, fontWeight: 600, marginTop: 4 }}>
              Try a different search or filter.
            </div>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const cat = CATEGORY[item.kind]
            return (
              <div
                key={item.id}
                style={{
                  display: "grid", gridTemplateColumns: "52px 1fr 120px 130px 110px",
                  padding: "14px 20px", alignItems: "center",
                  borderBottom: idx < filtered.length - 1 ? `1px solid ${C.hairline}` : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FDF8F1")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Thumbnail */}
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: item.thumbBg, display: "grid", placeItems: "center", fontSize: 22,
                  border: `1px solid ${C.hairline}`,
                }}>
                  {item.thumbEmoji}
                </div>

                {/* Title + desc */}
                <div style={{ paddingRight: 12 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink, lineHeight: 1.2 }}>
                    {item.title}
                    {item.status === "draft" && (
                      <span style={{
                        marginLeft: 8, padding: "2px 8px", borderRadius: 999,
                        background: "#FFE9C2", color: "#E89B1C",
                        fontSize: 10.5, fontWeight: 800, letterSpacing: 0.3, verticalAlign: "middle",
                      }}>DRAFT</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 12.5, color: C.muted, fontWeight: 600, marginTop: 2,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                    maxWidth: 280,
                  }}>
                    {item.desc}
                  </div>
                </div>

                {/* Category badge */}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "4px 10px", borderRadius: 999,
                  background: cat.soft, color: cat.color,
                  fontWeight: 700, fontSize: 12.5,
                  width: "fit-content",
                }}>
                  {cat.emoji} {cat.label}
                </span>

                {/* Date */}
                <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>{fmtDate(item.dateAdded)}</span>

                {/* Actions */}
                <div style={{ display: "flex", gap: 2 }}>
                  <RowBtn
                    icon={AdminIcons.Eye(15)}
                    color={C.accent} bg={C.accentSft}
                    title="Analytics"
                  />
                  <RowBtn
                    icon={AdminIcons.Pencil(15)}
                    color={C.primary} bg={C.primarySft}
                    title="Edit"
                    onClick={() => { setEditItem(item); setFormKind(item.kind) }}
                  />
                  <RowBtn
                    icon={AdminIcons.Trash(15)}
                    color="#E84B6B" bg="#FFD8E1"
                    title="Delete"
                    onClick={() => setDeleteId(item.id)}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: C.muted }}>
        {filtered.length} of {resources.length} resources
      </div>

      {/* Modals */}
      {showTypePicker && (
        <TypePickerModal onSelect={handleAddSelect} onClose={() => setShowTypePicker(false)} />
      )}
      {(formKind !== null) && (
        <ResourceForm
          kind={formKind}
          initial={editItem ?? undefined}
          onClose={() => { setFormKind(null); setEditItem(null) }}
          onSave={handleSave}
        />
      )}
      <Confirm
        open={!!deleteId}
        title="Delete resource?"
        message={toDelete ? `"${toDelete.title}" will be permanently removed.` : ""}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
