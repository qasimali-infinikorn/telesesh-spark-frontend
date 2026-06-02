# Telesesh Spark — Frontend

Next.js 16 client for the Telesesh Spark therapy resource platform. Serves the learner-facing library, admin panel, billing, and user profile flows.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Lucide React icons |
| Styling | Tailwind CSS v4 (PostCSS), inline design-token styles |
| Auth | NextAuth v5 (Credentials + Google OAuth) |
| Testing | Playwright (E2E) |

## Prerequisites

- Node.js ≥ 20 (`node --version`)
- Backend API running at `http://localhost:3001` (see `backend/README.md`)

## Setup

```bash
cd frontend
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```bash
# .env.local

NEXTAUTH_SECRET=any-random-string-32-chars-min
NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_API_URL=http://localhost:3001

GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

## Scripts

```bash
npm run dev          # development server (hot reload)
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint
npm run test:e2e     # Playwright headless
npm run test:e2e:ui  # Playwright with UI runner
npm run test:e2e:debug  # Playwright debug mode
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & registration pages
│   ├── admin/           # Admin panel (dashboard, resources, sounds, tags, age-groups, settings)
│   ├── billing/         # Subscription & billing
│   ├── favorites/       # Saved resources
│   ├── packages/        # Package browse/purchase
│   ├── payment/         # Checkout flow
│   ├── profile/         # User profile
│   ├── settings/        # Account settings
│   ├── api/             # Next.js API routes (auth callbacks)
│   ├── layout.tsx        # Root layout (fonts, providers)
│   └── page.tsx          # Library home page
├── components/
│   └── admin/           # Admin UI components (ResourceForm, ListManager, etc.)
├── lib/                 # Shared utilities, mock data, resource constants
├── providers/           # React context providers (session, etc.)
├── types/               # Shared TypeScript types
├── auth.ts              # NextAuth configuration
└── proxy.ts             # API proxy helper
```

## Auth Flow

1. User signs in via **email/password** or **Google OAuth**.
2. NextAuth calls `POST /users/sign_in` (credentials) or `POST /api/v1/auth/google` (OAuth) on the Rails backend.
3. The backend returns a **JWT** stored in the NextAuth session.
4. All API requests include `Authorization: Bearer <jwt>`.

## Admin Panel

Accessible at `/admin`. Routes:

| Path | Description |
|---|---|
| `/admin/dashboard` | Stats overview |
| `/admin/resources` | Full resource CRUD (video, audio, document, game) |
| `/admin/sounds` | Sound library management |
| `/admin/tags` | Content tag management |
| `/admin/age-groups` | Age group category management |
| `/admin/settings` | Account & security settings |
