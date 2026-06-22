import Link from "next/link";

const featuredLessons = [
  {
    title: "Operator Training Module 1: Machine Safety & Startup Checklist",
    description:
      "Review molding-cell safety basics, PPE, lockout/tagout awareness, material and mold verification, first article inspection, and shift handoff with an interactive checklist and quiz.",
    href: "/training/operator-safety-startup",
    level: "Operator",
  },
  {
    title: "Process Window",
    description:
      "Learn how to bracket fill speed, pack pressure, mold temperature, and cooling time so the team understands the approved low, target, and high limits.",
    href: "/lessons/process-window",
    level: "Beginner/Intermediate",
  },
  {
    title: "Gate Seal Study",
    description:
      "Learn how to identify gate seal with hold-time steps, part-weight data, and a clear weight plateau before locking in production hold time.",
    href: "/lessons/gate-seal-study",
    level: "Beginner/Intermediate",
  },
  {
    title: "Decoupled Molding I",
    description:
      "Learn how to establish a fill-only process, set a reliable transfer position, and separate fill from pack before troubleshooting part quality.",
    href: "/lessons/decoupled-molding-1",
    level: "Beginner/Intermediate",
  },
];

const lessonModules = [
  {
    title: "Process window fundamentals",
    description:
      "Learn how melt temperature, mold temperature, fill speed, transfer, pack pressure, and cooling time define the stable operating range for a tool.",
    topics: ["Define acceptable part quality", "Bracket high and low settings", "Document the approved window"],
  },
  {
    title: "Fill-only and viscosity studies",
    description:
      "Use short-shot progression and relative viscosity data to understand flow behavior before optimizing pack and hold conditions.",
    topics: ["Run fill-only parts", "Compare peak pressure response", "Choose a stable fill speed"],
  },
  {
    title: "Gate seal and pack control",
    description:
      "Confirm when the gate freezes so pack time is long enough to control shrink without wasting cycle time or adding stress.",
    topics: ["Weigh parts at timed intervals", "Identify weight plateau", "Set repeatable hold time"],
  },
  {
    title: "Setup discipline and validation",
    description:
      "Turn study results into repeatable setup sheets, startup checks, and change-control habits that protect the validated process.",
    topics: ["Record actual readings", "Verify material and water systems", "Change one variable at a time"],
  },
];

const studySequence = [
  "Confirm the tool, material, dryer, and water circuits are ready for a stable baseline.",
  "Establish fill-only behavior before adding pack and hold pressure.",
  "Run viscosity, pressure drop, and gate-seal studies to identify robust settings.",
  "Validate the final process with measured part quality, cycle data, and documented limits.",
];

export default function LessonsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-violet-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-violet-300/30 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:border-violet-200 hover:bg-violet-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
            Scientific Molding Training
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Build repeatable molding knowledge
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Follow a practical lesson path for developing robust process windows, validating gate seal, and documenting setup discipline for injection molding teams.
              </p>
            </div>
            <div className="rounded-2xl border border-violet-300/20 bg-slate-900/70 p-4 text-sm leading-6 text-slate-300">
              Use these modules as a training roadmap before changing production settings or transferring a process to another press.
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4">
          {featuredLessons.map((lesson) => (
            <Link
              key={lesson.title}
              href={lesson.href}
              className="rounded-3xl border border-violet-300/30 bg-violet-300/10 p-5 shadow-xl shadow-violet-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-violet-200 sm:p-6"
            >
              <span className="rounded-full bg-violet-300 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-950">
                {lesson.level}
              </span>
              <h2 className="mt-4 text-2xl font-bold text-white">{lesson.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{lesson.description}</p>
              <p className="mt-5 text-sm font-bold text-violet-100">Start lesson →</p>
            </Link>
          ))}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {lessonModules.map((module) => (
            <article
              key={module.title}
              className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-violet-300/40 sm:p-6"
            >
              <h2 className="text-2xl font-bold text-white">{module.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{module.description}</p>
              <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-300">
                {module.topics.map((topic) => (
                  <li key={topic} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-300" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
          <h2 className="text-2xl font-bold text-white">Recommended study sequence</h2>
          <ol className="mt-5 grid gap-3 text-sm leading-6 text-slate-300 sm:text-base lg:grid-cols-4">
            {studySequence.map((step, index) => (
              <li key={step} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-300 text-sm font-bold text-slate-950">
                  {index + 1}
                </span>
                <p className="mt-3">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
