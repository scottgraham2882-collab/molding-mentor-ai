import Link from "next/link";
import { demoProgress, getProgressSummary } from "../lib/progress-data";

type DashboardCard = {
  title: string;
  description: string;
  href?: string;
  status?: "Coming Soon";
  accent: string;
};

const progressSummary = getProgressSummary(demoProgress);

const dashboardWidgets = [
  { label: "Training progress", value: `${progressSummary.trainingProgress}%`, description: "Completed lesson path" },
  { label: "Certifications earned", value: String(progressSummary.certificationsEarned), description: "Printable credentials" },
  { label: "Lessons remaining", value: String(progressSummary.lessonsRemaining), description: "Modules left to finish" },
];

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
    title: "Mold History Database",
    description:
      "Add, search, edit, delete, save, and print mold history records with tooling notes, repair history, and process knowledge.",
    href: "/molds",
    accent: "from-cyan-300 to-emerald-400",
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
    title: "Customer Complaint Tracker",
    description:
      "Create, save, edit, delete, filter, and print 8D-style customer complaint records for quality follow-up.",
    href: "/quality/customer-complaints",
    accent: "from-emerald-300 to-cyan-400",
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
    title: "Training Assignment Manager",
    description:
      "Assign modules, track due dates, status, quiz scores, supervisor notes, completion percentage, and print training reports.",
    href: "/training/assignments",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    title: "Employee Skills Matrix",
    description:
      "Add, save, edit, filter, and print employee skill records with qualification levels, expiration dates, and supervisor sign-offs.",
    href: "/training/skills-matrix",
    accent: "from-cyan-300 to-emerald-400",
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
    title: "Material Defect Troubleshooter",
    description:
      "Select splay, bubbles, silver streaks, black specks, delamination, or brittleness to review material causes and corrective actions.",
    href: "/materials/troubleshooter",
    accent: "from-blue-300 to-cyan-400",
  },
];

function CardContent({ card }: { card: DashboardCard }) {
  return (
    <>
      <div
        className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${card.accent}`}
        aria-hidden="true"
      />
      <div className="mt-6 flex items-start justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">{card.title}</h2>
        {card.status ? (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
            {card.status}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">{card.description}</p>
      <div className="mt-7 flex items-center justify-between text-sm font-bold text-cyan-100">
        <span>{card.href ? "Open tool" : "Planned module"}</span>
        <span aria-hidden="true">→</span>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_32%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Mobile-first molding support
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              AI Molding Coach
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A focused dashboard for injection molding teams to diagnose defects, follow disciplined troubleshooting, and prepare for future scientific molding tools.
            </p>
          </div>
        </header>

        <section aria-label="Progress widgets" className="grid gap-4 sm:grid-cols-3">
          {dashboardWidgets.map((widget) => (
            <article key={widget.label} className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5 shadow-xl shadow-cyan-950/20">
              <p className="text-4xl font-black text-white">{widget.value}</p>
              <h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-100">{widget.label}</h2>
              <p className="mt-2 text-sm text-slate-300">{widget.description}</p>
            </article>
          ))}
        </section>

        <section
          aria-label="AI Molding Coach tools"
          className="grid gap-4 sm:grid-cols-2 lg:gap-6"
        >
          {dashboardCards.map((card) => {
            const className =
              "group min-h-64 rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-slate-950/30 backdrop-blur transition sm:p-7";

            if (card.href) {
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`${className} hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.1] focus:outline-none focus:ring-4 focus:ring-cyan-300/20`}
                >
                  <CardContent card={card} />
                </Link>
              );
            }

            return (
              <article
                key={card.title}
                className={`${className} opacity-80`}
              >
                <CardContent card={card} />
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
