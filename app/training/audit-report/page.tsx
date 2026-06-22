"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AuditStatus = "Pass" | "Needs Update" | "Missing" | "Expired";

type AuditRecord = {
  id: string;
  auditDate: string;
  auditorName: string;
  department: string;
  employeeName: string;
  trainingRecordReviewed: string;
  certificationReviewed: string;
  status: AuditStatus;
  findings: string;
  correctiveActionNeeded: string;
  responsiblePerson: string;
  dueDate: string;
  closureNotes: string;
  updatedAt: string;
};

type AuditForm = Omit<AuditRecord, "id" | "updatedAt">;

type FilterState = {
  department: string;
  status: "All" | AuditStatus;
  employee: string;
  dueDate: string;
};

const storageKey = "moldingMentor.trainingAuditReportRecords";

const statuses: AuditStatus[] = ["Pass", "Needs Update", "Missing", "Expired"];

const emptyForm: AuditForm = {
  auditDate: new Date().toISOString().slice(0, 10),
  auditorName: "",
  department: "",
  employeeName: "",
  trainingRecordReviewed: "",
  certificationReviewed: "",
  status: "Pass",
  findings: "",
  correctiveActionNeeded: "",
  responsiblePerson: "",
  dueDate: "",
  closureNotes: "",
};

const emptyFilters: FilterState = {
  department: "",
  status: "All",
  employee: "",
  dueDate: "",
};

const statusStyles: Record<AuditStatus, string> = {
  Pass: "border-emerald-300/40 bg-emerald-300/15 text-emerald-100 print:border-emerald-700 print:text-emerald-800",
  "Needs Update": "border-amber-300/40 bg-amber-300/15 text-amber-100 print:border-amber-700 print:text-amber-800",
  Missing: "border-rose-300/40 bg-rose-300/15 text-rose-100 print:border-rose-700 print:text-rose-800",
  Expired: "border-red-300/40 bg-red-300/15 text-red-100 print:border-red-700 print:text-red-800",
};

function freshForm() {
  return { ...emptyForm, auditDate: new Date().toISOString().slice(0, 10) };
}

function matchesFilter(value: string, filter: string) {
  return value.toLowerCase().includes(filter.trim().toLowerCase());
}

export default function TrainingAuditReportPage() {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [form, setForm] = useState<AuditForm>(freshForm());
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setRecords(JSON.parse(saved) as AuditRecord[]);
      } catch {
        setRecords([]);
      }
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(records));
    }
  }, [records, hasLoaded]);

  const counts = useMemo(() => {
    return statuses.reduce<Record<AuditStatus, number>>((summary, status) => {
      summary[status] = records.filter((record) => record.status === status).length;
      return summary;
    }, { Pass: 0, "Needs Update": 0, Missing: 0, Expired: 0 });
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const statusMatch = filters.status === "All" || record.status === filters.status;
      const dueDateMatch = !filters.dueDate || record.dueDate === filters.dueDate;
      return (
        statusMatch &&
        dueDateMatch &&
        matchesFilter(record.department, filters.department) &&
        matchesFilter(record.employeeName, filters.employee)
      );
    });
  }, [filters, records]);

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextRecord = {
      ...form,
      auditorName: form.auditorName.trim(),
      department: form.department.trim(),
      employeeName: form.employeeName.trim(),
      trainingRecordReviewed: form.trainingRecordReviewed.trim(),
      certificationReviewed: form.certificationReviewed.trim(),
      findings: form.findings.trim(),
      correctiveActionNeeded: form.correctiveActionNeeded.trim(),
      responsiblePerson: form.responsiblePerson.trim(),
      closureNotes: form.closureNotes.trim(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setRecords((current) => current.map((record) => (record.id === editingId ? { ...nextRecord, id: editingId } : record)));
    } else {
      setRecords((current) => [{ ...nextRecord, id: crypto.randomUUID() }, ...current]);
    }

    setForm(freshForm());
    setEditingId(null);
  }

  function editRecord(record: AuditRecord) {
    setForm({
      auditDate: record.auditDate,
      auditorName: record.auditorName,
      department: record.department,
      employeeName: record.employeeName,
      trainingRecordReviewed: record.trainingRecordReviewed,
      certificationReviewed: record.certificationReviewed,
      status: record.status,
      findings: record.findings,
      correctiveActionNeeded: record.correctiveActionNeeded,
      responsiblePerson: record.responsiblePerson,
      dueDate: record.dueDate,
      closureNotes: record.closureNotes,
    });
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(freshForm());
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Training Tools</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-slate-950">Training Audit Report</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Audit employee training records and certifications, track corrective actions, save records locally, filter follow-up work, and print a clean audit report.
              </p>
            </div>
            <button onClick={() => window.print()} className="rounded-2xl border border-cyan-300/40 px-5 py-3 text-sm font-black text-cyan-100 print:hidden">Print audit report</button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statuses.map((status) => (
            <article key={status} className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 print:border-slate-300 print:bg-white print:shadow-none">
              <p className="text-4xl font-black text-white print:text-slate-950">{counts[status]}</p>
              <h2 className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-slate-300 print:text-slate-600">{status}</h2>
              <p className="mt-2 text-sm text-slate-400 print:text-slate-700">Saved audit records</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] print:block">
          <form onSubmit={saveRecord} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
            <h2 className="text-2xl font-black text-white">{editingId ? "Edit audit record" : "Add audit record"}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-200">Audit date<input required type="date" value={form.auditDate} onChange={(event) => setForm({ ...form, auditDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Auditor name<input required value={form.auditorName} onChange={(event) => setForm({ ...form, auditorName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Department<input required value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Employee name<input required value={form.employeeName} onChange={(event) => setForm({ ...form, employeeName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Training record reviewed<input required value={form.trainingRecordReviewed} onChange={(event) => setForm({ ...form, trainingRecordReviewed: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Certification reviewed<input value={form.certificationReviewed} onChange={(event) => setForm({ ...form, certificationReviewed: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AuditStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Due date<input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Findings<textarea required rows={3} value={form.findings} onChange={(event) => setForm({ ...form, findings: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Corrective action needed<textarea rows={3} value={form.correctiveActionNeeded} onChange={(event) => setForm({ ...form, correctiveActionNeeded: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Responsible person<input value={form.responsiblePerson} onChange={(event) => setForm({ ...form, responsiblePerson: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Closure notes<textarea rows={3} value={form.closureNotes} onChange={(event) => setForm({ ...form, closureNotes: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Save audit record"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(freshForm()); }} className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-200">Cancel</button> : null}
            </div>
          </form>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white print:text-slate-950">Saved audit records</h2>
                <p className="mt-1 text-sm text-slate-300 print:text-slate-700">Showing {filteredRecords.length} of {records.length} records saved in browser local storage.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
              <input placeholder="Filter department" value={filters.department} onChange={(event) => setFilters({ ...filters, department: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" />
              <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value as FilterState["status"] })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
              <input placeholder="Filter employee" value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" />
              <input aria-label="Filter due date" type="date" value={filters.dueDate} onChange={(event) => setFilters({ ...filters, dueDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" />
              <button onClick={() => setFilters(emptyFilters)} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 sm:col-span-2 lg:col-span-4">Clear filters</button>
            </div>

            <div className="mt-5 grid gap-4">
              {filteredRecords.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-5 text-slate-300 print:text-slate-700">No audit records match the current filters.</p> : null}
              {filteredRecords.map((record) => (
                <article key={record.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 print:break-inside-avoid print:border-slate-300 print:bg-white">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white print:text-slate-950">{record.employeeName}</h3>
                      <p className="text-sm text-slate-300 print:text-slate-700">{record.department} • Audit date: {record.auditDate} • Auditor: {record.auditorName}</p>
                    </div>
                    <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${statusStyles[record.status]}`}>{record.status}</span>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div><dt className="font-black text-slate-400 print:text-slate-600">Training record reviewed</dt><dd className="mt-1 text-slate-100 print:text-slate-950">{record.trainingRecordReviewed}</dd></div>
                    <div><dt className="font-black text-slate-400 print:text-slate-600">Certification reviewed</dt><dd className="mt-1 text-slate-100 print:text-slate-950">{record.certificationReviewed || "Not applicable"}</dd></div>
                    <div><dt className="font-black text-slate-400 print:text-slate-600">Responsible person</dt><dd className="mt-1 text-slate-100 print:text-slate-950">{record.responsiblePerson || "Unassigned"}</dd></div>
                    <div><dt className="font-black text-slate-400 print:text-slate-600">Due date</dt><dd className="mt-1 text-slate-100 print:text-slate-950">{record.dueDate || "No due date"}</dd></div>
                    <div className="sm:col-span-2"><dt className="font-black text-slate-400 print:text-slate-600">Findings</dt><dd className="mt-1 whitespace-pre-wrap text-slate-100 print:text-slate-950">{record.findings}</dd></div>
                    <div className="sm:col-span-2"><dt className="font-black text-slate-400 print:text-slate-600">Corrective action needed</dt><dd className="mt-1 whitespace-pre-wrap text-slate-100 print:text-slate-950">{record.correctiveActionNeeded || "None recorded"}</dd></div>
                    <div className="sm:col-span-2"><dt className="font-black text-slate-400 print:text-slate-600">Closure notes</dt><dd className="mt-1 whitespace-pre-wrap text-slate-100 print:text-slate-950">{record.closureNotes || "Open"}</dd></div>
                  </dl>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row print:hidden">
                    <button onClick={() => editRecord(record)} className="rounded-2xl border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-100">Edit</button>
                    <button onClick={() => deleteRecord(record.id)} className="rounded-2xl border border-rose-300/30 px-4 py-2 text-sm font-black text-rose-100">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
