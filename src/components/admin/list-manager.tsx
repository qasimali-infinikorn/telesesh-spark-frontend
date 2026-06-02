"use client"

import { useState } from "react"
import { C, RowBtn, Confirm, AdminIcons } from "./shared"

interface ListManagerProps {
  title: string
  subtitle?: string
  initialItems: string[]
  icon?: React.ReactNode
  placeholder?: string
}

export default function ListManager({
  title,
  subtitle,
  initialItems,
  icon,
  placeholder = "Add new item…",
}: ListManagerProps) {
  const [items, setItems]         = useState<string[]>(initialItems)
  const [input, setInput]         = useState("")
  const [editIdx, setEditIdx]     = useState<number | null>(null)
  const [editVal, setEditVal]     = useState("")
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null)

  function handleAdd() {
    const v = input.trim()
    if (!v || items.includes(v)) return
    setItems((prev) => [...prev, v])
    setInput("")
  }

  function handleEditSave(idx: number) {
    const v = editVal.trim()
    if (!v) { setEditIdx(null); return }
    setItems((prev) => prev.map((item, i) => (i === idx ? v : item)))
    setEditIdx(null)
  }

  function handleDelete(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
    setDeleteIdx(null)
  }

  return (
    <div style={{ fontFamily: "var(--font-nunito)", padding: "32px 36px", maxWidth: 760 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        {icon && (
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: C.primarySft, color: C.primary,
            display: "grid", placeItems: "center",
          }}>
            {icon}
          </div>
        )}
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: C.ink }}>{title}</h1>
      </div>
      {subtitle && (
        <p style={{ margin: "0 0 28px", color: C.muted, fontWeight: 600, fontSize: 14.5 }}>{subtitle}</p>
      )}
      {!subtitle && <div style={{ marginBottom: 28 }} />}

      {/* Add Row */}
      <div style={{
        background: C.card, borderRadius: 20, padding: "20px 24px",
        border: `1px solid ${C.hairline}`,
        boxShadow: "0 6px 18px -10px rgba(40,20,10,0.1)",
        marginBottom: 16,
      }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={placeholder}
            style={{
              flex: 1, padding: "11px 14px", borderRadius: 12,
              border: `2px solid ${C.hairline}`, background: "#FAF4ED",
              fontSize: 14, fontWeight: 600, color: C.ink,
              fontFamily: "inherit", outline: "none", transition: "border-color 0.18s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: "11px 22px", borderRadius: 12, border: "none",
              background: C.primary, color: "#fff",
              fontWeight: 800, fontSize: 14, cursor: "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 8px 18px rgba(215,107,63,0.3)",
              opacity: input.trim() ? 1 : 0.6,
            }}
          >
            {AdminIcons.Plus(16)} Add
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{
        background: C.card, borderRadius: 20,
        border: `1px solid ${C.hairline}`,
        boxShadow: "0 6px 18px -10px rgba(40,20,10,0.1)",
        overflow: "hidden",
      }}>
        {items.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center", color: C.muted, fontWeight: 700, fontSize: 14 }}>
            No items yet. Add one above!
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex", alignItems: "center",
                padding: "14px 20px",
                borderBottom: idx < items.length - 1 ? `1px solid ${C.hairline}` : "none",
                gap: 12,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FDF8F1")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: C.primary, flexShrink: 0,
              }} />

              {editIdx === idx ? (
                <input
                  autoFocus
                  value={editVal}
                  onChange={(e) => setEditVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditSave(idx)
                    if (e.key === "Escape") setEditIdx(null)
                  }}
                  style={{
                    flex: 1, padding: "7px 12px", borderRadius: 10,
                    border: `2px solid ${C.primary}`, background: C.primarySft,
                    fontSize: 14, fontWeight: 600, color: C.ink,
                    fontFamily: "inherit", outline: "none",
                  }}
                />
              ) : (
                <span style={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: C.ink }}>{item}</span>
              )}

              <div style={{ display: "flex", gap: 4 }}>
                {editIdx === idx ? (
                  <>
                    <RowBtn
                      icon={AdminIcons.Check(15)}
                      color="#1A8A70"
                      bg="#D4F1EA"
                      title="Save"
                      onClick={() => handleEditSave(idx)}
                    />
                    <RowBtn
                      icon={AdminIcons.Close(15)}
                      color={C.muted}
                      title="Cancel"
                      onClick={() => setEditIdx(null)}
                    />
                  </>
                ) : (
                  <>
                    <RowBtn
                      icon={AdminIcons.Pencil(15)}
                      color={C.primary}
                      bg={C.primarySft}
                      title="Edit"
                      onClick={() => { setEditIdx(idx); setEditVal(item) }}
                    />
                    <RowBtn
                      icon={AdminIcons.Trash(15)}
                      color="#E84B6B"
                      bg="#FFD8E1"
                      title="Delete"
                      onClick={() => setDeleteIdx(idx)}
                    />
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: C.muted }}>
        {items.length} {items.length === 1 ? "item" : "items"}
      </div>

      <Confirm
        open={deleteIdx !== null}
        title="Delete item?"
        message={deleteIdx !== null ? `"${items[deleteIdx]}" will be permanently removed.` : ""}
        onConfirm={() => deleteIdx !== null && handleDelete(deleteIdx)}
        onCancel={() => setDeleteIdx(null)}
      />
    </div>
  )
}
