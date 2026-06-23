"use client";

import Link from "next/link";

import { FeedbackPrompt } from "../../components/FeedbackPrompt";
import { useMemo, useState } from "react";

import { DefectEducationPanels } from "../../components/DefectEducationPanels";
import { LearnMoreAboutThis } from "../../components/LearnMoreAboutThis";
import { RecommendedNextStepEngine } from "../../components/RecommendedNextStepEngine";
import { defectGuides } from "../../lib/defect-data";
import { getTroubleshootingNextStepContext } from "../../lib/next-step-engine";

type WizardAnswers = {
  defectSlug: string;
  location: string;
  timing: string;
  recentChange: string;
};

const partLocations = [
  "At the gate or sprue",
  "At the end of fill",
  "On a parting line, shutoff, insert, or ejector pin",
  "On a thick rib, boss, corner, or heavy wall",
  "Across a wide surface or several cavities",
];

const startTimes = [
  "Right after startup or mold change",
  "After a material, color, or lot change",
  "After tool cleaning, repair, or maintenance",
  "It slowly got worse during the run",
  "Only on certain cavities, shifts, or machines",
];

const recentChanges = [
  "Material, colorant, regrind, dryer, or loader changed",
  "Machine settings, setup sheet, barrel heats, or water settings changed",
  "Mold maintenance, vent cleaning, insert work, or hot-runner work happened",
  "Operator handling, trim, inspection, or packaging changed",
  "Nothing obvious changed yet",
];

const beginnerFlow = [
  {
    title: "1. What do you see?",
    helper: "Pick the name that looks closest. If you are not sure, choose the closest match and use Photo Analysis next.",
  },
  {
    title: "2. Where is it on the part?",
    helper: "Location helps separate fill, pack, cooling, material, and tooling problems.",
  },
  {
    title: "3. When did it start?",
    helper: "The start time points to what changed first.",
  },
  {
    title: "4. What changed recently?",
    helper: "Most defects follow a recent change in material, machine, mold, method, or measurement.",
  },
];

const safeActionFallbacks = [
  "Save one good part and one bad part with cavity number, time, and shift.",
  "Compare the current setup to the approved process sheet before changing settings.",
  "Record the current cushion, fill time, peak pressure, melt temperature, mold temperature, and water flow if available.",
];

function makeFirstCheck(defect: (typeof defectGuides)[number], answers: WizardAnswers) {
  return [
    defect.checkFirst[0],
    `Confirm the mark location: ${answers.location}.`,
    `Review what happened when it started: ${answers.timing}.`,
  ];
}

function makeDoNotChangeFirst(defect: (typeof defectGuides)[number], answers: WizardAnswers) {
  if (answers.recentChange.includes("Material")) {
    return "Do not start by changing pack, fill speed, or temperatures until the resin, color, regrind, dryer, and lot are verified.";
  }

  if (answers.recentChange.includes("Mold")) {
    return "Do not chase the issue with machine settings until vents, shutoffs, inserts, hot-runner drops, and maintenance work are checked.";
  }

  if (defect.processAreas.includes("Pack/hold")) {
    return "Do not make large pack or hold changes first. Verify cushion, transfer, part weight, and gate seal evidence.";
  }

  if (defect.processAreas.includes("Cooling")) {
    return "Do not shorten cooling or raise temperatures first. Confirm water flow, mold temperature, and part temperature.";
  }

  return "Do not make several setting changes at once. Avoid changing the process before checking the obvious material, mold, and setup items.";
}

function makeSafeActions(defect: (typeof defectGuides)[number]) {
  return [defect.actions[0], ...safeActionFallbacks].slice(0, 3);
}

export default function TroubleshootingPage() {
  const [answers, setAnswers] = useState<WizardAnswers>({
    defectSlug: defectGuides[0]?.slug ?? "",
    location: partLocations[0],
    timing: startTimes[0],
    recentChange: recentChanges[0],
  });

  const likelyDefect = useMemo(
    () => defectGuides.find((defect) => defect.slug === answers.defectSlug) ?? defectGuides[0],
    [answers.defectSlug],
  );

  const firstChecks = makeFirstCheck(likelyDefect, answers);
  const safeActions = makeSafeActions(likelyDefect);
  const doNotChangeFirst = makeDoNotChangeFirst(likelyDefect, answers);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Troubleshooting Wizard
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_20rem] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find the first safe troubleshooting step
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Answer four plain-language questions. The wizard gives a likely defect, what to check first, what not to change first, and safe first actions for a new operator or process technician.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-bold leading-6 text-amber-100">
              Reminder: Make one change at a time and document the result.
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Step-by-step flow</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Start with what you can see</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-slate-300">Use the part, the setup sheet, and recent change history before touching machine settings.</p>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4">
                <span className="block text-lg font-black text-white">{beginnerFlow[0].title}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-300">{beginnerFlow[0].helper}</span>
                <select
                  value={answers.defectSlug}
                  onChange={(event) => setAnswers((current) => ({ ...current, defectSlug: event.target.value }))}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-base font-bold text-white focus:border-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
                >
                  {defectGuides.map((defect) => (
                    <option key={defect.slug} value={defect.slug}>{defect.name}</option>
                  ))}
                </select>
              </label>

              {[
                { key: "location", options: partLocations, ...beginnerFlow[1] },
                { key: "timing", options: startTimes, ...beginnerFlow[2] },
                { key: "recentChange", options: recentChanges, ...beginnerFlow[3] },
              ].map((step) => (
                <fieldset key={step.key} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <legend className="text-lg font-black text-white">{step.title}</legend>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{step.helper}</p>
                  <div className="mt-3 grid gap-2">
                    {step.options.map((option) => (
                      <label key={option} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm leading-5 text-slate-200 has-[:checked]:border-cyan-300/60 has-[:checked]:bg-cyan-300/10">
                        <input
                          type="radio"
                          name={step.key}
                          value={option}
                          checked={answers[step.key as keyof WizardAnswers] === option}
                          onChange={(event) => setAnswers((current) => ({ ...current, [step.key]: event.target.value }))}
                          className="mt-1 h-4 w-4 shrink-0 accent-cyan-300"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-slate-950/20 sm:p-6 lg:sticky lg:top-6 lg:self-start">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Results</p>
            <h2 className="mt-2 text-2xl font-black text-white">Likely defect: {likelyDefect.name}</h2>
            <p className="mt-3 text-sm leading-6 text-emerald-50/90">{likelyDefect.description}</p>

            <div className="mt-5 space-y-4">
              <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <h3 className="font-black text-white">What to check first</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
                  {firstChecks.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section className="rounded-2xl border border-rose-300/30 bg-rose-300/10 p-4">
                <h3 className="font-black text-rose-100">What NOT to change first</h3>
                <p className="mt-2 text-sm leading-6 text-rose-50/90">{doNotChangeFirst}</p>
              </section>

              <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <h3 className="font-black text-white">Top 3 possible causes</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-300">
                  {likelyDefect.causes.slice(0, 3).map((cause) => <li key={cause}>{cause}</li>)}
                </ol>
              </section>

              <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <h3 className="font-black text-white">Safe first actions</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
                  {safeActions.map((action) => <li key={action}>{action}</li>)}
                </ul>
              </section>

              <DefectEducationPanels defect={likelyDefect} compact />
              <LearnMoreAboutThis defectSlug={likelyDefect.slug} defectName={likelyDefect.name} />
            </div>
          </aside>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/defects" className="rounded-2xl border border-cyan-300/30 bg-slate-900/70 p-4 font-black text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10">
              Defect Library →
              <span className="mt-1 block text-sm font-medium leading-5 text-slate-300">Read the full guide for this defect.</span>
            </Link>
            <Link href="/coach" className="rounded-2xl border border-cyan-300/30 bg-slate-900/70 p-4 font-black text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10">
              AI Coach →
              <span className="mt-1 block text-sm font-medium leading-5 text-slate-300">Ask follow-up questions about the process.</span>
            </Link>
            <Link href="/photo-analysis" className="rounded-2xl border border-cyan-300/30 bg-slate-900/70 p-4 font-black text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10">
              Defect Photo Analysis →
              <span className="mt-1 block text-sm font-medium leading-5 text-slate-300">Use a part photo if the defect name is uncertain.</span>
            </Link>
          </div>
        </section>

        <RecommendedNextStepEngine
          context={getTroubleshootingNextStepContext(likelyDefect.slug)}
          intro="After the wizard points you in a direction, choose one focused follow-up step."
        />

        <FeedbackPrompt page="Troubleshooting Wizard" />
      </div>
    </main>
  );
}
