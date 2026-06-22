"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type CertificationStatus = "Active" | "Expiring Soon" | "Expired";

type CertificationRecord = {
  id: string;
  employeeName: string;
  certificationName: string;
  certificationCategory: string;
  issueDate: string;
  expirationDate: string;
  issuingOrganization: string;
  status: CertificationStatus;
  notes: string;
  updatedAt: string;
};

type CertificationForm = Omit<CertificationRecord, "id" | "updatedAt">;

const storageKey = "moldingMentor.certificationManagement";
const statuses: CertificationStatus[] = ["Active", "Expiring Soon", "Expired"];

const emptyForm: CertificationForm = {
  employeeName: "",
  certificationName: "",
  certificationCategory: "",
  issueDate: "",
  expirationDate: "",
  issuingOrganization: "",
  status: "Active",
  notes: "",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function daysUntil(dateValue: string) {
  if (!dateValue) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateValue}T00:00:00`);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export default function CertificationManagementPage() {
  const [records, setRecords] = useState<CertificationRecord[]>([]);
  const [form, setForm] = useState<CertificationForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoadedRecords, setHasLoadedRecords] = useState(false);
  const [filters, setFilters] = useState({ employee: "", certification: "", status: "All" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setRecords(JSON.parse(saved) as CertificationRecord[]);
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

  const dashboard = useMemo(() => {
    return records.reduce(
      (summary, record) => {
        if (record.status === "Active") summary.active += 1;
        if (record.status === "Expired") summary.expired += 1;

        const days = daysUntil(record.expirationDate);
        if (days !== null && days >= 0 && days <= 30) summary.expiringSoon += 1;

        return summary;
      },
      { active: 0, expiringSoon: 0, expired: 0 },
    );
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const employeeMatch = normalize(record.employeeName).includes(normalize(filters.employee));
      const certificationMatch = normalize(record.certificationName).includes(normalize(filters.certification));
      const statusMatch = filters.status === "All" || record.status === filters.status;
      return employeeMatch && certificationMatch && statusMatch;
    });
  }, [records, filters]);

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextRecord = {
      ...form,
      employeeName: form.employeeName.trim(),
      certificationName: form.certificationName.trim(),
      certificationCategory: form.certificationCategory.trim(),
      issuingOrganization: form.issuingOrganization.trim(),
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

  function editRecord(record: CertificationRecord) {
    setForm({
      employeeName: record.employeeName,
      certificationName: record.certificationName,
      certificationCategory: record.certificationCategory,
      issueDate: record.issueDate,
      expirationDate: record.expirationDate,
      issuingOrganization: record.issuingOrganization,
      status: record.status,
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
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-slate-950">Certification Management Center</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Create, store, filter, edit, delete, and print employee certification records with expiration visibility for training leaders.
              </p>
            </div>
            <button onClick={() => window.print()} className="rounded-2xl border border-cyan-300/40 px-5 py-3 text-sm font-black text-cyan-100 print:hidden">Print certification report</button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3 print:grid-cols-3">
          <article className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-4xl font-black text-white print:text-slate-950">{dashboard.active}</p><h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-100 print:text-slate-700">Active certifications</h2></article>
          <article className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-4xl font-black text-white print:text-slate-950">{dashboard.expiringSoon}</p><h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-amber-100 print:text-slate-700">Expiring within 30 days</h2></article>
          <article className="rounded-[1.5rem] border border-rose-300/20 bg-rose-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-4xl font-black text-white print:text-slate-950">{dashboard.expired}</p><h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-rose-100 print:text-slate-700">Expired certifications</h2></article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] print:block">
          <form onSubmit={saveRecord} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
            <h2 className="text-2xl font-black text-white">{editingId ? "Edit certification" : "Create certification"}</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-200">Employee name<input required value={form.employeeName} onChange={(event) => setForm({ ...form, employeeName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Certification name<input required value={form.certificationName} onChange={(event) => setForm({ ...form, certificationName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Certification category<input required value={form.certificationCategory} onChange={(event) => setForm({ ...form, certificationCategory: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-slate-200">Issue date<input required type="date" value={form.issueDate} onChange={(event) => setForm({ ...form, issueDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label><label className="grid gap-2 text-sm font-bold text-slate-200">Expiration date<input required type="date" value={form.expirationDate} onChange={(event) => setForm({ ...form, expirationDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label></div>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Issuing organization<input required value={form.issuingOrganization} onChange={(event) => setForm({ ...form, issuingOrganization: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Certification status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as CertificationStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Notes<textarea rows={4} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Create certification"}</button>{editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-200">Cancel</button> : null}</div>
          </form>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black text-white print:text-slate-950">Saved certifications</h2><p className="mt-1 text-sm text-slate-300 print:text-slate-700">{filteredRecords.length} of {records.length} records shown</p></div></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 print:hidden"><input placeholder="Filter employee" value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" /><input placeholder="Filter certification" value={filters.certification} onChange={(event) => setFilters({ ...filters, certification: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" /><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>
            <div className="mt-5 grid gap-4">
              {filteredRecords.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-5 text-slate-300 print:text-slate-700">No certifications match the current filters.</p> : null}
              {filteredRecords.map((record) => {
                const days = daysUntil(record.expirationDate);
                return (
                  <article key={record.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 print:break-inside-avoid print:border-slate-300 print:bg-white">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="text-xl font-black text-white print:text-slate-950">{record.employeeName}</h3><p className="text-sm text-slate-300 print:text-slate-700">{record.certificationName} • {record.certificationCategory}</p></div><span className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 print:border-slate-300 print:bg-white print:text-slate-700">{record.status}</span></div>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="font-bold text-slate-400 print:text-slate-600">Issued by</dt><dd className="text-white print:text-slate-950">{record.issuingOrganization}</dd></div><div><dt className="font-bold text-slate-400 print:text-slate-600">Issue date</dt><dd className="text-white print:text-slate-950">{record.issueDate}</dd></div><div><dt className="font-bold text-slate-400 print:text-slate-600">Expiration</dt><dd className="text-white print:text-slate-950">{record.expirationDate}{days !== null ? ` (${days < 0 ? Math.abs(days) + " days expired" : days + " days left"})` : ""}</dd></div></dl>
                    {record.notes ? <p className="mt-4 rounded-2xl bg-white/5 p-3 text-sm leading-6 text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-800">{record.notes}</p> : null}
                    <div className="mt-4 flex gap-3 print:hidden"><button onClick={() => editRecord(record)} className="rounded-xl border border-emerald-300/40 px-4 py-2 text-sm font-bold text-emerald-100">Edit</button><button onClick={() => deleteRecord(record.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 text-sm font-bold text-rose-100">Delete</button></div>
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
