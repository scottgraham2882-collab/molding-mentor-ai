import Link from "next/link";

type RoadmapStep = {
  title: string;
  href?: string;
  why: string;
};

type Roadmap = {
  title: string;
  audience: string;
  focus: string;
  steps: RoadmapStep[];
};

const roadmaps: Roadmap[] = [
  {
    title: "Operator Path",
    audience: "For people running presses, checking parts, and reporting issues during production.",
    focus: "Build common language first, then learn what defects look like and how to respond safely.",
    steps: [
      {
        title: "Molding Dictionary",
        href: "/molding-dictionary",
        why: "Shared terms help operators explain what they see clearly during handoffs, checks, and troubleshooting conversations.",
      },
      {
        title: "Defect Library",
        href: "/defects",
        why: "Recognizing defects by name helps the team sort parts faster and describe quality problems consistently.",
      },
      {
        title: "Troubleshooting Checklists",
        href: "/checklists",
        why: "Checklists keep first responses simple, repeatable, and focused on observation before changing the process.",
      },
      {
        title: "Training Modules",
        href: "/training/role-paths",
        why: "Role-based modules help operators keep building skills after the basics are understood.",
      },
      {
        title: "Knowledge Vault Examples",
        href: "/knowledge-vault",
        why: "Reviewing saved examples shows how previous teams captured problems, fixes, and prevention notes.",
      },
    ],
  },
  {
    title: "Process Technician Path",
    audience: "For people adjusting processes, supporting startups, and helping solve repeat molding problems.",
    focus: "Start with root cause thinking, then connect process adjustments to documented learning.",
    steps: [
      {
        title: "Root Cause Coach",
        href: "/root-cause-coach",
        why: "Root cause thinking helps technicians avoid chasing symptoms and focus on what changed.",
      },
      {
        title: "Process Adjustment Guide",
        href: "/process-adjustment-guide",
        why: "A structured adjustment sequence supports safer decisions and better communication before process changes are made.",
      },
      {
        title: "Scientific Molding Lessons",
        href: "/lessons",
        why: "Scientific molding concepts make process decisions easier to explain, repeat, and improve over time.",
      },
      {
        title: "Defect Library",
        href: "/defects",
        why: "Defect references connect symptoms to possible causes so technicians can choose better next checks.",
      },
      {
        title: "Advanced Troubleshooting Resources",
        href: "/troubleshooting",
        why: "Guided troubleshooting resources help technicians organize evidence and decide what to verify next.",
      },
    ],
  },
  {
    title: "Supervisor Path",
    audience: "For shift leaders, supervisors, and team leads supporting people and production flow.",
    focus: "Keep shifts aligned, grow team capability, and preserve what the team learns.",
    steps: [
      {
        title: "Shift Handoff Log",
        href: "/shift-handoff",
        why: "Clear handoffs reduce repeated questions and keep open issues visible from one shift to the next.",
      },
      {
        title: "Skills Matrix",
        href: "/skills-matrix",
        why: "A skills view helps supervisors identify coverage gaps and plan practical coaching conversations.",
      },
      {
        title: "Knowledge Vault",
        href: "/knowledge-vault",
        why: "Preserving lessons learned keeps fixes from living only in one person's memory.",
      },
      {
        title: "Root Cause Coach",
        href: "/root-cause-coach",
        why: "Supervisors can use root cause structure to guide team problem solving without jumping to blame.",
      },
      {
        title: "Team Development and Knowledge Sharing",
        href: "/training/role-paths",
        why: "Shared development paths help leaders turn daily production learning into stronger team capability.",
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

export default function RoadmapsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <Link
            href="/"
            className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-cyan-700 transition hover:border-cyan-400 hover:bg-cyan-50 focus:outline-none focus:ring-4 focus:ring-cyan-200"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-black uppercase tracking-[0.24em] text-cyan-700">Learning Roadmaps</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Choose a simple learning path by role</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                These roadmaps organize existing Molding Mentor resources into practical learning orders for operators, process technicians, and supervisors.
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

        <section className="mt-6 grid gap-5 lg:grid-cols-3" aria-label="Role learning roadmaps">
          {roadmaps.map((roadmap) => (
            <article key={roadmap.title} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-700">Role path</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{roadmap.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{roadmap.audience}</p>
                <p className="mt-3 rounded-2xl bg-slate-100 p-4 text-sm font-semibold leading-6 text-slate-700">{roadmap.focus}</p>
              </div>

              <ol className="mt-5 space-y-4">
                {roadmap.steps.map((step, index) => (
                  <li key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-700 text-sm font-black text-white">{index + 1}</span>
                      <div>
                        <h3 className="text-lg font-black text-slate-950">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{step.why}</p>
                        {step.href ? (
                          <Link
                            href={step.href}
                            className="mt-4 inline-flex text-sm font-black text-cyan-700 transition hover:text-cyan-900 focus:outline-none focus:ring-4 focus:ring-cyan-200"
                          >
                            Open resource →
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
