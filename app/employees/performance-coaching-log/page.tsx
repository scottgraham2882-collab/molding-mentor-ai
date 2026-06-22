"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type CoachingStatus = "Open" | "Follow-up Scheduled" | "Closed";
type CoachingType = "Positive Reinforcement" | "Corrective Coaching" | "Training Need" | "Performance Review";

type CoachingLog = {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  coachingDate: string;
  coachName: string;
  coachingType: CoachingType;
  status: CoachingStatus;
  observation: string;
  standard: string;
  actionPlan: string;
  followUpDate: string;
  employeeResponse: string;
  supervisorNotes: string;
  updatedAt: string;
};

type CoachingLogForm = Omit<CoachingLog, "id" | "updatedAt">;

const storageKey = "moldingMentor.employeePerformanceCoachingLogs";
const coachingTypes: CoachingType[] = ["Positive Reinforcement", "Corrective Coaching", "Training Need", "Performance Review"];
const coachingStatuses: CoachingStatus[] = ["Open", "Follow-up Scheduled", "Closed"];

const emptyForm: CoachingLogForm = {
  employeeName: "",
  role: "",
  department: "",
  coachingDate: "",
  coachName: "",
  coachingType: "Corrective Coaching",
  status: "Open",
  observation: "",
  standard: "",
  actionPlan: "",
  followUpDate: "",
  employeeResponse: "",
  supervisorNotes: "",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function isOverdue(log: CoachingLog) {
  if (log.status === "Closed" || !log.followUpDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const followUp = new Date(`${log.followUpDate}T00:00:00`);
  return !Number.isNaN(followUp.getTime()) && followUp < today;
}

export default function EmployeePerformanceCoachingLogPage() {
  const [logs, setLogs] = useState<CoachingLog[]>([]);
  const [form, setForm] = useState<CoachingLogForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoadedLogs, setHasLoadedLogs] = useState(false);
  const [filters, setFilters] = useState({ employee: "", coach: "", status: "All", type: "All" });

  useEffect(() => {
    const savedLogs = window.localStorage.getItem(storageKey);
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs) as CoachingLog[]);
      } catch {
        setLogs([]);
      }
    }
    setHasLoadedLogs(true);
  }, []);

  useEffect(() => {
    if (hasLoadedLogs) {
      window.localStorage.setItem(storageKey, JSON.stringify(logs));
    }
  }, [logs, hasLoadedLogs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const employeeMatch = normalize(log.employeeName).includes(normalize(filters.employee));
      const coachMatch = normalize(log.coachName).includes(normalize(filters.coach));
      const statusMatch = filters.status === "All" || log.status === filters.status;
      const typeMatch = filters.type === "All" || log.coachingType === filters.type;
      return employeeMatch && coachMatch && statusMatch && typeMatch;
    });
  }, [logs, filters]);

  const summary = useMemo(() => {
    const open = logs.filter((log) => log.status !== "Closed").length;
    const overdue = logs.filter(isOverdue).length;
    const closed = logs.filter((log) => log.status === "Closed").length;
    return { open, overdue, closed };
  }, [logs]);

  function saveLog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextLog = {
      ...form,
      employeeName: form.employeeName.trim(),
      role: form.role.trim(),
      department: form.department.trim(),
      coachName: form.coachName.trim(),
      observation: form.observation.trim(),
      standard: form.standard.trim(),
      actionPlan: form.actionPlan.trim(),
      employeeResponse: form.employeeResponse.trim(),
      supervisorNotes: form.supervisorNotes.trim(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setLogs((current) => current.map((log) => (log.id === editingId ? { ...nextLog, id: editingId } : log)));
    } else {
      setLogs((current) => [{ ...nextLog, id: crypto.randomUUID() }, ...current]);
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function editLog(log: CoachingLog) {
    setForm({
      employeeName: log.employeeName,
      role: log.role,
      department: log.department,
      coachingDate: log.coachingDate,
      coachName: log.coachName,
      coachingType: log.coachingType,
      status: log.status,
      observation: log.observation,
      standard: log.standard,
      actionPlan: log.actionPlan,
      followUpDate: log.followUpDate,
      employeeResponse: log.employeeResponse,
      supervisorNotes: log.supervisorNotes,
    });
    setEditingId(log.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteLog(id: string) {
    setLogs((current) => current.filter((log) => log.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Employee Management</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-slate-950">Employee Performance Coaching Log</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Document coaching conversations, standards, action plans, employee responses, follow-up dates, and closure status from any device.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center sm:min-w-96 print:hidden">
              <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-4"><p className="text-3xl font-black text-white">{summary.open}</p><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-cyan-100">Open</p></div>
              <div className="rounded-3xl border border-rose-300/30 bg-rose-300/10 p-4"><p className="text-3xl font-black text-white">{summary.overdue}</p><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-rose-100">Overdue</p></div>
              <div className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-4"><p className="text-3xl font-black text-white">{summary.closed}</p><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-100">Closed</p></div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr] print:block">
          <form onSubmit={saveLog} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
            <h2 className="text-2xl font-black text-white">{editingId ? "Edit coaching log" : "Create coaching log"}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-200">Employee name<input required value={form.employeeName} onChange={(event) => setForm({ ...form, employeeName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Role<input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Department<input required value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Coaching date<input required type="date" value={form.coachingDate} onChange={(event) => setForm({ ...form, coachingDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Coach / supervisor<input required value={form.coachName} onChange={(event) => setForm({ ...form, coachName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Coaching type<select value={form.coachingType} onChange={(event) => setForm({ ...form, coachingType: event.target.value as CoachingType })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300">{coachingTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as CoachingStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300">{coachingStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Follow-up date<input type="date" value={form.followUpDate} onChange={(event) => setForm({ ...form, followUpDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Observed behavior or performance<input required value={form.observation} onChange={(event) => setForm({ ...form, observation: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Standard or expectation<textarea required rows={3} value={form.standard} onChange={(event) => setForm({ ...form, standard: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Action plan<textarea required rows={3} value={form.actionPlan} onChange={(event) => setForm({ ...form, actionPlan: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Employee response<textarea rows={3} value={form.employeeResponse} onChange={(event) => setForm({ ...form, employeeResponse: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Supervisor notes<textarea rows={3} value={form.supervisorNotes} onChange={(event) => setForm({ ...form, supervisorNotes: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Create coaching log"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-200">Cancel</button> : null}
            </div>
          </form>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-2xl font-black text-white print:text-slate-950">Saved coaching logs</h2><p className="mt-1 text-sm text-slate-300 print:text-slate-700">{filteredLogs.length} of {logs.length} logs shown</p></div>
              <button onClick={() => window.print()} className="rounded-2xl border border-cyan-300/40 px-5 py-3 text-sm font-black text-cyan-100 print:hidden">Print logs</button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4 print:hidden">
              <input placeholder="Filter employee" value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              <input placeholder="Filter coach" value={filters.coach} onChange={(event) => setFilters({ ...filters, coach: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"><option>All</option>{coachingStatuses.map((status) => <option key={status}>{status}</option>)}</select>
              <select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"><option>All</option>{coachingTypes.map((type) => <option key={type}>{type}</option>)}</select>
            </div>

            <div className="mt-5 grid gap-4">
              {filteredLogs.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-5 text-slate-300 print:text-slate-700">No coaching logs match the current filters.</p> : null}
              {filteredLogs.map((log) => {
                const overdue = isOverdue(log);
                const statusClass = overdue ? "border-rose-300/40 bg-rose-300/10 text-rose-100" : log.status === "Closed" ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100" : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100";
                return (
                  <article key={log.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 print:break-inside-avoid print:border-slate-300 print:bg-white">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div><h3 className="text-xl font-black text-white print:text-slate-950">{log.employeeName}</h3><p className="text-sm text-slate-300 print:text-slate-700">{log.role} • {log.department} • {log.coachingDate}</p></div>
                      <div className="flex flex-wrap gap-2"><span className="w-fit rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-violet-100 print:border-slate-300 print:bg-white print:text-slate-700">{log.coachingType}</span><span className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] print:border-slate-300 print:bg-white print:text-slate-700 ${statusClass}`}>{overdue ? "Overdue" : log.status}</span></div>
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <div><dt className="font-bold text-slate-400 print:text-slate-600">Coach</dt><dd className="text-white print:text-slate-950">{log.coachName}</dd></div>
                      <div><dt className="font-bold text-slate-400 print:text-slate-600">Follow-up</dt><dd className="text-white print:text-slate-950">{log.followUpDate || "Not scheduled"}</dd></div>
                      <div><dt className="font-bold text-slate-400 print:text-slate-600">Observed behavior</dt><dd className="text-white print:text-slate-950">{log.observation}</dd></div>
                    </dl>
                    <div className="mt-4 grid gap-3 text-sm">
                      <p className="rounded-2xl bg-white/5 p-3 leading-6 text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-800"><strong>Standard:</strong> {log.standard}</p>
                      <p className="rounded-2xl bg-white/5 p-3 leading-6 text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-800"><strong>Action plan:</strong> {log.actionPlan}</p>
                      {log.employeeResponse ? <p className="rounded-2xl bg-white/5 p-3 leading-6 text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-800"><strong>Employee response:</strong> {log.employeeResponse}</p> : null}
                      {log.supervisorNotes ? <p className="rounded-2xl bg-white/5 p-3 leading-6 text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-800"><strong>Supervisor notes:</strong> {log.supervisorNotes}</p> : null}
                    </div>
                    <div className="mt-4 flex gap-3 print:hidden">
                      <button onClick={() => editLog(log)} className="rounded-xl border border-emerald-300/40 px-4 py-2 text-sm font-bold text-emerald-100">Edit</button>
                      <button onClick={() => deleteLog(log.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 text-sm font-bold text-rose-100">Delete</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
