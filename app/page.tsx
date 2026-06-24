import Link from "next/link";
import { getTools, type ToolMetadata } from "../lib/tool-registry";

type NavigationCard = ToolMetadata;

type NavigationGroup = {
  title: string;
  description: string;
  cards: NavigationCard[];
};

const navigationGroups: NavigationGroup[] = [
  {
    title: "Learning",
    description: "Build molding knowledge one clear step at a time.",
    cards: getTools(["/molding-dictionary", "/lessons", "/training/role-paths", "/roadmaps", "/learning-plans"]),
  },
  {
    title: "Troubleshooting",
    description: "Find a safe first step before changing the process.",
    cards: getTools(["/coach", "/troubleshooting", "/simulator", "/checklists", "/process-adjustment-guide", "/root-cause-coach"]),
  },
  {
    title: "Knowledge & Collaboration",
    description: "Preserve what the team learns and keep shifts aligned.",
    cards: getTools(["/knowledge-vault", "/shift-handoff", "/training/skills-matrix"]),
  },
];

const missionItems = [
  "Help People Learn",
  "Help People Troubleshoot",
  "Preserve Knowledge",
  "Support Collaboration",
  "Keep It Simple",
  "People First",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-700">Molding Mentor AI</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Main Dashboard</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                A simple starting point for learning, troubleshooting, preserving knowledge, and supporting collaboration on the shop floor.
              </p>
              <Link
                href="/start-here"
                className="mt-6 flex max-w-xl flex-col rounded-2xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-500 hover:bg-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-200"
              >
                <span className="text-xs font-black uppercase tracking-[0.24em] text-cyan-700">New or not sure?</span>
                <span className="mt-2 text-2xl font-black text-slate-950">Start Here</span>
                <span className="mt-2 text-sm leading-6 text-slate-700">
                  Pick your role and need, then get three clear tools to open first.
                </span>
                <span className="mt-4 text-sm font-black text-cyan-800">Find your first step →</span>
              </Link>
            </div>
            <div className="rounded-2xl bg-cyan-50 p-4">
              <ul className="grid gap-2 text-sm font-bold text-cyan-950 sm:grid-cols-2 lg:grid-cols-1">
                {missionItems.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/all-tools" className="mt-4 inline-flex rounded-full bg-cyan-600 px-4 py-2 text-sm font-black text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200">
                View all tools →
              </Link>
            </div>
          </div>
        </header>

        {navigationGroups.map((group) => (
          <section key={group.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby={`${group.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}-heading`}>
            <div className="mb-4">
              <h2 id={`${group.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}-heading`} className="text-2xl font-black tracking-tight text-slate-950">
                {group.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{group.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.cards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex min-h-40 flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-50 focus:outline-none focus:ring-4 focus:ring-cyan-200"
                >
                  <span>
                    <span className="block text-xl font-black text-slate-950">{card.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-slate-600">{card.description}</span>
                  </span>
                  <span className="mt-5 text-sm font-black text-cyan-700 transition group-hover:translate-x-1">Open tool →</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
