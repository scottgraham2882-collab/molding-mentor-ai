import Link from "next/link";
import { getTools, type ToolMetadata } from "../../lib/tool-registry";

type ToolCard = ToolMetadata;

type ToolCategory = {
  title: string;
  purpose: string;
  tools: ToolCard[];
};

const categoryDefinitions = [
  { title: "Start Here", purpose: "Simple first stops for people who are new, unsure, or trying to find the right next tool.", hrefs: ["/start-here", "/mission", "/"] },
  { title: "Learning", purpose: "Build molding knowledge with plain-language references, lessons, examples, and roadmaps.", hrefs: ["/molding-dictionary", "/lessons", "/roadmaps", "/case-studies", "/knowledge-checks"] },
  { title: "Troubleshooting", purpose: "Help teams slow down, understand the problem, and choose safe first checks.", hrefs: ["/troubleshooting", "/simulator", "/defects", "/root-cause-coach", "/root-cause/what-changed", "/process-adjustment-guide"] },
  { title: "Knowledge & Collaboration", purpose: "Preserve what people learn and help shifts, teams, and departments stay aligned.", hrefs: ["/knowledge-vault", "/knowledge-search", "/shift-handoff", "/work-instructions", "/meetings"] },
  { title: "Training", purpose: "Assign learning, track progress, and support people as they grow into new roles.", hrefs: ["/training/assignments", "/training/plan-builder", "/training/skills-matrix", "/training/role-paths", "/certifications"] },
  { title: "Quality", purpose: "Support first-piece checks, containment, corrective action, audits, and customer quality work.", hrefs: ["/quality/first-piece-approval", "/quality/containment", "/quality/corrective-action", "/quality/8d-report", "/quality/audits"] },
  { title: "Materials", purpose: "Help teams manage resin, drying, color changes, inventory, and traceability.", hrefs: ["/materials/resin-drying", "/materials/drying-log", "/materials/lot-traceability", "/materials/color-change", "/materials/troubleshooter"] },
  { title: "Production", purpose: "Keep daily production work visible, organized, and easier to hand off.", hrefs: ["/production/live-board", "/production/run-log", "/production/schedule", "/production/job-traveler", "/startup-approval"] },
  { title: "Maintenance", purpose: "Support machine, mold, and maintenance work with clear records and practical checklists.", hrefs: ["/maintenance", "/molds", "/molds/pm-scheduler", "/machines", "/mold-change"] },
  { title: "Management", purpose: "Give leaders simple places to review plant work, reports, actions, and improvement priorities.", hrefs: ["/plant-management", "/reports/kpi-dashboard", "/reports/daily", "/reports/weekly", "/actions"] },
] as const;

const categories: ToolCategory[] = categoryDefinitions.map((category) => ({
  title: category.title,
  purpose: category.purpose,
  tools: getTools(category.hrefs),
}));

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
                    <span className="block text-xl font-black text-slate-950">{tool.title}</span>
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
