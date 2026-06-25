import Link from "next/link";

const experiencePillars = [
  {
    title: "Plain-language guidance",
    description: "Operators and technicians should not need engineering jargon to understand what to check next. The experience explains molding ideas in shop-floor language first, then adds deeper context when the learner is ready.",
  },
  {
    title: "Evidence before adjustment",
    description: "Molding Mentor slows the team down long enough to ask what changed, inspect the part, check the basics, and avoid chasing a defect with random setting changes.",
  },
  {
    title: "Learning built into the work",
    description: "Every troubleshooting path, checklist, and lesson is designed to teach why the step matters so the next person grows instead of only copying an answer.",
  },
  {
    title: "Knowledge that stays with the plant",
    description: "Lessons learned, handoff notes, and saved fixes help prevent the same problem from being solved from scratch every shift, every job, or every new employee onboarding cycle.",
  },
];

const shopFloorOutcomes = [
  "Newer employees get a safe first step instead of guessing.",
  "Experienced technicians have a simple way to teach without writing long procedures.",
  "Supervisors can see training, troubleshooting, quality, and handoff work in one connected workspace.",
  "Teams build a shared language around defects, process windows, materials, molds, and corrective actions.",
];

export default function WhyMoldingMentorExperiencePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link
          href="/"
          className="w-fit rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
        >
          ← Back home
        </Link>

        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-white/10 shadow-2xl shadow-cyan-950/30">
          <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="p-6 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Why Molding Mentor Experience</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                A shop-floor learning experience built around people, proof, and practical decisions.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Molding Mentor AI is designed for the moments when someone sees a defect, inherits a handoff, trains a teammate, or needs to understand why a process is behaving differently. It keeps the experience simple enough for the floor while reinforcing disciplined molding thinking.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/start-here" className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-300/30">
                  Start the experience →
                </Link>
                <Link href="/all-tools" className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/20">
                  View all tools
                </Link>
              </div>
            </div>
            <aside className="border-t border-white/10 bg-cyan-300/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <h2 className="text-xl font-black text-white">The experience is meant to feel:</h2>
              <ul className="mt-5 grid gap-3 text-sm font-bold text-cyan-50">
                {[
                  "simple enough for a busy shift",
                  "structured enough for repeatable troubleshooting",
                  "teachable enough for new employees",
                  "humble enough to ask for evidence first",
                ].map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {experiencePillars.map((pillar) => (
            <article key={pillar.title} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
              <h2 className="text-2xl font-black text-white">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{pillar.description}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-slate-950/20 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">What changes on the floor</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">The goal is confident action without skipping the thinking.</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {shopFloorOutcomes.map((outcome) => (
              <li key={outcome} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm font-bold leading-6 text-emerald-50 sm:text-base">
                <span className="text-emerald-300" aria-hidden="true">•</span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
