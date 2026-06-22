"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const sections = [
  {
    title: "Injection Molding Safety Basics",
    body: "Treat the press as energized equipment with high clamp force, hot surfaces, stored hydraulic or pneumatic energy, and moving robot/EOAT zones. Stay outside guarded areas, never bypass interlocks, and stop the job when a condition is unsafe.",
    points: ["Verify guards and E-stops before cycling", "Keep hands clear of the mold area", "Report leaks, exposed wiring, or abnormal noise"],
  },
  {
    title: "PPE Requirements",
    body: "Wear the required PPE before entering the cell. Typical molding PPE includes safety glasses, heat-resistant gloves for hot parts or purging, cut-resistant gloves for trimming, hearing protection where posted, and safety shoes.",
    points: ["Match gloves to heat, cut, and chemical hazards", "Use face protection for purging or splash risk", "Replace damaged PPE immediately"],
  },
  {
    title: "Lockout/Tagout Awareness",
    body: "Operators must understand when work requires authorized lockout/tagout support. Clearing minor jams follows site procedures; entering guarded areas, servicing equipment, or defeating energy requires the approved LOTO process.",
    points: ["Know who is authorized for LOTO", "Do not remove another person's lock or tag", "Escalate before reaching into danger zones"],
  },
  {
    title: "Startup Checklist",
    body: "A safe startup confirms the machine, mold, material system, auxiliaries, documentation, and quality plan are ready before production parts are released.",
    points: ["Review setup sheet and previous shift notes", "Confirm water, air, dryer, robot, and conveyors", "Run startup parts through quality approval"],
  },
  {
    title: "Material Verification",
    body: "Wrong or wet material can create scrap and unsafe purging. Confirm resin family, grade, colorant, regrind ratio, lot number, drying time, and dryer temperature against the work order.",
    points: ["Match material labels to the router", "Record lot numbers", "Check dryer dew point or alarm status"],
  },
  {
    title: "Mold Verification",
    body: "Confirm the correct mold is installed, clamped, watered, connected, and protected before automatic cycling. Validate mold number, core pulls, hot runner zones, limit switches, and mold safety settings.",
    points: ["Check mold number and revision", "Verify water circuits and leaks", "Confirm mold protection is active"],
  },
  {
    title: "First Article Inspection",
    body: "First article approval proves startup parts meet the current print, control plan, and visual standard before full release. Hold parts until quality signs off according to site rules.",
    points: ["Label first shots clearly", "Measure critical dimensions", "Compare cosmetics to approved sample"],
  },
  {
    title: "Shift Handoff Checklist",
    body: "A strong handoff prevents repeated mistakes. Communicate part status, quality holds, process changes, scrap trends, maintenance issues, and material or packaging needs.",
    points: ["Document open issues", "Share alarms or adjustments", "Confirm next-shift priorities"],
  },
];

const checklistItems = [
  "Safety guards, light curtains, and E-stops verified",
  "Required PPE selected and worn",
  "LOTO escalation points understood",
  "Setup sheet and work order reviewed",
  "Material grade, color, lot, and dryer status verified",
  "Mold number, water circuits, and mold protection verified",
  "Auxiliaries, robot, conveyor, and packaging ready",
  "First article parts labeled and submitted for approval",
  "Quality acceptance criteria reviewed",
  "Shift handoff notes completed",
];

const quiz = [
  {
    question: "What should an operator do if a guard or interlock is not working?",
    options: ["Stop and report the unsafe condition", "Run slowly until maintenance arrives", "Tape the switch closed", "Only use manual mode"],
    answer: 0,
  },
  {
    question: "Which PPE is commonly needed when handling hot molded parts or purging?",
    options: ["Heat-resistant gloves", "Cotton sleeves only", "No gloves near presses", "Dust mask only"],
    answer: 0,
  },
  {
    question: "Who should remove a personal lock or tag?",
    options: ["The person who applied it under site procedure", "Any supervisor", "The next operator", "Anyone with bolt cutters"],
    answer: 0,
  },
  {
    question: "Before releasing production, startup parts should be:",
    options: ["Approved through the first article process", "Mixed into the first box", "Scrapped without review", "Accepted if the cycle is automatic"],
    answer: 0,
  },
  {
    question: "Material verification should include:",
    options: ["Grade, color, lot, and dryer condition", "Only pellet color", "Only hopper level", "Only supplier name"],
    answer: 0,
  },
  {
    question: "Why verify mold water circuits during startup?",
    options: ["To protect mold temperature control and catch leaks", "To reduce paperwork", "To make parts heavier", "To bypass cooling time"],
    answer: 0,
  },
  {
    question: "Mold protection settings are used to:",
    options: ["Help prevent closing on an obstruction", "Increase clamp force automatically", "Disable alarms", "Dry material faster"],
    answer: 0,
  },
  {
    question: "A good shift handoff should include:",
    options: ["Quality status, changes, alarms, and open issues", "Only the operator name", "Only total parts made", "Nothing if the press is running"],
    answer: 0,
  },
  {
    question: "If the material lot does not match the work order, the operator should:",
    options: ["Stop and get verification before running", "Blend it with the old lot", "Run until parts fail", "Change the label"],
    answer: 0,
  },
  {
    question: "What is the safest response to an abnormal hydraulic leak or electrical smell?",
    options: ["Stop, secure the area, and notify support", "Ignore it during startup", "Increase cycle time", "Open the panel to inspect wiring"],
    answer: 0,
  },
];

const passingScore = 80;

export default function OperatorSafetyStartupPage() {
  const [checked, setChecked] = useState<boolean[]>(() => checklistItems.map(() => false));
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const checklistProgress = Math.round((checked.filter(Boolean).length / checklistItems.length) * 100);
  const score = useMemo(
    () => answers.reduce<number>((total, answer, index) => total + (answer === quiz[index].answer ? 1 : 0), 0),
    [answers],
  );
  const scorePercent = Math.round((score / quiz.length) * 100);
  const passed = submitted && scorePercent >= passingScore;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/50 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <Link href="/lessons" className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100 hover:bg-cyan-300/10">← Back to training</Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Operator Training Module 1</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Machine Safety & Startup Checklist</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">A mobile-first safety lesson for injection molding operators covering safe startup habits, material and mold verification, first article release, and shift handoff discipline.</p>
        </header>

        <section className="sticky top-0 z-10 mt-4 rounded-3xl border border-white/10 bg-slate-950/90 p-4 shadow-xl shadow-slate-950/30 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-white">Checklist progress: {checklistProgress}%</p>
            <p className="text-sm font-bold text-cyan-200">Quiz passing score: {passingScore}%</p>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all" style={{ width: `${checklistProgress}%` }} /></div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {sections.map((section, index) => (
            <article key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">Section {index + 1}</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{section.body}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                {section.points.map((point) => <li key={point} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />{point}</li>)}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-950/20 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Interactive startup checklist</h2>
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
          <h2 className="text-2xl font-bold text-white">10-question quiz</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Answer all questions, then submit. A score of {passingScore}% or higher unlocks the completion certificate.</p>
          <ol className="mt-5 space-y-4">
            {quiz.map((item, index) => (
              <li key={item.question} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="font-bold text-white">{index + 1}. {item.question}</p>
                <div className="mt-3 grid gap-2">
                  {item.options.map((option, optionIndex) => (
                    <label key={option} className="flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
                      <input type="radio" name={`question-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => current.map((value, answerIndex) => answerIndex === index ? optionIndex : value))} className="mt-1 accent-cyan-300" />
                      {option}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => setSubmitted(true)} className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 transition hover:bg-cyan-200 sm:w-auto">Submit quiz</button>
          {submitted ? <p className="mt-4 text-lg font-bold text-white">Score: {score}/{quiz.length} ({scorePercent}%) — {passed ? "Passed" : "Review the lesson and try again"}</p> : null}
        </section>

        {passed ? (
          <section className="mt-6 rounded-[2rem] border border-amber-300/40 bg-gradient-to-br from-amber-300/20 to-cyan-300/10 p-6 text-center shadow-2xl shadow-amber-950/20 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Certificate of Completion</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Machine Safety & Startup Checklist</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">This certifies completion of Operator Training Module 1 with a passing quiz score of {scorePercent}% and documented startup checklist progress of {checklistProgress}%.</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
