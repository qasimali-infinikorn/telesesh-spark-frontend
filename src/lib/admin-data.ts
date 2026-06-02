import { RESOURCES } from "@/lib/resources"
import type { Resource } from "@/lib/resources"

export { RESOURCES } from "@/lib/resources"

export const AGE_OPTIONS = ["Preschool", "Elementary School", "Middle School", "High School", "Adult"]
export const SERVICE_OPTIONS = [
  "Speech therapy",
  "Occupational therapy",
  "School counseling",
  "Psychological service",
  "Physical therapy",
]

export function hashId(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function fmtDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export interface AdminResource extends Resource {
  dateAdded: string
  status: "published" | "draft"
  views: number
  favCount: number
}

const BASE_DATE = new Date("2024-01-01").getTime()
const MS_PER_DAY = 86_400_000

export const ADMIN_RESOURCES: AdminResource[] = RESOURCES.map((r) => {
  const h = hashId(r.id)
  const dayOffset = h % 365
  const dateAdded = new Date(BASE_DATE + dayOffset * MS_PER_DAY).toISOString().split("T")[0]
  const views = 200 + (h % 4800)
  const favCount = 10 + (h % 390)
  const status: "published" | "draft" = h % 7 === 0 ? "draft" : "published"
  return { ...r, dateAdded, status, views, favCount }
})

export interface AdminSound {
  id: string
  title: string
  desc: string
  dateAdded: string
}

export const ADMIN_SOUNDS: AdminSound[] = [
  { id: "s1",  title: "/b/ — Bilabial Stop",    desc: "Practice the voiced bilabial plosive in initial, medial and final positions.",      dateAdded: "2024-02-10" },
  { id: "s2",  title: "/p/ — Bilabial Stop",    desc: "Unvoiced partner to /b/. Includes minimal pair words and carrier phrases.",         dateAdded: "2024-02-12" },
  { id: "s3",  title: "/m/ — Bilabial Nasal",   desc: "Nasal resonance drills and humming warm-ups for the /m/ phoneme.",                  dateAdded: "2024-02-15" },
  { id: "s4",  title: "/f/ — Labiodental",       desc: "Friction focus: upper teeth on lower lip. Single words → sentences.",              dateAdded: "2024-02-20" },
  { id: "s5",  title: "/v/ — Labiodental",       desc: "Voiced counterpart of /f/. Target words with varying syllable structures.",        dateAdded: "2024-03-01" },
  { id: "s6",  title: "/s/ — Alveolar Sibilant", desc: "Classic lateral lisp correction cues and tongue placement reminders.",            dateAdded: "2024-03-05" },
  { id: "s7",  title: "/z/ — Alveolar Sibilant", desc: "Voiced sibilant in medial and final positions, with voiced/unvoiced contrast.",   dateAdded: "2024-03-08" },
  { id: "s8",  title: "/r/ — Rhotic",            desc: "Retroflexed /r/ production cues, from isolation through conversational speech.",  dateAdded: "2024-03-12" },
  { id: "s9",  title: "/l/ — Lateral",           desc: "Tongue-tip laterals: dark /l/ vs. clear /l/ in varied phonetic contexts.",        dateAdded: "2024-03-18" },
  { id: "s10", title: "/th/ — Dental",           desc: "Voiced and voiceless dental fricatives — minimal pairs and tongue-tip cues.",     dateAdded: "2024-03-22" },
]
