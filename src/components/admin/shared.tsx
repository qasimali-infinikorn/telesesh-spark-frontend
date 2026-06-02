"use client"

import { useState, useRef, useEffect } from "react"
import {
  FolderOpen, Mic, Plus, Eye, Pencil, Trash2, Check, X, ChevronLeft,
  Upload, Search, Sparkles, Video, Headphones, FileText, Gamepad2,
  ChevronDown, LayoutDashboard, TrendingUp, Star, Users, Clock,
  Settings, User2, Tag, Calendar, Mail, Lock, RefreshCw, Code2,
  ArrowRight, Save, FileCheck, Globe, FilePenLine, AlertTriangle,
} from "lucide-react"

export {
  FolderOpen, Mic, Plus, Eye, Pencil, Trash2, Check, X, ChevronLeft,
  Upload, Search, Sparkles, Video, Headphones, FileText, Gamepad2,
  ChevronDown, LayoutDashboard, TrendingUp, Star, Users, Clock,
  Settings, User2, Tag, Calendar, Mail, Lock, RefreshCw, Code2,
  ArrowRight, Save, FileCheck, Globe, FilePenLine, AlertTriangle,
}

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
