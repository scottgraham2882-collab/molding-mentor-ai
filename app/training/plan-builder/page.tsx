"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ProgressStatus = "Not Started" | "In Progress" | "On Hold" | "Completed";

type TrainingPlan = {
  id: string;
  employeeName: string;
  currentRole: string;
  targetRole: string;
  skillGaps: string;
  requiredTrainingModules: string;
  requiredCertifications: string;
  trainerMentorAssigned: string;
  startDate: string;
  targetCompletionDate: string;
  progressStatus: ProgressStatus;
  supervisorNotes: string;
  updatedAt: string;
};

type TrainingPlanForm = Omit<TrainingPlan, "id" | "updatedAt">;

const storageKey = "moldingMentor.trainingPlanBuilder";
const progressStatuses: ProgressStatus[] = ["Not Started", "In Progress", "On Hold", "Completed"];

const emptyForm: TrainingPlanForm = {
  employeeName: "",
  currentRole: "",
  targetRole: "",
  skillGaps: "",
  requiredTrainingModules: "",
  requiredCertifications: "",
  trainerMentorAssigned: "",
  startDate: "",
  targetCompletionDate: "",
  progressStatus: "Not Started",
  supervisorNotes: "",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function formatDate(value: string) {
  if (!value) return "Not scheduled";
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

function splitItems(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function calculatePlanProgress(plan: TrainingPlan | TrainingPlanForm) {
  if (plan.progressStatus === "Completed") return 100;
  if (plan.progressStatus === "Not Started") return 0;

  const trackedFields = [
    plan.employeeName,
    plan.currentRole,
    plan.targetRole,
    plan.skillGaps,
    plan.requiredTrainingModules,
    plan.requiredCertifications,
    plan.trainerMentorAssigned,
    plan.startDate,
    plan.targetCompletionDate,
    plan.supervisorNotes,
  ];
  const completedFields = trackedFields.filter((field) => field.trim().length > 0).length;
  const completionPercent = Math.round((completedFields / trackedFields.length) * 100);

  if (plan.progressStatus === "On Hold") return Math.min(75, Math.max(10, completionPercent));
  return Math.min(95, Math.max(25, completionPercent));
}

export default function TrainingPlanBuilderPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [form, setForm] = useState<TrainingPlanForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoadedPlans, setHasLoadedPlans] = useState(false);
  const [filters, setFilters] = useState({ employee: "", role: "", status: "All", targetDate: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setPlans(JSON.parse(saved) as TrainingPlan[]);
      } catch {
        setPlans([]);
      }
    }
    setHasLoadedPlans(true);
  }, []);

  useEffect(() => {
    if (hasLoadedPlans) {
      window.localStorage.setItem(storageKey, JSON.stringify(plans));
    }
  }, [plans, hasLoadedPlans]);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const employeeMatch = normalize(plan.employeeName).includes(normalize(filters.employee));
      const roleMatch = `${plan.currentRole} ${plan.targetRole}`.toLowerCase().includes(normalize(filters.role));
      const statusMatch = filters.status === "All" || plan.progressStatus === filters.status;
      const targetDateMatch = !filters.targetDate || plan.targetCompletionDate === filters.targetDate;
      return employeeMatch && roleMatch && statusMatch && targetDateMatch;
    });
  }, [plans, filters]);

  const summary = useMemo(() => {
    const totalPlans = plans.length;
    const completedPlans = plans.filter((plan) => plan.progressStatus === "Completed").length;
    const averageProgress = totalPlans === 0 ? 0 : Math.round(plans.reduce((sum, plan) => sum + calculatePlanProgress(plan), 0) / totalPlans);
    const dueSoon = plans.filter((plan) => {
      if (!plan.targetCompletionDate || plan.progressStatus === "Completed") return false;
      const target = new Date(`${plan.targetCompletionDate}T00:00:00`).getTime();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysUntilTarget = (target - today.getTime()) / 86_400_000;
      return daysUntilTarget >= 0 && daysUntilTarget <= 14;
    }).length;

    return { totalPlans, completedPlans, averageProgress, dueSoon };
  }, [plans]);

  function savePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextPlan = {
      ...form,
      employeeName: form.employeeName.trim(),
      currentRole: form.currentRole.trim(),
      targetRole: form.targetRole.trim(),
      skillGaps: form.skillGaps.trim(),
      requiredTrainingModules: form.requiredTrainingModules.trim(),
      requiredCertifications: form.requiredCertifications.trim(),
      trainerMentorAssigned: form.trainerMentorAssigned.trim(),
      supervisorNotes: form.supervisorNotes.trim(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setPlans((currentPlans) => currentPlans.map((plan) => (plan.id === editingId ? { ...nextPlan, id: editingId } : plan)));
    } else {
      setPlans((currentPlans) => [{ ...nextPlan, id: crypto.randomUUID() }, ...currentPlans]);
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function editPlan(plan: TrainingPlan) {
    setForm({
      employeeName: plan.employeeName,
      currentRole: plan.currentRole,
      targetRole: plan.targetRole,
      skillGaps: plan.skillGaps,
      requiredTrainingModules: plan.requiredTrainingModules,
      requiredCertifications: plan.requiredCertifications,
      trainerMentorAssigned: plan.trainerMentorAssigned,
      startDate: plan.startDate,
      targetCompletionDate: plan.targetCompletionDate,
      progressStatus: plan.progressStatus,
      supervisorNotes: plan.supervisorNotes,
    });
    setEditingId(plan.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deletePlan(planId: string) {
    setPlans((currentPlans) => currentPlans.filter((plan) => plan.id !== planId));
    if (editingId === planId) {
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:p-4 print:shadow-none">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Training Tools</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Employee Training Plan Builder</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
            Create role-based development plans, assign mentors, track required modules and certifications, save records locally, and print clean training plans for review meetings.
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-4 print:grid-cols-4">
          {[
            ["Saved plans", summary.totalPlans],
            ["Completed", summary.completedPlans],
            ["Avg. progress", `${summary.averageProgress}%`],
            ["Due in 14 days", summary.dueSoon],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/[0.07] p-4 print:border-slate-300 print:bg-white">
              <p className="text-3xl font-black text-white print:text-slate-950">{value}</p>
              <h2 className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-cyan-200 print:text-slate-600">{label}</h2>
            </article>
          ))}
        </section>

        <form onSubmit={savePlan} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">{editingId ? "Edit plan" : "Create training plan"}</p>
              <h2 className="mt-2 text-2xl font-black text-white">Plan details</h2>
            </div>
            <button className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200" type="submit">
              {editingId ? "Update plan" : "Save plan"}
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Employee name", "employeeName", "text"],
              ["Current role", "currentRole", "text"],
              ["Target role", "targetRole", "text"],
              ["Trainer / mentor assigned", "trainerMentorAssigned", "text"],
              ["Start date", "startDate", "date"],
              ["Target completion date", "targetCompletionDate", "date"],
            ].map(([label, key, type]) => (
              <label key={key} className="text-sm font-bold text-slate-200">
                {label}
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  required={["employeeName", "currentRole", "targetRole"].includes(key)}
                  type={type}
                  value={form[key as keyof TrainingPlanForm]}
                  onChange={(event) => setForm((currentForm) => ({ ...currentForm, [key]: event.target.value }))}
                />
              </label>
            ))}

            <label className="text-sm font-bold text-slate-200">
              Progress status
              <select
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                value={form.progressStatus}
                onChange={(event) => setForm((currentForm) => ({ ...currentForm, progressStatus: event.target.value as ProgressStatus }))}
              >
                {progressStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Progress percentage</p>
              <p className="mt-2 text-4xl font-black text-white">{calculatePlanProgress(form)}%</p>
            </div>

            {[
              ["Skill gaps", "skillGaps"],
              ["Required training modules", "requiredTrainingModules"],
              ["Required certifications", "requiredCertifications"],
              ["Supervisor notes", "supervisorNotes"],
            ].map(([label, key]) => (
              <label key={key} className="text-sm font-bold text-slate-200 sm:col-span-2">
                {label}
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                  value={form[key as keyof TrainingPlanForm]}
                  onChange={(event) => setForm((currentForm) => ({ ...currentForm, [key]: event.target.value }))}
                />
              </label>
            ))}
          </div>
        </form>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 sm:p-6 print:hidden">
          <h2 className="text-2xl font-black text-white">View saved plans</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <input className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Filter employee" value={filters.employee} onChange={(event) => setFilters((current) => ({ ...current, employee: event.target.value }))} />
            <input className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Filter role" value={filters.role} onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))} />
            <select className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option>All</option>
              {progressStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
            <input className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" type="date" value={filters.targetDate} onChange={(event) => setFilters((current) => ({ ...current, targetDate: event.target.value }))} />
          </div>
        </section>

        <section className="grid gap-4 print:block">
          {filteredPlans.length === 0 ? (
            <article className="rounded-[1.75rem] border border-dashed border-white/20 bg-white/[0.04] p-6 text-center text-slate-300 print:hidden">No saved training plans match the current filters.</article>
          ) : null}

          {filteredPlans.map((plan) => {
            const progress = calculatePlanProgress(plan);
            return (
              <article key={plan.id} className="break-inside-avoid rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30 print:mb-4 print:border-slate-300 print:bg-white print:p-4 print:shadow-none">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300 print:text-slate-600">{plan.progressStatus}</p>
                    <h2 className="mt-2 text-2xl font-black text-white print:text-slate-950">{plan.employeeName}</h2>
                    <p className="mt-1 text-sm text-slate-300 print:text-slate-700">{plan.currentRole} → {plan.targetRole}</p>
                  </div>
                  <div className="min-w-40">
                    <p className="text-right text-3xl font-black text-white print:text-slate-950">{progress}%</p>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800 print:border print:border-slate-300 print:bg-white">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 print:grid-cols-2">
                  <div><dt className="font-black text-slate-400 print:text-slate-600">Trainer / mentor</dt><dd className="text-slate-100 print:text-slate-950">{plan.trainerMentorAssigned || "Not assigned"}</dd></div>
                  <div><dt className="font-black text-slate-400 print:text-slate-600">Schedule</dt><dd className="text-slate-100 print:text-slate-950">{formatDate(plan.startDate)} - {formatDate(plan.targetCompletionDate)}</dd></div>
                </dl>

                <div className="mt-5 grid gap-4 sm:grid-cols-3 print:grid-cols-3">
                  {[
                    ["Skill gaps", splitItems(plan.skillGaps)],
                    ["Training modules", splitItems(plan.requiredTrainingModules)],
                    ["Certifications", splitItems(plan.requiredCertifications)],
                  ].map(([label, items]) => (
                    <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 print:border-slate-300 print:bg-white">
                      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-emerald-200 print:text-slate-700">{label as string}</h3>
                      <ul className="mt-3 space-y-2 text-sm text-slate-200 print:text-slate-950">
                        {(items as string[]).length > 0 ? (items as string[]).map((item) => <li key={item}>• {item}</li>) : <li>Not recorded</li>}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 print:border-slate-300 print:bg-white">
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200 print:text-slate-700">Supervisor notes</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200 print:text-slate-950">{plan.supervisorNotes || "No notes entered."}</p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row print:hidden">
                  <button className="rounded-2xl border border-cyan-300/40 px-4 py-3 text-sm font-black text-cyan-100" type="button" onClick={() => editPlan(plan)}>Edit</button>
                  <button className="rounded-2xl border border-rose-300/40 px-4 py-3 text-sm font-black text-rose-100" type="button" onClick={() => deletePlan(plan.id)}>Delete</button>
                  <button className="rounded-2xl border border-white/20 px-4 py-3 text-sm font-black text-white" type="button" onClick={() => window.print()}>Print-friendly training plan</button>
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
