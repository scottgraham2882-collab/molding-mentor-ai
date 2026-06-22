"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const storageKey = "process-technician-training-progress-v1";
const passingScore = 80;

const sections = [
  {
    title: "Process sheet verification",
    body: "Verify the documented process before touching the press. Match the part number, mold number, material, color, revision, barrel temperatures, mold temperatures, shot size, fill time, transfer position, cushion, pack/hold profile, recovery, cooling, and quality notes to the current job packet.",
    points: ["Confirm the process sheet revision is current", "Compare documented setpoints to actual machine values", "Escalate missing or conflicting data before making adjustments"],
  },
  {
    title: "Fill-only setup",
    body: "Build the process from a controlled fill-only shot so the part is about 95–98% full without pack or hold influence. This separates first-stage filling from second-stage packing and makes defects easier to diagnose with data.",
    points: ["Turn off or minimize hold pressure for the study", "Use consistent material and temperature conditions", "Document fill time, peak pressure, and short-shot appearance"],
  },
  {
    title: "Transfer position",
    body: "Set transfer by screw position whenever possible so the machine switches from fill to pack at the same cavity volume each cycle. A stable transfer point protects the part from overpacking, shorts, flash, and cushion instability.",
    points: ["Transfer before the cavity is completely full", "Watch pressure at transfer for repeatability", "Do not use cosmetic appearance alone to set transfer"],
  },
  {
    title: "Cushion control",
    body: "Cushion is the material left in front of the screw at the end of pack/hold. A consistent cushion confirms the screw did not bottom out and that the shot size, check ring, transfer, and packing conditions are controlled.",
    points: ["Maintain a repeatable cushion from shot to shot", "Investigate drifting or zero cushion immediately", "Record cushion actuals during startup and troubleshooting"],
  },
  {
    title: "Pack and hold setup",
    body: "Pack and hold pressure compensate for material shrinkage until the gate seals. Establish hold pressure and time using part weight, dimensions, sinks, flash, and gate seal evidence rather than guessing from appearance.",
    points: ["Separate fill problems from pack/hold problems", "Use measured part data when adjusting pressure", "Avoid excessive hold pressure that creates stress or flash"],
  },
  {
    title: "Gate seal verification",
    body: "Gate seal studies identify the hold time at which part weight no longer increases. Running beyond gate seal wastes cycle time; running below gate seal can cause sinks, voids, dimensional drift, and inconsistent weights.",
    points: ["Weigh samples at increasing hold times", "Look for the weight plateau", "Set hold time with a documented safety margin"],
  },
  {
    title: "Recovery and screw control",
    body: "Screw recovery must finish with enough time before mold opening and must produce a consistent shot. Monitor recovery time, screw rpm, back pressure, decompression, feed consistency, and melt temperature risk.",
    points: ["Recovery should not control the cycle unless intentionally validated", "Use back pressure to improve melt consistency, not to hide other issues", "Watch for surging, long recovery, or black specks"],
  },
  {
    title: "Cooling time validation",
    body: "Cooling time should be validated with part temperature, dimensions, ejection quality, warp, and cycle stability. Reducing cooling without evidence often transfers cost into scrap, rework, or downstream quality problems.",
    points: ["Confirm parts eject without distortion or sticking", "Check critical dimensions after stable cooling", "Document the approved cycle time and cooling time"],
  },
  {
    title: "Troubleshooting with data",
    body: "Effective process technicians use actual values and trends instead of random knob turning. Compare current data to the validated process, change one variable at a time, record the result, and return to the standard if the change fails.",
    points: ["Collect evidence before changing settings", "Use pressure, time, position, temperature, weight, and inspection data", "Communicate changes through the process change log"],
  },
  {
    title: "Process technician quiz",
    body: "Complete the checklist and pass the quiz to record completion in this browser. The quiz reinforces disciplined setup, transfer, cushion, gate seal, recovery, cooling, and data-driven troubleshooting habits.",
    points: ["Answer all 15 questions", "Passing score is 80%", "Retake after reviewing missed topics if needed"],
  },
];

const checklistItems = [
  "Current process sheet revision, mold, material, and part number verified",
  "Machine actuals compared against documented temperatures, speeds, pressures, and times",
  "Fill-only approach understood and hold influence removed or minimized for startup studies",
  "Transfer position set by documented screw position or approved validated method",
  "Cushion target and acceptable variation reviewed before production release",
  "Pack and hold pressure profile confirmed against process sheet and part requirements",
  "Gate seal method understood with part-weight plateau documented when required",
  "Recovery time, screw rpm, back pressure, and decompression checked for stable shot preparation",
  "Cooling time validated against ejection, dimensions, warp, and quality requirements",
  "Troubleshooting plan uses data, one controlled change at a time, and documented results",
];

const quiz = [
  { question: "What is the first step before adjusting an established process?", options: ["Verify the current process sheet and compare it to actual machine values", "Increase hold pressure", "Shorten cooling time", "Change multiple settings quickly"], answer: 0 },
  { question: "What is the purpose of a fill-only study?", options: ["To separate first-stage filling from pack and hold effects", "To prove cooling is unnecessary", "To bypass process documentation", "To run production without inspection"], answer: 0 },
  { question: "A typical fill-only short shot should be approximately:", options: ["95–98% full", "50% full", "Completely packed", "Flashed at the parting line"], answer: 0 },
  { question: "Transfer position is commonly preferred over pressure transfer because it:", options: ["Switches at a repeatable screw position and cavity volume", "Ignores material viscosity", "Eliminates the need for cushion", "Automatically fixes all defects"], answer: 0 },
  { question: "What does a zero cushion usually indicate?", options: ["The screw may be bottoming out and pack control may be lost", "The process is always ideal", "The mold is too cold", "Cooling time is too long"], answer: 0 },
  { question: "Consistent cushion helps confirm:", options: ["Repeatable shot delivery and pack control", "No inspection is needed", "The gate is always open", "The hopper is empty"], answer: 0 },
  { question: "Pack and hold settings should primarily be validated with:", options: ["Measured part data such as weight, dimensions, sinks, voids, and flash", "Operator preference only", "A random pressure increase", "Cycle counter totals"], answer: 0 },
  { question: "Gate seal is commonly identified when:", options: ["Part weight stops increasing as hold time is extended", "The barrel reaches maximum temperature", "The robot enters the mold", "The screw recovery alarm turns on"], answer: 0 },
  { question: "Running hold time far beyond gate seal usually:", options: ["Wastes cycle time without adding useful packing", "Improves every dimension indefinitely", "Eliminates material drying", "Prevents all flash"], answer: 0 },
  { question: "Recovery should normally finish:", options: ["Before cooling ends with enough margin for a stable cycle", "After mold open every cycle", "Only after parts are inspected", "Before material enters the barrel"], answer: 0 },
  { question: "Back pressure is used mainly to:", options: ["Improve melt mixing and shot consistency when applied appropriately", "Replace mold temperature control", "Remove the need for drying", "Set clamp tonnage"], answer: 0 },
  { question: "Cooling time validation should include:", options: ["Ejection quality, part temperature, dimensions, warp, and stability", "Only the fastest possible cycle", "Only the operator's opinion", "Only resin color"], answer: 0 },
  { question: "When troubleshooting, the technician should change:", options: ["One variable at a time and record the result", "Every available setting", "Only undocumented settings", "Nothing, even if data shows a problem"], answer: 0 },
  { question: "Which data is useful for process troubleshooting?", options: ["Pressure, time, position, temperature, weight, dimensions, and visual evidence", "Only part color", "Only shift rumors", "Only packaging count"], answer: 0 },
  { question: "What score is required to pass this module?", options: ["80%", "50%", "60%", "100% only"], answer: 0 },
];

type SavedProgress = {
  checked: boolean[];
  answers: (number | null)[];
  submitted: boolean;
};

export default function ProcessTechnicianTrainingPage() {
  const [checked, setChecked] = useState<boolean[]>(() => checklistItems.map(() => false));
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedProgress;
        setChecked(checklistItems.map((_, index) => Boolean(parsed.checked?.[index])));
        setAnswers(quiz.map((_, index) => parsed.answers?.[index] ?? null));
        setSubmitted(Boolean(parsed.submitted));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ checked, answers, submitted }));
  }, [answers, checked, hydrated, submitted]);

  const checklistProgress = Math.round((checked.filter(Boolean).length / checklistItems.length) * 100);
  const answeredProgress = Math.round((answers.filter((answer) => answer !== null).length / quiz.length) * 100);
  const score = useMemo(() => answers.reduce<number>((total, answer, index) => total + (answer === quiz[index].answer ? 1 : 0), 0), [answers]);
  const scorePercent = Math.round((score / quiz.length) * 100);
  const passed = submitted && scorePercent >= passingScore;
  const overallProgress = Math.round((checklistProgress + answeredProgress + (passed ? 100 : 0)) / 3);

  function resetProgress() {
    setChecked(checklistItems.map(() => false));
    setAnswers(quiz.map(() => null));
    setSubmitted(false);
    window.localStorage.removeItem(storageKey);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/50 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <Link href="/" className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100 hover:bg-cyan-300/10">← Back to Training Tools</Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Process Technician Training Module</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Scientific Startup, Validation & Troubleshooting</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">A mobile-first dark-theme module for process technicians covering process sheet verification, fill-only setup, transfer, cushion, pack/hold, gate seal, recovery, cooling, and data-driven troubleshooting.</p>
        </header>

        <section className="sticky top-0 z-10 mt-4 rounded-3xl border border-white/10 bg-slate-950/90 p-4 shadow-xl shadow-slate-950/30 backdrop-blur">
          <div className="grid gap-3 sm:grid-cols-4">
            <p className="text-sm font-bold text-white">Overall progress: {overallProgress}%</p>
            <p className="text-sm font-bold text-cyan-200">Checklist: {checklistProgress}%</p>
            <p className="text-sm font-bold text-emerald-200">Quiz answered: {answeredProgress}%</p>
            <p className="text-sm font-bold text-amber-200">Passing score: {passingScore}%</p>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 transition-all" style={{ width: `${overallProgress}%` }} /></div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {sections.map((section, index) => (
            <article key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">Section {index + 1}</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{section.body}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">{section.points.map((point) => <li key={point} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />{point}</li>)}</ul>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-950/20 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Interactive process technician checklist</h2>
          <p className="mt-2 text-sm text-slate-300">Checklist selections, quiz answers, and completion status are saved automatically in this browser.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {checklistItems.map((item, index) => (
              <label key={item} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm font-semibold text-slate-200">
                <input type="checkbox" checked={checked[index]} onChange={() => setChecked((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} className="mt-1 h-5 w-5 rounded border-white/20 bg-slate-900 accent-emerald-300" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Process technician quiz</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Answer all 15 questions, then submit. A score of {passingScore}% or higher unlocks the completion screen.</p>
          <ol className="mt-5 space-y-4">
            {quiz.map((item, index) => (
              <li key={item.question} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="font-bold text-white">{index + 1}. {item.question}</p>
                <div className="mt-3 grid gap-2">
                  {item.options.map((option, optionIndex) => (
                    <label key={option} className="flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
                      <input type="radio" name={`process-technician-question-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => current.map((value, answerIndex) => answerIndex === index ? optionIndex : value))} className="mt-1 accent-cyan-300" />
                      {option}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => setSubmitted(true)} className="rounded-2xl bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 transition hover:bg-cyan-200">Submit quiz</button>
            <button type="button" onClick={resetProgress} className="rounded-2xl border border-white/15 px-5 py-4 text-base font-black text-slate-100 transition hover:bg-white/10">Reset saved progress</button>
          </div>
          {submitted ? <p className="mt-4 text-lg font-bold text-white">Score: {score}/{quiz.length} ({scorePercent}%) — {passed ? "Passed" : "Review the module and try again"}</p> : null}
        </section>

        {passed ? (
          <section className="mt-6 rounded-[2rem] border border-amber-300/40 bg-gradient-to-br from-amber-300/20 to-cyan-300/10 p-6 text-center shadow-2xl shadow-amber-950/20 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Completion recorded</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Process Technician Training Complete</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">You completed the process technician checklist and passed the 15-question quiz with {scorePercent}%. This completion is stored in local browser storage for this device.</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
