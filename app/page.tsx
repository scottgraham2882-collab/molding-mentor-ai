import Link from "next/link";

const recommendations = [
  "Describe the defect, material, tool, machine settings, and when the issue started.",
  "Check one variable at a time so each process change can be measured clearly.",
  "Review fill, pack, cooling, and venting before making large parameter changes.",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Injection molding coach
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Molding Mentor AI
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Enter a molding problem and get structured troubleshooting guidance for defects,
            process drift, tooling concerns, and scientific molding next steps.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/defects"
              className="inline-flex justify-center rounded-2xl border border-cyan-300/30 px-5 py-3 text-base font-bold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
            >
              Open Defect Library
            </Link>
            <Link
              href="/troubleshooting"
              className="inline-flex justify-center rounded-2xl bg-cyan-300 px-5 py-3 text-base font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30"
            >
              Open Troubleshooting Assistant
            </Link>
          </div>

          <form className="mt-8 space-y-5">
            <label htmlFor="problem" className="block text-sm font-medium text-slate-200">
              Injection molding problem
            </label>
            <textarea
              id="problem"
              name="problem"
              rows={6}
              placeholder="Example: We are seeing short shots on a glass-filled nylon part after a material lot change..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/20"
            />
            <button
              type="button"
              className="w-full rounded-2xl bg-cyan-300 px-5 py-3 text-base font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30 sm:w-auto"
            >
              Ask Coach
            </button>
          </form>

          <section className="mt-8 rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-5">
            <h2 className="text-xl font-semibold text-white">Troubleshooting recommendations</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300 sm:text-base">
              {recommendations.map((recommendation) => (
                <li key={recommendation} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
