"use client"

import { useState } from "react"
import { AGE_OPTIONS, SERVICE_OPTIONS } from "@/lib/admin-data"
import { ALL_TAGS } from "@/lib/resources"
import { C, MultiDropdown, Check, X, Plus, Sparkles, Code2, Globe, FilePenLine, Video, Headphones, FileText, Gamepad2 } from "./shared"
import type { AdminResource } from "@/lib/admin-data"

// ─── Types ────────────────────────────────────────────────────────────────────

type Kind = "video" | "audio" | "doc" | "game"

interface FormState {
  title: string
  desc: string
  tags: string[]
  thumbEmoji: string
  thumbBg: string
  services: string[]
  ages: string[]
  goals: string[]
  tips: string
  kind: Kind
  // video
  videoFile: string
  videoUrl: string
  // audio
  audioFile: string
  transcript: string
  // doc
  docFile: string
  allowDownload: boolean
  // game
  gameTab: "ai" | "paste"
  aiPrompt: string
  pasteCode: string
  generatedHtml: string
}

const INITIAL: FormState = {
  title: "", desc: "", tags: [], thumbEmoji: "🎯", thumbBg: "#FFE3D2",
  services: [], ages: [], goals: [], tips: "",
  kind: "video", videoFile: "", videoUrl: "", audioFile: "", transcript: "",
  docFile: "", allowDownload: true, gameTab: "ai",
  aiPrompt: "", pasteCode: "", generatedHtml: "",
}

const THUMB_EMOJIS = ["🎯","🌟","🏆","🎵","📚","🎮","🦁","🚀","🌈","🌊","🎨","🦋","🐾","🌺","⭐"]
const THUMB_BGS    = ["#FFE3D2","#D4F1EA","#E8DFFF","#FFE9C2","#FFD8E1","#C8E6FF","#FFE6B8","#FFF3D6"]

const PROMPT_CHIPS = [
  "Phonics matching game",
  "Letter recognition quiz",
  "Word building activity",
  "Memory card match",
  "Drag & drop sorting",
  "Sound identification",
]

async function mockGenerateGame(prompt: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000))
  if (Math.random() < 0.05) throw new Error("Generation timed out. Please try again.")
  return `<!doctype html><html><head><meta charset="utf-8"/><style>
    html,body{margin:0;padding:0;min-height:100%;background:#FFE8EE;font-family:'Nunito',sans-serif;display:grid;place-items:center;}
    .card{padding:32px 48px;border-radius:24px;background:#E84B6B;color:#fff;font-size:36px;font-weight:900;cursor:pointer;user-select:none;box-shadow:0 12px 28px rgba(232,75,107,.4);transition:transform .15s;}
    .card:hover{transform:translateY(-3px);}
    .score{margin-top:18px;font-weight:700;color:#2A2F4A;font-size:18px;}
    .prompt{max-width:300px;text-align:center;font-size:14px;color:#6C6580;font-weight:600;margin-top:8px;}
  </style></head><body>
    <div style="text-align:center">
      <div id="card" class="card">Tap me! 🎮</div>
      <div class="score">Score: <span id="n">0</span></div>
      <div class="prompt">Prompt: ${prompt.slice(0, 60)}…</div>
    </div>
    <script>let n=0;document.getElementById('card').addEventListener('click',()=>{n++;document.getElementById('n').textContent=n;document.getElementById('card').textContent=n%2?'Again! ⭐':'Great! 🎉';});<\/script>
  </body></html>`
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
  const steps = ["Details", "Upload", "Preview & Publish"]
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {steps.map((label, i) => {
        const done    = i < step
        const active  = i === step
        const pending = i > step
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                display: "grid", placeItems: "center",
                background: done ? C.accent : active ? C.primary : C.hairline,
                color: done || active ? "#fff" : C.muted,
                fontWeight: 900, fontSize: 14,
                boxShadow: active ? `0 6px 16px ${C.primary}44` : "none",
              }}>
                {done ? <Check size={16} /> : i + 1}
              </div>
              <span style={{
                fontSize: 13.5, fontWeight: 800,
                color: done ? C.accent : active ? C.primary : C.muted,
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginLeft: 10, marginRight: 10,
                background: done ? C.accent : C.hairline,
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  const [goalInput, setGoalInput] = useState("")

  function addGoal() {
    const v = goalInput.trim()
    if (!v) return
    setForm((p) => ({ ...p, goals: [...p.goals, v] }))
    setGoalInput("")
  }

  function removeGoal(i: number) {
    setForm((p) => ({ ...p, goals: p.goals.filter((_, idx) => idx !== i) }))
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div>
        <label style={labelStyle}>Title *</label>
        <input
          value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Resource title"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
        />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
          placeholder="Brief description of this resource…"
          rows={3}
          style={{ ...inputStyle, resize: "vertical" as const }}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
        />
      </div>

      {/* Tags */}
      <div>
        <label style={labelStyle}>Tags</label>
        <MultiDropdown
          label="Select tags"
          options={ALL_TAGS}
          selected={form.tags}
          onChange={(tags) => setForm((p) => ({ ...p, tags }))}
        />
      </div>

      {/* Thumbnail */}
      <div>
        <label style={labelStyle}>Thumbnail</label>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {/* Preview */}
          <div style={{
            width: 80, height: 80, borderRadius: 16, flexShrink: 0,
            background: form.thumbBg, display: "grid", placeItems: "center", fontSize: 36,
            border: `2px solid ${C.hairline}`,
          }}>
            {form.thumbEmoji}
          </div>
          <div style={{ flex: 1 }}>
            {/* Emoji picker */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 10 }}>
              {THUMB_EMOJIS.map((e) => (
                <button
                  key={e} type="button"
                  onClick={() => setForm((p) => ({ ...p, thumbEmoji: e }))}
                  style={{
                    width: 36, height: 36, borderRadius: 10, border: `2px solid ${form.thumbEmoji === e ? C.primary : C.hairline}`,
                    background: form.thumbEmoji === e ? C.primarySft : "#FAF4ED",
                    fontSize: 20, cursor: "pointer",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
            {/* BG picker */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {THUMB_BGS.map((bg) => (
                <button
                  key={bg} type="button"
                  onClick={() => setForm((p) => ({ ...p, thumbBg: bg }))}
                  style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: bg, cursor: "pointer",
                    border: form.thumbBg === bg ? `3px solid ${C.primary}` : `2px solid ${C.hairline}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service + Age row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Services</label>
          <MultiDropdown
            label="Select services"
            options={SERVICE_OPTIONS}
            selected={form.services}
            onChange={(services) => setForm((p) => ({ ...p, services }))}
          />
        </div>
        <div>
          <label style={labelStyle}>Age Groups</label>
          <MultiDropdown
            label="Select age groups"
            options={AGE_OPTIONS}
            selected={form.ages}
            onChange={(ages) => setForm((p) => ({ ...p, ages }))}
          />
        </div>
      </div>

      {/* Learning Goals */}
      <div>
        <label style={labelStyle}>Learning Goals</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            value={goalInput} onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
            placeholder="Add a learning goal…"
            style={{ ...inputStyle, flex: 1 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
          />
          <button
            type="button" onClick={addGoal}
            style={{
              padding: "11px 16px", borderRadius: 12, border: "none",
              background: C.primary, color: "#fff",
              fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <Plus size={14} />
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
          {form.goals.map((g, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 10px 5px 12px", borderRadius: 999,
              background: C.accentSft, color: C.accent, fontWeight: 700, fontSize: 13,
            }}>
              {g}
              <button
                type="button"
                onClick={() => removeGoal(i)}
                style={{
                  width: 18, height: 18, borderRadius: "50%", border: "none",
                  background: C.accent, color: "#fff",
                  cursor: "pointer", display: "grid", placeItems: "center",
                  fontFamily: "inherit",
                }}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <label style={labelStyle}>Therapist Tips</label>
        <textarea
          value={form.tips} onChange={(e) => setForm((p) => ({ ...p, tips: e.target.value }))}
          placeholder="Optional tips for using this resource…"
          rows={2}
          style={{ ...inputStyle, resize: "vertical" as const }}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
        />
      </div>
    </div>
  )
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError]     = useState<string | null>(null)
  const [pasteValid, setPasteValid] = useState<boolean | null>(null)

  async function handleGenerate() {
    if (!form.aiPrompt.trim()) return
    setGenerating(true)
    setGenError(null)
    try {
      const html = await mockGenerateGame(form.aiPrompt)
      setForm((p) => ({ ...p, generatedHtml: html }))
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed.")
    } finally {
      setGenerating(false)
    }
  }

  function handlePasteChange(code: string) {
    setForm((p) => ({ ...p, pasteCode: code, generatedHtml: code }))
    if (!code.trim()) { setPasteValid(null); return }
    setPasteValid(code.includes("<html") || code.includes("<!doctype") || code.includes("<div"))
  }

  if (form.kind === "video") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>Video File</label>
          <div style={dropZoneStyle}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div>
            <div style={{ fontWeight: 800, color: C.ink, fontSize: 14 }}>Drop video file here</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>MP4, WebM or MOV · Max 500 MB</div>
            {form.videoFile && <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: C.accent }}>{form.videoFile}</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: C.hairline }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: C.muted }}>OR</span>
          <div style={{ flex: 1, height: 1, background: C.hairline }} />
        </div>
        <div>
          <label style={labelStyle}>Embed URL</label>
          <input
            value={form.videoUrl} onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
            placeholder="https://youtube.com/watch?v=…"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
          />
        </div>
      </div>
    )
  }

  if (form.kind === "audio") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>Audio File</label>
          <div style={dropZoneStyle}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎵</div>
            <div style={{ fontWeight: 800, color: C.ink, fontSize: 14 }}>Drop audio file here</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>MP3, WAV or AAC · Max 50 MB</div>
            {form.audioFile && (
              <>
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: C.accent }}>{form.audioFile}</div>
                {/* Waveform preview */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, marginTop: 12, height: 32 }}>
                  {Array.from({ length: 24 }, (_, i) => {
                    const h = 8 + Math.abs(Math.sin(i * 1.3) * 24)
                    return (
                      <div key={i} style={{
                        width: 4, height: h, borderRadius: 2,
                        background: C.accent, opacity: 0.7,
                      }} />
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Transcript</label>
          <textarea
            value={form.transcript}
            onChange={(e) => setForm((p) => ({ ...p, transcript: e.target.value }))}
            placeholder="Paste or type the audio transcript here…"
            rows={4}
            style={{ ...inputStyle, resize: "vertical" as const }}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
          />
        </div>
      </div>
    )
  }

  if (form.kind === "doc") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label style={labelStyle}>Document File</label>
          <div style={dropZoneStyle}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
            <div style={{ fontWeight: 800, color: C.ink, fontSize: 14 }}>Drop document here</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>PDF, DOCX or PPTX · Max 100 MB</div>
            {form.docFile && <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: C.accent }}>{form.docFile}</div>}
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", borderRadius: 14,
          border: `2px solid ${C.hairline}`, background: "#FAF4ED",
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Allow Download</div>
            <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, marginTop: 2 }}>
              Let learners download this document
            </div>
          </div>
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, allowDownload: !p.allowDownload }))}
            style={{
              width: 48, height: 26, borderRadius: 999, border: "none",
              background: form.allowDownload ? C.primary : "#D6C8B6",
              cursor: "pointer", position: "relative", transition: "background 0.2s",
              fontFamily: "inherit",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3,
              left: form.allowDownload ? 24 : 4,
              transition: "left 0.2s",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }} />
          </button>
        </div>
      </div>
    )
  }

  // game
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 0, background: C.panelBg, borderRadius: 12, padding: 4, width: "fit-content" }}>
        {(["ai", "paste"] as const).map((tab) => (
          <button
            key={tab} type="button"
            onClick={() => setForm((p) => ({ ...p, gameTab: tab }))}
            style={{
              padding: "8px 18px", borderRadius: 10, border: "none",
              background: form.gameTab === tab ? "#fff" : "transparent",
              color: form.gameTab === tab ? C.ink : C.muted,
              fontWeight: 800, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
              boxShadow: form.gameTab === tab ? "0 2px 8px rgba(40,20,10,0.1)" : "none",
            }}
          >
            {tab === "ai"
              ? <><Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />AI Prompt Builder</>
              : <><Code2 size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Paste Code</>
            }
          </button>
        ))}
      </div>

      {form.gameTab === "ai" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Suggestion chips */}
          <div>
            <label style={labelStyle}>Quick Suggestions</label>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip} type="button"
                  onClick={() => setForm((p) => ({ ...p, aiPrompt: chip }))}
                  style={{
                    padding: "6px 12px", borderRadius: 999,
                    border: `2px solid ${form.aiPrompt === chip ? C.primary : C.hairline}`,
                    background: form.aiPrompt === chip ? C.primarySft : "#FAF4ED",
                    color: form.aiPrompt === chip ? C.primary : C.muted,
                    fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt textarea */}
          <div>
            <label style={labelStyle}>Describe your game</label>
            <textarea
              value={form.aiPrompt}
              onChange={(e) => setForm((p) => ({ ...p, aiPrompt: e.target.value }))}
              placeholder="e.g. A matching game where children match animal sounds to pictures. Include 6 pairs…"
              rows={4}
              style={{ ...inputStyle, resize: "vertical" as const }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
            />
          </div>

          {genError && (
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: "#FFD8E1", color: "#B03050",
              fontWeight: 700, fontSize: 13.5,
            }}>
              {genError}
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !form.aiPrompt.trim()}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "13px 24px", borderRadius: 14, border: "none",
              background: generating ? C.hairline : C.primary, color: generating ? C.muted : "#fff",
              fontWeight: 800, fontSize: 14, cursor: generating ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: generating ? "none" : "0 8px 18px rgba(215,107,63,0.35)",
            }}
          >
            {generating ? (
              <>
                <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 0.6s linear infinite" }} />
                Building your game…
              </>
            ) : (
              <><Sparkles size={16} /> Generate Game</>
            )}
          </button>

          {form.generatedHtml && !generating && (
            <div>
              <label style={labelStyle}>Preview</label>
              <iframe
                srcDoc={form.generatedHtml}
                sandbox="allow-scripts allow-pointer-lock"
                referrerPolicy="no-referrer"
                style={{ width: "100%", height: 300, borderRadius: 14, border: `2px solid ${C.hairline}` }}
              />
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={labelStyle}>HTML Game Code</label>
              {pasteValid !== null && (
                <span style={{
                  fontSize: 12, fontWeight: 800,
                  color: pasteValid ? "#1A8A70" : "#B03050",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {pasteValid ? <Check size={13} /> : <X size={13} />}
                  {pasteValid ? "Valid HTML" : "Looks incomplete"}
                </span>
              )}
            </div>
            <textarea
              value={form.pasteCode}
              onChange={(e) => handlePasteChange(e.target.value)}
              placeholder="<!doctype html><html>…"
              rows={12}
              spellCheck={false}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                border: `2px solid ${pasteValid === false ? "#E84B6B" : C.hairline}`,
                background: "#1E1E2E", color: "#CDD6F4",
                fontFamily: "'Courier New', monospace",
                fontSize: 13, lineHeight: 1.6, outline: "none",
                resize: "vertical" as const,
              }}
            />
          </div>

          {form.pasteCode && pasteValid && (
            <div>
              <label style={labelStyle}>Live Preview</label>
              <iframe
                srcDoc={form.pasteCode}
                sandbox="allow-scripts allow-pointer-lock"
                referrerPolicy="no-referrer"
                style={{ width: "100%", height: 280, borderRadius: 14, border: `2px solid ${C.hairline}` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({
  form,
  kind,
  onPublish,
  onDraft,
}: {
  form: FormState
  kind: Kind
  onPublish: () => void
  onDraft: () => void
}) {
  const catColors: Record<Kind, { color: string; soft: string; Icon: React.ComponentType<{ size?: number }> }> = {
    video: { color: "#2DB89E", soft: "#D4F1EA", Icon: Video      },
    audio: { color: "#7A5BC9", soft: "#E8DFFF", Icon: Headphones },
    doc:   { color: "#E89B1C", soft: "#FFE9C2", Icon: FileText   },
    game:  { color: "#E84B6B", soft: "#FFD8E1", Icon: Gamepad2   },
  }
  const cat = catColors[kind]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Thumbnail preview */}
      <div style={{
        background: form.thumbBg, borderRadius: 20, height: 140,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72,
      }}>
        {form.thumbEmoji}
      </div>

      {/* Summary card */}
      <div style={{
        background: C.panelBg, borderRadius: 16, padding: "20px 22px",
        border: `1px solid ${C.hairline}`, display: "flex", flexDirection: "column", gap: 14,
      }}>
        <SummaryRow label="Title" value={form.title || "—"} />
        <SummaryRow label="Description" value={form.desc || "—"} />
        <SummaryRow label="Type" value={
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 10px", borderRadius: 999,
            background: cat.soft, color: cat.color, fontWeight: 700, fontSize: 12.5,
          }}>
            <cat.Icon size={11} /> {kind.charAt(0).toUpperCase() + kind.slice(1)}
          </span>
        } />
        {form.tags.length > 0 && (
          <SummaryRow label="Tags" value={form.tags.join(", ")} />
        )}
        {form.ages.length > 0 && (
          <SummaryRow label="Age Groups" value={form.ages.join(", ")} />
        )}
        {form.services.length > 0 && (
          <SummaryRow label="Services" value={form.services.join(", ")} />
        )}
        {form.goals.length > 0 && (
          <SummaryRow label="Learning Goals" value={form.goals.join(" · ")} />
        )}
        {form.tips && <SummaryRow label="Tips" value={form.tips} />}
      </div>

      {/* Publish buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button" onClick={onDraft}
          style={{
            flex: 1, padding: "14px", borderRadius: 14,
            border: `2px solid ${C.hairline}`, background: "#fff",
            color: C.muted, fontWeight: 800, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <FilePenLine size={16} /> Save as Draft
        </button>
        <button
          type="button" onClick={onPublish}
          style={{
            flex: 2, padding: "14px", borderRadius: 14, border: "none",
            background: C.primary, color: "#fff",
            fontWeight: 800, fontSize: 14, cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 8px 18px rgba(215,107,63,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <Globe size={16} /> Publish Resource
        </button>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span style={{ minWidth: 110, fontSize: 12.5, fontWeight: 800, color: C.muted, letterSpacing: 0.2, paddingTop: 2 }}>
        {label.toUpperCase()}
      </span>
      <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, flex: 1 }}>{value}</span>
    </div>
  )
}

// ─── ResourceForm ─────────────────────────────────────────────────────────────

interface ResourceFormProps {
  kind: Kind
  initial?: Partial<AdminResource>
  onClose: () => void
  onSave: (data: { status: "published" | "draft"; form: FormState }) => void
}

export default function ResourceForm({ kind, initial, onClose, onSave }: ResourceFormProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>({
    ...INITIAL,
    kind,
    title:       initial?.title ?? "",
    desc:        initial?.desc ?? "",
    tags:        initial?.tags ?? [],
    thumbEmoji:  initial?.thumbEmoji ?? "🎯",
    thumbBg:     initial?.thumbBg ?? "#FFE3D2",
    services:    initial?.service ? [initial.service] : [],
    ages:        initial?.age ? [initial.age] : [],
  })

  function canAdvance() {
    if (step === 0) return !!form.title.trim()
    return true
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 600,
      background: "rgba(42,47,74,0.5)", backdropFilter: "blur(5px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 28, padding: "36px 40px",
          width: "100%", maxWidth: 660, maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 32px 80px -16px rgba(40,20,10,0.3)",
          fontFamily: "var(--font-nunito)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: C.ink }}>
              {initial ? "Edit Resource" : "Add Resource"}
            </div>
            <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginTop: 2 }}>
              {kind.charAt(0).toUpperCase() + kind.slice(1)} · Step {step + 1} of 3
            </div>
          </div>
          <button
            type="button" onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: 10, border: "none",
              background: C.panelBg, color: C.muted,
              cursor: "pointer", display: "grid", placeItems: "center",
              fontFamily: "inherit",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <Stepper step={step} />

        {step === 0 && <Step1 form={form} setForm={setForm} />}
        {step === 1 && <Step2 form={form} setForm={setForm} />}
        {step === 2 && (
          <Step3
            form={form}
            kind={kind}
            onPublish={() => onSave({ status: "published", form })}
            onDraft={() => onSave({ status: "draft", form })}
          />
        )}

        {/* Bottom nav — not shown on step 3 (handled inside Step3) */}
        {step < 2 && (
          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            <button
              type="button"
              onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
              style={{
                flex: 1, padding: "13px", borderRadius: 12,
                border: `2px solid ${C.hairline}`, background: "#fff",
                color: C.muted, fontWeight: 800, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {step === 0 ? "Cancel" : "← Back"}
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              style={{
                flex: 2, padding: "13px", borderRadius: 12, border: "none",
                background: canAdvance() ? C.primary : C.hairline,
                color: canAdvance() ? "#fff" : C.muted,
                fontWeight: 800, fontSize: 14,
                cursor: canAdvance() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                boxShadow: canAdvance() ? "0 8px 18px rgba(215,107,63,0.35)" : "none",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Style helpers ─────────────────────────────────────────────────────────────

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

const dropZoneStyle: React.CSSProperties = {
  border: `2px dashed ${C.hairline}`, borderRadius: 16,
  padding: "32px 24px", textAlign: "center",
  background: "#FAF4ED", cursor: "pointer",
}
