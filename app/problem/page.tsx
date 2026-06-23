"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ProblemOption = {
  symptom: string;
  likelyDefect: string;
  checkFirst: string;
  doNotChangeFirst: string;
  safeFirstAction: string;
};

const problemOptions: ProblemOption[] = [
  { symptom: "Part is not full", likelyDefect: "Short shot", checkFirst: "Check if the hopper has material, the dryer is running, and the shot cushion is steady.", doNotChangeFirst: "Do not raise melt temperature first. Heat can hide the real cause and may create burn marks or weak parts.", safeFirstAction: "Make one fill-only check, compare it to the setup sheet, and tell a technician if the part is still short." },
  { symptom: "Extra plastic / flash", likelyDefect: "Flash", checkFirst: "Look for plastic leaking at the parting line, vents, ejector pins, or damaged shutoff areas.", doNotChangeFirst: "Do not add more pack pressure first. More pressure often makes flash worse.", safeFirstAction: "Clean the mold face if allowed, verify clamp and setup sheet values, and save a flashed sample." },
  { symptom: "Burn marks", likelyDefect: "Burning or diesel marks", checkFirst: "Check whether the mark is near the end of fill, a rib, a vent, or a trapped-air area.", doNotChangeFirst: "Do not raise injection speed first. Faster fill can trap air harder and make burns worse.", safeFirstAction: "Slowly confirm vents are clean and ask for help before changing speed, pressure, or temperature." },
  { symptom: "Silver streaks", likelyDefect: "Splay or silver streaking", checkFirst: "Check material drying, moisture, hopper cover, resin lot, colorant, and whether streaks follow flow direction.", doNotChangeFirst: "Do not raise barrel heat first. More heat can make wet or degraded material look worse.", safeFirstAction: "Confirm dryer temperature, time, airflow, and material type before changing the press setup." },
  { symptom: "Bubbles or voids", likelyDefect: "Voids or trapped gas", checkFirst: "Cut or inspect a sample if allowed and check whether bubbles are inside thick sections or near the surface.", doNotChangeFirst: "Do not increase cooling time first unless the process owner asks. It may not fix missing pack pressure or gas.", safeFirstAction: "Save good and bad samples, verify cushion is stable, and review pack/hold readings with a technician." },
  { symptom: "Warped part", likelyDefect: "Warpage", checkFirst: "Check part temperature at ejection, cooling water flow, mold temperature, and whether the part is being bent after ejection.", doNotChangeFirst: "Do not change only one mold temperature zone first without checking water flow and part handling.", safeFirstAction: "Place parts on a flat surface, let them cool the same way, and compare cavities before changing the process." },
  { symptom: "Sink mark", likelyDefect: "Sink", checkFirst: "Look at thick walls, ribs, bosses, and areas opposite heavy features where the surface pulls inward.", doNotChangeFirst: "Do not only add more cooling time first. Sink is often tied to packing, gate seal, or part thickness.", safeFirstAction: "Mark the sink location, keep samples by cavity, and verify hold pressure/time and cushion are stable." },
  { symptom: "Part is sticking", likelyDefect: "Sticking or ejection issue", checkFirst: "Check whether the part sticks on the core, cavity, slides, lifters, or ejector pins.", doNotChangeFirst: "Do not spray mold release first unless your plant allows it. Spray can hide tooling issues and contaminate parts.", safeFirstAction: "Stop if parts are hanging up, save the sample, and ask for help before forcing parts out of the mold." },
  { symptom: "Size is wrong", likelyDefect: "Dimensional issue", checkFirst: "Confirm the gauge, measurement method, part cooling time, cavity number, and print tolerance.", doNotChangeFirst: "Do not adjust pressure or temperature first until measurement and cooling conditions are confirmed.", safeFirstAction: "Measure several parts the same way after they cool, then compare the trend to the process sheet." },
  { symptom: "Color looks wrong", likelyDefect: "Color variation or contamination", checkFirst: "Check resin, colorant, regrind, purge history, hopper mix, and whether old material is still in the barrel.", doNotChangeFirst: "Do not raise barrel temperature first. Heat may darken material or make contamination harder to diagnose.", safeFirstAction: "Keep a clean sample, verify the material/color code, and purge only by the approved work instruction." },
];

export default function ProblemPage() {
  const [selectedSymptom, setSelectedSymptom] = useState(problemOptions[0].symptom);
  const selectedProblem = useMemo(() => problemOptions.find((option) => option.symptom === selectedSymptom) ?? problemOptions[0], [selectedSymptom]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10">← Back home</Link>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Problem helper</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">I&apos;m Having a Problem</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Pick what you see on the part. This beginner-friendly guide gives a safe first step before anyone starts changing machine settings.</p>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1fr_22rem]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/25 sm:p-6">
            <h2 className="text-2xl font-black text-white">What are you seeing?</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {problemOptions.map((option) => (
                <button key={option.symptom} type="button" onClick={() => setSelectedSymptom(option.symptom)} className={`rounded-2xl border p-4 text-left text-base font-black transition focus:outline-none focus:ring-4 focus:ring-cyan-300/20 ${selectedSymptom === option.symptom ? "border-cyan-200 bg-cyan-300 text-slate-950" : "border-white/10 bg-slate-950/70 text-slate-100 hover:border-cyan-300/50 hover:bg-white/10"}`}>
                  {option.symptom}
                </button>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-emerald-300/20 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/25 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Result</p>
            <h2 className="mt-2 text-3xl font-black text-white">{selectedProblem.likelyDefect}</h2>
            <ResultBlock title="What to check first" text={selectedProblem.checkFirst} />
            <ResultBlock title="What not to change first" text={selectedProblem.doNotChangeFirst} />
            <ResultBlock title="Safe first action" text={selectedProblem.safeFirstAction} />
          </aside>
        </section>

        <section className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/80 p-5 sm:p-6">
          <h2 className="text-2xl font-black text-white">Need more help?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <HelpLink href="/troubleshooting" label="Troubleshooting Wizard" helper="Answer more questions." />
            <HelpLink href="/photo-analysis" label="Defect Photo Analysis" helper="Use a part picture." />
            <HelpLink href="/defects" label="Defect Library" helper="Read the full guide." />
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultBlock({ title, text }: { title: string; text: string }) {
  return <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4"><h3 className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">{title}</h3><p className="mt-2 text-sm font-semibold leading-6 text-slate-200">{text}</p></section>;
}

function HelpLink({ href, label, helper }: { href: string; label: string; helper: string }) {
  return <Link href={href} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-cyan-300/50 hover:bg-white/10"><span className="block text-lg font-black text-cyan-100">{label} →</span><span className="mt-1 block text-sm font-semibold text-slate-300">{helper}</span></Link>;
}
