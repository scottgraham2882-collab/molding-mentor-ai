"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DashboardCard = {
  title: string;
  description: string;
  href?: string;
  status?: "Coming Soon";
  accent: string;
  keywords?: string[];
  beginnerTitle?: string;
  beginnerExplanation?: string;
};

type ShopRole = "Operator" | "Process Technician" | "Supervisor" | "Manager";

type RoleToolPick = {
  label: string;
  href: string;
};

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
    beginnerTitle: "Ask Molding Coach",
    beginnerExplanation: "Ask a plain-language question and get next steps.",
    description:
      "Chat through a molding problem to get targeted questions, likely root causes, corrective actions, and links to lessons and defect guides.",
    href: "/coach",
    accent: "from-cyan-300 to-emerald-400",
  },

  {
    title: "Defect Photo Analysis",
    beginnerTitle: "Defect Photo Analysis",
    beginnerExplanation: "Upload a part photo when you are not sure what defect you see.",
    description:
      "Upload a molded part photo, select material and defect category, then get an AI-style likely defect review with troubleshooting and lesson links.",
    href: "/photo-analysis",
    accent: "from-sky-300 to-cyan-400",
  },
  {
    title: "Defect Library",
    beginnerTitle: "Defect Library",
    beginnerExplanation: "Compare common defects, causes, and safe fixes.",
    description:
      "Review common injection molding defects, likely root causes, and corrective actions before changing the process.",
    href: "/defects",
    accent: "from-cyan-300 to-sky-400",
  },
  {
    title: "Troubleshooting Assistant",
    beginnerTitle: "Troubleshooting Wizard",
    beginnerExplanation: "Answer guided questions to find a good first fix.",
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

const categoryKeywords: Record<string, string[]> = {
  "Troubleshoot a Problem": ["troubleshooting", "fix", "defect", "scrap", "short shot", "flash", "sink", "warp", "machine alarm", "root cause"],
  "Run Production": ["production", "run", "setup", "startup", "mold change", "handoff", "schedule", "process sheet", "downtime", "oee"],
  "Check Quality": ["quality", "first piece", "first article", "inspection", "hold", "containment", "audit", "capa", "corrective action"],
  "Train Employees": ["training", "employee", "operator", "technician", "supervisor", "skills", "certification", "lesson", "quiz", "safety"],
  "Manage Materials": ["material", "resin", "drying", "dryer", "lot", "inventory", "color change", "purge", "moisture", "supplier"],
  "Reports & Management": ["report", "management", "daily", "weekly", "kpi", "meeting", "document", "action item", "mold history", "machine history"],
};

const toolKeywordMap: Record<string, string[]> = {
  "/coach": ["ask ai", "help", "problem", "process help", "root cause"],
  "/troubleshooting": ["guided help", "process issue", "machine issue", "fix problem"],
  "/defects": ["defect guide", "short shot", "flash", "sink", "burn", "warp", "splay"],
  "/photo-analysis": ["photo", "picture", "part defect", "visual check"],
  "/scrap": ["rejects", "bad parts", "scrap count", "defect scrap"],
  "/process-sheet-builder": ["setup sheet", "setup parameters", "recipe", "print setup"],
  "/production/live-board": ["press status", "machines running", "floor board", "live board"],
  "/quality/first-piece-approval": ["first piece", "startup check", "good part", "approval"],
  "/quality/containment": ["quality hold", "suspect parts", "quarantine", "sort"],
  "/materials/resin-drying": ["resin drying", "dry temperature", "dry time", "material guide"],
  "/materials/drying-log": ["dryer log", "dew point", "hopper", "moisture"],
  "/reports/daily": ["daily report", "shift report", "plant report", "production report"],
  "/reports/weekly": ["weekly report", "management review", "plant summary"],
  "/training/assignments": ["assign training", "due dates", "training status", "operator training"],
  "/training/skills-matrix": ["skills", "qualified", "cross training", "matrix"],
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


function getToolKeywords(card: DashboardCard) {
  const category = getToolCategory(card);
  return [
    card.title,
    card.description,
    card.href ?? "",
    category,
    ...(categoryKeywords[category] ?? []),
    ...(card.href ? toolKeywordMap[card.href] ?? [] : []),
    ...(card.keywords ?? []),
  ];
}

function matchesToolSearch(card: DashboardCard, search: string) {
  if (!search) return true;
  const haystack = getToolKeywords(card).join(" ").toLowerCase();
  return search
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

function toolButtonClass(extra = "") {
  return `group flex min-h-24 items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-left shadow-xl shadow-slate-950/25 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/[0.11] focus:outline-none focus:ring-4 focus:ring-cyan-300/20 ${extra}`;
}

function SimpleToolCard({
  card,
  titleOverride,
  compact = false,
  isFavorite = false,
  beginnerMode = false,
  isBeginnerStart = false,
  onToggleFavorite,
  onOpenTool,
}: {
  card: DashboardCard;
  titleOverride?: string;
  compact?: boolean;
  isFavorite?: boolean;
  beginnerMode?: boolean;
  isBeginnerStart?: boolean;
  onToggleFavorite?: (href: string) => void;
  onOpenTool?: (href: string) => void;
}) {
  const displayTitle = titleOverride ?? (beginnerMode && card.beginnerTitle ? card.beginnerTitle : card.title);
  const category = getToolCategory(card);
  const favoriteLabel = isFavorite ? `Remove ${displayTitle} from favorites` : `Add ${displayTitle} to favorites`;
  const content = (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-cyan-200/80">
          {categoryDetails[category].icon} {category}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h3 className={`${compact ? "text-base" : "text-lg"} font-black leading-tight text-white`}>{displayTitle}</h3>
          {isBeginnerStart ? (
            <span className="rounded-full bg-amber-300 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-slate-950">Start here</span>
          ) : null}
        </div>
        {beginnerMode && card.beginnerExplanation ? (
          <p className="mt-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-semibold leading-5 text-cyan-50">{card.beginnerExplanation}</p>
        ) : null}
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-300">{card.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {card.href && onToggleFavorite ? (
          <button
            aria-label={favoriteLabel}
            aria-pressed={isFavorite}
            className={`rounded-full border px-3 py-2 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-cyan-300/20 ${
              isFavorite
                ? "border-amber-200/70 bg-amber-300/20 text-amber-100"
                : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-amber-200/60 hover:text-amber-100"
            }`}
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onToggleFavorite(card.href!);
            }}
          >
            ★
          </button>
        ) : null}
        <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-2 text-cyan-100" aria-hidden="true">→</span>
      </div>
    </>
  );

  if (card.href) {
    return (
      <Link
        href={card.href}
        className={toolButtonClass(`${compact ? "min-h-20" : ""} ${isBeginnerStart ? "border-amber-300/70 bg-amber-300/10 shadow-amber-950/30 ring-2 ring-amber-300/25" : ""}`)}
        onClick={() => onOpenTool?.(card.href!)}
      >
        {content}
      </Link>
    );
  }

  return <article className={toolButtonClass("opacity-75")}>{content}</article>;
}

function ToolList({
  cards,
  label,
  compact = false,
  favoriteHrefs,
  beginnerMode = false,
  beginnerStartHrefs = new Set<string>(),
  onToggleFavorite,
  onOpenTool,
}: {
  cards: DashboardCard[];
  label: string;
  compact?: boolean;
  favoriteHrefs: Set<string>;
  beginnerMode?: boolean;
  beginnerStartHrefs?: Set<string>;
  onToggleFavorite: (href: string) => void;
  onOpenTool: (href: string) => void;
}) {
  return (
    <section aria-label={label} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <SimpleToolCard
          key={`${label}-${card.title}`}
          card={card}
          compact={compact}
          isFavorite={Boolean(card.href && favoriteHrefs.has(card.href))}
          beginnerMode={beginnerMode}
          isBeginnerStart={Boolean(card.href && beginnerStartHrefs.has(card.href))}
          onToggleFavorite={onToggleFavorite}
          onOpenTool={onOpenTool}
        />
      ))}
    </section>
  );
}


function RoleToolList({
  picks,
  favoriteHrefs,
  beginnerMode,
  beginnerStartHrefs,
  onToggleFavorite,
  onOpenTool,
}: {
  picks: RoleToolPick[];
  favoriteHrefs: Set<string>;
  beginnerMode: boolean;
  beginnerStartHrefs: Set<string>;
  onToggleFavorite: (href: string) => void;
  onOpenTool: (href: string) => void;
}) {
  return (
    <section aria-label="Tools for selected role" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {picks.map((pick) => {
        const card = dashboardCards.find((dashboardCard) => dashboardCard.href === pick.href);

        if (!card) return null;

        return (
          <SimpleToolCard
            key={`${pick.label}-${pick.href}`}
            card={card}
            titleOverride={pick.label}
            isFavorite={favoriteHrefs.has(pick.href)}
            beginnerMode={beginnerMode}
            isBeginnerStart={beginnerStartHrefs.has(pick.href)}
            onToggleFavorite={onToggleFavorite}
            onOpenTool={onOpenTool}
          />
        );
      })}
    </section>
  );
}

const defaultFavoriteHrefs = ["/troubleshooting", "/coach", "/defects", "/production/live-board", "/quality/first-piece-approval", "/materials/resin-drying"];
const homepageFavoritesStorageKey = "moldingMentorHomepageFavorites";
const homepageRecentToolsStorageKey = "moldingMentorRecentTools";
const maxRecentTools = 5;
const validFavoriteHrefs = new Set(dashboardCards.flatMap((card) => (card.href ? [card.href] : [])));
const validToolHrefs = validFavoriteHrefs;
const mostUsedHrefs = new Set(["/process-sheet-builder", "/production/live-board", "/scrap", "/oee", "/materials/resin-drying", "/calculators"]);
const beginnerModeStorageKey = "moldingMentorBeginnerMode";
const beginnerStartHrefs = new Set(["/troubleshooting", "/photo-analysis", "/defects", "/coach"]);
const selectedRoleStorageKey = "moldingMentorSelectedRole";
const shopRoles: ShopRole[] = ["Operator", "Process Technician", "Supervisor", "Manager"];
const roleHelpers: Record<ShopRole, string> = {
  Operator: "Fast help for defects, instructions, and basic training.",
  "Process Technician": "Tools for troubleshooting, studies, calculations, and process changes.",
  Supervisor: "Shift tools for production, downtime, scrap, handoff, and training status.",
  Manager: "Reports, KPIs, action items, and customer issue follow-up.",
};
const roleToolPicks: Record<ShopRole, RoleToolPick[]> = {
  Operator: [
    { label: "Troubleshooting Wizard", href: "/troubleshooting" },
    { label: "Defect Photo Analysis", href: "/photo-analysis" },
    { label: "Work Instructions", href: "/work-instructions" },
    { label: "Training", href: "/training/operator-safety-startup" },
  ],
  "Process Technician": [
    { label: "Troubleshooting Assistant", href: "/troubleshooting" },
    { label: "Defect Library", href: "/defects" },
    { label: "Scientific Molding Studies", href: "/scientific-molding/studies" },
    { label: "Process Calculators", href: "/calculators" },
    { label: "Process Change Log", href: "/process-change-log" },
  ],
  Supervisor: [
    { label: "Live Production Board", href: "/production/live-board" },
    { label: "Shift Handoff", href: "/shift-handoff" },
    { label: "Downtime Tracker", href: "/downtime" },
    { label: "Scrap Tracker", href: "/scrap" },
    { label: "Training Compliance", href: "/training/compliance" },
  ],
  Manager: [
    { label: "KPI Dashboard", href: "/reports/kpi-dashboard" },
    { label: "Daily Report", href: "/reports/daily" },
    { label: "Weekly Report", href: "/reports/weekly" },
    { label: "Action Items", href: "/actions" },
    { label: "Customer Complaints", href: "/quality/customer-complaints" },
  ],
};


export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteTools, setFavoriteTools] = useState<string[]>(defaultFavoriteHrefs);
  const [recentToolHrefs, setRecentToolHrefs] = useState<string[]>([]);
  const [recentToolsHydrated, setRecentToolsHydrated] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ShopRole>("Operator");
  const favoriteHrefSet = useMemo(() => new Set(favoriteTools), [favoriteTools]);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  useEffect(() => {
    setBeginnerMode(window.localStorage.getItem(beginnerModeStorageKey) === "true");

    const savedRole = window.localStorage.getItem(selectedRoleStorageKey);
    if (savedRole && shopRoles.includes(savedRole as ShopRole)) {
      setSelectedRole(savedRole as ShopRole);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(beginnerModeStorageKey, String(beginnerMode));
  }, [beginnerMode]);

  useEffect(() => {
    window.localStorage.setItem(selectedRoleStorageKey, selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    const savedFavorites = window.localStorage.getItem(homepageFavoritesStorageKey);

    if (!savedFavorites) return;

    try {
      const parsedFavorites = JSON.parse(savedFavorites);

      if (Array.isArray(parsedFavorites)) {
        const validFavorites = parsedFavorites.filter((href): href is string =>
          typeof href === "string" && validFavoriteHrefs.has(href),
        );

        setFavoriteTools(Array.from(new Set(validFavorites)));
      }
    } catch {
      window.localStorage.removeItem(homepageFavoritesStorageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(homepageFavoritesStorageKey, JSON.stringify(favoriteTools));
  }, [favoriteTools]);

  useEffect(() => {
    const savedRecentTools = window.localStorage.getItem(homepageRecentToolsStorageKey);

    if (!savedRecentTools) {
      setRecentToolsHydrated(true);
      return;
    }

    try {
      const parsedRecentTools = JSON.parse(savedRecentTools);

      if (Array.isArray(parsedRecentTools)) {
        const validRecentTools = parsedRecentTools.filter((href): href is string =>
          typeof href === "string" && validToolHrefs.has(href),
        );

        setRecentToolHrefs(Array.from(new Set(validRecentTools)).slice(0, maxRecentTools));
      }
    } catch {
      window.localStorage.removeItem(homepageRecentToolsStorageKey);
    } finally {
      setRecentToolsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!recentToolsHydrated) return;

    window.localStorage.setItem(homepageRecentToolsStorageKey, JSON.stringify(recentToolHrefs));
  }, [recentToolHrefs, recentToolsHydrated]);

  const toggleFavorite = (href: string) => {
    setFavoriteTools((currentFavorites) => {
      if (currentFavorites.includes(href)) {
        return currentFavorites.filter((favoriteHref) => favoriteHref !== href);
      }

      return [...currentFavorites, href];
    });
  };

  const trackRecentTool = (href: string) => {
    if (!validToolHrefs.has(href)) return;

    setRecentToolHrefs((currentRecentTools) => [
      href,
      ...currentRecentTools.filter((recentHref) => recentHref !== href),
    ].slice(0, maxRecentTools));
  };

  const clearRecentTools = () => {
    setRecentToolHrefs([]);
  };
  const visibleCards = useMemo(() => {
    if (!normalizedSearch) return dashboardCards;

    return dashboardCards.filter((card) => matchesToolSearch(card, normalizedSearch));
  }, [normalizedSearch]);

  const favorites = dashboardCards.filter((card) => card.href && favoriteHrefSet.has(card.href));
  const recentTools = recentToolHrefs
    .map((href) => dashboardCards.find((card) => card.href === href))
    .filter((card): card is DashboardCard => Boolean(card));
  const mostUsedTools = visibleCards.filter((card) => card.href && mostUsedHrefs.has(card.href));
  const beginnerStartTools = dashboardCards.filter((card) => card.href && beginnerStartHrefs.has(card.href));
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
            <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/55 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-white">Beginner Mode</p>
                <p className="mt-1 text-sm leading-5 text-slate-300">Turn on simpler tool names, short explanations, and suggested starting points.</p>
              </div>
              <button
                aria-pressed={beginnerMode}
                className={`flex w-full items-center justify-between rounded-full border px-4 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-cyan-300/20 sm:w-48 ${
                  beginnerMode
                    ? "border-emerald-200/70 bg-emerald-300 text-slate-950"
                    : "border-white/10 bg-slate-900 text-slate-200 hover:border-cyan-300/50"
                }`}
                type="button"
                onClick={() => setBeginnerMode((current) => !current)}
              >
                <span>{beginnerMode ? "Beginner On" : "Beginner Off"}</span>
                <span className={`h-6 w-11 rounded-full p-1 transition ${beginnerMode ? "bg-slate-950/25" : "bg-slate-950"}`} aria-hidden="true">
                  <span className={`block h-4 w-4 rounded-full bg-white transition ${beginnerMode ? "translate-x-5" : "translate-x-0"}`} />
                </span>
              </button>
            </div>
            {beginnerMode ? (
              <p className="mt-4 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-bold leading-6 text-amber-50">
                Not sure what the defect is? Start with the Troubleshooting Wizard or upload a photo.
              </p>
            ) : null}
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

        <section className="rounded-[2rem] border border-emerald-300/20 bg-slate-900/75 p-4 shadow-2xl shadow-emerald-950/20 sm:p-6" aria-label="Role based tools">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">Role tools</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Pick your role</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Choose your job for the shift. We will show the best tools first and remember this choice on this device.
              </p>
            </div>
            <p className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm font-bold text-emerald-100">
              Showing: {selectedRole}
            </p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="list" aria-label="Select role">
            {shopRoles.map((role) => (
              <button
                key={role}
                aria-pressed={selectedRole === role}
                className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-emerald-300/20 ${
                  selectedRole === role
                    ? "border-emerald-200/80 bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-950/20"
                    : "border-white/10 bg-slate-950/55 text-slate-100 hover:border-emerald-300/50 hover:bg-white/[0.08]"
                }`}
                type="button"
                onClick={() => setSelectedRole(role)}
              >
                <span className="block text-base font-black">{role}</span>
                <span className={`mt-2 block text-sm leading-5 ${selectedRole === role ? "text-slate-800" : "text-slate-300"}`}>{roleHelpers[role]}</span>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <RoleToolList picks={roleToolPicks[selectedRole]} favoriteHrefs={favoriteHrefSet} beginnerMode={beginnerMode} beginnerStartHrefs={beginnerStartHrefs} onToggleFavorite={toggleFavorite} onOpenTool={trackRecentTool} />
          </div>
        </section>

        {normalizedSearch ? (
          <section className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/70 p-4 sm:p-6" aria-live="polite">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Search results</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Matching tool cards</h2>
              </div>
              <p className="text-sm text-slate-400">{visibleCards.length} tools found for “{searchTerm}”</p>
            </div>
            <div className="mt-4">
              {visibleCards.length > 0 ? (
                <ToolList cards={visibleCards} label="Matching search tools" favoriteHrefs={favoriteHrefSet} beginnerMode={beginnerMode} beginnerStartHrefs={beginnerStartHrefs} onToggleFavorite={toggleFavorite} onOpenTool={trackRecentTool} />
              ) : (
                <p className="rounded-[1.5rem] border border-amber-300/30 bg-amber-300/10 p-6 text-center text-amber-50">
                  No tools found. Try searching troubleshooting, training, quality, material, or reports.
                </p>
              )}
            </div>
          </section>
        ) : null}

        {beginnerMode ? (
          <section className="rounded-[2rem] border border-amber-300/30 bg-gradient-to-br from-amber-300/15 via-slate-900/80 to-cyan-300/10 p-4 shadow-2xl shadow-amber-950/20 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-200">Start Here</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Best tools when you are new or unsure</h2>
            <p className="mt-2 text-sm leading-6 text-amber-50/90">Not sure what the defect is? Start with the Troubleshooting Wizard or upload a photo.</p>
            <div className="mt-4">
              <ToolList cards={beginnerStartTools} label="Beginner start tools" favoriteHrefs={favoriteHrefSet} beginnerMode={beginnerMode} beginnerStartHrefs={beginnerStartHrefs} onToggleFavorite={toggleFavorite} onOpenTool={trackRecentTool} />
            </div>
          </section>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="xl:col-span-2">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">Favorites</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Quick picks for the floor</h2>
            <div className="mt-3">
              {favorites.length > 0 ? (
                <ToolList cards={favorites} label="Favorite tools" favoriteHrefs={favoriteHrefSet} beginnerMode={beginnerMode} beginnerStartHrefs={beginnerStartHrefs} onToggleFavorite={toggleFavorite} onOpenTool={trackRecentTool} />
              ) : (
                <p className="rounded-[1.5rem] border border-dashed border-emerald-300/30 bg-emerald-300/10 p-6 text-sm leading-6 text-emerald-50">
                  No favorites saved yet. Tap the star on any tool card to keep it here on this device.
                </p>
              )}
            </div>
          </section>
          <section>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Recent tools</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Last used</h2>
            <div className="mt-3">
              {recentTools.length > 0 ? (
                <div className="grid gap-3">
                  <ToolList cards={recentTools} label="Recent tools" compact favoriteHrefs={favoriteHrefSet} beginnerMode={beginnerMode} beginnerStartHrefs={beginnerStartHrefs} onToggleFavorite={toggleFavorite} onOpenTool={trackRecentTool} />
                  <button
                    className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-black text-slate-200 transition hover:border-rose-300/50 hover:text-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-300/20"
                    type="button"
                    onClick={clearRecentTools}
                  >
                    Clear recent tools
                  </button>
                </div>
              ) : (
                <p className="rounded-[1.5rem] border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-sm leading-6 text-cyan-50">
                  Open any tool card and your 5 most recent tools will appear here on this device.
                </p>
              )}
            </div>
          </section>
        </div>

        <section>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Most used tools</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Common daily tasks</h2>
          <div className="mt-3"><ToolList cards={mostUsedTools} label="Most used tools" favoriteHrefs={favoriteHrefSet} beginnerMode={beginnerMode} beginnerStartHrefs={beginnerStartHrefs} onToggleFavorite={toggleFavorite} onOpenTool={trackRecentTool} /></div>
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
                {category.tools.length > 0 ? <ToolList cards={category.tools} label={`${category.name} tools`} compact favoriteHrefs={favoriteHrefSet} beginnerMode={beginnerMode} beginnerStartHrefs={beginnerStartHrefs} onToggleFavorite={toggleFavorite} onOpenTool={trackRecentTool} /> : <p className="text-sm text-slate-400">No matching tools in this category.</p>}
              </section>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
