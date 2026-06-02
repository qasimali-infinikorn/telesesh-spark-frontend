// Central icon exports for Telesesh Spark.
// All icons are from lucide-react — 2px rounded stroke, consistent weight.
// Import from here, not directly from lucide-react, so substitutions stay in one place.

export {
  // ── Brand / Navigation ─────────────────────────────────────────────
  Sparkles,          // logo mark + "All" category
  BookOpen,          // Library nav
  Heart,             // Favorites nav (warm — therapist/child relationship)
  User2,             // Profile nav
  Settings,          // Settings nav
  CreditCard,        // Billing nav
  LayoutDashboard,   // Admin nav / Dashboard
  LogOut,            // Sign out
  ChevronDown,       // Dropdown chevron
  ChevronLeft,       // Back button
  ChevronRight,      // Forward / expand

  // ── Resource categories ────────────────────────────────────────────
  Video,             // Video category
  Headphones,        // Audio category (speech therapy focus)
  FileText,          // Documents
  Gamepad2,          // Games

  // ── Actions ────────────────────────────────────────────────────────
  Eye,               // View resource
  Pencil,            // Edit
  Trash2,            // Delete
  Plus,              // Add
  Search,            // Search
  ArrowRight,        // Submit / next
  Upload,            // Upload file
  Download,          // Download
  Star,              // Favourited state
  StarOff,           // Un-favourited (outline)
  BookmarkPlus,      // Save / bookmark
  Share2,            // Share

  // ── Status / Feedback ──────────────────────────────────────────────
  CheckCircle2,      // Success
  XCircle,           // Error
  X,                 // Close / dismiss
  Check,             // Checkmark (inline)
  AlertTriangle,     // Warning

  // ── Forms / Auth ───────────────────────────────────────────────────
  Mail,
  Lock,
  EyeOff,            // Password hide
  User,              // User input field
  Stethoscope,       // Role / profession (speech therapy!)

  // ── Content / Analytics ────────────────────────────────────────────
  TrendingUp,        // Analytics trend
  BarChart2,         // Bar chart
  Clock,             // Time / duration
  Calendar,          // Date
  Tag,               // Tags
  Mic,               // Articulation / sounds (speech therapy)
  AudioWaveform,     // Audio waveform
  Activity,          // Activity / stats
  Layers,            // Resources overview

  // ── Admin ──────────────────────────────────────────────────────────
  FolderOpen,        // Resource folder
  ShieldCheck,       // Subscription / security
  Bell,              // Notifications
  Link2,             // Connected accounts
  RefreshCw,         // Regenerate
  Code2,             // Code editor

} from "lucide-react"

// Icon size tokens — use these for consistency
export const ICON_SM  = 14   // badges, inline labels
export const ICON_MD  = 18   // buttons, nav items
export const ICON_LG  = 22   // section headers, stat cards
export const ICON_XL  = 32   // hero sections, empty states
