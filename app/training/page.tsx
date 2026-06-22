import Link from "next/link";

const modules = [
  "Fill-only studies and transfer position discipline",
  "Gate seal, pack pressure, and hold-time validation",
  "Cooling balance, mold temperature, and water-flow checks",
  "Documented process windows and one-variable-at-a-time changes",
];

export default function TrainingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Scientific Molding Training
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build a repeatable troubleshooting foundation
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Use these training topics to align technicians, processors, and engineers around stable scientific molding methods.
          </p>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <article
              key={module}
              className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6"
            >
              <h2 className="text-xl font-bold text-white">{module}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Capture the current standard, run the study with measured data, and document what changed before releasing the process.
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
