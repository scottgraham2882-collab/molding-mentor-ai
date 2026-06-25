import Link from "next/link";

const reasons = [
  {
    title: "New people need the why, not just the button to push",
    detail:
      "Molding Mentor AI explains symptoms, first checks, and the reason behind each action so operators and technicians can build judgment instead of memorizing isolated fixes.",
  },
  {
    title: "Troubleshooting should start with evidence",
    detail:
      "The app keeps teams focused on what changed, what can be verified, and what should not be adjusted first, reducing guesswork and unnecessary process changes.",
  },
  {
    title: "Shop-floor knowledge should not disappear between shifts",
    detail:
      "Lessons learned, handoff notes, corrective actions, and work instructions give teams a shared memory for recurring molding problems.",
  },
  {
    title: "People learn faster when tools are simple",
    detail:
      "Every page is designed to be approachable on the floor: plain language, practical next steps, and role-based paths for operators, technicians, and supervisors.",
  },
];

const outcomes = [
  "Safer first responses before changing machine settings",
  "Clearer training conversations between experienced and newer employees",
  "More consistent troubleshooting language across shifts",
  "Better preservation of local process knowledge and lessons learned",
];

export default function WhyMoldingMentorPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-3xl border border-cyan-300/20 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Why Molding Mentor</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">
            Built to help molding teams learn, solve, and remember
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Molding Mentor AI exists because strong injection molding teams need more than scattered notes, tribal knowledge, and rushed fixes. They need a simple guide that supports people while protecting the process.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-2">
          {reasons.map((reason, index) => (
            <article key={reason.title} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-lg font-black text-slate-950">
                {index + 1}
              </div>
              <h2 className="mt-5 text-2xl font-black text-white">{reason.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{reason.detail}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-slate-950/20 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">What success looks like</p>
          <h2 className="mt-3 text-3xl font-black text-white">A calmer, clearer path from problem to learning</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-base font-bold text-emerald-50">
                <span className="text-emerald-300" aria-hidden="true">•</span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">The guiding idea</h2>
          <p className="mt-3 text-base font-bold leading-7 text-amber-50">
            Respect the person, respect the process, and use evidence before assumptions. When teams understand why a step matters, they can troubleshoot with confidence and teach the next person well.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/start-here" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-200">
              Start using the guide →
            </Link>
            <Link href="/mission" className="rounded-full border border-amber-200/40 px-5 py-3 text-sm font-black text-amber-50 transition hover:bg-amber-200/10">
              Read the mission →
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
