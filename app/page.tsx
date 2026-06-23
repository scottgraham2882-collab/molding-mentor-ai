import Link from "next/link";

type Tool = {
  title: string;
  helper: string;
  href: string;
};

type Category = {
  title: string;
  shopTalk: string;
  href: string;
  count: string;
  tools: Tool[];
};

const categories: Category[] = [
  {
    title: "Troubleshoot a Problem",
    shopTalk: "Find the defect, check the likely causes, and pick the next safe move.",
    href: "/troubleshooting",
    count: "6 tools",
    tools: [
      { title: "Guided Troubleshooting", helper: "Step through the problem", href: "/troubleshooting" },
      { title: "AI Troubleshooting Coach", helper: "Ask for help in plain words", href: "/coach" },
      { title: "Defect Library", helper: "Match the part defect", href: "/defects" },
      { title: "Photo Defect Check", helper: "Review a part photo", href: "/photo-analysis" },
    ],
  },
  {
    title: "Run Production",
    shopTalk: "Start jobs, hand off shifts, track output, and keep presses moving.",
    href: "/production/live-board",
    count: "10 tools",
    tools: [
      { title: "Live Production Board", helper: "See press status now", href: "/production/live-board" },
      { title: "Run Log", helper: "Record parts, scrap, and time", href: "/production/run-log" },
      { title: "Shift Handoff", helper: "Tell the next shift what changed", href: "/shift-handoff" },
      { title: "Startup Approval", helper: "Approve the first good run", href: "/startup-approval" },
    ],
  },
  {
    title: "Check Quality",
    shopTalk: "Approve first pieces, hold suspect parts, and follow up on quality issues.",
    href: "/quality/first-piece-approval",
    count: "10 tools",
    tools: [
      { title: "First Piece Approval", helper: "Check before full production", href: "/quality/first-piece-approval" },
      { title: "First Article Report", helper: "Record critical checks", href: "/quality/first-article" },
      { title: "Quality Hold", helper: "Control suspect product", href: "/quality/containment" },
      { title: "Corrective Action", helper: "Track root cause work", href: "/quality/corrective-action" },
    ],
  },
  {
    title: "Train Employees",
    shopTalk: "Assign training, check skills, and help operators and techs learn the standard.",
    href: "/training/assignments",
    count: "16 tools",
    tools: [
      { title: "Training Assignments", helper: "Give people their next lessons", href: "/training/assignments" },
      { title: "Skills Matrix", helper: "See who is qualified", href: "/training/skills-matrix" },
      { title: "Process Tech Training", helper: "Build setup discipline", href: "/training/process-technician" },
      { title: "Supervisor Training", helper: "Coach better shift leadership", href: "/training/supervisor" },
    ],
  },
  {
    title: "Manage Materials",
    shopTalk: "Dry resin, trace lots, manage inventory, and control color or material changes.",
    href: "/materials/inventory",
    count: "7 tools",
    tools: [
      { title: "Material Inventory", helper: "Know what resin is on hand", href: "/materials/inventory" },
      { title: "Drying Log", helper: "Record dryer settings", href: "/materials/drying-log" },
      { title: "Lot Traceability", helper: "Track resin by lot", href: "/materials/lot-traceability" },
      { title: "Material Troubleshooter", helper: "Check splay, bubbles, and specks", href: "/materials/troubleshooter" },
    ],
  },
  {
    title: "Reports & Management",
    shopTalk: "Review the shift, watch KPIs, manage actions, and keep records under control.",
    href: "/reports/daily",
    count: "12 tools",
    tools: [
      { title: "Daily Plant Report", helper: "Summarize the day", href: "/reports/daily" },
      { title: "KPI Dashboard", helper: "Check plant health", href: "/reports/kpi-dashboard" },
      { title: "Action Tracker", helper: "Follow up on open items", href: "/actions" },
      { title: "Plant Management", helper: "Manage users and records", href: "/plant-management" },
    ],
  },
];

const favorites: Tool[] = [
  { title: "Live Production Board", helper: "Press status and shift priorities", href: "/production/live-board" },
  { title: "Guided Troubleshooting", helper: "Work through a molding problem", href: "/troubleshooting" },
  { title: "First Piece Approval", helper: "Approve parts before the run", href: "/quality/first-piece-approval" },
];

const recentTools: Tool[] = [
  { title: "Shift Handoff", helper: "Open issues for next shift", href: "/shift-handoff" },
  { title: "Material Drying Log", helper: "Dryer settings and time", href: "/materials/drying-log" },
  { title: "Scrap Tracker", helper: "Scrap count and reason", href: "/scrap" },
];

const mostUsedTools: Tool[] = [
  { title: "Process Sheet Builder", helper: "Standard setup values", href: "/process-sheet-builder" },
  { title: "Defect Library", helper: "Fast defect lookup", href: "/defects" },
  { title: "OEE Dashboard", helper: "Availability, speed, quality", href: "/oee" },
  { title: "Mold Change Checklist", helper: "Safe setup steps", href: "/mold-change" },
];

function ToolLink({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4 transition hover:border-cyan-300/50 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
    >
      <span>
        <span className="block text-base font-bold text-white">{tool.title}</span>
        <span className="mt-1 block text-sm text-slate-400">{tool.helper}</span>
      </span>
      <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-cyan-200 transition group-hover:bg-cyan-300/20" aria-hidden="true">
        Open
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/20 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">Molding Mentor AI</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
            What do you need help with?
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Pick a shop-floor task, open a favorite tool, or search by the problem you are trying to solve.
          </p>
          <label className="mt-6 block" htmlFor="home-search">
            <span className="sr-only">What do you need help with?</span>
            <input
              id="home-search"
              type="search"
              placeholder="What do you need help with?"
              className="w-full rounded-2xl border border-cyan-300/30 bg-slate-950 px-5 py-4 text-lg font-semibold text-white placeholder:text-slate-500 shadow-inner shadow-slate-950 focus:border-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
            />
          </label>
        </header>

        <section aria-labelledby="category-heading">
          <h2 id="category-heading" className="text-xl font-black text-white sm:text-2xl">Choose a work area</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <article key={category.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30">
                <div className="flex items-start justify-between gap-4">
                  <Link href={category.href} className="text-2xl font-black text-white hover:text-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/20">
                    {category.title}
                  </Link>
                  <span className="shrink-0 rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-200">{category.count}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{category.shopTalk}</p>
                <div className="mt-5 grid gap-2">
                  {category.tools.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="rounded-xl bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-300/20">
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3" aria-label="Quick tool lists">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-xl font-black text-white">Favorites</h2>
            <div className="mt-4 grid gap-3">{favorites.map((tool) => <ToolLink key={tool.href} tool={tool} />)}</div>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-xl font-black text-white">Recent tools</h2>
            <div className="mt-4 grid gap-3">{recentTools.map((tool) => <ToolLink key={tool.href} tool={tool} />)}</div>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-xl font-black text-white">Most used tools</h2>
            <div className="mt-4 grid gap-3">{mostUsedTools.map((tool) => <ToolLink key={tool.href} tool={tool} />)}</div>
          </div>
        </section>
      </section>
    </main>
  );
}
