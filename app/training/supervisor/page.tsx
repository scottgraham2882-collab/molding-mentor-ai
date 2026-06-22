"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const storageKey = "supervisor-training-progress-v1";
const passingScore = 80;

const sections = [
  {
    title: "Production floor leadership",
    body: "Supervisors set the tone for safe, disciplined production. Walk the floor with purpose, verify standards are being followed, remove barriers for operators, and keep communication focused on safety, quality, delivery, and respect.",
    points: ["Start with safety and quality expectations", "Use facts from the floor instead of assumptions", "Model calm urgency during problems"],
  },
  {
    title: "Shift startup expectations",
    body: "A strong startup confirms people, machines, molds, materials, paperwork, and quality requirements are ready before production momentum builds. The supervisor verifies readiness and assigns ownership for gaps.",
    points: ["Review staffing, priorities, and constraints", "Confirm startup approvals and first-piece requirements", "Make open risks visible early"],
  },
  {
    title: "Reading production dashboards",
    body: "Dashboards turn production activity into decisions. Supervisors should understand schedule attainment, machine status, cycle performance, OEE, scrap, downtime, labor coverage, and quality holds well enough to prioritize the next floor action.",
    points: ["Focus on exceptions that need action", "Compare current performance to target", "Validate dashboard data with floor checks"],
  },
  {
    title: "Scrap and downtime review",
    body: "Scrap and downtime are signals that require timely review. Supervisors should separate chronic issues from new events, confirm reason codes, ask for evidence, and assign follow-up so losses do not become normal.",
    points: ["Review top scrap defects and downtime reasons", "Confirm quantities, times, and affected machines", "Escalate repeat losses with clear facts"],
  },
  {
    title: "Coaching operators",
    body: "Effective coaching is specific, respectful, and tied to standards. Supervisors observe the work, ask questions, reinforce correct behavior, correct unsafe or nonstandard work immediately, and document training needs.",
    points: ["Coach at the workstation when possible", "Explain the why behind the standard", "Follow up to confirm the behavior changed"],
  },
  {
    title: "Escalating quality issues",
    body: "Quality concerns must be escalated quickly when product risk exists. Supervisors protect customers by stopping suspect flow, preserving evidence, notifying quality or process support, and verifying containment is in place.",
    points: ["Stop and contain suspect product", "Notify the correct support functions", "Document who was contacted and what changed"],
  },
  {
    title: "Process change approval",
    body: "Supervisors must ensure process changes follow the approved path. Unauthorized knob-turning creates unstable production, hidden defects, and poor handoffs. Changes need a reason, approval, verification, and documentation.",
    points: ["Confirm who is authorized to change the process", "Require before-and-after data", "Record approved changes for the next shift"],
  },
  {
    title: "Shift handoff expectations",
    body: "A good handoff prevents repeated troubleshooting and missed quality risks. Supervisors summarize machine status, staffing concerns, open quality holds, process changes, downtime, material issues, priorities, and required follow-up.",
    points: ["Use a consistent handoff format", "Highlight unresolved risks and owners", "Confirm the next supervisor understands priorities"],
  },
  {
    title: "Training assignment follow-up",
    body: "Training assignments only create value when supervisors verify completion and skill application. Review due dates, quiz scores, observation results, and open coaching needs during routine shift leadership.",
    points: ["Track overdue and upcoming assignments", "Pair online completion with floor observation", "Document gaps and next actions"],
  },
  {
    title: "Supervisor quiz",
    body: "Complete the checklist and pass the quiz to record completion in this browser. The quiz reinforces leadership routines, dashboard use, scrap and downtime review, operator coaching, escalation, change control, handoff, and training follow-up.",
    points: ["Answer all 15 questions", "Passing score is 80%", "Retake after reviewing missed topics if needed"],
  },
];

const checklistItems = [
  "Safety, quality, delivery, and staffing priorities reviewed before floor walk",
  "Shift startup readiness verified for people, machines, molds, materials, and paperwork",
  "Production dashboard checked for schedule, machine status, OEE, scrap, downtime, and holds",
  "Top scrap and downtime issues reviewed with reason codes and affected machines",
  "At least one operator coaching conversation completed using a clear standard",
  "Suspect quality issues contained and escalated to the correct support function",
  "Process changes verified as approved, documented, and communicated",
  "Shift handoff notes include status, risks, changes, owners, and next priorities",
  "Training assignments reviewed for overdue items, quiz scores, and observation needs",
  "Follow-up owners and due dates are clear for unresolved production issues",
];

const quiz = [
  { question: "What should production floor leadership prioritize first?", options: ["Safety, quality, delivery, and respectful standard work", "Only the highest machine count", "Only end-of-shift reports", "Avoiding all escalations"], answer: 0 },
  { question: "A strong shift startup should confirm:", options: ["People, machines, molds, materials, paperwork, and quality requirements are ready", "Only that operators arrived", "Only that the press is cycling", "Only that the schedule was printed"], answer: 0 },
  { question: "When reading a production dashboard, supervisors should focus on:", options: ["Exceptions that require action against target performance", "The brightest chart colors", "Ignoring floor verification", "Only yesterday's totals"], answer: 0 },
  { question: "Dashboard data should be validated by:", options: ["Checking the floor and asking for facts when something looks abnormal", "Assuming every entry is perfect", "Deleting unfavorable records", "Waiting until the end of the month"], answer: 0 },
  { question: "Scrap and downtime reviews are useful because they:", options: ["Reveal losses that need containment, root cause, and follow-up", "Replace quality inspection", "Prove no action is needed", "Should only be done annually"], answer: 0 },
  { question: "Which is the best response to repeated downtime on one machine?", options: ["Confirm the reason code, gather evidence, assign support, and follow up", "Rename the reason code", "Ignore it if production restarts", "Blame the next shift without data"], answer: 0 },
  { question: "Effective operator coaching should be:", options: ["Specific, respectful, tied to the standard, and followed up", "Only verbal and never observed", "Delayed until review season", "Focused on personal criticism"], answer: 0 },
  { question: "If an operator is not following a critical quality check, the supervisor should:", options: ["Stop and coach to the standard immediately", "Wait several weeks", "Ignore it if parts look acceptable", "Change the inspection plan alone"], answer: 0 },
  { question: "When a potential quality escape is found, the first supervisor action is to:", options: ["Protect the customer by stopping suspect flow and containing product", "Keep shipping until proof is perfect", "Change the process quietly", "Delete the defect record"], answer: 0 },
  { question: "Quality escalation should include:", options: ["Facts, containment status, affected product, and who was notified", "Rumors only", "No documentation", "Only production totals"], answer: 0 },
  { question: "Process changes on the floor should be:", options: ["Approved, verified, documented, and communicated", "Made by anyone at any time", "Hidden until parts fail", "Based only on guesswork"], answer: 0 },
  { question: "Before approving or accepting a process change, supervisors should look for:", options: ["A reason, before-and-after data, verification, and a record", "Only a faster cycle", "Only operator preference", "No quality involvement"], answer: 0 },
  { question: "A complete shift handoff should include:", options: ["Machine status, open risks, quality holds, process changes, downtime, priorities, and owners", "Only the production count", "Only personal notes", "Nothing if the next shift is experienced"], answer: 0 },
  { question: "Training assignment follow-up should combine online completion with:", options: ["Floor observation and coaching on skill application", "No supervisor involvement", "Only a printed certificate", "Skipping overdue items"], answer: 0 },
  { question: "What score is required to pass this module?", options: ["80%", "50%", "60%", "100% only"], answer: 0 },
];

type SavedProgress = {
  checked: boolean[];
  answers: (number | null)[];
  submitted: boolean;
};

export default function SupervisorTrainingPage() {
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
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Supervisor Training Module</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Production Floor Leadership & Shift Execution</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">A mobile-first dark-theme module for supervisors covering floor leadership, shift startup, dashboards, scrap, downtime, coaching, escalation, process approval, shift handoff, assignments, and quiz completion.</p>
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
          <h2 className="text-2xl font-bold text-white">Interactive supervisor checklist</h2>
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
          <h2 className="text-2xl font-bold text-white">Supervisor quiz</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Answer all 15 questions, then submit. A score of {passingScore}% or higher unlocks the completion screen.</p>
          <ol className="mt-5 space-y-4">
            {quiz.map((item, index) => (
              <li key={item.question} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="font-bold text-white">{index + 1}. {item.question}</p>
                <div className="mt-3 grid gap-2">
                  {item.options.map((option, optionIndex) => (
                    <label key={option} className="flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
                      <input type="radio" name={`supervisor-question-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => current.map((value, answerIndex) => answerIndex === index ? optionIndex : value))} className="mt-1 accent-cyan-300" />
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
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Supervisor Training Complete</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">You completed the supervisor checklist and passed the 15-question quiz with {scorePercent}%. This completion is stored in local browser storage for this device.</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
