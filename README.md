# JBC Volunteer Hub

Volunteer scheduling and management system for the **June Bug Center**. Built with Next.js, TypeScript, and Tailwind CSS.

## Quick Start

```bash
cd jbc-volunteer-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — click **Get Started** and choose a role (Volunteer or Staff) to explore the app.

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **Next.js App Router** with route groups | Clean separation of volunteer/staff pages while sharing layout, navigation, and components |
| **Mock service layer** (`lib/services/`) | Every data function returns a `Promise`, mirroring real Firestore SDK calls. Swap to Firebase by editing only service files |
| **React Context for auth** | Simplest state management for MVP. Replace context value source with `onAuthStateChanged` later |
| **shadcn/ui (base-ui)** | Components copied into the project — zero runtime dependency, fully customizable |
| **TypeScript interfaces** (`lib/types/`) | Mirror planned Firestore document schemas 1:1 for seamless migration |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Role selection (→ Firebase Auth)
│   └── (app)/                # Authenticated route group
│       ├── layout.tsx        # App shell with sidebar + topnav
│       ├���─ dashboard/        # Role-aware dashboard
│       ├── shifts/           # Browse/manage shifts
│       ├── schedule/         # Volunteer: my schedule
│       ├── hours/            # Volunteer: hours history
│       ├── approvals/        # Staff: approval queue
│       └── attendance/       # Staff: attendance tracking
├── components/
│   ├── ui/                   # shadcn primitives
│   ├── layout/               # AppShell, Sidebar, TopNav
│   ├── shifts/               # ShiftCard, ShiftList, ShiftFormModal, WeekView
│   ├── approvals/            # ApprovalQueue
│   ├── attendance/           # AttendanceTracker
│   ├── dashboard/            # StatCard
│   └── shared/               # EmptyState, StatusBadge, LoadingSpinner, ErrorState
└── lib/
    ├── types/                # Shared TypeScript interfaces
    ├── mock-data/            # Seed data for all entities
    ├── services/             # Mock async service functions
    │   ├── auth.ts           # → Firebase Auth
    │   ├── shifts.ts         # → Firestore "shifts" collection
    │   ├── signups.ts        # → Firestore "signups" collection
    │   ├── attendance.ts     # → Firestore "attendance" collection
    │   └── calendar.ts       # → Google Calendar API
    └── context/
        └── AuthContext.tsx    # Mock auth provider
```

## What Works (Demo-Ready)

- **Landing page** with feature overview
- **Role selection** — switch between Volunteer and Staff instantly
- **Volunteer flow**: dashboard with stats, browse available shifts, sign up, view schedule (list + week view), hours history with totals
- **Staff flow**: dashboard with coverage gaps, shift CRUD with form modal, approval queue (approve/reject), attendance tracking table
- **Shared components**: shift cards, stat cards, status badges, empty states, loading states, week calendar view
- **Responsive layout**: sidebar on desktop, sheet menu on mobile
- **Role switcher** in the user dropdown — demo both flows without logging out

## What Is Placeholder / TODO

All backend integrations are stubbed with `// TODO:` comments in the service files.

### Firebase Authentication
- **File**: `lib/services/auth.ts`, `lib/context/AuthContext.tsx`
- **Current**: Mock login by role selection, user stored in React state
- **To integrate**: Install `firebase`, initialize app, use `signInWithEmailAndPassword()`, listen to `onAuthStateChanged()`, fetch user role from Firestore `users` collection

### Firestore Database
- **Files**: `lib/services/shifts.ts`, `signups.ts`, `attendance.ts`
- **Current**: In-memory arrays with simulated async delays
- **To integrate**: Replace each function body with Firestore queries (`collection()`, `addDoc()`, `updateDoc()`, `onSnapshot()` for real-time)
- **Planned collections**: `users`, `shifts`, `signups`, `attendance`, `reminders`

### Google Calendar API
- **File**: `lib/services/calendar.ts`
- **Current**: Mock functions that log to console
- **To integrate**: Install `googleapis`, authenticate via OAuth2, use `calendar.events.insert()` to sync shifts, set up reminders via event notifications
- **Use case**: Volunteers can add shifts to their Google Calendar; automated reminders before shifts

### Reminders
- **Current**: Type definitions and mock data exist, no UI yet
- **To integrate**: Firebase Cloud Functions to send reminder emails/notifications before shifts. UI for reminder preferences on the volunteer side.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (base-ui primitives)
- **Icons**: Lucide React

## Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```
