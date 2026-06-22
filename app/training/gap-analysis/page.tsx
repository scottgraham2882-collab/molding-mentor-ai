"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type GapSeverity = "Low" | "Medium" | "High" | "Critical";
type GapStatus = "Open" | "In Progress" | "Scheduled" | "Completed" | "Deferred";

type GapRecord = {
  id: string;
  employeeName: string;
  currentRole: string;
  targetRole: string;
  requiredSkill: string;
  currentSkillLevel: string;
  requiredSkillLevel: string;
  gapSeverity: GapSeverity;
  recommendedTraining: string;
  dueDate: string;
  status: GapStatus;
  updatedAt: string;
};

type GapForm = Omit<GapRecord, "id" | "updatedAt">;

const storageKey = "moldingMentor.trainingGapAnalysis";
const severities: GapSeverity[] = ["Low", "Medium", "High", "Critical"];
const statuses: GapStatus[] = ["Open", "In Progress", "Scheduled", "Completed", "Deferred"];
const skillLevels = ["No experience", "Awareness", "Basic", "Working", "Proficient", "Trainer"];

const emptyForm: GapForm = {
  employeeName: "",
  currentRole: "",
  targetRole: "",
  requiredSkill: "",
  currentSkillLevel: "Awareness",
  requiredSkillLevel: "Working",
  gapSeverity: "Medium",
  recommendedTraining: "",
  dueDate: "",
  status: "Open",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function formatDate(value: string) {
  if (!value) return "No due date";
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

function severityBadge(severity: GapSeverity) {
  if (severity === "Critical") return "border-rose-300/40 bg-rose-300/15 text-rose-100";
  if (severity === "High") return "border-orange-300/40 bg-orange-300/15 text-orange-100";
  if (severity === "Medium") return "border-amber-300/40 bg-amber-300/15 text-amber-100";
  return "border-emerald-300/40 bg-emerald-300/15 text-emerald-100";
}

function statusBadge(status: GapStatus) {
  if (status === "Completed") return "border-emerald-300/30 bg-emerald-300/15 text-emerald-100";
  if (status === "In Progress" || status === "Scheduled") return "border-cyan-300/30 bg-cyan-300/15 text-cyan-100";
  if (status === "Deferred") return "border-slate-300/20 bg-slate-300/10 text-slate-200";
  return "border-amber-300/30 bg-amber-300/15 text-amber-100";
}

export default function TrainingGapAnalysisPage() {
  const [records, setRecords] = useState<GapRecord[]>([]);
  const [form, setForm] = useState<GapForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoadedRecords, setHasLoadedRecords] = useState(false);
  const [filters, setFilters] = useState({ employee: "", role: "", severity: "All", status: "All" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setRecords(JSON.parse(saved) as GapRecord[]);
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

  const filteredRecords = useMemo(() => records.filter((record) => {
    const employeeMatch = normalize(record.employeeName).includes(normalize(filters.employee));
    const roleMatch = normalize(`${record.currentRole} ${record.targetRole}`).includes(normalize(filters.role));
    const severityMatch = filters.severity === "All" || record.gapSeverity === filters.severity;
    const statusMatch = filters.status === "All" || record.status === filters.status;
    return employeeMatch && roleMatch && severityMatch && statusMatch;
  }), [records, filters]);

  const openGaps = records.filter((record) => record.status !== "Completed" && record.status !== "Deferred").length;
  const criticalGaps = records.filter((record) => record.gapSeverity === "Critical" && record.status !== "Completed").length;

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextRecord = {
      ...form,
      employeeName: form.employeeName.trim(),
      currentRole: form.currentRole.trim(),
      targetRole: form.targetRole.trim(),
      requiredSkill: form.requiredSkill.trim(),
      recommendedTraining: form.recommendedTraining.trim(),
      updatedAt: new Date().toISOString(),
    };
    if (!nextRecord.employeeName || !nextRecord.currentRole || !nextRecord.targetRole || !nextRecord.requiredSkill) return;
    if (editingId) {
      setRecords((current) => current.map((record) => (record.id === editingId ? { ...nextRecord, id: editingId } : record)));
      setEditingId(null);
    } else {
      setRecords((current) => [{ ...nextRecord, id: crypto.randomUUID() }, ...current]);
    }
    setForm(emptyForm);
  }

  function editRecord(record: GapRecord) {
    setForm({ employeeName: record.employeeName, currentRole: record.currentRole, targetRole: record.targetRole, requiredSkill: record.requiredSkill, currentSkillLevel: record.currentSkillLevel, requiredSkillLevel: record.requiredSkillLevel, gapSeverity: record.gapSeverity, recommendedTraining: record.recommendedTraining, dueDate: record.dueDate, status: record.status });
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
        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:p-4 print:shadow-none">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300 print:text-slate-700">Training Tools</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Training Gap Analysis</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">Compare current roles to target roles, document skill gaps, prioritize severity, assign training, and print a focused development report.</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-center print:border-slate-300 print:bg-white"><p className="text-4xl font-black text-white print:text-slate-950">{openGaps}</p><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100 print:text-slate-700">Open gaps</p></div>
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-center print:border-slate-300 print:bg-white"><p className="text-4xl font-black text-white print:text-slate-950">{criticalGaps}</p><p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-100 print:text-slate-700">Critical gaps</p></div>
          </div>
        </header>

        <form onSubmit={saveRecord} className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4 sm:grid-cols-2 lg:grid-cols-5 print:hidden">
          <label className="text-sm font-bold text-slate-200">Employee name<input required value={form.employeeName} onChange={(event) => setForm({ ...form, employeeName: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" /></label>
          <label className="text-sm font-bold text-slate-200">Current role<input required value={form.currentRole} onChange={(event) => setForm({ ...form, currentRole: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" /></label>
          <label className="text-sm font-bold text-slate-200">Target role<input required value={form.targetRole} onChange={(event) => setForm({ ...form, targetRole: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" /></label>
          <label className="text-sm font-bold text-slate-200">Required skill<input required value={form.requiredSkill} onChange={(event) => setForm({ ...form, requiredSkill: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" /></label>
          <label className="text-sm font-bold text-slate-200">Current skill level<select value={form.currentSkillLevel} onChange={(event) => setForm({ ...form, currentSkillLevel: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white">{skillLevels.map((level) => <option key={level}>{level}</option>)}</select></label>
          <label className="text-sm font-bold text-slate-200">Required skill level<select value={form.requiredSkillLevel} onChange={(event) => setForm({ ...form, requiredSkillLevel: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white">{skillLevels.map((level) => <option key={level}>{level}</option>)}</select></label>
          <label className="text-sm font-bold text-slate-200">Gap severity<select value={form.gapSeverity} onChange={(event) => setForm({ ...form, gapSeverity: event.target.value as GapSeverity })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white">{severities.map((severity) => <option key={severity}>{severity}</option>)}</select></label>
          <label className="text-sm font-bold text-slate-200">Recommended training<input value={form.recommendedTraining} onChange={(event) => setForm({ ...form, recommendedTraining: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" /></label>
          <label className="text-sm font-bold text-slate-200">Due date<input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" /></label>
          <label className="text-sm font-bold text-slate-200">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as GapStatus })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <div className="flex gap-3 sm:col-span-2 lg:col-span-5"><button className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200" type="submit">{editingId ? "Update gap" : "Add gap"}</button>{editingId ? <button className="rounded-xl border border-white/10 px-5 py-3 text-sm font-black text-white" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</button> : null}</div>
        </form>

        <section className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4 sm:grid-cols-4 print:hidden">
          <input placeholder="Filter employee" value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
          <input placeholder="Filter current or target role" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
          <select value={filters.severity} onChange={(event) => setFilters({ ...filters, severity: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3 text-white"><option>All</option>{severities.map((severity) => <option key={severity}>{severity}</option>)}</select>
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3 text-white"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        </section>

        <section className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.07] print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4 print:border-slate-300"><h2 className="text-xl font-black text-white print:text-slate-950">Gap Analysis Report ({filteredRecords.length})</h2><button type="button" onClick={() => window.print()} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-100 print:hidden">Print report</button></div>
          <div className="grid gap-3 p-4 lg:hidden print:hidden">{filteredRecords.map((record) => (<article key={record.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-white">{record.employeeName}</p><p className="text-sm text-slate-300">{record.currentRole} → {record.targetRole}</p></div><span className={`rounded-full border px-3 py-1 text-xs font-bold ${severityBadge(record.gapSeverity)}`}>{record.gapSeverity}</span></div><p className="mt-3 text-sm text-slate-200"><span className="font-bold">Skill:</span> {record.requiredSkill}</p><p className="mt-1 text-sm text-slate-300">Level: {record.currentSkillLevel} → {record.requiredSkillLevel}</p><p className="mt-1 text-sm text-slate-300">Training: {record.recommendedTraining || "Not assigned"}</p><p className="mt-1 text-sm text-slate-300">Due: {formatDate(record.dueDate)} • <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${statusBadge(record.status)}`}>{record.status}</span></p><div className="mt-4 flex gap-2"><button onClick={() => editRecord(record)} className="rounded-lg bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950">Edit</button><button onClick={() => deleteRecord(record.id)} className="rounded-lg border border-rose-300/30 px-3 py-2 text-xs font-black text-rose-100">Delete</button></div></article>))}</div>
          <div className="hidden overflow-x-auto lg:block print:block"><table className="w-full min-w-[1100px] border-collapse text-left text-sm print:min-w-0 print:text-xs"><thead className="bg-slate-950/80 text-xs uppercase tracking-[0.18em] text-slate-300 print:bg-slate-100 print:text-slate-700"><tr>{["Employee", "Current role", "Target role", "Required skill", "Current", "Required", "Severity", "Training", "Due", "Status", "Actions"].map((heading) => <th key={heading} className="p-3 font-black print:p-2">{heading}</th>)}</tr></thead><tbody>{filteredRecords.map((record) => (<tr key={record.id} className="border-t border-white/10 print:border-slate-300"><td className="p-3 font-bold print:p-2">{record.employeeName}</td><td className="p-3 print:p-2">{record.currentRole}</td><td className="p-3 print:p-2">{record.targetRole}</td><td className="p-3 print:p-2">{record.requiredSkill}</td><td className="p-3 print:p-2">{record.currentSkillLevel}</td><td className="p-3 print:p-2">{record.requiredSkillLevel}</td><td className="p-3 print:p-2">{record.gapSeverity}</td><td className="p-3 print:p-2">{record.recommendedTraining || "Not assigned"}</td><td className="p-3 print:p-2">{formatDate(record.dueDate)}</td><td className="p-3 print:p-2">{record.status}</td><td className="p-3 print:hidden"><div className="flex gap-2"><button onClick={() => editRecord(record)} className="rounded-lg bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950">Edit</button><button onClick={() => deleteRecord(record.id)} className="rounded-lg border border-rose-300/30 px-3 py-2 text-xs font-black text-rose-100">Delete</button></div></td></tr>))}</tbody></table></div>
          {filteredRecords.length === 0 ? <p className="p-6 text-center text-slate-300 print:text-slate-700">No gap analysis records match the current filters.</p> : null}
        </section>
      </section>
    </main>
  );
}
