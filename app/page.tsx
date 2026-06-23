import Link from "next/link";

type Tool = {
  title: string;
  shopFloorName: string;
  description: string;
  href: string;
};

type Category = {
  title: string;
  helper: string;
  href: string;
  tools: Tool[];
};

const categories: Category[] = [
  {
    title: "Troubleshoot a Problem",
    helper: "Find the cause, pick the next check, and fix defects without guessing.",
    href: "/troubleshooting",
    tools: [
      {
        title: "Troubleshooting Assistant",
        shopFloorName: "Guided problem solver",
        description: "Walk through checks before changing the process.",
        href: "/troubleshooting",
      },
      {
        title: "AI Troubleshooting Coach",
        shopFloorName: "Ask the coach",
        description: "Get likely causes and corrective actions.",
        href: "/coach",
      },
      {
        title: "Defect Library",
        shopFloorName: "Defect look-up",
        description: "Match defects to common molding causes.",
        href: "/defects",
      },
      {
        title: "Defect Photo Analysis",
        shopFloorName: "Photo defect check",
        description: "Use a part photo to review likely defects.",
        href: "/photo-analysis",
      },
      {
        title: "Material Defect Troubleshooter",
        shopFloorName: "Material issue check",
        description: "Check splay, bubbles, black specks, and more.",
        href: "/materials/troubleshooter",
      },
    ],
  },
  {
    title: "Run Production",
    helper: "Start jobs, follow the sheet, track the shift, and keep machines moving.",
    href: "/production/live-board",
    tools: [
      {
        title: "Real-Time Production Board",
        shopFloorName: "Live machine board",
        description: "See what is running and what needs attention.",
        href: "/production/live-board",
      },
      {
        title: "Production Schedule Board",
        shopFloorName: "Today’s schedule",
        description: "Plan jobs and compare actual output.",
        href: "/production/schedule",
      },
      {
        title: "Production Run Log",
        shopFloorName: "Run log",
        description: "Record counts, scrap, runtime, and notes.",
        href: "/production/run-log",
      },
      {
        title: "Process Sheet Builder",
        shopFloorName: "Process sheet",
        description: "Build and print repeatable setup sheets.",
        href: "/process-sheet-builder",
      },
      {
        title: "Mold Change Checklist",
        shopFloorName: "Mold change checklist",
        description: "Work through safe removal, install, and startup.",
        href: "/mold-change",
      },
      {
        title: "Shift Handoff Logs",
        shopFloorName: "Shift handoff",
        description: "Tell the next shift what changed and what is open.",
        href: "/shift-handoff",
      },
    ],
  },
  {
    title: "Check Quality",
    helper: "Approve first pieces, contain bad parts, and document corrective actions.",
    href: "/quality/first-piece-approval",
    tools: [
      {
        title: "Digital First Piece Approval",
        shopFloorName: "First piece approval",
        description: "Verify parts before the run continues.",
        href: "/quality/first-piece-approval",
      },
      {
        title: "First Article Inspection Report",
        shopFloorName: "First article report",
        description: "Record dimensions, checks, and approval status.",
        href: "/quality/first-article",
      },
      {
        title: "Quality Hold / Containment Tracker",
        shopFloorName: "Quality hold",
        description: "Track suspect parts held by quality.",
        href: "/quality/containment",
      },
      {
        title: "Scrap Tracker",
        shopFloorName: "Scrap tracker",
        description: "Log scrap by defect and quantity.",
        href: "/scrap",
      },
      {
        title: "Corrective Action Tracker (CAPA)",
        shopFloorName: "CAPA tracker",
        description: "Track owners, due dates, and verification.",
        href: "/quality/capa",
      },
    ],
  },
  {
    title: "Train Employees",
    helper: "Assign training, check skills, and help operators learn the right way.",
    href: "/training/assignments",
    tools: [
      {
        title: "Training Assignment Manager",
        shopFloorName: "Training assignments",
        description: "Assign modules and check completion.",
        href: "/training/assignments",
      },
      {
        title: "Employee Skills Matrix",
        shopFloorName: "Skills matrix",
        description: "See who is qualified for each skill.",
        href: "/training/skills-matrix",
      },
      {
        title: "Operator Safety & Startup",
        shopFloorName: "Operator startup training",
        description: "Train operators on safe startup checks.",
        href: "/training/operator-safety-startup",
      },
      {
        title: "Mold Setup Training Module",
        shopFloorName: "Mold setup training",
        description: "Teach safe and repeatable mold changes.",
        href: "/training/mold-setup",
      },
      {
        title: "Process Technician Training Module",
        shopFloorName: "Process tech training",
        description: "Teach process checks and troubleshooting discipline.",
        href: "/training/process-technician",
      },
    ],
  },
  {
    title: "Manage Materials",
    helper: "Dry resin, track lots, manage inventory, and control material changes.",
    href: "/materials/inventory",
    tools: [
      {
        title: "Material Inventory Tracker",
        shopFloorName: "Material inventory",
        description: "Check stock, lots, locations, and status.",
        href: "/materials/inventory",
      },
      {
        title: "Material Lot Traceability Tracker",
        shopFloorName: "Lot traceability",
        description: "Follow resin lots from receiving to production.",
        href: "/materials/lot-traceability",
      },
      {
        title: "Material Drying Log",
        shopFloorName: "Drying log",
        description: "Record dryer settings, dew point, and time.",
        href: "/materials/drying-log",
      },
      {
        title: "Material Guides",
        shopFloorName: "Drying guide",
        description: "Check resin drying conditions before startup.",
        href: "/materials/resin-drying",
      },
      {
        title: "Color Change Procedure & Log",
        shopFloorName: "Color change log",
        description: "Record purge time, scrap, and first-good part.",
        href: "/materials/color-change",
      },
    ],
  },
  {
    title: "Reports & Management",
    helper: "Review plant results, assign actions, and keep records controlled.",
    href: "/reports/daily",
    tools: [
      {
        title: "Plant Daily Report",
        shopFloorName: "Daily plant report",
        description: "Review production, scrap, downtime, and priorities.",
        href: "/reports/daily",
      },
      {
        title: "Weekly Management Report",
        shopFloorName: "Weekly report",
        description: "Summarize results for the management team.",
        href: "/reports/weekly",
      },
      {
        title: "Executive KPI Dashboard",
        shopFloorName: "KPI dashboard",
        description: "Check trends for production, quality, and training.",
        href: "/reports/kpi-dashboard",
      },
      {
        title: "Action Item Tracker",
        shopFloorName: "Action items",
        description: "Track owners, due dates, priorities, and status.",
        href: "/actions",
      },
      {
        title: "Document Control System",
        shopFloorName: "Documents",
        description: "Manage controlled documents and reviews.",
        href: "/documents",
      },
    ],
  },
];

const favoriteTools = [
  categories[1].tools[0],
  categories[0].tools[1],
  categories[2].tools[0],
  categories[4].tools[2],
];

const recentTools = [
  categories[1].tools[2],
  categories[1].tools[5],
  categories[2].tools[3],
  categories[5].tools[0],
];

const mostUsedTools = [
  categories[0].tools[0],
  categories[1].tools[3],
  categories[3].tools[1],
  categories[5].tools[3],
];

function ToolList({ title, tools }: { title: string; tools: Tool[] }) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-slate-950/30 sm:p-5">
      <h2 className="text-lg font-black text-white">{title}</h2>
      <div className="mt-4 grid gap-3">
        {tools.map((tool) => (
          <Link
            key={`${title}-${tool.href}`}
            href={tool.href}
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-cyan-300/50 hover:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-100">{tool.shopFloorName}</p>
                <p className="mt-1 text-sm leading-5 text-slate-400">{tool.description}</p>
              </div>
              <span className="shrink-0 text-lg text-cyan-200" aria-hidden="true">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_30%)]" />
          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">Molding Mentor AI</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
                  Find the right shop-floor tool fast.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Simple shortcuts for process techs and supervisors. Troubleshoot problems, run the shift, check quality, train people, and manage materials from one clean home screen.
                </p>
              </div>
              <form className="rounded-3xl border border-cyan-300/20 bg-slate-950/70 p-3" role="search">
                <label htmlFor="tool-search" className="sr-only">
                  What do you need help with?
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="tool-search"
                    name="q"
                    type="search"
                    placeholder="What do you need help with?"
                    className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-white px-4 text-base font-semibold text-slate-950 outline-none placeholder:text-slate-500 focus:ring-4 focus:ring-cyan-300/30"
                  />
                  <button
                    type="submit"
                    className="min-h-14 rounded-2xl bg-cyan-300 px-6 text-base font-black text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </header>

        <section aria-label="Tool categories" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.title}
              href={category.href}
              className="group rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-white/[0.1] focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-xl font-black text-slate-950">
                  {index + 1}
                </span>
                <span className="mt-2 text-2xl text-cyan-200" aria-hidden="true">
                  →
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-black text-white">{category.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{category.helper}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {category.tools.slice(0, 3).map((tool) => (
                  <span key={tool.href} className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-bold text-slate-300">
                    {tool.shopFloorName}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <ToolList title="Favorites" tools={favoriteTools} />
          <ToolList title="Recent tools" tools={recentTools} />
          <ToolList title="Most used tools" tools={mostUsedTools} />
        </section>
      </section>
    </main>
  );
}
