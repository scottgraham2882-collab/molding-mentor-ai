"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DashboardCard = {
  title: string;
  description: string;
  href?: string;
  status?: "Coming Soon";
  accent: string;
};

const FAVORITES_STORAGE_KEY = "moldingMentor.favoriteTools";

const getToolId = (card: DashboardCard) => card.href ?? card.title;

const dashboardCards: DashboardCard[] = [
  {
    title: "User Profile",
    description:
      "Review your account, completed lessons, quiz scores, certifications, calculator history, and AI Coach conversations.",
    href: "/profile",
    accent: "from-cyan-300 to-blue-400",
  },
  {
    title: "User Login",
    description:
      "Log in to restore your personalized training dashboard and progress-tracking workspace.",
    href: "/account/login",
    accent: "from-blue-300 to-violet-400",
  },
  {
    title: "User Registration",
    description:
      "Create a user account for saved training activity, credentials, calculator runs, and coach chats.",
    href: "/account/register",
    accent: "from-emerald-300 to-lime-400",
  },
  {
    title: "Process Sheet Builder",
    description:
      "Create, save, edit, print, and export injection molding process sheets for repeatable setups and shift handoffs.",
    href: "/process-sheet-builder",
    accent: "from-lime-300 to-cyan-400",
  },
  {
    title: "Electronic Process Sheet Approval",
    description:
      "Create, save, filter, edit, delete, and print electronic approvals for controlled process sheet revisions.",
    href: "/process-sheets/approval",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Work Instruction Builder",
    description:
      "Create, save, filter, edit, delete, and print controlled work instructions with PPE, tools, safety warnings, quality checks, approvals, and image placeholders.",
    href: "/work-instructions",
    accent: "from-emerald-300 to-cyan-400",
  },

  {
    title: "Process Change Log",
    description:
      "Create before-and-after process change records with reasons, results, notes, browser storage, filters, editing, deletion, and print view.",
    href: "/process-change-log",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Action Item Tracker",
    description:
      "Create, assign, filter, edit, save, and print management action items with status, priority, category, assignee, due-date, and overdue tracking.",
    href: "/actions",
    accent: "from-amber-300 to-cyan-400",
  },
  {
    title: "Document Control System",
    description:
      "Create, save, edit, filter, review, delete, and print controlled document records with revision, owner, status, and review-due tracking.",
    href: "/documents",
    accent: "from-cyan-300 to-amber-400",
  },
  {
    title: "Mold History Database",
    description:
      "Add, search, edit, delete, save, and print mold history records with tooling notes, repair history, and process knowledge.",
    href: "/molds",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Mold Preventive Maintenance Scheduler",
    description:
      "Create, save, filter, edit, delete, and print mold PM schedules with cycle intervals, due dates, technicians, issues, and status counts.",
    href: "/molds/pm-scheduler",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Machine History Database",
    description:
      "Add, search, edit, delete, save, and print machine history records with maintenance, hydraulic, electrical, automation, and process notes.",
    href: "/machines",
    accent: "from-emerald-300 to-cyan-400",
  },

  {
    title: "Mold Change Checklist",
    description:
      "Work through mold-change safety, removal, installation, connections, startup checks, and first article approval with saved progress and print view.",
    href: "/mold-change",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Startup Approval System",
    description:
      "Complete startup sign-offs with interactive checks, approval status, saved approvals, edit/delete controls, and print-friendly reports.",
    href: "/startup-approval",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Shift Handoff Logs",
    description:
      "Record machine status, open issues, process changes, quality holds, downtime notes, and instructions for the next shift.",
    href: "/shift-handoff",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Production Schedule Board",
    description:
      "Create, save, edit, filter, delete, and print production schedule entries with planned-versus-actual quantities and job status tracking.",
    href: "/production/schedule",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Real-Time Production Board",
    description:
      "Add, save, edit, delete, filter, and print live machine status cards with cycle times, quantities, scrap, downtime, issues, next actions, and status counts.",
    href: "/production/live-board",
    accent: "from-cyan-300 to-blue-400",
  },
  {
    title: "Production Run Log",
    description:
      "Create, save, edit, filter, delete, and print production run logs with automatic run time, total parts, scrap percentage, and parts-per-hour calculations.",
    href: "/production/run-log",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Production Job Traveler",
    description:
      "Create, save, edit, delete, status-track, and print job travelers from material verification through final approval.",
    href: "/production/job-traveler",
    accent: "from-cyan-300 to-blue-400",
  },
  {
    title: "Meeting Notes & Follow-Up Tracker",
    description:
      "Create, save, edit, delete, filter, and print meeting notes with attendees, decisions, action items, owners, due dates, and follow-up notes.",
    href: "/meetings",
    accent: "from-violet-300 to-cyan-400",
  },
  {
    title: "Plant Daily Report",
    description:
      "Create, save, edit, delete, review, and print daily plant reports covering production, scrap, downtime, machines, quality, safety, staffing, maintenance, and next-shift priorities.",
    href: "/reports/daily",
    accent: "from-emerald-300 to-cyan-400",
  },

  {
    title: "OEE Dashboard",
    description:
      "Calculate availability, performance, quality, scrap, downtime, and OEE with saved history, charts, editing, deletion, and print-friendly reports.",
    href: "/oee",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Downtime Tracker",
    description:
      "Log downtime events, edit saved entries, and review total minutes with reason-code summaries from browser storage.",
    href: "/downtime",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Preventive Maintenance Tracker",
    description:
      "Schedule PM follow-ups, log maintenance tasks, edit saved records, and review upcoming due dates from browser storage.",
    href: "/maintenance",
    accent: "from-emerald-300 to-teal-400",
  },

  {
    title: "First Article Inspection Report",
    description:
      "Create, save, edit, delete, and print quality first article inspection reports with critical dimensions and approval status.",
    href: "/quality/first-article",
    accent: "from-teal-300 to-emerald-400",
  },
  {
    title: "Digital First Piece Approval",
    description:
      "Create, save, view, edit, delete, filter, and print first-piece approvals with part, mold, machine, inspection, packaging, and disposition details.",
    href: "/quality/first-piece-approval",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Audit Checklist System",
    description:
      "Create layered process, 5S, safety, mold setup, first article, and process sheet audits with pass/fail checks, corrective actions, saved records, filters, and print reports.",
    href: "/quality/audits",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Quality Hold / Containment Tracker",
    description:
      "Create, save, edit, delete, total, and print containment records for suspect parts held by quality.",
    href: "/quality/containment",
    accent: "from-amber-300 to-emerald-400",
  },
  {
    title: "Corrective Action / Root Cause Report",
    description:
      "Create, save, edit, filter, delete, and print corrective action reports with containment, root cause, and verification notes.",
    href: "/quality/corrective-action",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Corrective Action Tracker (CAPA)",
    description:
      "Create, save, edit, delete, filter, dashboard, and print CAPA records with owners, due dates, containment, corrective action, prevention, and verification notes.",
    href: "/quality/capa",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Customer Complaint Tracker",
    description:
      "Create, save, edit, delete, filter, and print 8D-style customer complaint records for quality follow-up.",
    href: "/quality/customer-complaints",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Supplier Quality Issue Tracker",
    description:
      "Create, save, edit, delete, filter, count, and print supplier issue records with containment, corrective action requests, due dates, status, and verification notes.",
    href: "/quality/supplier-issues",
    accent: "from-amber-300 to-cyan-400",
  },
  {
    title: "8D Problem Solving Report",
    description:
      "Create, save, edit, delete, filter, and print structured 8D reports linked to complaints, parts, molds, and machines.",
    href: "/quality/8d-report",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Scrap Tracker",
    description:
      "Add, edit, and review scrap entries with total quantity and defect-type summaries stored in this browser.",
    href: "/scrap",
    accent: "from-rose-300 to-orange-400",
  },
  {
    title: "AI Troubleshooting Coach",
    description:
      "Chat through a molding problem to get targeted questions, likely root causes, corrective actions, and links to lessons and defect guides.",
    href: "/coach",
    accent: "from-cyan-300 to-emerald-400",
  },

  {
    title: "Defect Photo Analysis",
    description:
      "Upload a molded part photo, select material and defect category, then get an AI-style likely defect review with troubleshooting and lesson links.",
    href: "/photo-analysis",
    accent: "from-sky-300 to-cyan-400",
  },
  {
    title: "Defect Library",
    description:
      "Review common injection molding defects, likely root causes, and corrective actions before changing the process.",
    href: "/defects",
    accent: "from-cyan-300 to-sky-400",
  },
  {
    title: "Troubleshooting Assistant",
    description:
      "Use a guided workflow to collect evidence, isolate process variables, and validate the next corrective step.",
    href: "/troubleshooting",
    accent: "from-emerald-300 to-teal-400",
  },

  {
    title: "Weekly Management Report",
    description:
      "Create, save, edit, delete, view, and print weekly production, quality, downtime, safety, training, and corrective-action reports.",
    href: "/reports/weekly",
    accent: "from-cyan-300 to-violet-400",
  },
  {
    title: "Executive KPI Dashboard",
    description:
      "Track executive production, quality, downtime, OEE, corrective-action, complaint, training, and certification KPIs with local history, trend indicators, editing, deletion, and print view.",
    href: "/reports/kpi-dashboard",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Plant Management Mode",
    description:
      "Manage multiple users, employee training records, certification tracking, shift assignments, reports, and supervisor reviews.",
    href: "/plant-management",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Certification Center",
    description:
      "Track completed training modules, quiz scores, certification progress, earned badges, and generate printable certificates.",
    href: "/certifications",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Certification Management Center",
    description:
      "Create, save, edit, filter, delete, and print employee certification records with status counts and 30-day expiration visibility.",
    href: "/training/certifications",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Training Assignment Manager",
    description:
      "Assign modules, track due dates, status, quiz scores, supervisor notes, completion percentage, and print training reports.",
    href: "/training/assignments",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Training Renewal Reminder System",
    description:
      "Add, save, edit, delete, filter, count, and print employee training and certification renewal reminders with 30-day due-soon visibility.",
    href: "/training/renewals",
    accent: "from-amber-300 to-cyan-400",
  },
  {
    title: "Training Compliance Dashboard",
    description:
      "Enter compliance snapshots, monitor assignments and certifications, review saved history, edit or delete records, and print compliance reports.",
    href: "/training/compliance",
    accent: "from-cyan-300 to-violet-400",
  },
  {
    title: "Training Audit Report",
    description:
      "Add, save, edit, delete, filter, count, and print training audit records for employee training records, certifications, findings, corrective actions, owners, and due dates.",
    href: "/training/audit-report",
    accent: "from-violet-300 to-cyan-400",
  },
  {
    title: "Employee Training Plan Builder",
    description:
      "Create, save, edit, filter, delete, track progress, and print employee training plans with role goals, skill gaps, modules, certifications, mentors, dates, status, and supervisor notes.",
    href: "/training/plan-builder",
    accent: "from-emerald-300 to-violet-400",
  },
  {
    title: "Role-Based Training Paths",
    description:
      "Select a role, view required modules, lessons, certifications, skills, completion time, advancement path, saved progress, and print-friendly training plans.",
    href: "/training/role-paths",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Employee Training Record",
    description:
      "Create, save, edit, filter, and print employee training records with quiz scores, pass/fail status, certifications, expiration alerts, and supervisor sign-off.",
    href: "/employees/training-record",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Employee Performance Coaching Log",
    description:
      "Create, save, edit, filter, and print employee performance coaching logs with observations, standards, action plans, employee responses, follow-up dates, and closure status.",
    href: "/employees/performance-coaching-log",
    accent: "from-violet-300 to-cyan-400",
  },
  {
    title: "Employee Skills Matrix",
    description:
      "Add, save, edit, filter, and print employee skill records with qualification levels, expiration dates, and supervisor sign-offs.",
    href: "/training/skills-matrix",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Department Training Matrix",
    description:
      "Add, save, edit, delete, filter, and print department training records with completion percentages, certification status, expiration dates, and supervisor sign-offs.",
    href: "/training/department-matrix",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Training Gap Analysis",
    description:
      "Add, save, edit, delete, filter, and print employee training gap records with role targets, skill levels, severity, due dates, status, open-gap totals, and critical-gap visibility.",
    href: "/training/gap-analysis",
    accent: "from-rose-300 to-cyan-400",
  },
  {
    title: "Operator Safety & Startup",
    description:
      "Complete Operator Training Module 1 with machine-safety basics, startup verification, an interactive checklist, quiz, and certificate.",
    href: "/training/operator-safety-startup",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Mold Setup Training Module",
    description:
      "Train setup technicians on safe mold changes, verification, crane awareness, utilities, mold protection, automation checks, first shots, common mistakes, and quiz completion.",
    href: "/training/mold-setup",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Process Technician Training Module",
    description:
      "Train process technicians on process sheet verification, fill-only setup, transfer, cushion, pack/hold, gate seal, recovery, cooling validation, data troubleshooting, and quiz completion.",
    href: "/training/process-technician",
    accent: "from-cyan-300 to-amber-400",
  },
  {
    title: "Supervisor Training Module",
    description:
      "Train supervisors on production floor leadership, shift startup expectations, dashboards, scrap and downtime review, operator coaching, quality escalation, process change approval, shift handoffs, assignment follow-up, and quiz completion.",
    href: "/training/supervisor",
    accent: "from-amber-300 to-cyan-400",
  },
  {
    title: "Scientific Molding Study Manager",
    description:
      "Create, save, edit, filter, delete, and print fill, gate seal, pressure drop, decoupled molding, and process window study records.",
    href: "/scientific-molding/studies",
    accent: "from-cyan-300 to-violet-400",
  },
  {
    title: "Scientific Molding Training",
    description:
      "Build a structured learning path for process windows, gate seal studies, viscosity curves, and setup discipline.",
    href: "/lessons",
    accent: "from-violet-300 to-fuchsia-400",
  },
  {
    title: "Scientific Molding Calculator",
    description:
      "Estimate clamp tonnage, total shot weight, and screw recovery time with mobile-friendly scientific molding calculator cards.",
    href: "/calculators",
    accent: "from-amber-300 to-orange-400",
  },
  {
    title: "Material Guides",
    description:
      "Check resin drying conditions and troubleshoot material-related defects before starting a run or adjusting the process.",
    href: "/materials/resin-drying",
    accent: "from-teal-300 to-cyan-400",
  },
  {
    title: "Material Lot Traceability Tracker",
    description:
      "Create, save, edit, filter, delete, and print resin lot traceability records from receiving through drying and production output.",
    href: "/materials/lot-traceability",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Material Inventory Tracker",
    description:
      "Add, save, view, edit, delete, filter, count, and print material inventory records with supplier lots, quantities, locations, expirations, and stock status.",
    href: "/materials/inventory",
    accent: "from-amber-300 to-emerald-400",
  },
  {
    title: "Material Drying Log",
    description:
      "Create, save, edit, delete, filter, and print material drying records with dryer settings, dew point, duration, operator notes, and browser storage.",
    href: "/materials/drying-log",
    accent: "from-teal-300 to-emerald-400",
  },
  {
    title: "Color Change Procedure & Log",
    description:
      "Create, save, edit, delete, filter, and print color change records with purge timing, scrap generated, first-good-part time, and browser storage.",
    href: "/materials/color-change",
    accent: "from-fuchsia-300 to-cyan-400",
  },
  {
    title: "Material Change Approval Form",
    description:
      "Create, save, edit, delete, filter, approve, reject, and print material change approvals with quality, technician, and supervisor sign-offs.",
    href: "/materials/change-approval",
    accent: "from-cyan-300 to-blue-400",
  },
  {
    title: "Material Defect Troubleshooter",
    description:
      "Select splay, bubbles, silver streaks, black specks, delamination, or brittleness to review material causes and corrective actions.",
    href: "/materials/troubleshooter",
    accent: "from-blue-300 to-cyan-400",
  },
  {
    title: "Dashboard",
    description:
      "Review the main progress dashboard with training, certification, and coaching activity in one place.",
    href: "/dashboard",
    accent: "from-cyan-300 to-blue-400",
  },
  {
    title: "Printable Certificate",
    description:
      "Generate and print training certificates for completed lessons and qualification records.",
    href: "/certifications/certificate",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Decoupled Molding Lesson",
    description:
      "Learn the first practical step in decoupled molding with fill-only setup, transfer position, and repeatability checks.",
    href: "/lessons/decoupled-molding-1",
    accent: "from-violet-300 to-cyan-400",
  },
  {
    title: "Gate Seal Study Lesson",
    description:
      "Follow the steps for proving gate seal, documenting part weight response, and setting hold-time discipline.",
    href: "/lessons/gate-seal-study",
    accent: "from-violet-300 to-fuchsia-400",
  },
  {
    title: "Process Window Lesson",
    description:
      "Understand how to define practical high and low process limits before production variation reaches quality risk.",
    href: "/lessons/process-window",
    accent: "from-fuchsia-300 to-cyan-400",
  },
  {
    title: "Clamp Tonnage Calculator",
    description:
      "Estimate required clamp force from projected area and pressure assumptions during setup review.",
    href: "/calculators/clamp-tonnage",
    accent: "from-amber-300 to-orange-400",
  },
  {
    title: "Shot Size Calculator",
    description:
      "Check shot utilization against barrel capacity so setup teams can catch risky machine matches early.",
    href: "/calculators/shot-size",
    accent: "from-orange-300 to-amber-400",
  },
  {
    title: "Cycle Time Calculator",
    description:
      "Add fill, pack, cooling, recovery, mold movement, and handling time to estimate cycle and output rate.",
    href: "/calculators/cycle-time",
    accent: "from-amber-300 to-cyan-400",
  },

];

const categoryOrder = [
  "Troubleshoot a Problem",
  "Run Production",
  "Check Quality",
  "Train Employees",
  "Manage Materials",
  "Reports & Management",
];

const categoryDetails: Record<string, { icon: string; helper: string; cta: string; accent: string }> = {
  "Troubleshoot a Problem": {
    icon: "🔎",
    helper: "Fix defects, machine issues, scrap, and process problems fast.",
    cta: "Start troubleshooting",
    accent: "from-cyan-300 to-blue-400",
  },
  "Run Production": {
    icon: "🏭",
    helper: "Set up jobs, run the floor, track downtime, and hand off the shift.",
    cta: "Run the floor",
    accent: "from-emerald-300 to-cyan-400",
  },
  "Check Quality": {
    icon: "✅",
    helper: "Approve first pieces, hold suspect parts, and close quality actions.",
    cta: "Check parts",
    accent: "from-teal-300 to-emerald-400",
  },
  "Train Employees": {
    icon: "🎓",
    helper: "Assign training, build skills, and print certificates.",
    cta: "Open training",
    accent: "from-violet-300 to-cyan-400",
  },
  "Manage Materials": {
    icon: "🧪",
    helper: "Dry resin, track lots, control inventory, and manage changes.",
    cta: "Check materials",
    accent: "from-amber-300 to-emerald-400",
  },
  "Reports & Management": {
    icon: "📊",
    helper: "Review reports, actions, documents, meetings, people, molds, and machines.",
    cta: "Review reports",
    accent: "from-fuchsia-300 to-cyan-400",
  },
};

const categoryQuickLinks: Record<string, string> = {
  "Troubleshoot a Problem": "/troubleshooting",
  "Run Production": "/production/live-board",
  "Check Quality": "/quality/first-piece-approval",
  "Train Employees": "/training/assignments",
  "Manage Materials": "/materials/resin-drying",
  "Reports & Management": "/reports/daily",
};

function getToolCategory(card: DashboardCard) {
  const href = card.href ?? "";
  const title = card.title.toLowerCase();

  if (
    ["/coach", "/troubleshooting", "/defects", "/photo-analysis", "/scrap", "/downtime"].includes(href) ||
    href === "/materials/troubleshooter" ||
    title.includes("troubleshoot") ||
    title.includes("defect")
  ) {
    return "Troubleshoot a Problem";
  }

  if (
    href.startsWith("/production") ||
    ["/startup-approval", "/mold-change", "/shift-handoff", "/process-sheet-builder", "/process-sheets/approval", "/work-instructions", "/process-change-log", "/oee", "/calculators", "/scientific-molding/studies"].includes(href) ||
    href.startsWith("/calculators")
  ) {
    return "Run Production";
  }

  if (href.startsWith("/quality")) return "Check Quality";
  if (href.startsWith("/training") || href.startsWith("/lessons") || href.startsWith("/certifications") || href.startsWith("/employees")) return "Train Employees";
  if (href.startsWith("/materials")) return "Manage Materials";

  return "Reports & Management";
}

function toolCardClass(extra = "") {
  return `group relative flex min-h-24 flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-left shadow-xl shadow-slate-950/25 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/[0.11] focus-within:ring-4 focus-within:ring-cyan-300/20 ${extra}`;
}

function SimpleToolCard({
  card,
  compact = false,
  isFavorite,
  onToggleFavorite,
}: {
  card: DashboardCard;
  compact?: boolean;
  isFavorite: boolean;
  onToggleFavorite: (card: DashboardCard) => void;
}) {
  const category = getToolCategory(card);
  const favoriteLabel = isFavorite ? `Remove ${card.title} from favorites` : `Save ${card.title} to favorites`;
  const content = (
    <>
      <div className="min-w-0 pr-14">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-cyan-200/80">
          {categoryDetails[category].icon} {category}
        </p>
        <h3 className={`${compact ? "mt-1 text-base" : "mt-2 text-lg"} font-black leading-tight text-white`}>{card.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-300">{card.description}</p>
      </div>
      <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-cyan-100" aria-hidden="true">→</span>
    </>
  );

  return (
    <article className={toolCardClass(compact ? "min-h-20" : "")}>
      <button
        type="button"
        aria-pressed={isFavorite}
        aria-label={favoriteLabel}
        onClick={() => onToggleFavorite(card)}
        className={`absolute right-3 top-3 z-10 rounded-full border px-3 py-2 text-base font-black shadow-lg transition focus:outline-none focus:ring-4 focus:ring-cyan-300/30 ${
          isFavorite
            ? "border-amber-200/70 bg-amber-300 text-slate-950 hover:bg-amber-200"
            : "border-white/10 bg-slate-950/80 text-slate-300 hover:border-amber-200/70 hover:text-amber-200"
        }`}
      >
        <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
      </button>
      {card.href ? (
        <Link href={card.href} className="absolute inset-0 rounded-3xl focus:outline-none" aria-label={`Open ${card.title}`} />
      ) : null}
      <div className="pointer-events-none">{content}</div>
    </article>
  );
}

function ToolList({
  cards,
  label,
  compact = false,
  favoriteIds,
  onToggleFavorite,
}: {
  cards: DashboardCard[];
  label: string;
  compact?: boolean;
  favoriteIds: string[];
  onToggleFavorite: (card: DashboardCard) => void;
}) {
  const favoriteSet = new Set(favoriteIds);

  return (
    <section aria-label={label} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <SimpleToolCard
          key={`${label}-${card.title}`}
          card={card}
          compact={compact}
          isFavorite={favoriteSet.has(getToolId(card))}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
}

const recentHrefs = new Set(["/shift-handoff", "/process-sheet-builder", "/mold-change", "/quality/containment", "/materials/drying-log", "/training/assignments"]);
const mostUsedHrefs = new Set(["/process-sheet-builder", "/production/live-board", "/scrap", "/oee", "/materials/resin-drying", "/calculators"]);

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  useEffect(() => {
    try {
      const savedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavoriteIds(parsedFavorites.filter((item): item is string => typeof item === "string"));
        }
      }
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  const updateFavoriteIds = (updater: (currentIds: string[]) => string[]) => {
    setFavoriteIds((currentIds) => {
      const nextIds = updater(currentIds);
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextIds));
      return nextIds;
    });
  };

  const toggleFavorite = (card: DashboardCard) => {
    const toolId = getToolId(card);
    updateFavoriteIds((currentIds) =>
      currentIds.includes(toolId) ? currentIds.filter((id) => id !== toolId) : [...currentIds, toolId],
    );
  };
  const visibleCards = useMemo(() => {
    if (!normalizedSearch) return dashboardCards;

    return dashboardCards.filter((card) =>
      [card.title, card.description, card.href ?? "", getToolCategory(card)]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [normalizedSearch]);

  const favorites = visibleCards.filter((card) => favoriteIds.includes(getToolId(card)));
  const recentTools = visibleCards.filter((card) => card.href && recentHrefs.has(card.href));
  const mostUsedTools = visibleCards.filter((card) => card.href && mostUsedHrefs.has(card.href));
  const categories = categoryOrder.map((category) => ({
    name: category,
    tools: visibleCards.filter((card) => getToolCategory(card) === category),
  }));

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.24),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_34%)]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300 sm:text-sm">Shop-floor home</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">Find the right molding tool fast.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Simple buttons for technicians and supervisors. Search by defect, job, material, training, report, or tool name.
            </p>
            <label className="mt-7 block max-w-4xl">
              <span className="mb-2 block text-sm font-bold text-slate-200">What do you need help with?</span>
              <input
                className="w-full rounded-3xl border border-cyan-300/40 bg-slate-950/85 px-5 py-5 text-lg font-semibold text-white shadow-inner shadow-slate-950 placeholder:text-slate-400 focus:border-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
                placeholder="What do you need help with?"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
          </div>
        </header>

        <section aria-label="Main tool categories" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const details = categoryDetails[category.name];
            return (
              <Link key={category.name} href={categoryQuickLinks[category.name]} className="group rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/25 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/[0.11] focus:outline-none focus:ring-4 focus:ring-cyan-300/20">
                <div className={`mb-5 h-1.5 w-24 rounded-full bg-gradient-to-r ${details.accent}`} />
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-3xl" aria-hidden="true">{details.icon}</span>
                  <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm font-black text-cyan-100">{category.tools.length} tools</span>
                </div>
                <h2 className="mt-5 text-2xl font-black tracking-tight text-white">{category.name}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{details.helper}</p>
                <p className="mt-5 flex items-center justify-between text-sm font-black text-cyan-100"><span>{details.cta}</span><span aria-hidden="true">→</span></p>
              </Link>
            );
          })}
        </section>

        {normalizedSearch && visibleCards.length === 0 ? (
          <section className="rounded-[1.5rem] border border-amber-300/30 bg-amber-300/10 p-6 text-center text-amber-50">
            No tools match “{searchTerm}”. Try words like short shot, schedule, first piece, resin, or training.
          </section>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="xl:col-span-2">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">Favorites</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Quick picks for the floor</h2>
            <div className="mt-3">{favorites.length > 0 ? <ToolList cards={favorites} label="Favorite tools" favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} /> : <p className="rounded-3xl border border-dashed border-white/15 bg-white/[0.05] p-5 text-sm leading-6 text-slate-300">Tap the star on any tool card to save it here for quick access on this device.</p>}</div>
          </section>
          <section>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Recent tools</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Last used</h2>
            <div className="mt-3"><ToolList cards={recentTools} label="Recent tools" compact favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} /></div>
          </section>
        </div>

        <section>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Most used tools</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Common daily tasks</h2>
          <div className="mt-3"><ToolList cards={mostUsedTools} label="Most used tools" favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} /></div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">All tools</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Browse by simple job type</h2>
            </div>
            <p className="text-sm text-slate-400">Search filters this list without removing any routes.</p>
          </div>
          <div className="mt-5 grid gap-5">
            {categories.map((category) => (
              <section key={category.name} className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-black text-white"><span aria-hidden="true">{categoryDetails[category.name].icon}</span> {category.name}</h3>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-slate-300">{category.tools.length}</span>
                </div>
                {category.tools.length > 0 ? <ToolList cards={category.tools} label={`${category.name} tools`} compact favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} /> : <p className="text-sm text-slate-400">No matching tools in this category.</p>}
              </section>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
