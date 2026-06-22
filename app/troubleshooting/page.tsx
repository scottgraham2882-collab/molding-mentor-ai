"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const troubleshootingGuides = [
  {
    name: "Short Shot",
    questions: [
      "Did the issue begin after a material, colorant, or regrind percentage change?",
      "Are the short areas located at end-of-fill or thin-wall sections?",
      "Has cushion, transfer position, or peak injection pressure changed from the validated setup?",
      "Are gates, runners, vents, or the nozzle showing signs of restriction?",
    ],
    rootCauses: [
      "The cavity is not receiving enough melt volume or pressure before transfer.",
      "The melt front is cooling too quickly because of low melt temperature, low mold temperature, or slow fill speed.",
      "Flow is restricted by blocked gates, cold slugs, worn check rings, poor venting, or material feed problems.",
    ],
    actions: [
      "Confirm shot size, cushion, transfer position, and pressure limit against the process sheet.",
      "Increase injection speed, injection pressure, melt temperature, or mold temperature in controlled steps.",
      "Inspect and clean the nozzle, sprue, runners, gates, vents, check ring, and material feed throat.",
    ],
  },
  {
    name: "Flash",
    questions: [
      "Is flash appearing at the parting line, vents, ejector pins, or inserts?",
      "Did flash start after a clamp, mold maintenance, or setup change?",
      "Are pack pressure, injection speed, or transfer position higher than the validated setup?",
      "Do shutoffs, leader pins, vents, or parting-line surfaces show wear or contamination?",
    ],
    rootCauses: [
      "Cavity pressure is exceeding the mold's ability to stay sealed at a shutoff or parting-line area.",
      "Clamp force, mold alignment, or platen parallelism is not holding the tool closed evenly.",
      "Worn tooling, dirty parting lines, deep vents, or damaged inserts are allowing melt to escape.",
    ],
    actions: [
      "Clean and inspect the parting line, vents, inserts, and shutoffs before changing the process window.",
      "Verify clamp tonnage and mold alignment, then reduce pack pressure, injection speed, or shot size if needed.",
      "Repair worn shutoffs, vent lands, inserts, leader pins, or mold damage found during inspection.",
    ],
  },
  {
    name: "Sink Marks",
    questions: [
      "Are sinks located over ribs, bosses, thick walls, or material accumulation areas?",
      "Has gate freeze time been confirmed with a gate-seal study?",
      "Are pack pressure, pack time, cushion, and hold pressure stable shot to shot?",
      "Are cooling circuits flowing at the expected temperature, pressure, and rate?",
    ],
    rootCauses: [
      "Thick sections continue shrinking after the surface skin freezes, pulling the surface inward.",
      "The gate freezes before enough packing pressure compensates for material shrinkage.",
      "Uneven or insufficient cooling allows localized shrinkage to remain visible on the surface.",
    ],
    actions: [
      "Increase pack pressure and pack time until the part weight plateaus at gate seal.",
      "Verify cooling flow, remove blocked circuits, and adjust mold temperature around thick sections.",
      "Review part design for rib thickness, boss coring, wall transitions, and gate location improvements.",
    ],
  },
  {
    name: "Burn Marks",
    questions: [
      "Are burns appearing at end-of-fill, near ribs, around blind pockets, or at weld lines?",
      "Do vents show contamination, wear, or blocked exhaust paths?",
      "Are injection speed, screw speed, back pressure, or melt temperature above the standard process?",
      "Has material residence time increased because of a small shot size or long cycle interruption?",
    ],
    rootCauses: [
      "Trapped air or gas is being compressed and overheated because it cannot vent from the cavity.",
      "Excess shear from high speeds, pressure, or restrictions is overheating the polymer.",
      "Material is degrading due to excessive residence time, high barrel temperatures, or contamination.",
    ],
    actions: [
      "Clean existing vents and add venting near end-of-fill locations, ribs, weld lines, and blind pockets.",
      "Reduce injection speed, screw speed, back pressure, or melt temperature where shear is excessive.",
      "Purge degraded material and confirm barrel profile, residence time, material drying, and contamination controls.",
    ],
  },
  {
    name: "Splay",
    questions: [
      "Does the material require drying, and are dryer temperature, dew point, and drying time verified?",
      "Do streaks change when using fresh material instead of regrind or suspect material?",
      "Is decompression pulling air into the melt stream after screw recovery?",
      "Are melt temperature, back pressure, screw speed, or injection speed creating excessive shear?",
    ],
    rootCauses: [
      "Moisture or volatiles are vaporizing in the melt and streaking across the part surface.",
      "Air is being entrained from poor feed conditions, excessive suck-back, or turbulent flow paths.",
      "Material is being overheated or shear-degraded before it reaches the cavity surface.",
    ],
    actions: [
      "Verify drying conditions with actual dryer readings and material moisture checks before running production.",
      "Reduce decompression, stabilize feed, isolate regrind or contamination, and inspect hopper throat conditions.",
      "Lower melt temperature, screw speed, back pressure, or injection speed in measured steps.",
    ],
  },
  {
    name: "Warpage",
    questions: [
      "Is the distortion repeatable in the same direction and location each cycle?",
      "Are cooling circuits balanced for flow, temperature, pressure, and blockage?",
      "Do wall thickness changes, ribs, fiber orientation, or gate location drive uneven shrinkage?",
      "Are parts being ejected too hot, packed unevenly, or handled before they stabilize?",
    ],
    rootCauses: [
      "Uneven cooling, wall thickness, or packing creates different shrink rates across the part.",
      "Gate location, flow length, and fiber orientation are locking residual stress into the molded geometry.",
      "Ejection, handling, or fixture conditions are allowing the part to deform before it reaches dimensional stability.",
    ],
    actions: [
      "Balance coolant flow and temperature, clean circuits, and verify mold surface temperature consistency.",
      "Optimize pack pressure, pack time, cooling time, and ejection timing to reduce residual stress.",
      "Review part design, gate location, wall uniformity, and post-mold cooling or fixturing needs.",
    ],
  },
];

export default function TroubleshootingPage() {
  const [selectedDefect, setSelectedDefect] = useState(troubleshootingGuides[0].name);

  const selectedGuide = useMemo(
    () => troubleshootingGuides.find((guide) => guide.name === selectedDefect) ?? troubleshootingGuides[0],
    [selectedDefect],
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <nav className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
            >
              ← Back to coach
            </Link>
            <Link
              href="/defects"
              className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Open Defect Library
            </Link>
          </nav>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Troubleshooting Assistant
          </p>
          <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Diagnose molding defects faster
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Select a defect to review focused questions, likely root causes, and corrective actions for the next process check.
              </p>
            </div>
            <label className="block rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4">
              <span className="text-sm font-semibold text-slate-200">Select a defect</span>
              <select
                value={selectedDefect}
                onChange={(event) => setSelectedDefect(event.target.value)}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base font-semibold text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/20"
              >
                {troubleshootingGuides.map((guide) => (
                  <option key={guide.name} value={guide.name}>
                    {guide.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Step 1
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">Ask these questions</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {selectedGuide.questions.map((question) => (
                <li key={question} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-black text-slate-950">
                    ?
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Step 2
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">Likely root causes</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {selectedGuide.rootCauses.map((cause) => (
                <li key={cause} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-300" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Step 3
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">Corrective actions</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {selectedGuide.actions.map((action) => (
                <li key={action} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
