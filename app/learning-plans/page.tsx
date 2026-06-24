"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

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

type WeeklyFocus = "Safety" | "Defects" | "Setup" | "Process" | "Leadership";

type WeeklyPlan = {
  id: string;
  learnerName: string;
  role: string;
  mentor: string;
  startDate: string;
  weeklyHours: number;
  focus: WeeklyFocus;
  completedItems: string[];
  createdAt: string;
};

type WeeklyPlanForm = Omit<WeeklyPlan, "id" | "completedItems" | "createdAt">;

const storageKey = "moldingMentor.learningPlans.progress";
const weeklyPlanStorageKey = "moldingMentor.weeklyLearningPlans.mvp";
const weeklyFocusOptions: WeeklyFocus[] = ["Safety", "Defects", "Setup", "Process", "Leadership"];

const emptyWeeklyPlanForm: WeeklyPlanForm = {
  learnerName: "",
  role: "New Operator",
  mentor: "",
  startDate: "",
  weeklyHours: 3,
  focus: "Safety",
};


const weeklyPlanTemplates: Record<WeeklyFocus, PlanStep[]> = {
  Safety: [
    { title: "PPE and machine guarding walkdown", detail: "Review PPE, emergency stops, guarding, lockout boundaries, and when to call a lead before reaching into a press.", resourceHref: "/checklists", resourceLabel: "Open checklists" },
    { title: "Startup safety observation", detail: "Shadow a startup and document the safety checks completed before parts are released.", resourceHref: "/startup-approval", resourceLabel: "Review startup" },
    { title: "End-of-week mentor check", detail: "Have the learner explain the three highest-risk moments in their role and how they stay safe.", resourceHref: "/mentor-notes", resourceLabel: "Capture notes" },
  ],
  Defects: [
    { title: "Defect recognition drill", detail: "Compare real or sample parts for shorts, flash, sink, burns, splay, contamination, and dimensional concerns.", resourceHref: "/defects", resourceLabel: "Review defects" },
    { title: "Containment practice", detail: "Practice describing suspect product, containment boundaries, and escalation notes during a simulated quality issue.", resourceHref: "/shift-handoff", resourceLabel: "Use handoff" },
    { title: "Root-cause discussion", detail: "Pick one defect and list evidence needed before changing machine settings.", resourceHref: "/root-cause-coach", resourceLabel: "Use root cause coach" },
  ],
  Setup: [
    { title: "Mold-change sequence review", detail: "Walk through staging, utilities, water, material, safety, and startup checks with a qualified mentor.", resourceHref: "/mold-change", resourceLabel: "Open mold change" },
    { title: "Process sheet comparison", detail: "Compare current setup values against the approved process sheet and flag missing information.", resourceHref: "/process-sheet-builder", resourceLabel: "Build process sheet" },
    { title: "Handoff readiness check", detail: "Document what changed during setup and what the next shift must monitor.", resourceHref: "/shift-handoff", resourceLabel: "Use handoff" },
  ],
  Process: [
    { title: "Process window lesson", detail: "Study fill, pack, cooling, transfer, recovery, and why each must be proven with data.", resourceHref: "/lessons/process-window", resourceLabel: "Study lesson" },
    { title: "Scientific study practice", detail: "Run or simulate one structured study and record the evidence, decision, and follow-up.", resourceHref: "/scientific-molding/studies", resourceLabel: "Open studies" },
    { title: "Adjustment review", detail: "Explain which process changes are allowed, which require approval, and how to document them.", resourceHref: "/process-adjustment-guide", resourceLabel: "Open guide" },
  ],
  Leadership: [
    { title: "Skill gap review", detail: "Compare role expectations against current skill coverage and choose one practical coaching goal.", resourceHref: "/training/skills-matrix", resourceLabel: "Open skills matrix" },
    { title: "Coaching conversation", detail: "Hold a short coaching check-in focused on one behavior, one example, and one next action.", resourceHref: "/employees/performance-coaching-log", resourceLabel: "Open coaching log" },
    { title: "Weekly training review", detail: "Summarize progress, blockers, mentor notes, and the next week's focus.", resourceHref: "/reports/weekly", resourceLabel: "Open weekly report" },
  ],
};

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

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatDate(value: string) {
  if (!value) return "Set start date";
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

function addDays(value: string, days: number) {
  if (!value) return "Schedule after start date";
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString();
}

function isWeeklyFocus(value: unknown): value is WeeklyFocus {
  return weeklyFocusOptions.includes(value as WeeklyFocus);
}

function isWeeklyPlan(item: unknown): item is WeeklyPlan {
  if (!item || typeof item !== "object") return false;
  const plan = item as Partial<WeeklyPlan>;
  return (
    typeof plan.id === "string" &&
    typeof plan.learnerName === "string" &&
    typeof plan.role === "string" &&
    typeof plan.mentor === "string" &&
    typeof plan.startDate === "string" &&
    typeof plan.weeklyHours === "number" &&
    isWeeklyFocus(plan.focus) &&
    Array.isArray(plan.completedItems) &&
    plan.completedItems.every((item) => typeof item === "string") &&
    typeof plan.createdAt === "string"
  );
}

function getWeeklyPlans() {
  try {
    const saved = window.localStorage.getItem(weeklyPlanStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter(isWeeklyPlan) : [];
  } catch {
    return [];
  }
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
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [weeklyForm, setWeeklyForm] = useState<WeeklyPlanForm>(emptyWeeklyPlanForm);

  useEffect(() => {
    setCompletedSteps(getStoredProgress());
    setWeeklyPlans(getWeeklyPlans());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(completedSteps));
      window.localStorage.setItem(weeklyPlanStorageKey, JSON.stringify(weeklyPlans));
    }
  }, [completedSteps, weeklyPlans, hasLoaded]);

  const completedSet = useMemo(() => new Set(completedSteps), [completedSteps]);
  const totalSteps = learningPlans.reduce((sum, plan) => sum + plan.steps.length, 0);
  const completionPercent = totalSteps === 0 ? 0 : Math.round((completedSteps.length / totalSteps) * 100);
  const nextStep = learningPlans.flatMap((plan) => plan.steps.map((step) => ({ ...step, role: plan.role, id: stepId(plan.role, step.title) }))).find((step) => !completedSet.has(step.id));
  const activeWeeklyPlans = weeklyPlans.filter((plan) => plan.completedItems.length < weeklyPlanTemplates[plan.focus].length).length;
  const totalWeeklyItems = weeklyPlans.reduce((sum, plan) => sum + weeklyPlanTemplates[plan.focus].length, 0);
  const completedWeeklyItems = weeklyPlans.reduce((sum, plan) => sum + plan.completedItems.length, 0);

  function toggleStep(id: string) {
    setCompletedSteps((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function saveWeeklyPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextPlan: WeeklyPlan = {
      ...weeklyForm,
      learnerName: weeklyForm.learnerName.trim() || "Unnamed learner",
      mentor: weeklyForm.mentor.trim() || "Unassigned mentor",
      weeklyHours: Math.max(1, Math.min(20, Number(weeklyForm.weeklyHours) || 1)),
      id: createId(),
      completedItems: [],
      createdAt: new Date().toISOString(),
    };
    setWeeklyPlans((current) => [nextPlan, ...current]);
    setWeeklyForm(emptyWeeklyPlanForm);
  }

  function toggleWeeklyItem(planId: string, itemTitle: string) {
    setWeeklyPlans((current) =>
      current.map((plan) =>
        plan.id !== planId
          ? plan
          : {
              ...plan,
              completedItems: plan.completedItems.includes(itemTitle) ? plan.completedItems.filter((item) => item !== itemTitle) : [...plan.completedItems, itemTitle],
            },
      ),
    );
  }

  function deleteWeeklyPlan(planId: string) {
    setWeeklyPlans((current) => current.filter((plan) => plan.id !== planId));
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
        <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={saveWeeklyPlan} className="rounded-[1.75rem] border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-slate-950/30 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-200">Weekly Learning Plans MVP</p>
            <h2 className="mt-2 text-2xl font-black text-white">Create a one-week coaching plan</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50">Assign a learner, focus area, mentor, and weekly time budget. Each saved plan creates three practical shop-floor activities with due dates and local progress tracking.</p>
            <div className="mt-5 grid gap-3">
              <label className="text-sm font-bold text-slate-200">Learner name<input value={weeklyForm.learnerName} onChange={(event) => setWeeklyForm((form) => ({ ...form, learnerName: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Example: Jordan Lee" /></label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-bold text-slate-200">Role<select value={weeklyForm.role} onChange={(event) => setWeeklyForm((form) => ({ ...form, role: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300">{learningPlans.map((plan) => <option key={plan.role}>{plan.role}</option>)}</select></label>
                <label className="text-sm font-bold text-slate-200">Focus<select value={weeklyForm.focus} onChange={(event) => setWeeklyForm((form) => ({ ...form, focus: event.target.value as WeeklyFocus }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300">{weeklyFocusOptions.map((focus) => <option key={focus}>{focus}</option>)}</select></label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-bold text-slate-200">Start date<input type="date" value={weeklyForm.startDate} onChange={(event) => setWeeklyForm((form) => ({ ...form, startDate: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
                <label className="text-sm font-bold text-slate-200">Hours this week<input type="number" min="1" max="20" value={weeklyForm.weeklyHours} onChange={(event) => setWeeklyForm((form) => ({ ...form, weeklyHours: Number(event.target.value) }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              </div>
              <label className="text-sm font-bold text-slate-200">Mentor<input value={weeklyForm.mentor} onChange={(event) => setWeeklyForm((form) => ({ ...form, mentor: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Example: Sam, shift lead" /></label>
            </div>
            <button type="submit" className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">Save weekly plan</button>
          </form>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-200">Weekly plan board</p><h2 className="mt-2 text-2xl font-black text-white">{weeklyPlans.length} saved · {activeWeeklyPlans} active</h2></div><span className="rounded-full bg-slate-950/70 px-3 py-1 text-sm font-black text-emerald-100">{completedWeeklyItems}/{totalWeeklyItems} tasks</span></div>
            <div className="mt-5 space-y-4">
              {weeklyPlans.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-4 text-sm leading-6 text-slate-300">No weekly plans yet. Create the first plan to generate a focused one-week checklist.</p> : weeklyPlans.map((plan) => {
                const template = weeklyPlanTemplates[plan.focus];
                const percent = Math.round((plan.completedItems.length / template.length) * 100);
                return <article key={plan.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{plan.focus} · {plan.weeklyHours} hrs · starts {formatDate(plan.startDate)}</p><h3 className="mt-1 text-xl font-black text-white">{plan.learnerName}</h3><p className="mt-1 text-sm text-cyan-100">{plan.role} with {plan.mentor}</p></div><button type="button" onClick={() => deleteWeeklyPlan(plan.id)} className="rounded-full border border-rose-300/30 px-3 py-1 text-xs font-black text-rose-100 transition hover:bg-rose-300/10">Delete</button></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-300" style={{ width: `${percent}%` }} /></div><ol className="mt-4 space-y-3">{template.map((item, index) => { const isDone = plan.completedItems.includes(item.title); return <li key={item.title} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"><button type="button" onClick={() => toggleWeeklyItem(plan.id, item.title)} className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${isDone ? "bg-emerald-300 text-slate-950" : "bg-white/10 text-slate-200"}`}>{isDone ? "✓" : index + 1}</button><div><h4 className="font-black text-white">{item.title}</h4><p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Due {addDays(plan.startDate, index * 2)}</p><p className="mt-1 text-sm leading-6 text-slate-300">{item.detail}</p><Link href={item.resourceHref} className="mt-2 inline-flex text-sm font-black text-cyan-200 transition hover:text-cyan-100">{item.resourceLabel} →</Link></div></li>; })}</ol></article>;
              })}
            </div>
          </div>
        </section>

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
