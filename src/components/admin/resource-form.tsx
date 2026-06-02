"use client"

import { useState } from "react"
import { AGE_OPTIONS, SERVICE_OPTIONS } from "@/lib/admin-data"
import { ALL_TAGS } from "@/lib/resources"
import {
  C, MultiDropdown, Check, X, Plus, Sparkles, Code2, Globe,
  FilePenLine, Video, Headphones, FileText, Gamepad2,
} from "./shared"
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
  videoFile: string
  videoUrl: string
  audioFile: string
  transcript: string
  docFile: string
  allowDownload: boolean
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

function Stepper({ step, kindColor }: { step: number; kindColor: string }) {
  const steps = ["Details", "Upload", "Preview & Publish"]
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
      {steps.map((label, i) => {
        const done    = i < step
        const active  = i === step
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              {/* Circle */}
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                display: "grid", placeItems: "center",
                background: done
                  ? `linear-gradient(135deg,${kindColor},${kindColor}CC)`
                  : active
                    ? C.primary
                    : "#EDE6DC",
                color: done || active ? "#fff" : C.muted,
                fontWeight: 900, fontSize: 14,
                boxShadow: active ? `0 6px 18px ${C.primary}55` : done ? `0 4px 12px ${kindColor}44` : "none",
                transition: "all 0.3s ease",
              }}>
                {done ? <Check size={15} strokeWidth={3} /> : <span>{i + 1}</span>}
              </div>
              {/* Label */}
              <span style={{
                fontSize: 13, fontWeight: 800,
                color: done ? kindColor : active ? C.primary : C.muted,
                whiteSpace: "nowrap" as const,
                transition: "color 0.3s ease",
              }}>
                {label}
              </span>
            </div>
            {/* Connector */}
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 3, margin: "0 14px",
                borderRadius: 3,
                background: done ? kindColor : C.hairline,
                transition: "background 0.4s ease",
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 900, color: C.muted,
      letterSpacing: 1.2, textTransform: "uppercase" as const,
      marginBottom: 14, paddingBottom: 10,
      borderBottom: `1px solid ${C.hairline}`,
    }}>
      {children}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* — Basic info — */}
      <section>
        <SectionHeading>Basic Information</SectionHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Title <span style={{ color: C.primary }}>*</span></label>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Give this resource a clear, descriptive title"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
            />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.desc}
              onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
              placeholder="Briefly describe what this resource covers and who it's for…"
              rows={3}
              style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
            />
          </div>
        </div>
      </section>

      {/* — Thumbnail — */}
      <section>
        <SectionHeading>Thumbnail</SectionHeading>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* Large preview */}
          <div style={{
            width: 96, height: 96, borderRadius: 20, flexShrink: 0,
            background: form.thumbBg, display: "grid", placeItems: "center", fontSize: 44,
            border: `2px solid ${C.hairline}`,
            boxShadow: "0 4px 16px rgba(40,20,10,0.08)",
          }}>
            {form.thumbEmoji}
          </div>

          <div style={{ flex: 1 }}>
            {/* Emoji row */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, letterSpacing: 0.8, marginBottom: 8 }}>ICON</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 7 }}>
                {THUMB_EMOJIS.map((e) => (
                  <button
                    key={e} type="button"
                    onClick={() => setForm((p) => ({ ...p, thumbEmoji: e }))}
                    style={{
                      width: 38, height: 38, borderRadius: 10,
                      border: `2px solid ${form.thumbEmoji === e ? C.primary : C.hairline}`,
                      background: form.thumbEmoji === e ? C.primarySft : "#FAF4ED",
                      fontSize: 20, cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "grid", placeItems: "center",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Color row */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.muted, letterSpacing: 0.8, marginBottom: 8, marginTop: 12 }}>BACKGROUND</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                {THUMB_BGS.map((bg) => (
                  <button
                    key={bg} type="button"
                    onClick={() => setForm((p) => ({ ...p, thumbBg: bg }))}
                    style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: bg, cursor: "pointer",
                      border: form.thumbBg === bg
                        ? `3px solid ${C.primary}`
                        : `2px solid ${C.hairline}`,
                      boxShadow: form.thumbBg === bg ? `0 0 0 3px ${C.primarySft}` : "none",
                      transition: "all 0.15s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* — Categorization — */}
      <section>
        <SectionHeading>Categorization</SectionHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Tags</label>
            <MultiDropdown
              label="Select tags"
              options={ALL_TAGS}
              selected={form.tags}
              onChange={(tags) => setForm((p) => ({ ...p, tags }))}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
        </div>
      </section>

      {/* — Learning Goals — */}
      <section>
        <SectionHeading>Learning Goals</SectionHeading>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
            placeholder="Type a learning goal and press Enter…"
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
              flexShrink: 0,
            }}
          >
            <Plus size={15} />
          </button>
        </div>
        {form.goals.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
            {form.goals.map((g, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 10px 6px 13px", borderRadius: 999,
                background: C.accentSft, color: C.accent, fontWeight: 700, fontSize: 13,
              }}>
                {g}
                <button
                  type="button" onClick={() => removeGoal(i)}
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
        )}
      </section>

      {/* — Tips — */}
      <section>
        <SectionHeading>Therapist Tips <span style={{ fontWeight: 600, letterSpacing: 0 }}>(optional)</span></SectionHeading>
        <textarea
          value={form.tips}
          onChange={(e) => setForm((p) => ({ ...p, tips: e.target.value }))}
          placeholder="Add guidance notes for therapists using this resource…"
          rows={2}
          style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
        />
      </section>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <section>
          <SectionHeading>Video File</SectionHeading>
          <label
            style={{
              ...dropZoneStyle,
              cursor: "pointer",
              display: "block",
            }}
          >
            <input type="file" accept="video/*" style={{ display: "none" }} />
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎬</div>
            <div style={{ fontWeight: 800, color: C.ink, fontSize: 14.5 }}>Drop video here or click to browse</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>MP4, WebM or MOV · Max 500 MB</div>
            {form.videoFile && (
              <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: C.accent }}>
                ✓ {form.videoFile}
              </div>
            )}
          </label>
        </section>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1, height: 1, background: C.hairline }} />
          <span style={{
            padding: "4px 14px", borderRadius: 999,
            background: C.panelBg, fontSize: 12, fontWeight: 800, color: C.muted,
          }}>OR</span>
          <div style={{ flex: 1, height: 1, background: C.hairline }} />
        </div>

        <section>
          <SectionHeading>Embed URL</SectionHeading>
          <input
            value={form.videoUrl}
            onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
            placeholder="https://youtube.com/watch?v=…"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
          />
          <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, marginTop: 6 }}>
            Supports YouTube, Vimeo and direct video links.
          </div>
        </section>
      </div>
    )
  }

  if (form.kind === "audio") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <section>
          <SectionHeading>Audio File</SectionHeading>
          <label style={{ ...dropZoneStyle, cursor: "pointer", display: "block" }}>
            <input type="file" accept="audio/*" style={{ display: "none" }} />
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎵</div>
            <div style={{ fontWeight: 800, color: C.ink, fontSize: 14.5 }}>Drop audio here or click to browse</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>MP3, WAV or AAC · Max 50 MB</div>
            {form.audioFile && (
              <>
                <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: C.accent }}>✓ {form.audioFile}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, marginTop: 14, height: 32, justifyContent: "center" }}>
                  {Array.from({ length: 28 }, (_, i) => {
                    const h = 8 + Math.abs(Math.sin(i * 1.3) * 24)
                    return (
                      <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: C.accent, opacity: 0.7 }} />
                    )
                  })}
                </div>
              </>
            )}
          </label>
        </section>
        <section>
          <SectionHeading>Transcript <span style={{ fontWeight: 600, letterSpacing: 0 }}>(optional)</span></SectionHeading>
          <textarea
            value={form.transcript}
            onChange={(e) => setForm((p) => ({ ...p, transcript: e.target.value }))}
            placeholder="Paste or type the audio transcript here — helps with accessibility…"
            rows={5}
            style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
          />
        </section>
      </div>
    )
  }

  if (form.kind === "doc") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <section>
          <SectionHeading>Document File</SectionHeading>
          <label style={{ ...dropZoneStyle, cursor: "pointer", display: "block" }}>
            <input type="file" accept=".pdf,.docx,.pptx" style={{ display: "none" }} />
            <div style={{ fontSize: 36, marginBottom: 10 }}>📄</div>
            <div style={{ fontWeight: 800, color: C.ink, fontSize: 14.5 }}>Drop document here or click to browse</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>PDF, DOCX or PPTX · Max 100 MB</div>
            {form.docFile && (
              <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: C.accent }}>✓ {form.docFile}</div>
            )}
          </label>
        </section>

        <section>
          <SectionHeading>Download Settings</SectionHeading>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px", borderRadius: 16,
            border: `2px solid ${form.allowDownload ? C.accent : C.hairline}`,
            background: form.allowDownload ? C.accentSft : "#FAF4ED",
            transition: "all 0.2s ease",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Allow Download</div>
              <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, marginTop: 3 }}>
                Learners can download this document to their device
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, allowDownload: !p.allowDownload }))}
              style={{
                width: 52, height: 28, borderRadius: 999, border: "none",
                background: form.allowDownload ? C.accent : "#D6C8B6",
                cursor: "pointer", position: "relative", transition: "background 0.25s",
                fontFamily: "inherit", flexShrink: 0,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 3,
                left: form.allowDownload ? 27 : 3,
                transition: "left 0.25s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
              }} />
            </button>
          </div>
        </section>
      </div>
    )
  }

  // ── Game ──
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Tab switcher */}
      <div style={{
        display: "flex", gap: 4,
        background: C.panelBg, borderRadius: 14, padding: 5,
        border: `1px solid ${C.hairline}`,
      }}>
        {(["ai", "paste"] as const).map((tab) => (
          <button
            key={tab} type="button"
            onClick={() => setForm((p) => ({ ...p, gameTab: tab }))}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 10, border: "none",
              background: form.gameTab === tab ? "#fff" : "transparent",
              color: form.gameTab === tab ? C.ink : C.muted,
              fontWeight: 800, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
              boxShadow: form.gameTab === tab ? "0 2px 10px rgba(40,20,10,0.1)" : "none",
              transition: "all 0.18s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}
          >
            {tab === "ai"
              ? <><Sparkles size={14} /> AI Prompt Builder</>
              : <><Code2 size={14} /> Paste HTML Code</>
            }
          </button>
        ))}
      </div>

      {form.gameTab === "ai" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section>
            <SectionHeading>Quick Suggestions</SectionHeading>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip} type="button"
                  onClick={() => setForm((p) => ({ ...p, aiPrompt: chip }))}
                  style={{
                    padding: "7px 14px", borderRadius: 999,
                    border: `2px solid ${form.aiPrompt === chip ? C.primary : C.hairline}`,
                    background: form.aiPrompt === chip ? C.primarySft : "#FAF4ED",
                    color: form.aiPrompt === chip ? C.primary : C.muted,
                    fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s ease",
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading>Describe Your Game</SectionHeading>
            <textarea
              value={form.aiPrompt}
              onChange={(e) => setForm((p) => ({ ...p, aiPrompt: e.target.value }))}
              placeholder="e.g. A matching game where children match animal sounds to pictures. Include 6 pairs and a score counter…"
              rows={4}
              style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.primary)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.hairline)}
            />
          </section>

          {genError && (
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: "#FFD8E1", color: "#B03050",
              fontWeight: 700, fontSize: 13.5,
            }}>
              {genError}
            </div>
          )}

          <button
            type="button" onClick={handleGenerate}
            disabled={generating || !form.aiPrompt.trim()}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px 24px", borderRadius: 14, border: "none",
              background: generating ? C.hairline : C.primary,
              color: generating ? C.muted : "#fff",
              fontWeight: 800, fontSize: 14,
              cursor: generating || !form.aiPrompt.trim() ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: generating ? "none" : "0 8px 18px rgba(215,107,63,0.35)",
              opacity: !generating && !form.aiPrompt.trim() ? 0.6 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {generating ? (
              <>
                <span style={{
                  display: "inline-block", width: 16, height: 16,
                  border: "2.5px solid currentColor", borderTopColor: "transparent",
                  borderRadius: "50%", animation: "spinLoader 0.6s linear infinite",
                }} />
                Building your game…
              </>
            ) : (
              <><Sparkles size={16} /> Generate Game</>
            )}
          </button>

          {form.generatedHtml && !generating && (
            <section>
              <SectionHeading>Preview</SectionHeading>
              <iframe
                srcDoc={form.generatedHtml}
                sandbox="allow-scripts allow-pointer-lock"
                referrerPolicy="no-referrer"
                style={{
                  width: "100%", height: 300, borderRadius: 16,
                  border: `2px solid ${C.hairline}`,
                }}
              />
            </section>
          )}

          <style>{`
            @keyframes spinLoader { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <SectionHeading>HTML Game Code</SectionHeading>
              {pasteValid !== null && (
                <span style={{
                  fontSize: 12, fontWeight: 800,
                  color: pasteValid ? "#1A8A70" : "#B03050",
                  display: "flex", alignItems: "center", gap: 4,
                  marginTop: -4,
                }}>
                  {pasteValid ? <Check size={13} /> : <X size={13} />}
                  {pasteValid ? "Valid HTML" : "Looks incomplete"}
                </span>
              )}
            </div>
            <textarea
              value={form.pasteCode}
              onChange={(e) => handlePasteChange(e.target.value)}
              placeholder={'<!doctype html>\n<html>\n  <head><meta charset="utf-8"/></head>\n  <body>…</body>\n</html>'}
              rows={12}
              spellCheck={false}
              style={{
                width: "100%", padding: "16px", borderRadius: 14,
                border: `2px solid ${pasteValid === false ? "#E84B6B" : C.hairline}`,
                background: "#1A1B2E", color: "#CDD6F4",
                fontFamily: "'Courier New', monospace",
                fontSize: 13, lineHeight: 1.65, outline: "none",
                resize: "vertical" as const,
                transition: "border-color 0.18s",
              }}
            />
          </section>

          {form.pasteCode && pasteValid && (
            <section>
              <SectionHeading>Live Preview</SectionHeading>
              <iframe
                srcDoc={form.pasteCode}
                sandbox="allow-scripts allow-pointer-lock"
                referrerPolicy="no-referrer"
                style={{
                  width: "100%", height: 280, borderRadius: 16,
                  border: `2px solid ${C.hairline}`,
                }}
              />
            </section>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({
  form, kind, onPublish, onDraft,
}: {
  form: FormState; kind: Kind; onPublish: () => void; onDraft: () => void
}) {
  const catColors: Record<Kind, { color: string; soft: string; gradient: string; Icon: React.ComponentType<{ size?: number }> }> = {
    video: { color: "#2DB89E", soft: "#D4F1EA", gradient: "linear-gradient(135deg,#2DB89E,#34D4B5)", Icon: Video      },
    audio: { color: "#7A5BC9", soft: "#E8DFFF", gradient: "linear-gradient(135deg,#7A5BC9,#9B7FE8)", Icon: Headphones },
    doc:   { color: "#E89B1C", soft: "#FFE9C2", gradient: "linear-gradient(135deg,#E89B1C,#F5B84C)", Icon: FileText   },
    game:  { color: "#E84B6B", soft: "#FFD8E1", gradient: "linear-gradient(135deg,#E84B6B,#F0738C)", Icon: Gamepad2   },
  }
  const cat = catColors[kind]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero thumbnail */}
      <div style={{
        background: form.thumbBg, borderRadius: 20, height: 160,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 80,
        boxShadow: "inset 0 -4px 16px rgba(40,20,10,0.06)",
      }}>
        {form.thumbEmoji}
      </div>

      {/* Summary */}
      <section>
        <SectionHeading>Summary</SectionHeading>
        <div style={{
          background: C.panelBg, borderRadius: 16,
          border: `1px solid ${C.hairline}`,
          overflow: "hidden",
        }}>
          {[
            { label: "Title",         value: form.title || "—" },
            { label: "Description",   value: form.desc || "—" },
            { label: "Type",          value: (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "3px 10px", borderRadius: 999,
                background: cat.soft, color: cat.color, fontWeight: 700, fontSize: 12.5,
              }}>
                <cat.Icon size={11} /> {kind.charAt(0).toUpperCase() + kind.slice(1)}
              </span>
            )},
            ...(form.tags.length     ? [{ label: "Tags",          value: form.tags.join(", ") }] : []),
            ...(form.ages.length     ? [{ label: "Age Groups",    value: form.ages.join(", ") }] : []),
            ...(form.services.length ? [{ label: "Services",      value: form.services.join(", ") }] : []),
            ...(form.goals.length    ? [{ label: "Goals",         value: form.goals.join(" · ") }] : []),
            ...(form.tips            ? [{ label: "Tips",          value: form.tips }] : []),
          ].map((row, i, arr) => (
            <div
              key={row.label}
              style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                padding: "13px 18px",
                borderBottom: i < arr.length - 1 ? `1px solid ${C.hairline}` : "none",
              }}
            >
              <span style={{
                minWidth: 100, fontSize: 11.5, fontWeight: 900,
                color: C.muted, letterSpacing: 0.5, paddingTop: 3,
                textTransform: "uppercase" as const,
              }}>
                {row.label}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, flex: 1 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Publish row */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button" onClick={onDraft}
          style={{
            flex: 1, padding: "14px", borderRadius: 14,
            border: `2px solid ${C.hairline}`, background: "#fff",
            color: C.muted, fontWeight: 800, fontSize: 14,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.ink
            ;(e.currentTarget as HTMLButtonElement).style.color = C.ink
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = C.hairline
            ;(e.currentTarget as HTMLButtonElement).style.color = C.muted
          }}
        >
          <FilePenLine size={16} /> Save as Draft
        </button>
        <button
          type="button" onClick={onPublish}
          style={{
            flex: 2, padding: "14px", borderRadius: 14, border: "none",
            background: cat.gradient, color: "#fff",
            fontWeight: 800, fontSize: 14, cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: `0 8px 24px ${cat.color}55`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <Globe size={16} /> Publish Resource
        </button>
      </div>
    </div>
  )
}

// ─── ResourceForm (main) ──────────────────────────────────────────────────────

interface ResourceFormProps {
  kind: Kind
  initial?: Partial<AdminResource>
  onClose: () => void
  onSave: (data: { status: "published" | "draft"; form: FormState }) => void
}

const KIND_META: Record<Kind, { color: string; soft: string; gradient: string; Icon: React.ComponentType<{ size?: number }> }> = {
  video: { color: "#2DB89E", soft: "#D4F1EA", gradient: "linear-gradient(135deg,#2DB89E,#34D4B5)", Icon: Video      },
  audio: { color: "#7A5BC9", soft: "#E8DFFF", gradient: "linear-gradient(135deg,#7A5BC9,#9B7FE8)", Icon: Headphones },
  doc:   { color: "#E89B1C", soft: "#FFE9C2", gradient: "linear-gradient(135deg,#E89B1C,#F5B84C)", Icon: FileText   },
  game:  { color: "#E84B6B", soft: "#FFD8E1", gradient: "linear-gradient(135deg,#E84B6B,#F0738C)", Icon: Gamepad2   },
}

export default function ResourceForm({ kind, initial, onClose, onSave }: ResourceFormProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>({
    ...INITIAL,
    kind,
    title:      initial?.title ?? "",
    desc:       initial?.desc ?? "",
    tags:       initial?.tags ?? [],
    thumbEmoji: initial?.thumbEmoji ?? "🎯",
    thumbBg:    initial?.thumbBg ?? "#FFE3D2",
    services:   initial?.service ? [initial.service] : [],
    ages:       initial?.age ? [initial.age] : [],
  })

  const meta = KIND_META[kind]

  function canAdvance() {
    if (step === 0) return !!form.title.trim()
    return true
  }

  const stepLabels = ["Details", "Upload", "Preview & Publish"]

  return (
    <>
      <style>{`
        @keyframes formModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>

      <div
        style={{
          position: "fixed", inset: 0, zIndex: 600,
          background: "rgba(42,47,74,0.55)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff", borderRadius: 28,
            width: "100%", maxWidth: 760,
            maxHeight: "92vh",
            display: "flex", flexDirection: "column",
            boxShadow: "0 40px 100px -20px rgba(40,20,10,0.35)",
            fontFamily: "var(--font-nunito)",
            animation: "formModalIn 0.25s cubic-bezier(.34,1.56,.64,1) both",
            overflow: "hidden",
          }}
        >
          {/* ── Sticky header ── */}
          <div style={{
            padding: "28px 36px 24px",
            borderBottom: `1px solid ${C.hairline}`,
            flexShrink: 0,
            background: "#fff",
          }}>
            {/* Title row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Kind pill */}
                <div style={{
                  width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                  background: meta.gradient, color: "#fff",
                  display: "grid", placeItems: "center",
                  boxShadow: `0 6px 16px ${meta.color}44`,
                }}>
                  <meta.Icon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.ink, letterSpacing: -0.3 }}>
                    {initial ? "Edit Resource" : `Add ${kind.charAt(0).toUpperCase() + kind.slice(1)} Resource`}
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginTop: 2 }}>
                    Step {step + 1} of 3 — {stepLabels[step]}
                  </div>
                </div>
              </div>
              <button
                type="button" onClick={onClose}
                style={{
                  width: 36, height: 36, borderRadius: 10, border: "none",
                  background: C.panelBg, color: C.muted,
                  cursor: "pointer", display: "grid", placeItems: "center",
                  fontFamily: "inherit", flexShrink: 0,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Stepper */}
            <Stepper step={step} kindColor={meta.color} />
          </div>

          {/* ── Scrollable body ── */}
          <div style={{
            flex: 1, overflowY: "auto",
            padding: "28px 36px",
          }}>
            {step === 0 && <Step1 form={form} setForm={setForm} />}
            {step === 1 && <Step2 form={form} setForm={setForm} />}
            {step === 2 && (
              <Step3
                form={form} kind={kind}
                onPublish={() => onSave({ status: "published", form })}
                onDraft={() => onSave({ status: "draft", form })}
              />
            )}
          </div>

          {/* ── Sticky footer nav (hidden on step 3, which has its own CTAs) ── */}
          {step < 2 && (
            <div style={{
              padding: "18px 36px",
              borderTop: `1px solid ${C.hairline}`,
              background: "#fff",
              flexShrink: 0,
              display: "flex", gap: 12,
            }}>
              <button
                type="button"
                onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
                style={{
                  flex: 1, padding: "13px", borderRadius: 14,
                  border: `2px solid ${C.hairline}`, background: "#fff",
                  color: C.muted, fontWeight: 800, fontSize: 14,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = C.ink
                  ;(e.currentTarget as HTMLButtonElement).style.color = C.ink
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = C.hairline
                  ;(e.currentTarget as HTMLButtonElement).style.color = C.muted
                }}
              >
                {step === 0 ? "Cancel" : "← Back"}
              </button>
              <button
                type="button"
                onClick={() => canAdvance() && setStep((s) => s + 1)}
                disabled={!canAdvance()}
                style={{
                  flex: 2, padding: "13px", borderRadius: 14, border: "none",
                  background: canAdvance() ? meta.gradient : C.hairline,
                  color: canAdvance() ? "#fff" : C.muted,
                  fontWeight: 800, fontSize: 14,
                  cursor: canAdvance() ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  boxShadow: canAdvance() ? `0 8px 24px ${meta.color}44` : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {step === 1 ? "Continue to Preview →" : "Next — Upload content →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Style helpers ─────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12.5, fontWeight: 800, color: C.ink,
  marginBottom: 7, letterSpacing: 0.2,
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 12,
  border: `2px solid ${C.hairline}`, background: "#FAF4ED",
  fontSize: 14, fontWeight: 600, color: C.ink,
  fontFamily: "inherit", outline: "none", transition: "border-color 0.18s",
  boxSizing: "border-box" as const,
}

const dropZoneStyle: React.CSSProperties = {
  border: `2px dashed ${C.hairline}`, borderRadius: 18,
  padding: "40px 24px", textAlign: "center" as const,
  background: "#FAF4ED",
  transition: "all 0.18s ease",
}
