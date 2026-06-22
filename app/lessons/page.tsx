import Link from "next/link";

type Lesson = {
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  learningPoints: string[];
};

const lessons: Lesson[] = [
  {
    title: "Injection Molding Basics",
    level: "Beginner",
    description:
      "Learn the core molding cycle, machine movements, tooling features, and vocabulary used on the production floor.",
    learningPoints: [
      "Identify the major phases of the injection molding cycle.",
      "Connect machine settings to part quality observations.",
      "Recognize common tooling and material handling terms.",
    ],
  },
  {
    title: "Fill Phase",
    level: "Beginner",
    description:
      "Understand how melt fills the cavity and why consistent fill-only evaluation is the foundation for stable processing.",
    learningPoints: [
      "Separate fill behavior from pack and hold effects.",
      "Evaluate fill speed, transfer position, and short-shot samples.",
      "Spot fill-related symptoms like hesitation, burns, and short shots.",
    ],
  },
  {
    title: "Pack and Hold",
    level: "Intermediate",
    description:
      "Explore how pack pressure and hold time control shrinkage, weight, dimensions, and cavity pressure after transfer.",
    learningPoints: [
      "Explain the purpose of packing after the cavity is filled.",
      "Review how hold pressure influences sinks, flash, and dimensions.",
      "Document stable transfer, cushion, and part-weight trends.",
    ],
  },
  {
    title: "Cooling",
    level: "Beginner",
    description:
      "Study how cooling time, mold temperature, and water flow affect part stability, cycle time, and warpage risk.",
    learningPoints: [
      "Relate cooling conditions to part ejection temperature.",
      "Check water circuits, flow, and temperature consistency.",
      "Identify cooling-driven defects such as warp and dimensional drift.",
    ],
  },
  {
    title: "Decoupled Molding I",
    level: "Intermediate",
    description:
      "Learn the first level of decoupled molding by separating fill from pack for more repeatable process control.",
    learningPoints: [
      "Define fill-only setup and velocity-controlled filling.",
      "Set transfer position based on a controlled short shot.",
      "Use process outputs to confirm fill consistency.",
    ],
  },
  {
    title: "Gate Seal Study",
    level: "Intermediate",
    description:
      "Practice determining when the gate freezes so hold time decisions are based on data instead of guesswork.",
    learningPoints: [
      "Run a part-weight study across increasing hold times.",
      "Identify the point where additional hold time no longer adds weight.",
      "Apply gate seal findings to cycle-time and quality decisions.",
    ],
  },
  {
    title: "Process Window",
    level: "Advanced",
    description:
      "Map acceptable operating limits so teams understand where a process is robust and where defects begin.",
    learningPoints: [
      "Define practical high and low limits for key process settings.",
      "Compare acceptable parts across pressure, speed, and temperature changes.",
      "Use documented windows to improve setup repeatability.",
    ],
  },
  {
    title: "Troubleshooting with Data",
    level: "Advanced",
    description:
      "Use process evidence, part measurements, and trend data to prioritize root causes and validate corrective actions.",
    learningPoints: [
      "Collect baseline data before adjusting the process.",
      "Distinguish material, machine, mold, method, and design causes.",
      "Confirm improvements with measured outputs instead of assumptions.",
    ],
  },
];

const levelStyles: Record<Lesson["level"], string> = {
  Beginner: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Intermediate: "border-cyan-300/30 bg-cyan-300/10 text-cyan-200",
  Advanced: "border-violet-300/30 bg-violet-300/10 text-violet-200",
};

export default function LessonsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-violet-950/30 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.16),transparent_34%)]" />
          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
            >
              ← Back home
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
              Scientific Molding Training
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Lesson modules for data-driven molding
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Build scientific molding knowledge step by step with practical modules designed for technicians, processors, and troubleshooting teams. Lessons are marked Coming Soon while the curriculum is prepared.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-2 xl:grid-cols-4">
          {lessons.map((lesson, index) => (
            <article
              key={lesson.title}
              className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/25 backdrop-blur sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-black text-white">
                  {index + 1}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                  Coming Soon
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-white">{lesson.title}</h2>
              <span
                className={`mt-4 w-fit rounded-full border px-3 py-1 text-xs font-bold ${levelStyles[lesson.level]}`}
              >
                {lesson.level}
              </span>
              <p className="mt-4 text-sm leading-6 text-slate-300">{lesson.description}</p>

              <section className="mt-5 border-t border-white/10 pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Key learning points
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  {lesson.learningPoints.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
