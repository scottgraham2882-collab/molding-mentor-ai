import Link from "next/link";

const principles = [
  "Help People Learn",
  "Help People Troubleshoot",
  "Preserve Knowledge",
  "Keep It Simple",
  "Support Collaboration",
  "The 5 Whys Principle",
  "Humility Before Ego",
  "People First",
];

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-3xl border border-cyan-300/20 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Mission</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">
            Why We Built Molding Mentor AI
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            A simple guide for learning, troubleshooting, preserving knowledge, and working together on the shop floor.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 sm:p-8">
          <h2 className="text-2xl font-black text-white">Mission:</h2>
          <p className="mt-3 text-base leading-7 text-slate-300 sm:text-lg">
            Help operators, technicians, supervisors, and managers learn injection molding, troubleshoot problems using structured thinking, preserve manufacturing knowledge, and collaborate effectively to improve manufacturing processes.
          </p>
        </section>

        <section className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-slate-950/20 sm:p-8">
          <h2 className="text-2xl font-black text-white">Core Principles:</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {principles.map((principle) => (
              <li key={principle} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-base font-bold text-emerald-50">
                <span className="text-emerald-300" aria-hidden="true">•</span>
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm font-bold leading-6 text-amber-50 sm:p-6 sm:text-base">
          Keep it simple: use evidence before assumptions, share what you learn, and ask for help before pride becomes the problem.
        </section>
      </section>
    </main>
  );
}
