import type { LucideIcon } from "lucide-react"
import { Sparkles, Video, Headphones, FileText, Gamepad2 } from "lucide-react"

export const CATEGORY: Record<string, {
  label: string
  color: string
  soft: string
  Icon: LucideIcon
}> = {
  all:   { label: "All",       color: "#D76B3F", soft: "#FFE3D2", Icon: Sparkles   },
  video: { label: "Videos",    color: "#2DB89E", soft: "#D4F1EA", Icon: Video      },
  audio: { label: "Audio",     color: "#7A5BC9", soft: "#E8DFFF", Icon: Headphones },
  doc:   { label: "Documents", color: "#E89B1C", soft: "#FFE9C2", Icon: FileText   },
  game:  { label: "Games",     color: "#E84B6B", soft: "#FFD8E1", Icon: Gamepad2   },
}

export type CategoryKey = keyof typeof CATEGORY

export const ALL_TAGS = ["Phonics","Vocabulary","Listening","Memory","Articulation","Music","Visual","Routine","Printable","Story"]
export const AGE_GROUPS = ["Preschool","Elementary School","Middle School","High School","Adult"]
export const SERVICES = ["Speech therapy","Occupational therapy","School counseling","Psychological service","Physical therapy"]

export interface Resource {
  id: string
  kind: "video" | "audio" | "doc" | "game"
  title: string
  desc: string
  duration?: string
  pages?: number
  plays?: string
  tags: string[]
  badge: string
  age: string
  service: string
  fav?: boolean
  thumbBg: string
  thumbEmoji: string
}

export const RESOURCES: Resource[] = [
  { id:"v1", kind:"video", title:"Animal Sounds Adventure",    desc:"Match the animal to its sound — roar, moo, and more!",             duration:"4 min", tags:["Listening","Vocabulary"],         badge:"Animal Sounds", age:"Preschool",        service:"Speech therapy",        thumbBg:"#FFE6B8", thumbEmoji:"🦁" },
  { id:"v2", kind:"video", title:"Blast Off with /b/ Words",   desc:"A bouncy rocket story to practice the B sound.",                   duration:"6 min", tags:["Phonics","Articulation"],         badge:"Articulation",  age:"Elementary School", service:"Speech therapy",        thumbBg:"#C8E6FF", thumbEmoji:"🚀" },
  { id:"a1", kind:"audio", title:"Songs for Speech Day",       desc:"Three sing-along tracks for warming up the voice.",                duration:"3:42",  tags:["Music","Listening"],              badge:"Calm",          age:"Preschool",        service:"Speech therapy",        thumbBg:"#E8DFFF", thumbEmoji:"🎵", fav:true },
  { id:"a2", kind:"audio", title:"Rhyme Time Stories",         desc:"Narrated rhymes to build phonological awareness.",                 duration:"5:18",  tags:["Phonics","Listening"],            badge:"Story",         age:"Elementary School", service:"School counseling",     thumbBg:"#E8DFFF", thumbEmoji:"📻" },
  { id:"d1", kind:"doc",   title:"Daily Practice Worksheet",   desc:"Printable mouth-shape & sound practice sheet.",                   pages:4,          tags:["Articulation","Printable"],       badge:"PDF",           age:"Middle School",    service:"Occupational therapy",  thumbBg:"#FFF3D6", thumbEmoji:"📝", fav:true },
  { id:"d2", kind:"doc",   title:"Visual Schedule Cards",      desc:"Picture cards to map out the session, step by step.",             pages:12,         tags:["Routine","Visual"],               badge:"PDF",           age:"High School",      service:"Psychological service", thumbBg:"#FFF3D6", thumbEmoji:"🗂️" },
  { id:"g1", kind:"game",  title:"Memory Match: First Words",  desc:"Three stages: animals, food and vehicles. Each stage adds more pairs.", plays:"2.1k", tags:["Memory","Vocabulary"],      badge:"Multi-Stage",   age:"Elementary School", service:"Speech therapy",        thumbBg:"#FFD8E1", thumbEmoji:"🃏" },
  { id:"g2", kind:"game",  title:"Puzzle Pop",                 desc:"Tap matching shapes. Stages get bigger as the child masters each grid.", plays:"980", tags:["Memory","Vocabulary"],      badge:"Multi-Stage",   age:"Adult",            service:"Physical therapy",       thumbBg:"#FFD8E1", thumbEmoji:"🧩", fav:true },
  { id:"g3", kind:"game",  title:"Articulation Adventure",     desc:"Three sound stages — B, P, then M — picking the word with the target sound.", plays:"3.4k", tags:["Articulation","Phonics"], badge:"Multi-Stage", age:"Elementary School", service:"Speech therapy",   thumbBg:"#FFD8E1", thumbEmoji:"🗣️" },
  { id:"g4", kind:"game",  title:"Word Builder Bingo",         desc:"Tap letters in order. CVC → CCVC → two-syllable across three rounds.", plays:"1.8k", tags:["Vocabulary","Phonics"],     badge:"Multi-Stage",   age:"Elementary School", service:"Speech therapy",        thumbBg:"#FFD8E1", thumbEmoji:"🅱️" },
  { id:"g5", kind:"game",  title:"Story Sequence Quest",       desc:"Drop the picture cards in order. Stories get longer as you progress.", plays:"1.2k", tags:["Story","Vocabulary","Memory"], badge:"Multi-Stage", age:"Preschool",       service:"Speech therapy",        thumbBg:"#FFD8E1", thumbEmoji:"📖" },
  { id:"g6", kind:"game",  title:"Phoneme Pop",                desc:"Pop the bubble that matches the target sound. Three increasingly tricky rounds.", plays:"2.7k", tags:["Listening","Phonics"], badge:"Multi-Stage", age:"Elementary School", service:"Speech therapy", thumbBg:"#FFD8E1", thumbEmoji:"🫧" },
  { id:"g8", kind:"game",  title:"Sound Safari",               desc:"Tap the animal that makes the sound. Three habitats, more critters in each.", plays:"2.2k", tags:["Vocabulary","Listening"], badge:"Multi-Stage",  age:"Preschool",       service:"Speech therapy",        thumbBg:"#FFD8E1", thumbEmoji:"🦒" },
  { id:"g9", kind:"game",  title:"Feelings Finder",            desc:"Match faces to feelings — from happy/sad to trickier emotions in later levels.", plays:"1.4k", tags:["Vocabulary","Story"], badge:"Multi-Stage",  age:"Preschool",       service:"School counseling",     thumbBg:"#FFD8E1", thumbEmoji:"😊" },
]
