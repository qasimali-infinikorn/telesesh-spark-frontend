"use client"

import { useState, useRef, useEffect } from "react"

// ─── Design tokens ────────────────────────────────────────────────────────────
export const C = {
  primary:    "#D76B3F",
  primarySft: "#FFE3D2",
  accent:     "#2DB89E",
  accentSft:  "#D4F1EA",
  ink:        "#2A2F4A",
  muted:      "#6C6580",
  hairline:   "#F0E4D6",
  panelBg:    "#FBF5EC",
  pageBg:     "#FCEDDB",
  card:       "#FFFFFF",
} as const

// ─── AdminIcons ───────────────────────────────────────────────────────────────

const ico = (d: string, size = 18, stroke = "currentColor", fill = "none") => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export const AdminIcons = {
  Folder:   (s=18) => ico("M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z", s),
  Wave:     (s=18) => ico("M22 12h-4l-3 9L9 3l-3 9H2", s),
  Plus:     (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Eye:      (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Pencil:   (s=18) => ico("M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z", s),
  Trash:    (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Check:    (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Close:    (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Back:     (s=18) => ico("M19 12H5M12 19l-7-7 7-7", s),
  Upload:   (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Search:   (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Sparkle:  (s=18) => ico("M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", s),
  Video:    (s=18) => ico("M15 10l4.553-2.276A1 1 0 0 1 21 8.723v6.554a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z", s),
  Audio:    (s=18) => ico("M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", s),
  Doc:      (s=18) => ico("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8", s),
  Game:     (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4"/><circle cx="16" cy="12" r="1"/><circle cx="18" cy="10" r="1"/></svg>,
  Chevron:  (s=18) => ico("m6 9 6 6 6-6", s),
  Dash:     (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Trend:    (s=18) => ico("M22 7l-8.5 8.5-5-5L2 17M22 7h-6M22 7v6", s),
  StarF:    (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Users:    (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Clock:    (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Gear:     (s=18) => ico("M12 2a10 10 0 0 1 0 20A10 10 0 0 1 12 2zm0 3a7 7 0 0 0 0 14A7 7 0 0 0 12 5zm0 3a4 4 0 0 1 0 8 4 4 0 0 1 0-8z", s),
  User:     (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Tag:      (s=18) => ico("M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01", s),
  Cal:      (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Mail:     (s=18) => ico("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", s),
  Lock:     (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Settings: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode
  iconBg: string
  value: string
  label: string
  delta: string
  deltaPositive?: boolean
}

export function StatCard({ icon, iconBg, value, label, delta, deltaPositive = true }: StatCardProps) {
  return (
    <div style={{
      background: C.card, borderRadius: 20, padding: "22px 24px",
      border: `1px solid ${C.hairline}`,
      boxShadow: "0 6px 18px -10px rgba(40,20,10,0.1)",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: iconBg, display: "grid", placeItems: "center",
        }}>
          {icon}
        </div>
        <span style={{
          padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800,
          background: deltaPositive ? "#D4F1EA" : "#FFD8E1",
          color: deltaPositive ? "#1A8A70" : "#B03050",
        }}>
          {delta}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, color: C.ink, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.muted, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

interface PanelProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Panel({ title, subtitle, icon, children, style }: PanelProps) {
  return (
    <div style={{
      background: C.card, borderRadius: 20, padding: "22px 24px",
      border: `1px solid ${C.hairline}`,
      boxShadow: "0 6px 18px -10px rgba(40,20,10,0.1)",
      ...style,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        {icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: C.primarySft, color: C.primary,
            display: "grid", placeItems: "center",
          }}>
            {icon}
          </div>
        )}
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.ink }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, marginTop: 1 }}>{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  )
}

// ─── RowBtn ───────────────────────────────────────────────────────────────────

interface RowBtnProps {
  icon: React.ReactNode
  color?: string
  bg?: string
  title?: string
  onClick?: () => void
}

export function RowBtn({ icon, color = C.muted, bg = C.panelBg, title, onClick }: RowBtnProps) {
  const [hover, setHover] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 34, height: 34, borderRadius: 10, border: "none",
        background: hover ? bg : "transparent",
        color: hover ? color : C.muted,
        cursor: "pointer", display: "grid", placeItems: "center",
        transition: "all 0.15s ease", fontFamily: "inherit",
      }}
    >
      {icon}
    </button>
  )
}

// ─── Confirm ──────────────────────────────────────────────────────────────────

interface ConfirmProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function Confirm({ open, title, message, onConfirm, onCancel, danger = true }: ConfirmProps) {
  if (!open) return null
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(42,47,74,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 24, padding: "32px 36px",
          width: 380, boxShadow: "0 24px 60px -12px rgba(40,20,10,0.25)",
          fontFamily: "var(--font-nunito)",
          animation: "fadeIn 0.2s ease both",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 900, color: C.ink, marginBottom: 8 }}>{title}</div>
        <p style={{ fontSize: 14, color: C.muted, fontWeight: 600, marginTop: 0, marginBottom: 28 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
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
            onClick={onConfirm}
            style={{
              flex: 1, padding: "12px", borderRadius: 12, border: "none",
              background: danger ? "#E84B6B" : C.primary,
              color: "#fff", fontWeight: 800, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: danger ? "0 8px 18px rgba(232,75,107,0.35)" : "0 8px 18px rgba(215,107,63,0.35)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MultiDropdown ────────────────────────────────────────────────────────────

interface MultiDropdownProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (vals: string[]) => void
  placeholder?: string
}

export function MultiDropdown({ label, options, selected, onChange, placeholder }: MultiDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v])
  }

  const count = selected.length

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "11px 14px", borderRadius: 12,
          border: `2px solid ${count > 0 ? C.primary : C.hairline}`,
          background: count > 0 ? C.primarySft : "#FAF4ED",
          color: count > 0 ? C.primary : C.muted,
          fontWeight: 700, fontSize: 13.5,
          cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.18s ease",
        }}
      >
        <span>
          {count > 0 ? `${label} (${count})` : (placeholder ?? label)}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 200,
          background: "#fff", borderRadius: 14, border: `1px solid ${C.hairline}`,
          boxShadow: "0 12px 32px -8px rgba(40,20,10,0.15)",
          overflow: "hidden", maxHeight: 220, overflowY: "auto",
        }}>
          {options.map((opt) => {
            const active = selected.includes(opt)
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px",
                  background: active ? "#FFF5EF" : "transparent",
                  border: "none", borderBottom: `1px solid ${C.hairline}`,
                  color: active ? C.primary : C.ink,
                  fontWeight: active ? 800 : 600, fontSize: 13.5,
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${active ? C.primary : "#D6C8B6"}`,
                  background: active ? C.primary : "#fff",
                  display: "grid", placeItems: "center",
                }}>
                  {active && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
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
