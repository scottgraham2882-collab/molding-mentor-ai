"use client";

import { useState } from "react";
import Link from "next/link";

import { defectGuides } from "../../../lib/defect-data";

type Defect = {
  name: string;
  summary: string;
  materialCauses: string[];
  processChecks: string[];
  handlingChecks: string[];
  correctiveActions: string[];
};

const defects: Defect[] = defectGuides.map((defect) => ({
  name: defect.name,
  summary: defect.description,
  materialCauses: defect.materialChecks.map((check) => `Review ${check.toLowerCase()} as a possible material contributor.`),
  processChecks: defect.processAreas.map((area) => `Confirm ${area.toLowerCase()} is stable and matches the approved process.`),
  handlingChecks: [
    "Verify resin grade, lot, colorant, regrind percentage, and material labels.",
    "Confirm dryer settings, dew point, residence time, and hopper/loading cleanliness.",
    "Check recent material changes, open containers, purging, and segregation practices.",
  ],
  correctiveActions: defect.actions,
}));

export default function MaterialDefectTroubleshooterPage() {
  const [selectedDefect, setSelectedDefect] = useState(defects[0]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.18),transparent_34%)]" />
          <div className="relative">
            <Link
              href="/materials/resin-drying"
              className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
            >
              ← Material guides
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Material troubleshooting
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Material Defect Troubleshooter
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Select a visible defect to review likely material contributors, process checks, handling checks, and practical corrective actions before changing the process.
            </p>
          </div>
        </header>

        <aside className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5 text-sm font-semibold leading-6 text-amber-100 shadow-xl shadow-amber-950/20 sm:p-6">
          Always verify resin condition, drying data, lot changes, and supplier technical data sheets.
        </aside>

        <section className="grid gap-5 lg:grid-cols-[18rem_1fr]" aria-label="Material defect troubleshooting selector">
          <nav className="rounded-3xl border border-white/10 bg-white/10 p-3 shadow-xl shadow-slate-950/20 backdrop-blur" aria-label="Defect options">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {defects.map((defect) => {
                const isSelected = defect.name === selectedDefect.name;

                return (
                  <button
                    key={defect.name}
                    type="button"
                    onClick={() => setSelectedDefect(defect)}
                    className={`rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus:ring-4 focus:ring-cyan-300/20 ${
                      isSelected
                        ? "border-cyan-300/50 bg-cyan-300/15 text-white shadow-lg shadow-cyan-950/30"
                        : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-cyan-300/30 hover:bg-white/10"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className="block text-base font-bold">{defect.name}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">Tap to view checks</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-300">Selected defect</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">{selectedDefect.name}</h2>
              </div>
              <span className="w-fit rounded-full border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-teal-100">
                Material focus
              </span>
            </div>
            <p className="mt-5 text-base leading-7 text-slate-300">{selectedDefect.summary}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Checklist title="Possible material causes" items={selectedDefect.materialCauses} accent="text-cyan-300" />
              <Checklist title="Machine/process checks" items={selectedDefect.processChecks} accent="text-emerald-300" />
              <Checklist title="Material handling checks" items={selectedDefect.handlingChecks} accent="text-amber-300" />
              <Checklist title="Corrective actions" items={selectedDefect.correctiveActions} accent="text-violet-300" />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

function Checklist({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
      <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${accent}`}>{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={accent} aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
