import Link from "next/link";

type ToolCard = {
  name: string;
  description: string;
  href: string;
};

type ToolCategory = {
  title: string;
  purpose: string;
  tools: ToolCard[];
};

const categories: ToolCategory[] = [
  {
    title: "Start Here",
    purpose: "Simple first stops for people who are new, unsure, or trying to find the right next tool.",
    tools: [
      { name: "Start Here", description: "Pick your role and need to get three clear tools to open first.", href: "/start-here" },
      { name: "Mission", description: "Review the people-first principles behind Molding Mentor AI.", href: "/mission" },
      { name: "Main Dashboard", description: "Return to the simple homepage with the most common starting points.", href: "/" },
    ],
  },
  {
    title: "Learning",
    purpose: "Build molding knowledge with plain-language references, lessons, examples, and roadmaps.",
    tools: [
      { name: "Molding Dictionary", description: "Look up molding terms in simple language with shop-floor examples.", href: "/molding-dictionary" },
      { name: "Lessons", description: "Study practical scientific molding concepts in short learning modules.", href: "/lessons" },
      { name: "Learning Roadmaps", description: "Follow role-based learning paths for operators, technicians, and supervisors.", href: "/roadmaps" },
      { name: "Case Studies", description: "Learn from realistic molding situations, decisions, and outcomes.", href: "/case-studies" },
      { name: "Knowledge Checks", description: "Check understanding after lessons and training conversations.", href: "/knowledge-checks" },
    ],
  },
  {
    title: "Troubleshooting",
    purpose: "Help teams slow down, understand the problem, and choose safe first checks.",
    tools: [
      { name: "Troubleshooting Wizard", description: "Answer guided questions to narrow likely causes and corrective actions.", href: "/troubleshooting" },
      { name: "Defect Guide", description: "Match common part defects to likely molding, material, mold, and machine causes.", href: "/defects" },
      { name: "Root Cause Coach", description: "Work through root cause thinking before jumping to process changes.", href: "/root-cause-coach" },
      { name: "What Changed?", description: "Review recent changes that may explain a new molding problem.", href: "/root-cause/what-changed" },
      { name: "Process Adjustment Guide", description: "Use a structured approach when process adjustment is truly needed.", href: "/process-adjustment-guide" },
    ],
  },
  {
    title: "Knowledge & Collaboration",
    purpose: "Preserve what people learn and help shifts, teams, and departments stay aligned.",
    tools: [
      { name: "Knowledge Vault", description: "Save problems, causes, fixes, and prevention notes for future teams.", href: "/knowledge-vault" },
      { name: "Knowledge Search", description: "Find saved notes, lessons, and shop-floor knowledge quickly.", href: "/knowledge-search" },
      { name: "Shift Handoff", description: "Capture machine status, open issues, and instructions for the next shift.", href: "/shift-handoff" },
      { name: "Work Instructions", description: "Create and share clear steps for repeatable work.", href: "/work-instructions" },
      { name: "Meetings", description: "Keep action items and team discussion points in one place.", href: "/meetings" },
    ],
  },
  {
    title: "Training",
    purpose: "Assign learning, track progress, and support people as they grow into new roles.",
    tools: [
      { name: "Training Assignments", description: "Give employees the right training work and keep next steps visible.", href: "/training/assignments" },
      { name: "Training Plan Builder", description: "Build simple development plans around roles and skill gaps.", href: "/training/plan-builder" },
      { name: "Skills Matrix", description: "See who is trained, where coverage is strong, and where support is needed.", href: "/training/skills-matrix" },
      { name: "Role Paths", description: "Open training paths for operators, process technicians, and supervisors.", href: "/training/role-paths" },
      { name: "Certifications", description: "Track certification progress, renewals, and printable records.", href: "/certifications" },
    ],
  },
  {
    title: "Quality",
    purpose: "Support first-piece checks, containment, corrective action, audits, and customer quality work.",
    tools: [
      { name: "First Piece Approval", description: "Confirm quality requirements before production continues.", href: "/quality/first-piece-approval" },
      { name: "Quality Hold / Containment", description: "Control suspect product and document containment steps.", href: "/quality/containment" },
      { name: "Corrective Action", description: "Track fixes and prevention steps so quality issues do not repeat.", href: "/quality/corrective-action" },
      { name: "8D Report", description: "Organize team-based problem solving for serious quality events.", href: "/quality/8d-report" },
      { name: "Quality Audits", description: "Review audit findings and follow-up actions in a simple format.", href: "/quality/audits" },
    ],
  },
  {
    title: "Materials",
    purpose: "Help teams manage resin, drying, color changes, inventory, and traceability.",
    tools: [
      { name: "Resin Drying", description: "Review drying guidance before moisture-sensitive material is processed.", href: "/materials/resin-drying" },
      { name: "Drying Log", description: "Record drying activity so material history is easy to understand.", href: "/materials/drying-log" },
      { name: "Lot Traceability", description: "Connect material lots to jobs, parts, and production records.", href: "/materials/lot-traceability" },
      { name: "Color Change", description: "Plan and document color changes to reduce confusion and waste.", href: "/materials/color-change" },
      { name: "Materials Troubleshooter", description: "Check material-related causes when defects or processing problems appear.", href: "/materials/troubleshooter" },
    ],
  },
  {
    title: "Production",
    purpose: "Keep daily production work visible, organized, and easier to hand off.",
    tools: [
      { name: "Live Production Board", description: "See what is running, what needs attention, and current production status.", href: "/production/live-board" },
      { name: "Run Log", description: "Record production events, notes, and issues during the run.", href: "/production/run-log" },
      { name: "Production Schedule", description: "Review planned jobs and upcoming production work.", href: "/production/schedule" },
      { name: "Job Traveler", description: "Keep job instructions, routing, and requirements easy to follow.", href: "/production/job-traveler" },
      { name: "Startup Approval", description: "Verify startup conditions before committing to full production.", href: "/startup-approval" },
    ],
  },
  {
    title: "Maintenance",
    purpose: "Support machine, mold, and maintenance work with clear records and practical checklists.",
    tools: [
      { name: "Maintenance", description: "Review maintenance needs, notes, and follow-up work.", href: "/maintenance" },
      { name: "Molds", description: "Keep mold information, status, and related records easy to find.", href: "/molds" },
      { name: "Mold PM Scheduler", description: "Plan preventive maintenance for molds before problems interrupt production.", href: "/molds/pm-scheduler" },
      { name: "Machines", description: "Review machine information and shop-floor equipment details.", href: "/machines" },
      { name: "Mold Change", description: "Follow mold change steps and reduce missed handoff details.", href: "/mold-change" },
    ],
  },
  {
    title: "Management",
    purpose: "Give leaders simple places to review plant work, reports, actions, and improvement priorities.",
    tools: [
      { name: "Plant Management", description: "Review core plant management areas without crowding operator tools.", href: "/plant-management" },
      { name: "KPI Dashboard", description: "Review key performance indicators for production, quality, and downtime.", href: "/reports/kpi-dashboard" },
      { name: "Daily Report", description: "Check daily production, scrap, downtime, and team notes.", href: "/reports/daily" },
      { name: "Weekly Report", description: "Review trends and follow-up priorities across the week.", href: "/reports/weekly" },
      { name: "Actions", description: "Track practical follow-up items from meetings, problems, and improvement work.", href: "/actions" },
    ],
  },
];

const missionPillars = ["Help People Learn", "Help People Troubleshoot", "Preserve Knowledge", "Support Collaboration", "Keep It Simple"];

const categoryId = (title: string) => title.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-");

export default function AllToolsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Link href="/" className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-200">
          ← Back home
        </Link>

        <header className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.45fr_0.55fr]">
            <div className="p-6 sm:p-10">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-700">All Tools Hub</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Every major Molding Mentor AI tool in one simple directory.</h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                Use this page when you know there is a tool for the job, but you are not sure where it lives. The homepage can stay simple while this hub keeps the full toolset easy to find, understand, and use.
              </p>
              <Link href="/start-here" className="mt-6 inline-flex rounded-full bg-cyan-600 px-6 py-3 text-base font-black text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200">
                Start here first →
              </Link>
            </div>
            <aside className="border-t border-slate-200 bg-cyan-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <h2 className="text-lg font-black text-cyan-950">Built for the mission</h2>
              <ul className="mt-4 grid gap-3 text-sm font-bold text-cyan-950">
                {missionPillars.map((pillar) => (
                  <li key={pillar} className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" aria-hidden="true" />
                    {pillar}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </header>

        <nav aria-label="Tool categories" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <a key={category.title} href={`#${categoryId(category.title)}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-200">
                {category.title}
              </a>
            ))}
          </div>
        </nav>

        {categories.map((category) => (
          <section key={category.title} id={categoryId(category.title)} className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby={`${categoryId(category.title)}-heading`}>
            <div className="mb-5 max-w-3xl">
              <h2 id={`${categoryId(category.title)}-heading`} className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                {category.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{category.purpose}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {category.tools.map((tool) => (
                <Link key={tool.href} href={tool.href} className="group flex min-h-44 flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-50 focus:outline-none focus:ring-4 focus:ring-cyan-200">
                  <span>
                    <span className="block text-xl font-black text-slate-950">{tool.name}</span>
                    <span className="mt-2 block text-sm leading-6 text-slate-600">{tool.description}</span>
                  </span>
                  <span className="mt-5 flex items-center justify-between text-sm font-black text-cyan-700">
                    <span>{tool.href}</span>
                    <span className="transition group-hover:translate-x-1" aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
