"use client";

import { FormEvent, useMemo, useState } from "react";

type SkillStatus = "Not Started" | "In Progress" | "Complete";

type SkillRecord = {
  id: string;
  employeeName: string;
  skill: string;
  status: SkillStatus;
  createdAt: string;
};

type SkillForm = Pick<SkillRecord, "employeeName" | "skill" | "status">;

const statusOptions: SkillStatus[] = ["Not Started", "In Progress", "Complete"];

const suggestedSkills = [
  "Startup Procedure",
  "Mold Change",
  "Material Handling",
  "Scientific Molding Basics",
  "Troubleshooting Flash",
  "Troubleshooting Short Shot",
  "Process Documentation",
  "Quality Inspection",
];

const emptyForm: SkillForm = {
  employeeName: "",
  skill: "",
  status: "Not Started",
};

const statusStyles: Record<SkillStatus, string> = {
  "Not Started": "border-slate-300/30 bg-slate-300/10 text-slate-100",
  "In Progress": "border-amber-300/40 bg-amber-300/10 text-amber-100",
  Complete: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function SkillsMatrixPage() {
  const [records, setRecords] = useState<SkillRecord[]>([]);
  const [form, setForm] = useState<SkillForm>(emptyForm);

  const summary = useMemo(() => ({
    total: records.length,
    inProgress: records.filter((record) => record.status === "In Progress").length,
    complete: records.filter((record) => record.status === "Complete").length,
  }), [records]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const employeeName = form.employeeName.trim();
    const skill = form.skill.trim();

    if (!employeeName || !skill) return;

    setRecords((current) => [
      {
        id: crypto.randomUUID(),
        employeeName,
        skill,
        status: form.status,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setForm(emptyForm);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Training Tools</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Skills Matrix MVP</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                A simple, people-first place for supervisors and trainers to track who is learning key molding skills, what needs support, and what knowledge is already complete.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center sm:min-w-96">
              <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-4">
                <p className="text-3xl font-black text-white">{summary.total}</p>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-300">Records</p>
              </div>
              <div className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-4">
                <p className="text-3xl font-black text-white">{summary.inProgress}</p>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-100">In Progress</p>
              </div>
              <div className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-4">
                <p className="text-3xl font-black text-white">{summary.complete}</p>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-100">Complete</p>
              </div>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40 sm:grid-cols-3 sm:p-6">
          <div className="sm:col-span-3">
            <h2 className="text-2xl font-black text-white">Add skill record</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">Required fields keep the matrix clear without adding accounts, databases, or extra workflow.</p>
          </div>

          <label className="grid gap-2 text-sm font-bold text-slate-200">
            Employee Name
            <input
              required
              value={form.employeeName}
              onChange={(event) => setForm({ ...form, employeeName: event.target.value })}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
              placeholder="Jordan Lee"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-200">
            Skill
            <input
              required
              list="suggested-skills"
              value={form.skill}
              onChange={(event) => setForm({ ...form, skill: event.target.value })}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
              placeholder="Select or type a skill"
            />
            <datalist id="suggested-skills">
              {suggestedSkills.map((skill) => <option key={skill} value={skill} />)}
            </datalist>
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-200">
            Status
            <select
              required
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value as SkillStatus })}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
            >
              {statusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>

          <button type="submit" className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 sm:col-span-3">
            Add record
          </button>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Training progress records</h2>
              <p className="mt-1 text-sm text-slate-300">Newest records appear first so recent coaching conversations stay visible.</p>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/60 p-8 text-center text-slate-300">
              No skill records yet. Add the first employee skill above.
            </div>
          ) : (
            <div className="grid gap-3">
              {records.map((record) => (
                <article key={record.id} className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Employee</p>
                    <h3 className="mt-1 text-xl font-black text-white">{record.employeeName}</h3>
                    <p className="mt-1 text-xs text-slate-400">Added {formatDate(record.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Skill</p>
                    <p className="mt-1 text-base font-semibold text-slate-100">{record.skill}</p>
                  </div>
                  <span className={`w-fit rounded-full border px-4 py-2 text-sm font-black ${statusStyles[record.status]}`}>{record.status}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
