# Vivriti NEXT InfoSec — GRC Platform

**Module 1: Third Party Security Posture Management (TSPM)**

An enterprise Governance, Risk & Compliance (GRC) platform frontend for the Vivriti NEXT
Information Security team. Built as a production-quality, demo-ready application on a modular,
API-ready architecture so future modules (Risk, Compliance, Audit, Policy, Incident, BCM)
can plug in without redesign.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · shadcn-style component library ·
React Router · TanStack Query (provider + mock service layer) · Zustand · dnd-kit ·
Recharts · Framer Motion-ready.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

> No backend is required. All data is realistic mock data generated deterministically in
> `src/data/mock.ts`. The service layer in `src/data/api.ts` simulates async calls and mirrors
> the shape of a future REST/GraphQL backend — swap the implementations for `fetch` when ready.

## Demo logins

The login screen is a demo. Pick a persona and click **Sign in** (no real credentials needed):

- **Internal** — full platform (Dashboard, Question Master, Templates, Entities, Assessments,
  Reviewer Workspace, Findings, Reports, Audit Logs, Settings).
- **Vendor** — external vendor portal (assessments, questionnaire, submission history, messages).

Press **⌘K / Ctrl-K** anywhere for global search. Toggle light/dark from the header.

## Architecture

```
src/
  components/
    ui/         shadcn-style primitives (Button, Card, Table, Dialog, Drawer, …)
    layout/     app shell (Sidebar, Header, command palette, layouts)
    common/     PageHeader, StatCard, StatusBadge, DataTable toolbar, ConfirmDialog
    charts/     Recharts wrappers (donut, bar, trend)
  features/     feature-based modules (one folder per domain)
  data/         deterministic mock generators + mock API service layer
  store/        Zustand stores (theme, auth, ui, toast)
  types/        shared domain types
  lib/          utils, CSV export
```

## Business flow implemented

Question Master → Template Builder (drag & drop) → Entity → Assessment Wizard →
secure link → Vendor questionnaire (draft/autosave/submit-locks) → Reviewer Workspace
(approve / request correction with versioned history) → Findings → Reports & Audit Logs.

## Notes for backend integration

- Replace functions in `src/data/api.ts` with real HTTP calls; keep the return types.
- Wire TanStack Query hooks (provider already configured in `src/main.tsx`).
- Auth is a mock Zustand store (`src/store/auth.ts`) — replace with your IdP/SSO.
