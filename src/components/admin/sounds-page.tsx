"use client"

import { useState } from "react"
import { ADMIN_SOUNDS, fmtDate } from "@/lib/admin-data"
import type { AdminSound } from "@/lib/admin-data"
import { C, RowBtn, Confirm, AdminIcons } from "./shared"

// ─── SoundForm ────────────────────────────────────────────────────────────────

function SoundForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: AdminSound
  onSave: (title: string, desc: string) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [desc, setDesc]   = useState(initial?.desc ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSave(title.trim(), desc.trim())
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(42,47,74,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 24, padding: "32px 36px",
          width: 480, boxShadow: "0 24px 60px -12px rgba(40,20,10,0.25)",
          fontFamily: "var(--font-nunito)",
        }}
      >
        <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 900, color: C.ink }}>
          {initial ? "Edit Sound" : "Add Sound"}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              autoFocus
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. /b/ — Bilabial Stop"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
            />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief description of this sound…"
              rows={3}
              style={{ ...inputStyle, resize: "vertical" as const }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              type="button" onClick={onCancel}
              style={{
                flex: 1, padding: "12px", borderRadius: 12,
                border: `2px solid ${C.hairline}`, background: "#fff",
                color: C.muted, fontWeight: 800, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2, padding: "12px", borderRadius: 12, border: "none",
                background: C.primary, color: "#fff",
                fontWeight: 800, fontSize: 14, cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 8px 18px rgba(215,107,63,0.35)",
                opacity: title.trim() ? 1 : 0.6,
              }}
            >
              {initial ? "Save Changes" : "Add Sound"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── SoundsPage ───────────────────────────────────────────────────────────────

export default function SoundsPage() {
  const [sounds, setSounds]     = useState<AdminSound[]>(ADMIN_SOUNDS)
  const [search, setSearch]     = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editSound, setEditSound] = useState<AdminSound | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = sounds.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase())
  )

  function handleAdd(title: string, desc: string) {
    const id = `s${Date.now()}`
    const dateAdded = new Date().toISOString().split("T")[0]
    setSounds((prev) => [...prev, { id, title, desc, dateAdded }])
    setShowForm(false)
  }

  function handleEdit(title: string, desc: string) {
    if (!editSound) return
    setSounds((prev) =>
      prev.map((s) => (s.id === editSound.id ? { ...s, title, desc } : s))
    )
    setEditSound(null)
  }

  function handleDelete(id: string) {
    setSounds((prev) => prev.filter((s) => s.id !== id))
    setDeleteId(null)
  }

  const soundToDelete = sounds.find((s) => s.id === deleteId)

  return (
    <div style={{ fontFamily: "var(--font-nunito)", padding: "32px 36px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, color: C.ink }}>Sounds</h1>
          <p style={{ margin: 0, color: C.muted, fontWeight: 600, fontSize: 14.5 }}>
            Manage articulation sounds for speech therapy sessions.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 20px", borderRadius: 14, border: "none",
            background: C.primary, color: "#fff",
            fontWeight: 800, fontSize: 14, cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 8px 18px rgba(215,107,63,0.35)",
          }}
        >
          {AdminIcons.Plus(16)} Add Sound
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 380, marginBottom: 20 }}>
        <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: C.muted, pointerEvents: "none" }}>
          {AdminIcons.Search(16)}
        </span>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sounds…"
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

      {/* Table */}
      <div style={{
        background: C.card, borderRadius: 20,
        border: `1px solid ${C.hairline}`,
        boxShadow: "0 6px 18px -10px rgba(40,20,10,0.1)",
        overflow: "hidden",
      }}>
        {/* Table Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "48px 1fr 2fr 130px 90px",
          padding: "12px 20px",
          borderBottom: `1px solid ${C.hairline}`,
          background: C.panelBg,
        }}>
          {["", "Sound", "Description", "Date Added", "Actions"].map((h, i) => (
            <span key={i} style={{ fontSize: 11.5, fontWeight: 900, color: C.muted, letterSpacing: 0.6, textTransform: "uppercase" as const }}>
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center", color: C.muted, fontWeight: 700, fontSize: 14 }}>
            No sounds match your search.
          </div>
        ) : (
          filtered.map((sound, idx) => {
            const abbr = sound.title.match(/\/(.+?)\//)?.[1] ?? sound.title.slice(0, 2).toUpperCase()
            const colors = ["#2DB89E", "#7A5BC9", "#E89B1C", "#E84B6B", "#D76B3F"]
            const bg = colors[idx % colors.length]
            return (
              <div
                key={sound.id}
                style={{
                  display: "grid", gridTemplateColumns: "48px 1fr 2fr 130px 90px",
                  padding: "14px 20px", alignItems: "center",
                  borderBottom: idx < filtered.length - 1 ? `1px solid ${C.hairline}` : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FDF8F1")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Abbr circle */}
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: bg, color: "#fff",
                  display: "grid", placeItems: "center",
                  fontSize: 13, fontWeight: 900,
                }}>
                  {abbr}
                </div>

                {/* Title */}
                <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{sound.title}</span>

                {/* Description */}
                <span style={{
                  fontSize: 13.5, fontWeight: 600, color: C.muted,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                  paddingRight: 16,
                }}>
                  {sound.desc}
                </span>

                {/* Date */}
                <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>{fmtDate(sound.dateAdded)}</span>

                {/* Actions */}
                <div style={{ display: "flex", gap: 4 }}>
                  <RowBtn
                    icon={AdminIcons.Pencil(15)}
                    color={C.primary} bg={C.primarySft}
                    title="Edit"
                    onClick={() => setEditSound(sound)}
                  />
                  <RowBtn
                    icon={AdminIcons.Trash(15)}
                    color="#E84B6B" bg="#FFD8E1"
                    title="Delete"
                    onClick={() => setDeleteId(sound.id)}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: C.muted }}>
        {filtered.length} of {sounds.length} sounds
      </div>

      {/* Modals */}
      {showForm && (
        <SoundForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
      )}
      {editSound && (
        <SoundForm initial={editSound} onSave={handleEdit} onCancel={() => setEditSound(null)} />
      )}
      <Confirm
        open={!!deleteId}
        title="Delete sound?"
        message={soundToDelete ? `"${soundToDelete.title}" will be permanently removed.` : ""}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12.5, fontWeight: 800, color: C.ink,
  marginBottom: 6, letterSpacing: 0.2,
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 12,
  border: `2px solid ${C.hairline}`, background: "#FAF4ED",
  fontSize: 14, fontWeight: 600, color: C.ink,
  fontFamily: "inherit", outline: "none", transition: "border-color 0.18s",
}
