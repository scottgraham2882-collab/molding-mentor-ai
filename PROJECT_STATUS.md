# Project Status

_Last updated: 2026-06-22_

## Overview

AI Molding Coach is a Next.js application for injection molding teams. The current product is a mobile-first dashboard with linked training, troubleshooting, process, materials, certification, account, and management workflows.

## Current Build

- **Framework:** Next.js 15 with React 19 and TypeScript.
- **Styling:** Tailwind CSS with global app styles.
- **Primary entry point:** `app/page.tsx` dashboard.
- **Data model:** Demo user/progress data in `lib/account-storage.ts` and `lib/progress-data.ts`.
- **Persistence:** Browser `localStorage` for demo account profile data.

## Implemented Application Areas

### Core Dashboard

- Home dashboard with progress widgets and cards for the major tools.
- Dedicated dashboard route for returning-user workflow support.

### Account and Profile

- Login page.
- Registration page.
- User profile page that surfaces account data, lessons, quiz scores, certifications, calculator history, and AI Coach conversation summaries.

### Training and Certification

- Scientific molding lesson hub.
- Lesson pages for process window, gate seal study, and decoupled molding basics.
- Operator Safety & Startup training module.
- Certification center.
- Printable certificate route and print button component.

### Troubleshooting and AI Support

- AI Troubleshooting Coach route.
- Guided troubleshooting assistant route.
- Defect library route.
- Defect photo analysis route.

### Process and Calculators

- Process Sheet Builder route.
- Calculator hub.
- Clamp tonnage calculator.
- Shot size calculator.
- Cycle time calculator.

### Materials

- Resin drying guide.
- Material defect troubleshooter.

### Plant Management

- Plant Management Mode route for employee training and certification tracking concepts.

## Known Limitations

- Most workflows currently use static/demo data instead of a backend database.
- Authentication is represented by demo UI flows; there is no production auth provider connected yet.
- AI Coach and photo analysis experiences are currently product-flow prototypes and are not wired to a live AI API.
- Calculator and training history are not persisted beyond the local demo storage model unless implemented on each route.
- Plant management concepts are present in the UI, but role-based access control and multi-user administration still need backend support.

## Recommended Next Steps

1. Add a production data layer for users, training progress, certifications, calculator runs, process sheets, and coach conversations.
2. Connect authentication and authorization, including separate roles for operators, technicians, supervisors, and plant administrators.
3. Wire the AI Coach and defect photo analysis routes to production AI services with safety disclaimers, audit trails, and escalation guidance.
4. Add form validation and persistence to process sheets and calculators.
5. Expand automated tests around shared progress calculations, account storage behavior, and route-level UI smoke coverage.
6. Add deployment configuration and environment-variable documentation for production hosting.

## Verification Snapshot

- `npm run lint` currently fails on the generated `next-env.d.ts` triple-slash reference rule.
- `npm run build` passes.
