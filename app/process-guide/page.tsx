import Link from "next/link";

const guideSteps = [
  {
    title: "1. Verify the approved setup",
    intent: "Start from the documented process sheet before changing any settings.",
    checks: ["Confirm part, mold, machine, material, color, and revision.", "Compare actual temperatures, times, pressures, and positions to the approved sheet.", "Record anything that is different before making corrections."],
  },
  {
    title: "2. Confirm material condition",
    intent: "Material issues often look like process problems, especially with hygroscopic resins.",
    checks: ["Check resin lot, dryer temperature, drying time, dew point, and hopper residence time.", "Look for contamination, excessive regrind, colorant changes, or open containers.", "Document lot numbers so quality can trace suspect production if needed."],
  },
  {
    title: "3. Establish a stable fill",
    intent: "A repeatable first stage gives every later adjustment a reliable foundation.",
    checks: ["Verify cushion, shot size, transfer position, and fill time stability.", "Use short shots when needed to confirm balanced fill and no hesitation.", "Avoid changing hold pressure to fix a fill-speed or transfer-position issue."],
  },
  {
    title: "4. Validate pack and hold",
    intent: "Hold pressure and time should control weight, sink, voids, and gate freeze without overpacking.",
    checks: ["Review part weight trend and cavity balance before changing pack settings.", "Run or reference a gate seal study when hold time is in question.", "Watch for flash, high clamp load, sticking, or dimensional growth after pack changes."],
  },
  {
    title: "5. Protect cooling and recovery",
    intent: "Cooling, mold temperature, and screw recovery drive cycle consistency and part stability.",
    checks: ["Confirm water circuits, flow, actual mold temperature, and cooling time.", "Keep recovery complete before mold open with a consistent screw recovery time.", "Investigate drifting melt temperature, back pressure, screw speed, and decompression changes."],
  },
  {
    title: "6. Prove the correction",
    intent: "A change is only complete when the defect is reduced and the process remains repeatable.",
    checks: ["Run enough cycles after the change for the process to stabilize.", "Inspect the original defect and any risk areas created by the adjustment.", "Update the change log or approval workflow when the new setting should remain in use."],
  },
];

const commonSignals = [
  { symptom: "Short shot", firstChecks: "Material feed, shot size, transfer position, fill speed, venting, cushion." },
  { symptom: "Flash", firstChecks: "Clamp force, parting line condition, transfer point, hold pressure, material viscosity." },
  { symptom: "Sink or voids", firstChecks: "Gate seal, hold pressure/time, wall thickness, melt temperature, cooling." },
  { symptom: "Splay or silver streaks", firstChecks: "Drying, contamination, barrel temperature, screw decompression, shear." },
  { symptom: "Warp", firstChecks: "Cooling balance, mold temperature, pack balance, ejection, part handling." },
];

export default function ProcessGuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="text-sm font-bold text-cyan-300">← Dashboard</Link>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">Process control</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Process Guide</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Use this shop-floor sequence to check the process in a safe order, avoid random adjustments, and document what changed.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-100">
              Golden rule: change one thing at a time, let the press stabilize, then verify the part before moving on.
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-2">
          {guideSteps.map((step) => (
            <article key={step.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 sm:p-6">
              <h2 className="text-xl font-bold text-white">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-100">{step.intent}</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                {step.checks.map((check) => (
                  <li key={check} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Quick defect triage</p>
              <h2 className="mt-2 text-2xl font-black text-white">Common signals and first checks</h2>
            </div>
            <Link href="/process-change-log" className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
              Open Change Log
            </Link>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-white/10 text-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold">Signal</th>
                  <th className="px-4 py-3 font-bold">Check before adjusting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-300">
                {commonSignals.map((row) => (
                  <tr key={row.symptom}>
                    <td className="px-4 py-3 font-semibold text-white">{row.symptom}</td>
                    <td className="px-4 py-3 leading-6">{row.firstChecks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
