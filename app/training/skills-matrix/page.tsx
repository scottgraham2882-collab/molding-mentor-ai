"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type SkillLevel = "Not Trained" | "In Training" | "Qualified" | "Trainer";

type SkillRecord = {
  id: string;
  employeeName: string;
  role: string;
  skillCategory: string;
  skillName: string;
  skillLevel: SkillLevel;
  lastTrainedDate: string;
  expirationDate: string;
  supervisorSignOff: string;
  notes: string;
  updatedAt: string;
};

type SkillForm = Omit<SkillRecord, "id" | "updatedAt">;

const storageKey = "moldingMentor.employeeSkillsMatrix";
const skillLevels: SkillLevel[] = ["Not Trained", "In Training", "Qualified", "Trainer"];

const emptyForm: SkillForm = {
  employeeName: "",
  role: "",
  skillCategory: "",
  skillName: "",
  skillLevel: "Not Trained",
  lastTrainedDate: "",
  expirationDate: "",
  supervisorSignOff: "",
  notes: "",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function formatDate(value: string) {
  if (!value) return "Not recorded";
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

export default function SkillsMatrixPage() {
  const [records, setRecords] = useState<SkillRecord[]>([]);
  const [form, setForm] = useState<SkillForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoadedRecords, setHasLoadedRecords] = useState(false);
  const [filters, setFilters] = useState({ employee: "", role: "", skill: "", level: "All" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setRecords(JSON.parse(saved) as SkillRecord[]);
      } catch {
        setRecords([]);
      }
    }
    setHasLoadedRecords(true);
  }, []);

  useEffect(() => {
    if (hasLoadedRecords) {
      window.localStorage.setItem(storageKey, JSON.stringify(records));
    }
  }, [records, hasLoadedRecords]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const employeeMatch = normalize(record.employeeName).includes(normalize(filters.employee));
      const roleMatch = normalize(record.role).includes(normalize(filters.role));
      const skillMatch = `${record.skillCategory} ${record.skillName}`.toLowerCase().includes(normalize(filters.skill));
      const levelMatch = filters.level === "All" || record.skillLevel === filters.level;
      return employeeMatch && roleMatch && skillMatch && levelMatch;
    });
  }, [records, filters]);

  const summary = useMemo(() => {
    const counts = skillLevels.reduce<Record<SkillLevel, number>>((acc, level) => ({ ...acc, [level]: 0 }), {
      "Not Trained": 0,
      "In Training": 0,
      Qualified: 0,
      Trainer: 0,
    });

    records.forEach((record) => {
      counts[record.skillLevel] += 1;
    });

    const qualifiedTotal = counts.Qualified + counts.Trainer;
    const qualificationRate = records.length === 0 ? 0 : Math.round((qualifiedTotal / records.length) * 100);
    const expiringSoon = records.filter((record) => {
      if (!record.expirationDate) return false;
      const expiration = new Date(`${record.expirationDate}T00:00:00`).getTime();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysUntilExpiration = (expiration - today.getTime()) / 86_400_000;
      return daysUntilExpiration >= 0 && daysUntilExpiration <= 30;
    }).length;

    return { counts, qualifiedTotal, qualificationRate, expiringSoon };
  }, [records]);

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextRecord = {
      ...form,
      employeeName: form.employeeName.trim(),
      role: form.role.trim(),
      skillCategory: form.skillCategory.trim(),
      skillName: form.skillName.trim(),
      supervisorSignOff: form.supervisorSignOff.trim(),
      notes: form.notes.trim(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setRecords((current) => current.map((record) => (record.id === editingId ? { ...nextRecord, id: editingId } : record)));
    } else {
      setRecords((current) => [{ ...nextRecord, id: crypto.randomUUID() }, ...current]);
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function editRecord(record: SkillRecord) {
    setForm({
      employeeName: record.employeeName,
      role: record.role,
      skillCategory: record.skillCategory,
      skillName: record.skillName,
      skillLevel: record.skillLevel,
      lastTrainedDate: record.lastTrainedDate,
      expirationDate: record.expirationDate,
      supervisorSignOff: record.supervisorSignOff,
      notes: record.notes,
    });
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Training Tools</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-slate-950">Employee Skills Matrix</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Build a supervisor-ready training matrix with qualification levels, expiration tracking, sign-offs, local browser storage, filters, and a print-friendly report.
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-5 text-center print:border-slate-300 print:bg-white">
              <p className="text-5xl font-black text-white print:text-slate-950">{summary.qualificationRate}%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100 print:text-slate-600">Qualified</p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 print:grid-cols-5">
          {[...skillLevels.map((level) => ({ label: level, value: summary.counts[level] })), { label: "Qualified + Trainer", value: summary.qualifiedTotal }, { label: "Expires in 30 days", value: summary.expiringSoon }].map((item) => (
            <article key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.07] p-4 print:border-slate-300 print:bg-white">
              <p className="text-3xl font-black text-white print:text-slate-950">{item.value}</p>
              <h2 className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 print:text-slate-600">{item.label}</h2>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr] print:block">
          <form onSubmit={saveRecord} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
            <h2 className="text-2xl font-black text-white">{editingId ? "Edit skill record" : "Add employee skill record"}</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-200">Employee name<input required value={form.employeeName} onChange={(event) => setForm({ ...form, employeeName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Role<input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Skill category<input required value={form.skillCategory} onChange={(event) => setForm({ ...form, skillCategory: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Skill name<input required value={form.skillName} onChange={(event) => setForm({ ...form, skillName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Skill level<select value={form.skillLevel} onChange={(event) => setForm({ ...form, skillLevel: event.target.value as SkillLevel })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300">{skillLevels.map((level) => <option key={level}>{level}</option>)}</select></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-slate-200">Last trained date<input type="date" value={form.lastTrainedDate} onChange={(event) => setForm({ ...form, lastTrainedDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
                <label className="grid gap-2 text-sm font-bold text-slate-200">Expiration date<input type="date" value={form.expirationDate} onChange={(event) => setForm({ ...form, expirationDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              </div>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Supervisor sign-off<input placeholder="Supervisor initials or name" value={form.supervisorSignOff} onChange={(event) => setForm({ ...form, supervisorSignOff: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Notes<textarea rows={4} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Add skill record"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-200">Cancel</button> : null}
            </div>
          </form>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-2xl font-black text-white print:text-slate-950">Saved skills matrix</h2><p className="mt-1 text-sm text-slate-300 print:text-slate-700">{filteredRecords.length} of {records.length} records shown</p></div>
              <button onClick={() => window.print()} className="rounded-2xl border border-cyan-300/40 px-5 py-3 text-sm font-black text-cyan-100 print:hidden">Print matrix report</button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 print:hidden">
              <input placeholder="Filter employee" value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              <input placeholder="Filter role" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              <input placeholder="Filter skill" value={filters.skill} onChange={(event) => setFilters({ ...filters, skill: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              <select value={filters.level} onChange={(event) => setFilters({ ...filters, level: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"><option>All</option>{skillLevels.map((level) => <option key={level}>{level}</option>)}</select>
            </div>

            <div className="mt-5 overflow-x-auto print:overflow-visible">
              <table className="w-full min-w-[900px] border-separate border-spacing-y-3 text-left text-sm print:min-w-0 print:border-collapse print:border print:border-slate-300">
                <thead className="text-xs uppercase tracking-[0.16em] text-slate-400 print:text-slate-600">
                  <tr>{["Employee", "Role", "Category", "Skill", "Level", "Last trained", "Expires", "Sign-off", "Notes", "Actions"].map((heading) => <th key={heading} className="px-3 py-2 print:border print:border-slate-300">{heading}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? <tr><td colSpan={10} className="rounded-2xl border border-dashed border-white/20 p-5 text-slate-300 print:border-slate-300 print:text-slate-700">No skill records match the current filters.</td></tr> : null}
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="bg-slate-950/70 text-slate-100 print:bg-white print:text-slate-950">
                      <td className="rounded-l-2xl px-3 py-4 font-black text-white print:rounded-none print:border print:border-slate-300 print:text-slate-950">{record.employeeName}</td>
                      <td className="px-3 py-4 print:border print:border-slate-300">{record.role}</td>
                      <td className="px-3 py-4 print:border print:border-slate-300">{record.skillCategory}</td>
                      <td className="px-3 py-4 font-bold print:border print:border-slate-300">{record.skillName}</td>
                      <td className="px-3 py-4 print:border print:border-slate-300"><span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100 print:border-0 print:bg-white print:p-0 print:text-slate-950">{record.skillLevel}</span></td>
                      <td className="px-3 py-4 print:border print:border-slate-300">{formatDate(record.lastTrainedDate)}</td>
                      <td className="px-3 py-4 print:border print:border-slate-300">{formatDate(record.expirationDate)}</td>
                      <td className="px-3 py-4 print:border print:border-slate-300">{record.supervisorSignOff || "Pending"}</td>
                      <td className="px-3 py-4 print:border print:border-slate-300">{record.notes || "—"}</td>
                      <td className="rounded-r-2xl px-3 py-4 print:hidden"><div className="flex gap-2"><button onClick={() => editRecord(record)} className="rounded-xl border border-emerald-300/40 px-3 py-2 text-xs font-bold text-emerald-100">Edit</button><button onClick={() => deleteRecord(record.id)} className="rounded-xl border border-rose-300/40 px-3 py-2 text-xs font-bold text-rose-100">Delete</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
