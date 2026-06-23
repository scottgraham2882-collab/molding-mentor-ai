# Project Status

_Last updated: 2026-06-23_

## Overview

Molding Mentor AI is a Next.js application for injection molding teams. The repository now contains a broad mobile-first plant workspace with training, certifications, scientific molding lessons, calculators, quality systems, production logs, management reports, employee tracking, material support, and guided troubleshooting experiences.

## Current Build

- **Framework:** Next.js 15.5.6 with React 19.1.0 and TypeScript.
- **Styling:** Tailwind CSS with shared global app styles.
- **Primary entry point:** `app/page.tsx` dashboard linking to the major plant, quality, training, calculator, material, and management tools.
- **Data model:** Demo account and progress data in `lib/account-storage.ts` and `lib/progress-data.ts`.
- **Persistence:** Most operational tools use browser `localStorage` for create, save, edit, delete, filter, and print-oriented demo workflows.
- **AI readiness:** AI Coach and photo analysis are currently deterministic product-flow prototypes, not live AI API integrations.

## Completed Features

### Core App Shell and Account Experience

- Home dashboard with training progress widgets and links to every implemented tool area.
- Secondary dashboard route for returning-user workflow support.
- User profile page showing account details, completed lessons, quiz scores, certifications, calculator history, and AI Coach conversation summaries.
- Login and registration screens for the demo account flow.
- Certification center with completed module summaries, certification progress, badges, and printable certificate routing.

### Troubleshooting and AI-Style Support

- AI Troubleshooting Coach that matches common molding symptoms to questions, likely causes, corrective actions, and linked learning resources.
- Guided troubleshooting assistant for evidence gathering, baseline stabilization, process-window isolation, single-variable changes, and validation.
- Defect library covering common injection molding defects, likely root causes, and corrective actions.
- Defect photo analysis prototype with upload preview, material selection, defect category selection, AI-style confidence output, likely causes, corrective actions, and lesson links.

### Process, Production, and Operations

- Process Sheet Builder with job details, fill, pack, cooling, recovery, quality checks, save/edit/delete, print, and local persistence.
- Process Change Log with before/after parameter tracking, reason, result, notes, filters, print view, and local persistence.
- Work Instruction Builder with document control, scope, execution details, PPE, tools, safety warnings, quality checks, approvals, filtering, printing, and local persistence.
- Mold Change Checklist with safety, lockout/tagout awareness, mold removal/installation, utilities, material setup, automation setup, first shots, first article approval, saved progress, and print view.
- Startup Approval System with startup checks, approval sign-offs, saved approvals, edit/delete controls, status tracking, and print-friendly reports.
- Shift Handoff Logs for machine status, open issues, process changes, quality holds, downtime notes, next-shift instructions, saved history, and print view.
- Downtime Tracker with reason-code summaries, total downtime, saved entries, editing, and local persistence.
- Scrap Tracker with defect-type summaries, total scrap quantity, saved entries, editing, and local persistence.
- OEE Dashboard calculating availability, performance, quality, scrap percentage, downtime percentage, OEE, saved history, editing, deletion, charts, and print-friendly reporting.
- Preventive Maintenance Tracker with maintenance task history, due dates, upcoming work, editing, and local persistence.
- Mold History Database with searchable mold records, repair history, process knowledge, editing, deletion, and print view.
- Machine History Database with searchable machine records, maintenance notes, hydraulic/electrical/automation/process notes, editing, deletion, and print view.

### Reporting and Management

- Plant Daily Report for production, scrap, downtime, machine status, quality, safety, staffing, maintenance, and next-shift priorities.
- Weekly Management Report for production, quality, downtime, safety, training, corrective actions, narrative summaries, saved history, and print view.
- Executive KPI Dashboard for production, quality, downtime, OEE, corrective action, complaint, training, certification, trend indicators, local history, and print view.
- Plant Management Mode prototype for multi-user management concepts, employee training records, certification tracking, shift assignments, reporting metrics, and supervisor reviews.
- Action Item Tracker with categories, priorities, statuses, assignees, due dates, overdue tracking, filters, editing, local persistence, and print view.
- Meeting Notes & Follow-Up Tracker with meeting types, attendees, decisions, action items, owners, due dates, follow-up notes, filters, editing, and print view.
- Document Control System with document type, revision, owner, status, review-due tracking, filters, editing, deletion, local persistence, and print view.

### Materials and Scientific Molding

- Resin Drying Guide with material-specific drying references and startup support.
- Material Defect Troubleshooter for material-driven defects such as splay, bubbles, silver streaks, black specks, delamination, and brittleness.
- Scientific Molding lesson hub with structured learning path and study sequence.
- Lesson pages for Process Window, Gate Seal Study, and Decoupled Molding I.
- Scientific Molding Study Manager for fill, gate seal, pressure drop, decoupled molding, and process window study records.

## Current Routes

### Core, Account, and Profile

- `/` — main mobile-first dashboard.
- `/dashboard` — dashboard route.
- `/profile` — user profile and progress summary.
- `/account/login` — login page.
- `/account/register` — registration page.
- `/certifications` — user certification center.
- `/certifications/certificate` — printable certificate route.

### Troubleshooting, Defects, Materials, and Scientific Molding

- `/coach` — AI Troubleshooting Coach prototype.
- `/troubleshooting` — guided troubleshooting assistant.
- `/defects` — defect library.
- `/photo-analysis` — defect photo analysis prototype.
- `/materials/resin-drying` — resin drying guide.
- `/materials/troubleshooter` — material defect troubleshooter.
- `/lessons` — scientific molding lesson hub.
- `/lessons/process-window` — process window lesson.
- `/lessons/gate-seal-study` — gate seal study lesson.
- `/lessons/decoupled-molding-1` — decoupled molding lesson.
- `/scientific-molding/studies` — scientific molding study manager.

### Calculators

- `/calculators` — scientific molding calculator hub.
- `/calculators/clamp-tonnage` — clamp tonnage calculator.
- `/calculators/shot-size` — shot size usage calculator.
- `/calculators/cycle-time` — cycle time estimator.

### Process and Operations

- `/process-sheet-builder` — process sheet builder.
- `/process-change-log` — process change log.
- `/work-instructions` — work instruction builder.
- `/mold-change` — mold change checklist.
- `/startup-approval` — startup approval system.
- `/shift-handoff` — shift handoff logs.
- `/downtime` — downtime tracker.
- `/scrap` — scrap tracker.
- `/oee` — OEE dashboard.
- `/maintenance` — preventive maintenance tracker.
- `/molds` — mold history database.
- `/machines` — machine history database.

### Quality Tools

- `/quality/first-article` — first article inspection report.
- `/quality/audits` — audit checklist system.
- `/quality/containment` — quality hold / containment tracker.
- `/quality/corrective-action` — corrective action / root cause report.
- `/quality/customer-complaints` — customer complaint tracker.
- `/quality/8d-report` — 8D problem solving report.

### Reports, Management, and Employee Tools

- `/reports/daily` — plant daily report.
- `/reports/weekly` — weekly management report.
- `/reports/kpi-dashboard` — executive KPI dashboard.
- `/plant-management` — plant management mode prototype.
- `/actions` — action item tracker.
- `/meetings` — meeting notes and follow-up tracker.
- `/documents` — document control system.
- `/employees/training-record` — employee training record.
- `/employees/performance-coaching-log` — employee performance coaching log.

### Training Administration and Modules

- `/training/operator-safety-startup` — operator safety and startup module.
- `/training/mold-setup` — mold setup training module.
- `/training/process-technician` — process technician training module.
- `/training/supervisor` — supervisor training module.
- `/training/certifications` — certification management center.
- `/training/assignments` — training assignment manager.
- `/training/renewals` — training renewal reminder system.
- `/training/compliance` — training compliance dashboard.
- `/training/audit-report` — training audit report.
- `/training/plan-builder` — employee training plan builder.
- `/training/role-paths` — role-based training paths.
- `/training/skills-matrix` — employee skills matrix.
- `/training/department-matrix` — department training matrix.
- `/training/gap-analysis` — training gap analysis.

## Training Modules

- **Operator Safety & Startup:** machine-safety basics, PPE, lockout/tagout awareness, startup checklist, material verification, mold verification, first article inspection, shift handoff checklist, interactive checklist, quiz, and certificate path.
- **Mold Setup Training Module:** pre-change safety, mold verification, crane/hoist awareness, water lines, hydraulic/air hookups, mold protection, robot/conveyor setup, first shots, common setup mistakes, checklist, and quiz.
- **Process Technician Training Module:** process sheet verification, fill-only setup, transfer, cushion, pack/hold, gate seal, recovery, cooling validation, troubleshooting with data, checklist, and quiz.
- **Supervisor Training Module:** production floor leadership, shift startup expectations, dashboard review, scrap/downtime review, operator coaching, quality escalation, process-change approval, shift handoff expectations, training assignment follow-up, checklist, and quiz.
- **Scientific Molding Lessons:** process window fundamentals, gate seal study, decoupled molding basics, viscosity/fill-only concepts, setup discipline, and validation sequence.
- **Role-Based Training Paths:** role-specific modules, recommended lessons, required certifications, required skills, estimated completion timing, and advancement paths.
- **Training Administration:** assignment manager, renewal reminders, compliance dashboard, audit reports, plan builder, skills matrix, department matrix, gap analysis, employee training record, and performance coaching log.

## Calculators

- **Calculator hub (`/calculators`):** mobile-friendly cards for quick clamp tonnage, total shot weight, and recovery-time estimates.
- **Clamp Tonnage Calculator (`/calculators/clamp-tonnage`):** projected area and cavity pressure inputs with safety factor/reference pressure guidance.
- **Shot Size Usage Calculator (`/calculators/shot-size`):** part weight, runner weight, cavities, machine capacity, and utilization guidance.
- **Cycle Time Estimator (`/calculators/cycle-time`):** fill, pack/hold, cooling, recovery, mold open/close, eject, robot, and auxiliary-time estimate support.

## Quality Tools

- **First Article Inspection Report:** inspection details, dimensional results, approval status, saved reports, edit/delete, and print view.
- **Audit Checklist System:** layered process, 5S, safety, mold setup, first article, and process sheet audits with pass/fail checks, corrective actions, saved records, filters, and print reports.
- **Quality Hold / Containment Tracker:** suspect-part containment records, quantities, hold details, containment plan, totals, saved records, edit/delete, and print view.
- **Corrective Action / Root Cause Report:** issue details, containment, action plan, root cause, ownership, verification, status filters, saved reports, and print view.
- **Customer Complaint Tracker:** 8D-style complaint records covering complaint facts, containment, root cause, corrective actions, ownership, closure, filters, saved records, and print view.
- **8D Problem Solving Report:** D1 through D8 structure linked to complaints, parts, molds, and machines with saved reports, filters, status tracking, edit/delete, and print view.
- **Defect Library and Photo Analysis:** troubleshooting references and AI-style photo review outputs that support quality investigations.

## Management Tools

- **Plant Management Mode:** prototype for user oversight, training records, certification tracking, shift assignments, report metrics, and supervisor review concepts.
- **Daily, Weekly, and Executive Reports:** local report builders and KPI dashboard for plant-level production, quality, downtime, OEE, training, safety, and corrective-action visibility.
- **Action Item Tracker:** assignment and accountability system with due-date and overdue controls.
- **Meeting Notes & Follow-Up Tracker:** meeting recordkeeping with decisions, action items, owners, due dates, and follow-up notes.
- **Document Control System:** controlled document registry with revisions, status, owners, and review-due tracking.
- **Employee Records:** employee training record and performance coaching log.
- **Training Management:** certification management, assignments, renewals, compliance dashboard, audit report, training plan builder, role paths, skills matrix, department matrix, and gap analysis.
- **Asset and Production Management:** mold history, machine history, maintenance, downtime, scrap, OEE, shift handoff, startup approval, mold change checklist, process sheets, process changes, and work instructions.

## Remaining Roadmap Items

1. Add a production backend for users, roles, training progress, certifications, calculator runs, process sheets, studies, quality records, reports, documents, action items, and coach conversations.
2. Connect production authentication and authorization with role-based access for operators, setup technicians, process technicians, supervisors, quality, maintenance, and plant administrators.
3. Replace local demo storage with durable database-backed CRUD, audit trails, permissions, version history, and export/import support.
4. Wire AI Coach and defect photo analysis to production AI services with prompt/version control, safety disclaimers, source citations, escalation guidance, human review, and conversation history.
5. Add file/image upload storage for work instructions, defect photo analysis, quality records, documents, certificates, and report attachments.
6. Add robust form validation, required-field handling, data normalization, and reusable form components across all trackers/builders.
7. Add automated tests for calculators, local-storage utilities, progress summaries, route smoke coverage, and critical CRUD workflows.
8. Add production deployment configuration, environment-variable documentation, monitoring/logging, backup/restore, and data-retention policies.
9. Improve accessibility and responsive QA across every route, including keyboard flows, focus states, print views, and contrast checks.
10. Add manager dashboards that aggregate real saved data across shifts, employees, molds, machines, quality records, training status, and production reports.
11. Add notification/reminder workflows for expiring certifications, overdue training, overdue corrective actions, document reviews, PM tasks, startup approvals, and open action items.
12. Add CSV/PDF export, controlled print templates, and report distribution workflows.

## Known Limitations

- The app is currently a frontend/demo implementation with browser-local persistence and static seed data.
- Authentication screens exist, but no production auth provider or server-side session model is connected.
- Role-based permissions, multi-tenant plant data, and supervisor/admin workflows are UI prototypes until backed by a server.
- AI Coach and defect photo analysis are deterministic prototypes and are not connected to live model inference.
- Uploaded defect photos are previewed in-browser for the current session and are not stored in a production file service.
- Cross-route reporting does not yet aggregate persisted records into a shared backend data model.

## Verification Snapshot

- `npm run lint` passes.
- `npm run build` passes.
