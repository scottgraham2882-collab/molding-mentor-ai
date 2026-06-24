"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PlanStep = {
  title: string;
  detail: string;
  resourceHref: string;
  resourceLabel: string;
};

type LearningPlan = {
  role: string;
  audience: string;
  goal: string;
  timeline: string;
  accent: string;
  steps: PlanStep[];
};

const storageKey = "moldingMentor.learningPlans.progress";

const learningPlans: LearningPlan[] = [
  {
    role: "New Operator",
    audience: "Press operators, inspectors, and production helpers",
    goal: "Build safe habits, recognize common defects, and know when to ask for support.",
    timeline: "2–4 weeks",
    accent: "from-cyan-300 to-emerald-300",
    steps: [
      { title: "Learn molding language", detail: "Review the basic terms used during startup, inspection, downtime, and shift handoff.", resourceHref: "/molding-dictionary", resourceLabel: "Open dictionary" },
      { title: "Study common defects", detail: "Learn how shorts, flash, sink, burns, splay, and contamination look before making process changes.", resourceHref: "/defects", resourceLabel: "Review defects" },
      { title: "Practice shift communication", detail: "Capture what changed, what is contained, and what the next shift needs to watch.", resourceHref: "/shift-handoff", resourceLabel: "Use handoff" },
    ],
  },
  {
    role: "Setup Technician",
    audience: "Mold setters, material handlers, and startup support",
    goal: "Complete repeatable mold changes, document startups, and protect approved process windows.",
    timeline: "4–8 weeks",
    accent: "from-emerald-300 to-teal-300",
    steps: [
      { title: "Follow the mold-change flow", detail: "Use a consistent setup sequence so safety checks, utilities, water, and material readiness are not missed.", resourceHref: "/mold-change", resourceLabel: "Open mold change" },
      { title: "Verify startup approval", detail: "Confirm first-piece checks, documentation, and signoffs before releasing production.", resourceHref: "/startup-approval", resourceLabel: "Review startup" },
      { title: "Document process sheets", detail: "Record stable settings and approval notes so the next run starts from known conditions.", resourceHref: "/process-sheet-builder", resourceLabel: "Build process sheet" },
    ],
  },
  {
    role: "Process Technician",
    audience: "Technicians responsible for troubleshooting and process development",
    goal: "Use scientific molding studies and root-cause thinking before changing machine settings.",
    timeline: "8–12 weeks",
    accent: "from-violet-300 to-cyan-300",
    steps: [
      { title: "Learn the process window", detail: "Understand why fill, pack, cooling, transfer, and recovery must be proven instead of guessed.", resourceHref: "/lessons/process-window", resourceLabel: "Study process window" },
      { title: "Run structured studies", detail: "Practice fill, pack/hold, gate seal, and cooling checks with a repeatable study format.", resourceHref: "/scientific-molding/studies", resourceLabel: "Open studies" },
      { title: "Coach root cause thinking", detail: "Separate symptoms from causes and confirm what changed before adjusting the process.", resourceHref: "/root-cause-coach", resourceLabel: "Use root cause coach" },
    ],
  },
  {
    role: "Supervisor",
    audience: "Leads, supervisors, trainers, and department managers",
    goal: "Assign training, monitor gaps, and turn shop-floor issues into coaching moments.",
    timeline: "Ongoing",
    accent: "from-amber-300 to-orange-300",
    steps: [
      { title: "Review skill coverage", detail: "Compare role needs against current skill levels before assigning work or cross-training.", resourceHref: "/training/skills-matrix", resourceLabel: "Open skills matrix" },
      { title: "Build individual plans", detail: "Create plans with gaps, required modules, mentors, target dates, and supervisor notes.", resourceHref: "/training/plan-builder", resourceLabel: "Build a plan" },
      { title: "Track coaching actions", detail: "Record performance coaching and follow-up so development stays visible and fair.", resourceHref: "/employees/performance-coaching-log", resourceLabel: "Open coaching log" },
    ],
  },
];

function stepId(planRole: string, stepTitle: string) {
  return `${planRole}:${stepTitle}`;
}

function getStoredProgress() {
  try {
    const saved = window.localStorage.getItem(storageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function LearningPlansPage() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setCompletedSteps(getStoredProgress());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(completedSteps));
    }
  }, [completedSteps, hasLoaded]);

  const completedSet = useMemo(() => new Set(completedSteps), [completedSteps]);
  const totalSteps = learningPlans.reduce((sum, plan) => sum + plan.steps.length, 0);
  const completionPercent = totalSteps === 0 ? 0 : Math.round((completedSteps.length / totalSteps) * 100);
  const nextStep = learningPlans.flatMap((plan) => plan.steps.map((step) => ({ ...step, role: plan.role, id: stepId(plan.role, step.title) }))).find((step) => !completedSet.has(step.id));

  function toggleStep(id: string) {
    setCompletedSteps((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/10">
            ← Back home
          </Link>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Learning Plans</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Role-based training plans for molding teams</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Pick a role, follow the recommended sequence, and mark each step complete as the learner practices on the floor. Progress is saved on this device.</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.25fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5">
              <div className="flex items-center justify-between gap-3"><p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">Overall progress</p><p className="text-3xl font-black text-white">{completionPercent}%</p></div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${completionPercent}%` }} /></div>
              <p className="mt-3 text-sm text-slate-300">{completedSteps.length} of {totalSteps} steps complete</p>
            </div>
            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">Recommended next step</p>
              <h2 className="mt-2 text-2xl font-black text-white">{nextStep ? nextStep.title : "All plans are complete"}</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50">{nextStep ? `${nextStep.role}: ${nextStep.detail}` : "Reset any completed step if you want to run through the plan again."}</p>
            </div>
          </div>
        </header>
        <section className="grid gap-5 lg:grid-cols-2">
          {learningPlans.map((plan) => {
            const planCompleted = plan.steps.filter((step) => completedSet.has(stepId(plan.role, step.title))).length;
            const planPercent = Math.round((planCompleted / plan.steps.length) * 100);
            return (
              <article key={plan.role} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6">
                <div className={`h-2 rounded-full bg-gradient-to-r ${plan.accent}`} />
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">{plan.timeline}</p><h2 className="mt-2 text-2xl font-black text-white">{plan.role}</h2></div><span className="rounded-full bg-slate-950/70 px-3 py-1 text-sm font-black text-cyan-100">{planPercent}% complete</span></div>
                <p className="mt-3 text-sm font-bold text-cyan-100">{plan.audience}</p><p className="mt-2 text-sm leading-6 text-slate-300">{plan.goal}</p>
                <ol className="mt-5 space-y-3">
                  {plan.steps.map((step, index) => {
                    const id = stepId(plan.role, step.title);
                    const isComplete = completedSet.has(id);
                    return (
                      <li key={step.title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                        <div className="flex gap-3"><button type="button" onClick={() => toggleStep(id)} className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black transition ${isComplete ? "bg-emerald-300 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-cyan-300 hover:text-slate-950"}`} aria-label={`${isComplete ? "Mark incomplete" : "Mark complete"}: ${step.title}`}>{isComplete ? "✓" : index + 1}</button><div><h3 className="font-black text-white">{step.title}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{step.detail}</p><Link href={step.resourceHref} className="mt-3 inline-flex text-sm font-black text-cyan-200 transition hover:text-cyan-100">{step.resourceLabel} →</Link></div></div>
                      </li>
                    );
                  })}
                </ol>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
