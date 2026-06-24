"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AdjustmentGuide = {
  symptom: string;
  description: string;
  confirmFirst: string[];
  avoidFirst: string;
  adjustments: {
    setting: string;
    direction: string;
    why: string;
    watchFor: string;
  }[];
};

const adjustmentGuides: AdjustmentGuide[] = [
  {
    symptom: "Short shot / not full",
    description: "Use when the part is consistently missing material after material feed and setup-sheet checks are complete.",
    confirmFirst: ["Hopper has material and feed throat is not bridged.", "Cushion is stable and not bottoming out.", "Actual fill time and transfer position match the approved setup."],
    avoidFirst: "Do not raise melt temperature first unless the process owner confirms viscosity is the issue.",
    adjustments: [
      { setting: "Shot size", direction: "Increase in a small step if cushion is too low.", why: "Restores available material before changing pressure or heat.", watchFor: "Excess cushion, flash, or overpacked dimensions." },
      { setting: "Transfer position", direction: "Transfer later if the process is switching to hold too early.", why: "Lets first-stage fill complete before pack/hold takes over.", watchFor: "Pressure spike, flash, or a sudden cushion drop." },
      { setting: "Injection speed", direction: "Increase slightly if the part freezes before filling.", why: "Gets material through thin sections before the flow front cools.", watchFor: "Burns, blush, jetting, or shear splay." },
    ],
  },
  {
    symptom: "Flash",
    description: "Use when extra plastic appears at the parting line, vents, lifters, slides, ejector pins, or shutoff areas.",
    confirmFirst: ["Mold is fully clamped and parting line is clean.", "Flash location is identified by cavity and feature.", "No recent material, mold, or setup change explains lower viscosity or a gap."],
    avoidFirst: "Do not add hold pressure or more material first; that usually makes flash worse.",
    adjustments: [
      { setting: "Transfer position", direction: "Transfer earlier in a small step if the cavity is overfilled in first stage.", why: "Reduces pressure at the end of fill before hold begins.", watchFor: "Short shots, sinks, or lower part weight." },
      { setting: "Hold pressure", direction: "Reduce gradually if flash starts during pack/hold.", why: "Limits force pushing plastic into small gaps after fill.", watchFor: "Sink, voids, dimensional shrink, or low part weight." },
      { setting: "Clamp force / mold condition", direction: "Escalate if process settings are normal and flash remains localized.", why: "Persistent localized flash may be tooling, clamp, or damage related.", watchFor: "Repeat flash at one cavity, shutoff, vent, or damaged edge." },
    ],
  },
  {
    symptom: "Sink / voids",
    description: "Use when thick sections pull inward, internal voids are found, or part weight trends low after fill is stable.",
    confirmFirst: ["Gate seal time is known or a gate seal study is planned.", "Cushion and part weight are repeatable.", "Cooling water flow and mold temperature are stable."],
    avoidFirst: "Do not only add cooling time before checking pack/hold and gate seal.",
    adjustments: [
      { setting: "Hold pressure", direction: "Increase in a controlled step if part weight is low and flash risk is acceptable.", why: "Adds packing material while the gate is open.", watchFor: "Flash, stress, sticking, or oversized dimensions." },
      { setting: "Hold time", direction: "Increase until part weight stops rising, then do not add extra time.", why: "Keeps pressure on the gate until it freezes.", watchFor: "No weight gain after gate seal, longer cycle with no benefit." },
      { setting: "Melt / mold temperature", direction: "Review only after pack settings are proven.", why: "Temperature can affect shrink, viscosity, and gate freeze behavior.", watchFor: "Cycle-time growth, splay, burns, or dimensional drift." },
    ],
  },
  {
    symptom: "Splay / silver streaks",
    description: "Use when streaks follow flow direction or appear after material, dryer, color, or barrel changes.",
    confirmFirst: ["Dryer temperature, time, airflow, and dew point meet the material requirement.", "Material containers are closed and resin lot/colorant match the job.", "Purge history and contamination risks are documented."],
    avoidFirst: "Do not raise barrel heat first; more heat can worsen moisture, degradation, or shear.",
    adjustments: [
      { setting: "Drying condition", direction: "Correct dryer settings and allow proper residence time.", why: "Moisture is a common root cause for many hygroscopic materials.", watchFor: "Continued splay after the dried material reaches the feed throat." },
      { setting: "Back pressure / screw speed", direction: "Reduce shear if drying is confirmed good.", why: "Excess shear can overheat or aerate the melt.", watchFor: "Poor color mixing, recovery instability, or melt-temperature drift." },
      { setting: "Decompression", direction: "Reduce excessive suckback if air is being pulled into the melt stream.", why: "Too much decompression can introduce bubbles and streaking.", watchFor: "Drooling, stringing, or nozzle leakage." },
    ],
  },
  {
    symptom: "Warp / dimension drift",
    description: "Use when parts change shape or size after ejection, cooling, handling, or cavity-to-cavity imbalance.",
    confirmFirst: ["Parts are measured after the same cooling time with the same gauge method.", "Cavity numbers and part handling are recorded.", "Cooling circuits, flow, and mold-temperature actuals are checked."],
    avoidFirst: "Do not chase dimensions with random pressure changes before confirming measurement and cooling conditions.",
    adjustments: [
      { setting: "Cooling time", direction: "Increase only if parts are too hot or deforming at ejection.", why: "Allows the part to gain stiffness before handling and ejection loads.", watchFor: "Longer cycle without dimensional improvement." },
      { setting: "Mold temperature / water flow", direction: "Balance actual temperatures and restore blocked or restricted circuits.", why: "Uneven cooling drives differential shrink and warpage.", watchFor: "One-sided warp, cavity pattern, or hot spots." },
      { setting: "Pack balance", direction: "Adjust hold only after fill and cooling are repeatable.", why: "Packing changes shrink and dimensions, but can create stress if overused.", watchFor: "Flash, sticking, stress whitening, or weight shift." },
    ],
  },
];

const validationSteps = [
  "Change one setting at a time and record the old value, new value, time, and reason.",
  "Run enough cycles for the process to stabilize before judging the result.",
  "Inspect the original defect and any new risk areas the adjustment could create.",
  "Keep labeled samples from before and after the adjustment.",
  "Update the process change log or approval workflow if the new setting should remain.",
];

export default function ProcessAdjustmentGuidePage() {
  const [selectedSymptom, setSelectedSymptom] = useState(adjustmentGuides[0].symptom);
  const selectedGuide = useMemo(() => adjustmentGuides.find((guide) => guide.symptom === selectedSymptom) ?? adjustmentGuides[0], [selectedSymptom]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10">← Dashboard</Link>
          <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">Process Adjustment Guide MVP</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Adjust with a plan, not a guess</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Pick the symptom, confirm the basics, then review safe adjustment options with the tradeoffs to watch before locking in a process change.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-semibold leading-6 text-amber-100">
              MVP rule: this guide suggests a sequence, but plant approval, safety rules, and the approved process sheet always come first.
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[18rem_1fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-slate-950/25">
            <h2 className="px-1 text-lg font-black text-white">Choose the symptom</h2>
            <div className="mt-4 grid gap-3">
              {adjustmentGuides.map((guide) => (
                <button key={guide.symptom} type="button" onClick={() => setSelectedSymptom(guide.symptom)} className={`rounded-2xl border p-4 text-left text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-cyan-300/20 ${selectedSymptom === guide.symptom ? "border-cyan-200 bg-cyan-300 text-slate-950" : "border-white/10 bg-slate-950/70 text-slate-100 hover:border-cyan-300/50 hover:bg-white/10"}`}>
                  {guide.symptom}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex flex-col gap-5">
            <section className="rounded-[2rem] border border-emerald-300/20 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/25 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Selected guide</p>
              <h2 className="mt-2 text-3xl font-black text-white">{selectedGuide.symptom}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{selectedGuide.description}</p>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <InfoPanel title="Confirm before adjusting" items={selectedGuide.confirmFirst} />
                <section className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-rose-200">Avoid first</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-rose-50">{selectedGuide.avoidFirst}</p>
                </section>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/25 sm:p-6">
              <h2 className="text-2xl font-black text-white">Adjustment sequence</h2>
              <div className="mt-5 grid gap-4">
                {selectedGuide.adjustments.map((adjustment, index) => (
                  <article key={`${selectedGuide.symptom}-${adjustment.setting}`} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-xl font-black text-cyan-100">{index + 1}. {adjustment.setting}</h3>
                      <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">Small step</span>
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm leading-6 lg:grid-cols-3">
                      <GuideDetail label="Direction" value={adjustment.direction} />
                      <GuideDetail label="Why" value={adjustment.why} />
                      <GuideDetail label="Watch for" value={adjustment.watchFor} />
                    </dl>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/80 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Prove the change</p>
              <h2 className="mt-2 text-2xl font-black text-white">Validation checklist</h2>
            </div>
            <Link href="/process-change-log" className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200">Open Change Log</Link>
          </div>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {validationSteps.map((step, index) => (
              <li key={step} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm font-semibold leading-6 text-slate-200">
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300 text-sm font-black text-slate-950">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </section>
    </main>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-200">
        {items.map((item) => (
          <li key={item} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />{item}</li>
        ))}
      </ul>
    </section>
  );
}

function GuideDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-200">{value}</dd>
    </div>
  );
}
