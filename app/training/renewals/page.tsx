"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type RenewalStatus = "Current" | "Due Soon" | "Overdue";
type RenewalRequired = "Yes" | "No";

type RenewalRecord = {
  id: string;
  employeeName: string;
  trainingName: string;
  issueDate: string;
  expirationDate: string;
  renewalRequired: RenewalRequired;
  reminderStatus: RenewalStatus;
  supervisor: string;
  notes: string;
  updatedAt: string;
};

type RenewalForm = Omit<RenewalRecord, "id" | "updatedAt">;

const storageKey = "moldingMentor.trainingRenewals";
const statuses: RenewalStatus[] = ["Current", "Due Soon", "Overdue"];
const renewalRequiredOptions: RenewalRequired[] = ["Yes", "No"];

const emptyForm: RenewalForm = {
  employeeName: "",
  trainingName: "",
  issueDate: "",
  expirationDate: "",
  renewalRequired: "Yes",
  reminderStatus: "Current",
  supervisor: "",
  notes: "",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function daysUntil(dateValue: string) {
  if (!dateValue) return Number.POSITIVE_INFINITY;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateValue}T00:00:00`);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

function getCalculatedStatus(record: Pick<RenewalRecord, "expirationDate" | "renewalRequired" | "reminderStatus">): RenewalStatus {
  if (record.renewalRequired === "No") return record.reminderStatus;
  const days = daysUntil(record.expirationDate);
  if (days < 0) return "Overdue";
  if (days <= 30) return "Due Soon";
  return "Current";
}

export default function TrainingRenewalsPage() {
  const [records, setRecords] = useState<RenewalRecord[]>([]);
  const [form, setForm] = useState<RenewalForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoadedRecords, setHasLoadedRecords] = useState(false);
  const [filters, setFilters] = useState({ employee: "", status: "All", expirationDate: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setRecords(JSON.parse(saved) as RenewalRecord[]);
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

  const recordsWithCalculatedStatus = useMemo(
    () => records.map((record) => ({ ...record, calculatedStatus: getCalculatedStatus(record) })),
    [records],
  );

  const counts = useMemo(
    () => ({
      current: recordsWithCalculatedStatus.filter((record) => record.calculatedStatus === "Current").length,
      dueSoon: records.filter((record) => record.renewalRequired === "Yes" && daysUntil(record.expirationDate) >= 0 && daysUntil(record.expirationDate) <= 30).length,
      overdue: recordsWithCalculatedStatus.filter((record) => record.calculatedStatus === "Overdue").length,
    }),
    [records, recordsWithCalculatedStatus],
  );

  const filteredRecords = useMemo(() => {
    return recordsWithCalculatedStatus.filter((record) => {
      const employeeMatch = normalize(record.employeeName).includes(normalize(filters.employee));
      const statusMatch = filters.status === "All" || record.calculatedStatus === filters.status;
      const expirationMatch = !filters.expirationDate || record.expirationDate === filters.expirationDate;
      return employeeMatch && statusMatch && expirationMatch;
    });
  }, [recordsWithCalculatedStatus, filters]);

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextRecord = {
      ...form,
      employeeName: form.employeeName.trim(),
      trainingName: form.trainingName.trim(),
      supervisor: form.supervisor.trim(),
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

  function editRecord(record: RenewalRecord) {
    setForm({
      employeeName: record.employeeName,
      trainingName: record.trainingName,
      issueDate: record.issueDate,
      expirationDate: record.expirationDate,
      renewalRequired: record.renewalRequired,
      reminderStatus: record.reminderStatus,
      supervisor: record.supervisor,
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
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Training Tools</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-slate-950">Training Renewal Reminder System</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Track certification renewals, due-soon reminders, supervisors, and notes with browser storage and a print-friendly renewal report.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-4 print:border-slate-300 print:bg-white"><p className="text-3xl font-black text-white print:text-slate-950">{counts.current}</p><p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-emerald-100 print:text-slate-600">Current</p></div>
              <div className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-4 print:border-slate-300 print:bg-white"><p className="text-3xl font-black text-white print:text-slate-950">{counts.dueSoon}</p><p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-amber-100 print:text-slate-600">30 days</p></div>
              <div className="rounded-3xl border border-rose-300/30 bg-rose-300/10 p-4 print:border-slate-300 print:bg-white"><p className="text-3xl font-black text-white print:text-slate-950">{counts.overdue}</p><p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-rose-100 print:text-slate-600">Overdue</p></div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] print:block">
          <form onSubmit={saveRecord} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
            <h2 className="text-2xl font-black text-white">{editingId ? "Edit renewal" : "Add renewal record"}</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-200">Employee name<input required value={form.employeeName} onChange={(event) => setForm({ ...form, employeeName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Training or certification name<input required value={form.trainingName} onChange={(event) => setForm({ ...form, trainingName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-slate-200">Issue date<input required type="date" value={form.issueDate} onChange={(event) => setForm({ ...form, issueDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label><label className="grid gap-2 text-sm font-bold text-slate-200">Expiration date<input required type="date" value={form.expirationDate} onChange={(event) => setForm({ ...form, expirationDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label></div>
              <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-slate-200">Renewal required<select value={form.renewalRequired} onChange={(event) => setForm({ ...form, renewalRequired: event.target.value as RenewalRequired })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300">{renewalRequiredOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label className="grid gap-2 text-sm font-bold text-slate-200">Reminder status<select value={form.reminderStatus} onChange={(event) => setForm({ ...form, reminderStatus: event.target.value as RenewalStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label></div>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Supervisor<input required value={form.supervisor} onChange={(event) => setForm({ ...form, supervisor: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Notes<textarea rows={4} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Add renewal record"}</button>{editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-200">Cancel</button> : null}</div>
          </form>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black text-white print:text-slate-950">Renewal report</h2><p className="mt-1 text-sm text-slate-300 print:text-slate-700">{filteredRecords.length} of {records.length} records shown</p></div><button onClick={() => window.print()} className="rounded-2xl border border-cyan-300/40 px-5 py-3 text-sm font-black text-cyan-100 print:hidden">Print report</button></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 print:hidden"><input placeholder="Filter employee" value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" /><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select><input type="date" value={filters.expirationDate} onChange={(event) => setFilters({ ...filters, expirationDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" /></div>
            <div className="mt-5 grid gap-4">
              {filteredRecords.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-5 text-slate-300 print:text-slate-700">No renewal records match the current filters.</p> : null}
              {filteredRecords.map((record) => (
                <article key={record.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 print:break-inside-avoid print:border-slate-300 print:bg-white">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="text-xl font-black text-white print:text-slate-950">{record.employeeName}</h3><p className="text-sm text-slate-300 print:text-slate-700">{record.trainingName} • Supervisor: {record.supervisor}</p></div><span className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 print:border-slate-300 print:bg-white print:text-slate-700">{record.calculatedStatus}</span></div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4"><div><dt className="font-bold text-slate-400 print:text-slate-600">Issued</dt><dd className="text-white print:text-slate-950">{record.issueDate}</dd></div><div><dt className="font-bold text-slate-400 print:text-slate-600">Expires</dt><dd className="text-white print:text-slate-950">{record.expirationDate}</dd></div><div><dt className="font-bold text-slate-400 print:text-slate-600">Renewal required</dt><dd className="text-white print:text-slate-950">{record.renewalRequired}</dd></div><div><dt className="font-bold text-slate-400 print:text-slate-600">Days left</dt><dd className="text-white print:text-slate-950">{Number.isFinite(daysUntil(record.expirationDate)) ? daysUntil(record.expirationDate) : "N/A"}</dd></div></dl>
                  {record.notes ? <p className="mt-4 rounded-2xl bg-white/5 p-3 text-sm leading-6 text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-800">{record.notes}</p> : null}
                  <div className="mt-4 flex gap-3 print:hidden"><button onClick={() => editRecord(record)} className="rounded-xl border border-emerald-300/40 px-4 py-2 text-sm font-bold text-emerald-100">Edit</button><button onClick={() => deleteRecord(record.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 text-sm font-bold text-rose-100">Delete</button></div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
