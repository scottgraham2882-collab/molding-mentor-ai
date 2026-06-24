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
  plainSubtitle?: string;
};

type ShopRole = "Operator" | "Process Technician" | "Supervisor" | "Manager";

type RoleToolPick = {
  label: string;
  href: string;
};

type QuickAction = {
  label: string;
  helper: string;
  href: string;
  icon: string;
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
    title: "I'm Having a Problem",
    description:
      "Pick the visible part problem and get plain-language first checks, what not to change first, and safe next steps.",
    href: "/problem",
    accent: "from-rose-300 to-cyan-400",
    beginnerTitle: "I'm Having a Problem",
    beginnerExplanation: "Start here when a molded part looks wrong and you need a safe first step.",
  },
  {
    title: "Process Sheet Builder",
    description:
      "Build or update the approved setup sheet so each shift starts from the same settings.",
    href: "/process-sheet-builder",
    accent: "from-lime-300 to-cyan-400",
  },
  {
    title: "Electronic Process Sheet Approval",
    description:
      "Review and approve process sheet changes before a setup is used again.",
    href: "/process-sheets/approval",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Work Instruction Builder",
    description:
      "Write simple step-by-step work instructions with safety, tools, and quality checks.",
    href: "/work-instructions",
    accent: "from-emerald-300 to-cyan-400",
  },

  {
    title: "Process Change Log",
    plainSubtitle: "Record what setting was changed",
    description:
      "Record what setting changed, why it changed, and whether the part improved.",
    href: "/process-change-log",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Action Item Tracker",
    description:
      "Track who owns each follow-up, when it is due, and whether it is done.",
    href: "/actions",
    accent: "from-amber-300 to-cyan-400",
  },
  {
    title: "Document Control System",
    description:
      "Keep work instructions, forms, and controlled documents organized by owner and revision.",
    href: "/documents",
    accent: "from-cyan-300 to-amber-400",
  },
  {
    title: "Mold History Database",
    description:
      "Look up mold notes, repairs, and known issues before starting or troubleshooting a job.",
    href: "/molds",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Mold Preventive Maintenance Scheduler",
    description:
      "Plan mold maintenance before wear, damage, or missed cleaning causes production trouble.",
    href: "/molds/pm-scheduler",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Machine History Database",
    description:
      "Look up machine repairs and known problems before blaming the mold or material.",
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
    plainSubtitle: "Tell the next shift what happened",
    description:
      "Record machine status, open issues, process changes, quality holds, downtime notes, and instructions for the next shift.",
    href: "/shift-handoff",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Production Schedule Board",
    description:
      "See what should be running, what actually ran, and which jobs need attention.",
    href: "/production/schedule",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Real-Time Production Board",
    description:
      "See each press status, open issue, next action, good parts, scrap, and downtime.",
    href: "/production/live-board",
    accent: "from-cyan-300 to-blue-400",
  },
  {
    title: "Production Run Log",
    description:
      "Record what happened during a run: time, good parts, scrap, and notes.",
    href: "/production/run-log",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Production Job Traveler",
    description:
      "Follow the job from material check through final quality approval.",
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
      "Understand how much planned production time made good parts at the expected pace.",
    href: "/oee",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Downtime Tracker",
    plainSubtitle: "Log why the machine stopped",
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
    plainSubtitle: "Track bad parts",
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
    plainSubtitle: "Upload a picture of a bad part",
    beginnerTitle: "Defect Photo Analysis",
    beginnerExplanation: "Upload a part photo when you are not sure what defect you see.",
    description:
      "Upload a molded part photo, select material and defect category, then get an AI-style likely defect review with troubleshooting and lesson links.",
    href: "/photo-analysis",
    accent: "from-sky-300 to-cyan-400",
  },
  {
    title: "Defect Library",
    plainSubtitle: "Look up what a defect means",
    beginnerTitle: "Defect Library",
    beginnerExplanation: "Compare common defects, causes, and safe fixes.",
    description:
      "Review common injection molding defects, likely root causes, and corrective actions before changing the process.",
    href: "/defects",
    accent: "from-cyan-300 to-sky-400",
  },
  {
    title: "Troubleshooting Wizard",
    plainSubtitle: "Fix a molding problem",
    beginnerTitle: "Troubleshooting Wizard",
    beginnerExplanation: "Answer guided questions to find a good first fix.",
    description:
      "Use a guided workflow to collect evidence, isolate process variables, and validate the next corrective step.",
    href: "/troubleshooting",
    accent: "from-emerald-300 to-teal-400",
  },
  {
    title: "What Changed? Root Cause Helper",
    plainSubtitle: "Find what changed before bad parts started",
    beginnerTitle: "What Changed? Helper",
    beginnerExplanation: "Answer simple change questions before adjusting the press.",
    description:
      "Walk through material, color, mold, machine, settings, shift, and maintenance changes to identify likely root-cause areas and safe first checks.",
    href: "/root-cause/what-changed",
    accent: "from-amber-300 to-cyan-400",
    keywords: ["what changed", "root cause", "last good part", "sudden defect", "slow defect", "material change", "mold change", "process settings"],
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
    plainSubtitle: "See who needs training",
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
      "Keep one clear record of an employee’s completed training, quiz results, and sign-offs.",
    href: "/employees/training-record",
    accent: "from-cyan-300 to-emerald-400",
  },
  {
    title: "Employee Performance Coaching Log",
    description:
      "Record coaching conversations, expectations, follow-up dates, and closure notes.",
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
    title: "Guided Learning Paths",
    plainSubtitle: "Learn injection molding step by step",
    description:
      "Follow beginner-friendly role paths for operators, setup technicians, process technicians, and supervisors with saved progress and next lesson guidance.",
    href: "/learning-paths",
    accent: "from-cyan-300 to-emerald-400",
    beginnerTitle: "Guided Learning Paths",
    beginnerExplanation: "Start here to learn injection molding in a simple order for your role.",
    keywords: ["learning paths", "injection molding basics", "operator path", "setup technician", "process technician", "supervisor path"],
  },
  {
    title: "Real Shop-Floor Scenarios",
    plainSubtitle: "Practice troubleshooting real molding problems",
    description:
      "Work through beginner-friendly scenarios for flash, short shots, splay, warpage, burn marks, and voids with revealable answers, explanations, and links to the Defect Library, AI Coach, and Troubleshooting Wizard.",
    href: "/scenarios",
    accent: "from-amber-300 to-cyan-400",
    beginnerTitle: "Real Shop-Floor Scenarios",
    beginnerExplanation: "Practice what to check first when a real defect shows up at the press.",
    keywords: ["shop-floor scenarios", "troubleshooting practice", "real molding problems", "defect examples", "what changed", "beginner troubleshooting"],
  },
  {
    title: "Process Calculators",
    description:
      "Use simple calculators for clamp force, shot size, cycle time, and recovery checks.",
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
    title: "Knowledge Vault",
    plainSubtitle: "Capture simple lessons from the production floor",
    description:
      "Save problem, root cause, fix, prevention, and submitted-by notes so teams can learn, troubleshoot, preserve knowledge, and collaborate.",
    href: "/knowledge-vault",
    accent: "from-emerald-300 to-cyan-400",
    keywords: ["knowledge vault", "lessons learned", "production floor", "root cause", "fix", "prevention", "submitted by"],
  },

  {
    title: "Knowledge Search",
    plainSubtitle: "Find answers across defects, lessons, materials, and molding tools",
    description:
      "Search defect names, plain-English symptoms, material names, mold numbers, machine numbers, part numbers, troubleshooting keywords, lessons, and scientific molding topics.",
    href: "/knowledge-search",
    accent: "from-cyan-300 to-blue-400",
    keywords: ["knowledge search", "search", "defects", "troubleshooting", "materials", "scientific molding", "mold number", "machine number", "part number"],
  },
  {
    title: "Lessons Learned Knowledge Base",
    plainSubtitle: "Save fixes so the next technician learns faster",
    description:
      "Create, save, search, edit, delete, relate, and print lessons learned with root cause, solution, results, tags, and new-technician teaching notes.",
    href: "/knowledge-base",
    accent: "from-cyan-300 to-emerald-400",
    keywords: ["lessons learned", "knowledge base", "root cause", "teach technician", "tribal knowledge"],
  },

  {
    title: "Mentor Notes",
    plainSubtitle: "Leave simple teaching notes for newer employees",
    description:
      "Create, save, search, filter, edit, and delete mentor notes with topic, defect, machine, mold, tags, lessons learned, new-technician advice, and common mistakes to avoid.",
    href: "/mentor-notes",
    accent: "from-emerald-300 to-cyan-400",
    beginnerTitle: "Mentor Notes",
    beginnerExplanation: "Read practical advice from experienced techs and supervisors before making changes.",
    keywords: ["mentor notes", "teaching notes", "new technician", "supervisor notes", "tribal knowledge", "training"],
  },
  {
    title: "Case Studies Library",
    plainSubtitle: "Preserve real troubleshooting experiences",
    description:
      "Create, save, search, filter, edit, and delete real injection molding case studies with investigation steps, root cause, solution, results, lessons learned, and new-technician teaching notes.",
    href: "/case-studies",
    accent: "from-emerald-300 to-cyan-400",
    beginnerTitle: "Case Studies Library",
    beginnerExplanation: "Read and save real shop-floor troubleshooting stories so new technicians learn what was checked and why.",
    keywords: ["case studies", "troubleshooting stories", "root cause", "lessons learned", "teach technician", "defect history"],
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
  "Fix a Problem",
  "Learn Molding",
  "Search Knowledge",
  "More Tools",
];

const categoryDetails: Record<string, { icon: string; helper: string; cta: string; accent: string }> = {
  "Fix a Problem": {
    icon: "🆘",
    helper: "Start here when parts look wrong, scrap goes up, or you are not sure what changed.",
    cta: "Fix a problem",
    accent: "from-cyan-300 to-blue-400",
  },
  "Learn Molding": {
    icon: "🎓",
    helper: "Learn molding basics, practice real scenarios, and build stronger process thinking.",
    cta: "Start learning",
    accent: "from-violet-300 to-cyan-400",
  },
  "Search Knowledge": {
    icon: "🔍",
    helper: "Search answers, real case studies, and saved lessons learned before changing settings.",
    cta: "Search knowledge",
    accent: "from-emerald-300 to-cyan-400",
  },
  "More Tools": {
    icon: "🧰",
    helper: "Advanced production, quality, materials, training, reporting, and future expansion tools.",
    cta: "Browse more tools",
    accent: "from-amber-300 to-cyan-400",
  },
};

const categoryQuickLinks: Record<string, string> = {
  "Fix a Problem": "/problem",
  "Learn Molding": "/learning-paths",
  "Search Knowledge": "/knowledge-search",
  "More Tools": "/dashboard",
};

const categoryKeywords: Record<string, string[]> = {
  "Fix a Problem": ["troubleshooting", "fix", "defect", "scrap", "short shot", "flash", "sink", "warp", "machine alarm", "root cause"],
  "Learn Molding": ["learn", "lesson", "scientific molding", "scenario", "training module", "basics", "process window"],
  "Search Knowledge": ["knowledge", "search", "lessons learned", "case study", "saved fixes", "tribal knowledge"],
  "More Tools": ["advanced", "production", "quality", "materials", "training", "reports", "calculators", "documents", "future tools"],
};

const toolKeywordMap: Record<string, string[]> = {
  "/coach": ["ask ai", "help", "problem", "process help", "root cause"],
  "/troubleshooting": ["guided help", "process issue", "machine issue", "fix problem"],
  "/root-cause/what-changed": ["what changed", "root cause", "last good parts", "sudden problem", "slow problem", "material change", "color change", "mold change", "machine change", "settings change", "maintenance"],
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
  "/learning-paths": ["guided learning", "role path", "operator path", "setup technician path", "process technician path", "supervisor path", "lessons complete"],
  "/scenarios": ["shop-floor scenarios", "troubleshooting practice", "real molding problems", "flash startup", "short shot material change", "splay color change", "warpage cycle time", "burn marks end of fill", "voids thick section"],
  "/knowledge-search": ["knowledge search", "search all", "defects", "troubleshooting", "materials", "scientific molding", "mold number", "machine number", "part number", "plain english"],
  "/knowledge-base": ["lessons learned", "knowledge base", "root cause", "teach technician", "tribal knowledge", "saved fixes"],
  "/knowledge-vault": ["knowledge vault", "production floor", "problem", "root cause", "fix", "prevention", "submitted by", "lessons learned", "collaborate"],
  "/mentor-notes": ["mentor notes", "teaching notes", "new technician", "supervisor notes", "topic", "defect", "machine", "mold", "tag", "tribal knowledge"],
  "/training/skills-matrix": ["skills", "qualified", "cross training", "matrix"],
};

function getToolCategory(card: DashboardCard) {
  const href = card.href ?? "";
  const title = card.title.toLowerCase();

  if (
    ["/problem", "/troubleshooting", "/coach", "/photo-analysis", "/defects"].includes(href) ||
    title.includes("troubleshoot") ||
    title.includes("defect")
  ) {
    return "Fix a Problem";
  }

  if (
    href === "/learning-paths" ||
    href === "/lessons" ||
    href.startsWith("/lessons") ||
    href === "/scientific-molding/studies" ||
    href === "/scenarios"
  ) {
    return "Learn Molding";
  }

  if (href === "/knowledge-search" || href === "/case-studies" || href === "/knowledge-base" || href === "/knowledge-vault") {
    return "Search Knowledge";
  }

  return "More Tools";
}

function getToolKeywords(card: DashboardCard) {
  const category = getToolCategory(card);
  return [
    card.title,
    card.description,
    card.plainSubtitle ?? "",
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
            <span className="rounded-full bg-amber-300 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-slate-950">Best place to start</span>
          ) : null}
        </div>
        {card.plainSubtitle ? (
          <p className="mt-1 text-sm font-black leading-5 text-emerald-100 sm:text-[0.95rem]">{card.plainSubtitle}</p>
        ) : null}
        {beginnerMode && card.beginnerExplanation ? (
          <p className="mt-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-semibold leading-5 text-cyan-50">{card.beginnerExplanation}</p>
        ) : null}
        <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">What is this?</p>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-300">{card.description}</p>
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


const importantToolHrefsByCategory: Record<string, Set<string>> = {
  "Fix a Problem": new Set(["/troubleshooting", "/coach", "/photo-analysis", "/defects"]),
  "Learn Molding": new Set(["/learning-paths", "/lessons", "/scientific-molding/studies", "/scenarios"]),
  "Search Knowledge": new Set(["/knowledge-search", "/case-studies", "/knowledge-base"]),
  "More Tools": new Set(["/process-sheet-builder", "/production/live-board", "/scrap", "/oee", "/materials/resin-drying", "/calculators"]),
};

function splitToolsByImportance(categoryName: string, tools: DashboardCard[]) {
  const importantHrefs = importantToolHrefsByCategory[categoryName] ?? new Set<string>();
  const importantTools = tools.filter((tool) => tool.href && importantHrefs.has(tool.href));
  const moreTools = tools.filter((tool) => !tool.href || !importantHrefs.has(tool.href));

  return {
    importantTools: importantTools.length > 0 ? importantTools : tools.slice(0, 4),
    moreTools: importantTools.length > 0 ? moreTools : tools.slice(4),
  };
}

const defaultFavoriteHrefs = ["/troubleshooting", "/coach", "/photo-analysis", "/defects", "/knowledge-search"];
const homepageFavoritesStorageKey = "moldingMentorHomepageFavorites";
const homepageRecentToolsStorageKey = "moldingMentorRecentTools";
const maxRecentTools = 5;
const validFavoriteHrefs = new Set(dashboardCards.flatMap((card) => (card.href ? [card.href] : [])));
const validToolHrefs = validFavoriteHrefs;
const mostUsedHrefs = new Set(["/troubleshooting", "/coach", "/photo-analysis", "/defects", "/learning-paths", "/knowledge-search"]);
const beginnerModeStorageKey = "moldingMentorBeginnerMode";
const beginnerStartHrefs = new Set(["/problem", "/troubleshooting", "/photo-analysis", "/defects", "/coach"]);
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
    { label: "Troubleshooting Wizard", href: "/troubleshooting" },
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

const quickActions: QuickAction[] = [
  {
    label: "I'm Having a Problem",
    helper: "Pick what you see and get safe first steps.",
    href: "/problem",
    icon: "🆘",
  },
  {
    label: "Open Defect Library",
    helper: "Compare common defects and first checks.",
    href: "/defects",
    icon: "🚨",
  },
  {
    label: "Upload Part Photo",
    helper: "Use a part picture for defect help.",
    href: "/photo-analysis",
    icon: "📷",
  },
  {
    label: "Start Shift Handoff",
    helper: "Tell the next shift what changed.",
    href: "/shift-handoff",
    icon: "🤝",
  },
  {
    label: "Log Downtime",
    helper: "Record why the press stopped.",
    href: "/downtime",
    icon: "⏱️",
  },
  {
    label: "Log Scrap",
    helper: "Count bad parts and reasons.",
    href: "/scrap",
    icon: "🧾",
  },
  {
    label: "Open Troubleshooting Wizard",
    helper: "Answer questions and get next steps.",
    href: "/troubleshooting",
    icon: "🧭",
  },
  {
    label: "View Production Board",
    helper: "See machine status and floor issues.",
    href: "/production/live-board",
    icon: "📋",
  },
];


const primaryActions: QuickAction[] = [
  {
    label: "Troubleshoot a Defect",
    helper: "Answer a few questions and get the safest first checks.",
    href: "/troubleshooting",
    icon: "🔎",
  },
  {
    label: "Analyze a Defect Photo",
    helper: "Upload a part photo when you are not sure what you see.",
    href: "/photo-analysis",
    icon: "📷",
  },
  {
    label: "Ask the Molding Coach",
    helper: "Describe the issue in plain words and get next steps.",
    href: "/coach",
    icon: "💬",
  },
  {
    label: "Learn Injection Molding",
    helper: "Start guided paths built for shop-floor teams.",
    href: "/learning-paths",
    icon: "🎓",
  },
  {
    label: "Search Knowledge",
    helper: "Find saved fixes, defect guides, tools, and lessons.",
    href: "/knowledge-search",
    icon: "🔍",
  },
];


const missionPrinciples = [
  { title: "Help people learn", body: "Teach the why behind each check so every issue builds skill, not just a temporary fix." },
  { title: "Troubleshoot with evidence", body: "Ask why, gather facts, rule out possibilities, and validate changes before chasing settings." },
  { title: "Preserve shop knowledge", body: "Capture lessons, handoffs, histories, and fixes before experienced knowledge gets lost." },
  { title: "Keep it simple", body: "Fast, practical tools that work in plain language on the shop floor." },
  { title: "Support teamwork", body: "Bring operators, technicians, supervisors, and managers together because no one knows everything." },
  { title: "People first", body: "Use technology to grow better problem-solvers, teachers, leaders, and teammates—not replace them." },
];

const fiveWhysReminders = [
  "Ask why.",
  "Gather evidence.",
  "Rule out possibilities.",
  "Think critically.",
  "Seek another perspective when you reach the limit of your knowledge.",
];

const quickStartProblems = [
  { label: "Flash", helper: "Extra plastic on the edge", query: "flash" },
  { label: "Short Shot", helper: "Part did not fill all the way", query: "short shot" },
  { label: "Splay", helper: "Silver streaks or splash marks", query: "splay" },
  { label: "Burn Marks", helper: "Brown or black burn spots", query: "burn marks" },
  { label: "Warpage", helper: "Part is bent or twisted", query: "warpage" },
  { label: "Sink Marks", helper: "Dents over thick areas", query: "sink marks" },
  { label: "Voids", helper: "Air pockets inside the part", query: "voids" },
  { label: "Weld Lines", helper: "Weak line where flow meets", query: "weld lines" },
  { label: "Other", helper: "Not sure what to call it", query: "defect" },
];

const quickStartActions = [
  { label: "Troubleshooting Wizard", helper: "Answer quick questions", href: "/troubleshooting", icon: "🧭" },
  { label: "Photo Analysis", helper: "Use a part picture", href: "/photo-analysis", icon: "📷" },
  { label: "Ask the Molding Coach", helper: "Ask in plain words", href: "/coach", icon: "💬" },
  { label: "Defect Library", helper: "See causes and first checks", href: "/defects", icon: "📚" },
];

const mostViewedProblemsThisWeek = [
  { label: "Flash at parting line", helper: "Check clamp, mold shutoff, and pack pressure", href: "/defects?search=flash" },
  { label: "Short shot after startup", helper: "Check feed, cushion, transfer, and vents", href: "/defects?search=short%20shot" },
  { label: "Splay after material change", helper: "Check dry time, moisture, and barrel temps", href: "/defects?search=splay" },
];

const recentlySolvedProblems = [
  { label: "Burn marks at end of fill", helper: "Slowed fill slightly and cleaned vents", href: "/defects?search=burn%20marks" },
  { label: "Sink on thick boss", helper: "Checked gate seal and added hold support", href: "/defects?search=sink%20marks" },
  { label: "Warp after faster cycle", helper: "Checked cooling time and water flow first", href: "/defects?search=warpage" },
];

const coachStarterQuestions = [
  "I have flash near the gate.",
  "My parts are warped.",
  "I'm getting silver streaks.",
  "Cycle time increased after startup.",
];

const recentCoachingTopics = [
  "Flash after a mold change",
  "Warp on flat parts",
  "Splay and silver streaks",
  "Longer cycles after startup",
];


const startHereActions = [
  { label: "I Have a Defect", helper: "Identify the visible problem and choose a safe first check.", href: "/problem", icon: "🆘" },
  { label: "I Need to Learn", helper: "Follow beginner-friendly learning paths and real shop scenarios.", href: "/learning-paths", icon: "🎓" },
  { label: "I Need an Answer", helper: "Ask the coach or search the knowledge in plain language.", href: "/coach", icon: "💬" },
  { label: "I Want to Save Knowledge", helper: "Capture lessons learned so the next person starts smarter.", href: "/knowledge-base", icon: "🧠" },
];

const commonProblemShortcuts = [
  { label: "Flash", helper: "Extra plastic on edges or parting line", href: "/defects?search=flash" },
  { label: "Short Shot", helper: "Part does not fill completely", href: "/defects?search=short%20shot" },
  { label: "Splay", helper: "Silver streaks or splash marks", href: "/defects?search=splay" },
  { label: "Burn Marks", helper: "Brown or black marks near end of fill", href: "/defects?search=burn%20marks" },
  { label: "Warpage", helper: "Part bends, twists, or will not sit flat", href: "/defects?search=warpage" },
  { label: "Sink Marks", helper: "Dents or depressions over thick areas", href: "/defects?search=sink%20marks" },
];

const recommendedToolHrefs = ["/troubleshooting", "/coach", "/defects", "/knowledge-search"];

const guideMeOptions = [
  { question: "Are you troubleshooting?", helper: "Use guided questions when a part or process is not right.", href: "/troubleshooting", cta: "Start troubleshooting" },
  { question: "Learning?", helper: "Start with lessons designed for beginners and shop-floor roles.", href: "/learning-paths", cta: "Start learning" },
  { question: "Training someone?", helper: "Assign training or find role-based paths for the person you are helping.", href: "/training/assignments", cta: "Open training tools" },
  { question: "Looking for a past solution?", helper: "Search saved fixes, case studies, defects, and lessons learned.", href: "/knowledge-search", cta: "Search past solutions" },
];

const workflowSteps = [
  { label: "Fix a Problem", href: "/problem", helper: "Start here if you are unsure." },
  { label: "Troubleshooting Wizard", href: "/troubleshooting", helper: "Answer guided questions." },
  { label: "AI Coach", href: "/coach", helper: "Ask follow-up questions." },
  { label: "Photo Analysis", href: "/photo-analysis", helper: "Use a picture if needed." },
  { label: "Defect Library", href: "/defects", helper: "Confirm causes and checks." },
];

const legacyHomepageHelpers = [
  categoryQuickLinks,
  RoleToolList,
  splitToolsByImportance,
  roleHelpers,
  roleToolPicks,
  quickActions,
  primaryActions,
  missionPrinciples,
  fiveWhysReminders,
  quickStartActions,
  mostViewedProblemsThisWeek,
  recentlySolvedProblems,
  coachStarterQuestions,
  recentCoachingTopics,
  workflowSteps,
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteTools, setFavoriteTools] = useState<string[]>(defaultFavoriteHrefs);
  const [recentToolHrefs, setRecentToolHrefs] = useState<string[]>([]);
  const [recentToolsHydrated, setRecentToolsHydrated] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ShopRole>("Operator");
  const [selectedQuickStartProblem, setSelectedQuickStartProblem] = useState(quickStartProblems[0]);
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

  const recommendedTools = recommendedToolHrefs
    .map((href) => dashboardCards.find((card) => card.href === href))
    .filter((card): card is DashboardCard => Boolean(card));

  void selectedQuickStartProblem;
  void setSelectedQuickStartProblem;
  void clearRecentTools;
  void favorites;
  void recentTools;
  void mostUsedTools;
  void beginnerStartTools;
  void categories;
  void legacyHomepageHelpers;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Molding Mentor</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Get to the right tool fast.</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Mobile-first shortcuts for defects, learning, answers, and saved shop knowledge. Most users should find their next step in under 15 seconds.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/mission" className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-100 transition hover:bg-cyan-300/20">Mission</Link>
              <Link href="/settings" className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-cyan-300/50">Settings</Link>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] border border-amber-300/25 bg-slate-900/85 p-4 shadow-2xl shadow-amber-950/20 sm:p-6" aria-labelledby="start-here-heading">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Start Here</p>
          <h2 id="start-here-heading" className="mt-1 text-2xl font-black tracking-tight text-white">What do you need right now?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {startHereActions.map((action) => (
              <Link key={action.href} href={action.href} className="group flex min-h-36 flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4 text-left shadow-xl shadow-slate-950/25 transition hover:-translate-y-0.5 hover:border-amber-200/70 hover:bg-amber-300/10 focus:outline-none focus:ring-4 focus:ring-amber-300/20" onClick={() => trackRecentTool(action.href)}>
                <span className="text-3xl" aria-hidden="true">{action.icon}</span>
                <span>
                  <span className="block text-xl font-black leading-tight text-white">{action.label}</span>
                  <span className="mt-2 block text-sm font-semibold leading-5 text-slate-300">{action.helper}</span>
                </span>
                <span className="font-black text-amber-100 transition group-hover:translate-x-1">Go →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/80 p-4 shadow-2xl shadow-cyan-950/20 sm:p-6" aria-labelledby="common-problems-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Most Common Problems</p>
              <h2 id="common-problems-heading" className="mt-1 text-2xl font-black tracking-tight text-white">Tap the defect you see</h2>
            </div>
            <Link href="/defects" className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/10" onClick={() => trackRecentTool("/defects")}>Open full library →</Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {commonProblemShortcuts.map((problem) => (
              <Link key={problem.label} href={problem.href} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-cyan-200/70 hover:bg-cyan-300/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/20" onClick={() => trackRecentTool("/defects")}>
                <span className="block text-lg font-black text-white">{problem.label}</span>
                <span className="mt-1 block text-sm font-semibold leading-5 text-slate-300">{problem.helper}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-emerald-300/20 bg-slate-900/80 p-4 shadow-2xl shadow-emerald-950/20 sm:p-6" aria-labelledby="recommended-tools-heading">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">Recommended Tools</p>
          <h2 id="recommended-tools-heading" className="mt-1 text-2xl font-black tracking-tight text-white">Top 4 starter tools</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Use these when you are unsure what to do next: answer questions, ask the coach, compare defects, or search past fixes.</p>
          <div className="mt-4">
            <ToolList cards={recommendedTools} label="Top recommended tools" favoriteHrefs={favoriteHrefSet} beginnerMode={beginnerMode} beginnerStartHrefs={beginnerStartHrefs} onToggleFavorite={toggleFavorite} onOpenTool={trackRecentTool} />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-300/15 via-slate-900 to-emerald-300/15 p-5 text-center shadow-2xl shadow-slate-950/20" aria-labelledby="mission-reminder-heading">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Mission Reminder</p>
          <h2 id="mission-reminder-heading" className="mt-2 text-2xl font-black text-white sm:text-4xl">Learn. Troubleshoot. Preserve Knowledge. Work Together.</h2>
        </section>

        <section className="rounded-[2rem] border border-amber-300/25 bg-slate-900/85 p-4 shadow-2xl shadow-amber-950/20 sm:p-6" aria-labelledby="guide-me-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Not Sure Where to Start?</p>
              <h2 id="guide-me-heading" className="mt-1 text-2xl font-black tracking-tight text-white">Guide Me</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">Answer one simple question. No new form, no saved data.</p>
            </div>
            <Link href="/start-here" className="rounded-full bg-amber-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-200">Guide Me →</Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {guideMeOptions.map((option) => (
              <Link key={option.question} href={option.href} className="group rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:-translate-y-0.5 hover:border-amber-200/70 hover:bg-amber-300/10 focus:outline-none focus:ring-4 focus:ring-amber-300/20" onClick={() => trackRecentTool(option.href)}>
                <span className="block text-lg font-black text-white">{option.question}</span>
                <span className="mt-2 block text-sm font-semibold leading-5 text-slate-300">{option.helper}</span>
                <span className="mt-3 block rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-bold leading-5 text-amber-50">Example: {option.question === "Are you troubleshooting?" ? "part has flash or short shot" : option.question === "Learning?" ? "new operator needs basics" : option.question === "Training someone?" ? "supervisor assigns startup training" : "find how this was fixed last time"}</span>
                <span className="mt-4 block text-sm font-black text-amber-100 transition group-hover:translate-x-1">{option.cta} →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/80 p-4 shadow-2xl shadow-cyan-950/20 sm:p-6" aria-labelledby="beginner-terms-heading">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Beginner Help</p>
          <h2 id="beginner-terms-heading" className="mt-1 text-2xl font-black tracking-tight text-white">Common shop words in plain language</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Defect", "Something wrong with the molded part, like flash, burn marks, or a short shot."],
              ["Process", "The machine settings and steps used to make the part."],
              ["Root cause", "The real reason the problem happened, not just the first thing you notice."],
              ["Containment", "Keeping suspect parts separated until quality decides what to do."],
              ["OEE", "A plant number that compares planned time, running speed, and good parts."],
              ["Process window", "The safe range where settings still make good parts."],
            ].map(([term, meaning]) => (
              <article key={term} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <h3 className="text-lg font-black text-white">{term}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">{meaning}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 sm:p-6" aria-labelledby="all-tools-heading">
          <label className="block">
            <span id="all-tools-heading" className="mb-2 block text-sm font-bold text-slate-200">Need something else? Search all existing tools</span>
            <input className="w-full rounded-3xl border border-cyan-300/40 bg-slate-950/85 px-5 py-4 text-base font-semibold text-white shadow-inner shadow-slate-950 placeholder:text-slate-400 focus:border-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/20" placeholder="Try dryer, first piece, downtime, training..." type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
          {normalizedSearch ? (
            <div className="mt-4">
              <p className="mb-3 text-sm text-slate-400">{visibleCards.length} tools found for “{searchTerm}”</p>
              {visibleCards.length > 0 ? <ToolList cards={visibleCards} label="Matching search tools" favoriteHrefs={favoriteHrefSet} beginnerMode={beginnerMode} beginnerStartHrefs={beginnerStartHrefs} onToggleFavorite={toggleFavorite} onOpenTool={trackRecentTool} /> : <p className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5 text-amber-50">No tools found. Try another word.</p>}
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
