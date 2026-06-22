import Link from "next/link";

const coachingFields = [
  "Employee name and role",
  "Coaching date and supervisor",
  "Observed strength or standard followed",
  "Performance gap or improvement need",
  "Agreed action plan and support needed",
  "Follow-up date and completion notes",
];

const coachingSteps = [
  "Start with the observed behavior and the production, quality, safety, or teamwork standard it connects to.",
  "Ask for the employee's view before documenting assumptions or next steps.",
  "Agree on one or two measurable actions that can be verified during normal floor observation.",
  "Schedule follow-up before closing the conversation so coaching turns into skill growth.",
];

export default function EmployeePerformanceCoachingLog() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <Link href="/" className="text-sm font-bold text-cyan-200 hover:text-cyan-100">
            ← Back to dashboard
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            Supervisor tool
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            Employee Performance Coaching Log
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Use this mobile-friendly guide to prepare consistent coaching notes for employee development while keeping the conversation focused on standards, support, and follow-up.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2" aria-label="Coaching log sections">
          <article className="rounded-[1.75rem] border border-cyan-300/20 bg-cyan-300/10 p-6 shadow-xl shadow-cyan-950/20">
            <h2 className="text-2xl font-black text-white">Log details to capture</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-200">
              {coachingFields.map((field) => (
                <li key={field} className="rounded-2xl border border-white/10 bg-white/10 p-3">
                  {field}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.75rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-xl shadow-emerald-950/20">
            <h2 className="text-2xl font-black text-white">Coaching flow</h2>
            <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-200">
              {coachingSteps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-white/10 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-sm font-black text-slate-950">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-slate-950/30">
          <h2 className="text-2xl font-black text-white">Printable note template</h2>
          <div className="mt-5 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            {coachingFields.map((field) => (
              <div key={field} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="font-bold text-cyan-100">{field}</p>
                <div className="mt-4 h-20 rounded-xl border border-dashed border-white/20" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
