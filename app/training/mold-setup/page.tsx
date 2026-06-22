"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const storageKey = "mold-setup-training-progress-v1";
const passingScore = 80;

const sections = [
  {
    title: "Pre-mold-change safety",
    body: "Start every setup by controlling energy and traffic around the cell. Confirm the work order, notify affected operators, wear required PPE, and follow site lockout/tagout or authorized setup procedures before entering pinch-point areas.",
    points: ["Review the setup plan before loosening clamps", "Keep hands, tools, and hoses clear of moving platens", "Stop immediately for leaks, damaged guards, or unclear instructions"],
  },
  {
    title: "Mold verification",
    body: "Verify the correct mold, revision, cavity layout, tonnage range, part number, and required auxiliary equipment before the mold is lifted or clamped. Match the mold tag to the router and process sheet.",
    points: ["Confirm mold number and revision", "Inspect locating ring, clamp slots, and leader pins", "Check required cores, hot runner zones, and sensors"],
  },
  {
    title: "Crane/hoist safety awareness",
    body: "Only trained personnel should operate cranes or hoists. Inspect lifting hardware, stay out from under suspended loads, use tag lines where required, and communicate clearly before moving the mold.",
    points: ["Verify rated lifting capacity", "Use approved eyebolts, chains, and lifting points", "Keep the travel path clear and controlled"],
  },
  {
    title: "Water line setup",
    body: "Cooling circuits must match the process sheet so the mold reaches stable temperature and avoids leaks. Confirm supply and return direction, color coding, flow, temperature, and drain paths.",
    points: ["Connect circuits exactly as documented", "Check for cracked hoses or loose fittings", "Verify flow before production release"],
  },
  {
    title: "Hydraulic and air hookups",
    body: "Core pulls, slides, valve gates, and air functions must be connected to the correct ports and sequenced safely. Secure hoses, verify pressure limits, and dry-cycle functions before automatic operation.",
    points: ["Match every hose to the setup sheet", "Confirm quick-connects are fully seated", "Test movement at slow speed before cycling"],
  },
  {
    title: "Mold protection setup",
    body: "Mold protection helps prevent closing on parts, slides, loose hardware, or EOAT interference. Set low-pressure close, position windows, and sensor inputs carefully before full clamp force is enabled.",
    points: ["Set low pressure close before automatic mode", "Confirm ejector return and slide positions", "Do not bypass mold safety alarms"],
  },
  {
    title: "Robot/conveyor setup",
    body: "Automation must match the mold and part removal plan. Verify robot program, EOAT, vacuum, grip confirmation, conveyor direction, guarding, and safe handshakes with the press.",
    points: ["Confirm robot recipe and EOAT attachment", "Test part pickup and drop-off path", "Keep conveyors clear before startup"],
  },
  {
    title: "First shot startup checks",
    body: "First shots prove the mold, process, material, and quality requirements are ready. Start with controlled shots, inspect short/full parts, verify process values, and hold product until approval.",
    points: ["Purge and stabilize material safely", "Label first shots and submit for inspection", "Record actual cycle, temperatures, and pressures"],
  },
  {
    title: "Common setup mistakes",
    body: "Most setup losses come from skipped verification: crossed water lines, wrong mold revision, unsecured clamps, incorrect robot program, missed core hoses, and mold protection left too broad or disabled.",
    points: ["Never assume the previous setup was correct", "Use the checklist even during urgent changeovers", "Escalate mismatches before making parts"],
  },
  {
    title: "Setup technician quiz",
    body: "Complete the checklist and quiz to confirm understanding. A passing score records completion in this browser so the module can be resumed or reviewed later.",
    points: ["Answer all 10 questions", "Passing score is 80%", "Review any missed topics before retesting"],
  },
];

const checklistItems = [
  "Work order, mold number, and process sheet verified",
  "PPE, guards, E-stops, and setup safety requirements confirmed",
  "Crane/hoist path, rigging, and lifting points checked",
  "Mold condition, clamps, locating ring, and platen fit inspected",
  "Water circuits connected, labeled, flowing, and leak-free",
  "Hydraulic and air hookups matched to the setup sheet",
  "Core pulls, slides, valve gates, and ejectors dry-cycled safely",
  "Mold protection low-pressure close and sensor checks set",
  "Robot, EOAT, conveyor, and press handshakes verified",
  "First shots labeled, inspected, and held for startup approval",
];

const quiz = [
  { question: "What should be verified before loosening or moving a mold?", options: ["The work order, mold ID, setup plan, and safety controls", "Only the machine cycle counter", "Only the next box label", "That the press is in automatic mode"], answer: 0 },
  { question: "Who should operate a crane or hoist during a mold change?", options: ["A trained and authorized person following site rules", "Anyone available on the shift", "Only the newest technician", "The quality inspector"], answer: 0 },
  { question: "Why must water circuits match the process sheet?", options: ["To maintain mold temperature and prevent leaks or crossed flow", "To make the mold heavier", "To reduce the need for inspection", "To bypass cooling time"], answer: 0 },
  { question: "Before automatic cycling, hydraulic or air functions should be:", options: ["Connected correctly and tested at safe speed or pressure", "Left disconnected until production starts", "Tied together if labels are missing", "Adjusted only after a crash"], answer: 0 },
  { question: "Mold protection is intended to help prevent:", options: ["Closing on obstructions, parts, or out-of-position components", "Material drying problems", "Operator training records", "Barrel temperature alarms"], answer: 0 },
  { question: "If the robot recipe does not match the installed mold, the technician should:", options: ["Stop and load or verify the correct program before cycling", "Run slowly in automatic", "Disable the robot alarm", "Move the conveyor closer"], answer: 0 },
  { question: "First shots should be:", options: ["Labeled, inspected, and held until startup approval", "Mixed directly into finished goods", "Ignored if they look shiny", "Packed before process values stabilize"], answer: 0 },
  { question: "Which condition is a common setup mistake?", options: ["Crossed water lines or incorrect hookups", "Using a written checklist", "Confirming the mold revision", "Testing E-stops before startup"], answer: 0 },
  { question: "What is the safest response to missing hose labels or unclear setup instructions?", options: ["Escalate and verify before connecting or cycling", "Guess based on hose length", "Skip the function", "Increase clamp force"], answer: 0 },
  { question: "What score is required to pass this module?", options: ["80%", "50%", "60%", "100% only"], answer: 0 },
];

type SavedProgress = {
  checked: boolean[];
  answers: (number | null)[];
  submitted: boolean;
};

export default function MoldSetupTrainingPage() {
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
  const score = useMemo(() => answers.reduce<number>((total, answer, index) => total + (answer === quiz[index].answer ? 1 : 0), 0), [answers]);
  const scorePercent = Math.round((score / quiz.length) * 100);
  const passed = submitted && scorePercent >= passingScore;
  const overallProgress = Math.round((checklistProgress + (answers.filter((answer) => answer !== null).length / quiz.length) * 100 + (passed ? 100 : 0)) / 3);

  function resetProgress() {
    setChecked(checklistItems.map(() => false));
    setAnswers(quiz.map(() => null));
    setSubmitted(false);
    window.localStorage.removeItem(storageKey);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/50 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <Link href="/" className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100 hover:bg-cyan-300/10">← Back to Training Tools</Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Mold Setup Training Module</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Safe Mold Setup & Startup Readiness</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">A mobile-first dark-theme module for setup technicians covering safety, verification, utilities, mold protection, automation, first shots, common errors, and quiz-based completion.</p>
        </header>

        <section className="sticky top-0 z-10 mt-4 rounded-3xl border border-white/10 bg-slate-950/90 p-4 shadow-xl shadow-slate-950/30 backdrop-blur">
          <div className="grid gap-3 sm:grid-cols-3">
            <p className="text-sm font-bold text-white">Overall progress: {overallProgress}%</p>
            <p className="text-sm font-bold text-cyan-200">Checklist: {checklistProgress}%</p>
            <p className="text-sm font-bold text-emerald-200">Passing score: {passingScore}%</p>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all" style={{ width: `${overallProgress}%` }} /></div>
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
          <h2 className="text-2xl font-bold text-white">Interactive mold setup checklist</h2>
          <p className="mt-2 text-sm text-slate-300">Your checklist and quiz progress are saved automatically in this browser.</p>
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
          <h2 className="text-2xl font-bold text-white">Setup technician quiz</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Answer all 10 questions, then submit. A score of {passingScore}% or higher unlocks the completion screen.</p>
          <ol className="mt-5 space-y-4">
            {quiz.map((item, index) => (
              <li key={item.question} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="font-bold text-white">{index + 1}. {item.question}</p>
                <div className="mt-3 grid gap-2">
                  {item.options.map((option, optionIndex) => (
                    <label key={option} className="flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
                      <input type="radio" name={`mold-setup-question-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => current.map((value, answerIndex) => answerIndex === index ? optionIndex : value))} className="mt-1 accent-cyan-300" />
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
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Mold Setup Training Complete</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">You completed the mold setup checklist and passed the setup technician quiz with {scorePercent}%. This completion is stored in local browser storage for this device.</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
