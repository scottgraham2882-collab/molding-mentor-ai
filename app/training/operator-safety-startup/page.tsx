"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const PASSING_SCORE = 80;

const lessonSections = [
  {
    title: "Injection Molding Safety Basics",
    body: "Treat every press as energized, hot, and capable of sudden motion. Stay outside guarded areas, respect safety gates, and stop the job when alarms, leaks, blocked e-stops, or unsafe behaviors are found.",
    points: ["Know the emergency stops before startup", "Keep hands clear of clamp, nozzle, and robot travel", "Report oil, water, resin, or pellet slip hazards immediately"],
  },
  {
    title: "PPE Requirements",
    body: "Wear the site-required personal protective equipment before approaching the molding cell. PPE does not replace guarding, safe distance, or lockout rules.",
    points: ["Safety glasses with side shields", "Heat-resistant gloves for purge, nozzle, or hot parts", "Hearing protection, safety shoes, and sleeves as required"],
  },
  {
    title: "Lockout/Tagout Awareness",
    body: "Operators must understand when equipment requires authorized lockout/tagout. Never bypass guards, reach into a mold area, or clear jams unless the approved energy-control procedure is followed by authorized personnel.",
    points: ["Stop and notify a supervisor for jams or abnormal motion", "Verify who is authorized to lock out the press", "Do not remove another person’s lock or tag"],
  },
  {
    title: "Startup Checklist",
    body: "A disciplined startup protects people, the tool, and the validated process. Confirm the cell is clean, guards work, utilities are connected, and settings match the approved setup before cycling.",
    points: ["Review setup sheet and last shift notes", "Confirm water, air, dryer, hopper, and takeout equipment", "Run initial cycles at approved startup conditions"],
  },
  {
    title: "Material Verification",
    body: "Correct resin, colorant, regrind ratio, lot, and drying conditions must be verified before production. Material mistakes can create defects and customer escapes.",
    points: ["Match material label to work order", "Confirm dryer temperature, dew point, and residence time", "Document lot and colorant information"],
  },
  {
    title: "Mold Verification",
    body: "Confirm the correct mold, water layout, clamp setup, ejection, and part removal method before running production. Look for leaks, loose hoses, missing clamps, and abnormal mold protection alarms.",
    points: ["Match mold ID to work order", "Verify water circuits and mold temperature units", "Check clamp tonnage, ejector stroke, and mold protection"],
  },
  {
    title: "First Article Inspection",
    body: "First pieces prove the startup is producing acceptable parts. Inspect dimensions, visual quality, weight, labeling, and cavity balance according to the control plan before releasing production.",
    points: ["Tag and separate startup scrap", "Compare parts to approved sample or criteria", "Get required quality signoff before full-rate production"],
  },
  {
    title: "Shift Handoff Checklist",
    body: "A strong handoff prevents repeated troubleshooting and unsafe assumptions. Share current process status, open issues, material changes, quality alerts, and maintenance concerns.",
    points: ["Communicate alarms, adjustments, and defects", "Review material level and dryer status", "Confirm next operator understands containment or inspection needs"],
  },
];

const checklistItems = [
  "Work area is clean, dry, and free of trip or pellet hazards.",
  "Emergency stops, safety gates, and guards are present and unobstructed.",
  "Required PPE is worn and suitable for the task.",
  "Material, colorant, lot, and drying conditions match the work order.",
  "Mold ID, setup sheet, water lines, and mold temperature are verified.",
  "Robot, conveyor, grinder, and auxiliary equipment are in safe startup position.",
  "Startup scrap plan and first article inspection requirements are understood.",
  "Shift notes, quality alerts, and open maintenance issues have been reviewed.",
];

const quizQuestions = [
  { question: "What should you do before reaching into a guarded molding area?", options: ["Follow the authorized lockout/tagout or approved safe procedure", "Open the gate and move quickly", "Ask another operator to watch"], answer: 0 },
  { question: "Which PPE is commonly required around hot purge or nozzle areas?", options: ["Heat-resistant gloves", "Cotton-only gloves", "No gloves if the cycle is stopped"], answer: 0 },
  { question: "What is the safest response to an unexplained alarm or abnormal machine motion?", options: ["Stop and notify the proper support person", "Reset repeatedly until it runs", "Increase clamp speed"], answer: 0 },
  { question: "Why verify material lot and drying conditions at startup?", options: ["To prevent material mix-ups and moisture-related defects", "To reduce the need for first article inspection", "To make color changes faster"], answer: 0 },
  { question: "What confirms the mold matches the job?", options: ["Mold ID checked against the work order or setup sheet", "The press size looks correct", "The last operator said it was fine"], answer: 0 },
  { question: "When can production normally be released after startup?", options: ["After required first article checks and signoff", "After ten automatic cycles", "When the hopper is full"], answer: 0 },
  { question: "What belongs in a shift handoff?", options: ["Alarms, defects, adjustments, and containment needs", "Only the current part count", "Only break schedule information"], answer: 0 },
  { question: "What should happen to startup scrap?", options: ["Tag, separate, or handle it by the site scrap procedure", "Mix it into good parts", "Leave it beside the press"], answer: 0 },
  { question: "What does PPE replace?", options: ["Nothing; it supports but does not replace guarding and safe procedures", "Machine guarding", "Lockout/tagout"], answer: 0 },
  { question: "Who may remove another person’s lock or tag?", options: ["Only according to the site’s formal authorized procedure", "Any operator on the next shift", "Quality inspectors"], answer: 0 },
];

export default function OperatorSafetyStartupPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const checklistProgress = Math.round((checkedItems.length / checklistItems.length) * 100);
  const quizScore = useMemo(
    () => quizQuestions.reduce((score, item, index) => score + (answers[index] === item.answer ? 1 : 0), 0),
    [answers],
  );
  const scorePercent = Math.round((quizScore / quizQuestions.length) * 100);
  const passed = submitted && scorePercent >= PASSING_SCORE;

  function toggleChecklist(item: string) {
    setCheckedItems((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item],
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.2),transparent_32%)]" />
          <div className="relative">
            <Link href="/lessons" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10">← Back to training</Link>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.32em] text-cyan-300">Operator Training Module 1</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Machine Safety & Startup Checklist</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Mobile-first safety review for injection molding operators before startup, first article approval, and shift handoff.</p>
          </div>
        </header>

        <section className="sticky top-0 z-10 mt-4 rounded-3xl border border-white/10 bg-slate-950/90 p-4 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-white">Checklist progress: {checklistProgress}%</p>
            <p className="text-sm text-slate-300">Quiz passing score: {PASSING_SCORE}%</p>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all" style={{ width: `${checklistProgress}%` }} />
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {lessonSections.map((section, index) => (
            <article key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
              <span className="text-sm font-black text-cyan-300">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-2 text-2xl font-bold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{section.body}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {section.points.map((point) => <li key={point} className="flex gap-2"><span className="text-emerald-300">•</span>{point}</li>)}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Interactive Startup Checklist</h2>
          <div className="mt-5 grid gap-3">
            {checklistItems.map((item) => (
              <label key={item} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-200">
                <input type="checkbox" checked={checkedItems.includes(item)} onChange={() => toggleChecklist(item)} className="mt-1 h-5 w-5 accent-emerald-300" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-white">10-Question Knowledge Check</h2>
          <p className="mt-2 text-sm text-slate-300">Answer all questions, then submit. Passing score is {PASSING_SCORE}%.</p>
          <div className="mt-5 grid gap-4">
            {quizQuestions.map((item, index) => (
              <fieldset key={item.question} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <legend className="px-1 text-sm font-bold text-white">{index + 1}. {item.question}</legend>
                <div className="mt-3 grid gap-2">
                  {item.options.map((option, optionIndex) => (
                    <label key={option} className="flex gap-3 text-sm text-slate-300">
                      <input type="radio" name={`question-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} className="mt-1 accent-cyan-300" />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <button type="button" onClick={() => setSubmitted(true)} className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-200 sm:w-auto">Submit quiz</button>
          {submitted ? (
            <div className={`mt-5 rounded-3xl border p-5 ${passed ? "border-emerald-300/40 bg-emerald-300/10" : "border-amber-300/40 bg-amber-300/10"}`}>
              <p className="text-xl font-bold text-white">Score: {scorePercent}% ({quizScore}/{quizQuestions.length})</p>
              <p className="mt-2 text-sm text-slate-300">{passed ? "Passed. Continue to your certificate of completion." : "Review the module and retake the quiz to reach the passing score."}</p>
            </div>
          ) : null}
        </section>

        {passed ? (
          <section className="mt-6 rounded-[2rem] border border-emerald-300/40 bg-gradient-to-br from-emerald-300/20 to-cyan-300/10 p-6 text-center shadow-2xl shadow-emerald-950/30 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-200">Certificate of Completion</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Machine Safety & Startup Checklist</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200">This screen certifies completion of Operator Training Module 1 after completing the startup checklist and passing the knowledge check at {scorePercent}%.</p>
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-white/15 bg-slate-950/60 p-5 text-sm text-slate-300">Operator signature: ____________________ &nbsp; Date: __________</div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
