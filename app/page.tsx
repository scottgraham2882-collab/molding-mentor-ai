import Link from "next/link";

type NavigationCard = {
  title: string;
  description: string;
  href: string;
};

type NavigationGroup = {
  title: string;
  description: string;
  cards: NavigationCard[];
};

const navigationGroups: NavigationGroup[] = [
  {
    title: "Learning",
    description: "Build molding knowledge one clear step at a time.",
    cards: [
      {
        title: "Molding Dictionary",
        description: "Look up molding terms in plain language with shop-floor examples.",
        href: "/molding-dictionary",
      },
      {
        title: "Lessons",
        description: "Review practical lessons for scientific molding and process thinking.",
        href: "/lessons",
      },
      {
        title: "Training Modules",
        description: "Open role-based training modules for operators, technicians, and supervisors.",
        href: "/training/role-paths",
      },
      {
        title: "Learning Roadmaps",
        description: "Follow simple role-based roadmaps for operators, process technicians, and supervisors.",
        href: "/roadmaps",
      },
      {
        title: "Learning Plans",
        description: "Track role-based training plans and recommended next steps for molding team development.",
        href: "/learning-plans",
      },
    ],
  },
  {
    title: "Troubleshooting",
    description: "Find a safe first step before changing the process.",
    cards: [
      {
        title: "Ask Coach",
        description: "Ask a molding question in plain words and review suggested next checks.",
        href: "/coach",
      },
      {
        title: "Troubleshooting Wizard",
        description: "Answer guided questions to narrow down likely causes and corrective steps.",
        href: "/troubleshooting",
      },
      {
        title: "Checklists",
        description: "Use simple checklists for repeatable production, quality, and training work.",
        href: "/checklists",
      },
      {
        title: "Process Guide",
        description: "Follow a structured sequence for verifying and adjusting the molding process.",
        href: "/process-guide",
      },
      {
        title: "Root Cause Coach",
        description: "Work through root cause thinking so the team fixes the real problem.",
        href: "/root-cause-coach",
      },
    ],
  },
  {
    title: "Knowledge & Collaboration",
    description: "Preserve what the team learns and keep shifts aligned.",
    cards: [
      {
        title: "Knowledge Vault",
        description: "Save problems, causes, fixes, and prevention notes for future learning.",
        href: "/knowledge-vault",
      },
      {
        title: "Shift Handoff",
        description: "Capture machine status, open issues, and instructions for the next shift.",
        href: "/shift-handoff",
      },
      {
        title: "Skills Matrix",
        description: "Review team skills and qualification coverage for training conversations.",
        href: "/skills-matrix",
      },
    ],
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
            </div>
            <ul className="grid gap-2 rounded-2xl bg-cyan-50 p-4 text-sm font-bold text-cyan-950 sm:grid-cols-2 lg:grid-cols-1">
              {missionItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
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
