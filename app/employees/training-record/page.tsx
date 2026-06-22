"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type PassFailStatus = "Pass" | "Fail" | "Pending";
type CertificationStatus = "All" | "Certified" | "Not Certified" | "Expired" | "Expiring Soon";

type TrainingRecord = {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  trainingModule: string;
  trainerName: string;
  trainingDate: string;
  quizScore: string;
  passFailStatus: PassFailStatus;
  certificationEarned: string;
  expirationDate: string;
  supervisorSignOff: string;
  notes: string;
  updatedAt: string;
};

type TrainingRecordForm = Omit<TrainingRecord, "id" | "updatedAt">;

const storageKey = "moldingMentor.employeeTrainingRecords";
const passFailStatuses: PassFailStatus[] = ["Pass", "Fail", "Pending"];
const certificationFilters: CertificationStatus[] = ["All", "Certified", "Not Certified", "Expired", "Expiring Soon"];

const emptyForm: TrainingRecordForm = {
  employeeName: "",
  role: "",
  department: "",
  trainingModule: "",
  trainerName: "",
  trainingDate: "",
  quizScore: "",
  passFailStatus: "Pending",
  certificationEarned: "",
  expirationDate: "",
  supervisorSignOff: "",
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
  if (Number.isNaN(target.getTime())) return null;
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

function getCertificationStatus(record: TrainingRecord) {
  const hasCertification = Boolean(record.certificationEarned.trim());
  const remainingDays = daysUntil(record.expirationDate);

  if (!hasCertification) return "Not Certified";
  if (remainingDays !== null && remainingDays < 0) return "Expired";
  if (remainingDays !== null && remainingDays <= 30) return "Expiring Soon";
  return "Certified";
}

function getExpirationLabel(record: TrainingRecord) {
  const remainingDays = daysUntil(record.expirationDate);
  if (!record.expirationDate) return "No expiration recorded";
  if (remainingDays === null) return record.expirationDate;
  if (remainingDays < 0) return `Expired ${Math.abs(remainingDays)} day${Math.abs(remainingDays) === 1 ? "" : "s"} ago`;
  if (remainingDays === 0) return "Expires today";
  if (remainingDays <= 30) return `Expires in ${remainingDays} day${remainingDays === 1 ? "" : "s"}`;
  return `Expires ${record.expirationDate}`;
}

export default function EmployeeTrainingRecordPage() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [form, setForm] = useState<TrainingRecordForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoadedRecords, setHasLoadedRecords] = useState(false);
  const [filters, setFilters] = useState({ employee: "", role: "", module: "", certificationStatus: "All" as CertificationStatus });

  useEffect(() => {
    const savedRecords = window.localStorage.getItem(storageKey);
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords) as TrainingRecord[]);
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
      const moduleMatch = normalize(record.trainingModule).includes(normalize(filters.module));
      const certificationStatus = getCertificationStatus(record);
      const certificationMatch = filters.certificationStatus === "All" || certificationStatus === filters.certificationStatus;
      return employeeMatch && roleMatch && moduleMatch && certificationMatch;
    });
  }, [records, filters]);

  const certificationSummary = useMemo(() => {
    const expired = records.filter((record) => getCertificationStatus(record) === "Expired").length;
    const expiringSoon = records.filter((record) => getCertificationStatus(record) === "Expiring Soon").length;
    const passed = records.filter((record) => record.passFailStatus === "Pass").length;
    return { expired, expiringSoon, passed };
  }, [records]);

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextRecord = {
      ...form,
      employeeName: form.employeeName.trim(),
      role: form.role.trim(),
      department: form.department.trim(),
      trainingModule: form.trainingModule.trim(),
      trainerName: form.trainerName.trim(),
      quizScore: form.quizScore.trim(),
      certificationEarned: form.certificationEarned.trim(),
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

  function editRecord(record: TrainingRecord) {
    setForm({
      employeeName: record.employeeName,
      role: record.role,
      department: record.department,
      trainingModule: record.trainingModule,
      trainerName: record.trainerName,
      trainingDate: record.trainingDate,
      quizScore: record.quizScore,
      passFailStatus: record.passFailStatus,
      certificationEarned: record.certificationEarned,
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
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Employee Management</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-slate-950">Employee Training Record</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Create, save, edit, filter, and print employee training records with certification expiration visibility stored in this browser.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center sm:min-w-96 print:hidden">
              <div className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-4"><p className="text-3xl font-black text-white">{certificationSummary.passed}</p><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-100">Passed</p></div>
              <div className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-4"><p className="text-3xl font-black text-white">{certificationSummary.expiringSoon}</p><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-100">Expiring</p></div>
              <div className="rounded-3xl border border-rose-300/30 bg-rose-300/10 p-4"><p className="text-3xl font-black text-white">{certificationSummary.expired}</p><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-rose-100">Expired</p></div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr] print:block">
          <form onSubmit={saveRecord} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
            <h2 className="text-2xl font-black text-white">{editingId ? "Edit training record" : "Create training record"}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-200">Employee name<input required value={form.employeeName} onChange={(event) => setForm({ ...form, employeeName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Role<input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Department<input required value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Training module completed<input required value={form.trainingModule} onChange={(event) => setForm({ ...form, trainingModule: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Trainer name<input required value={form.trainerName} onChange={(event) => setForm({ ...form, trainerName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Training date<input required type="date" value={form.trainingDate} onChange={(event) => setForm({ ...form, trainingDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Quiz score<input required inputMode="numeric" placeholder="Example: 92%" value={form.quizScore} onChange={(event) => setForm({ ...form, quizScore: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Pass/Fail status<select value={form.passFailStatus} onChange={(event) => setForm({ ...form, passFailStatus: event.target.value as PassFailStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300">{passFailStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Certification earned<input placeholder="Certification name, if earned" value={form.certificationEarned} onChange={(event) => setForm({ ...form, certificationEarned: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Expiration date<input type="date" value={form.expirationDate} onChange={(event) => setForm({ ...form, expirationDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Supervisor sign-off<input required placeholder="Supervisor name or initials" value={form.supervisorSignOff} onChange={(event) => setForm({ ...form, supervisorSignOff: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Notes<textarea rows={4} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Create training record"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-200">Cancel</button> : null}
            </div>
          </form>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-2xl font-black text-white print:text-slate-950">Saved records</h2><p className="mt-1 text-sm text-slate-300 print:text-slate-700">{filteredRecords.length} of {records.length} records shown</p></div>
              <button onClick={() => window.print()} className="rounded-2xl border border-cyan-300/40 px-5 py-3 text-sm font-black text-cyan-100 print:hidden">Print records</button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4 print:hidden">
              <input placeholder="Filter employee" value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              <input placeholder="Filter role" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              <input placeholder="Filter module" value={filters.module} onChange={(event) => setFilters({ ...filters, module: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              <select value={filters.certificationStatus} onChange={(event) => setFilters({ ...filters, certificationStatus: event.target.value as CertificationStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">{certificationFilters.map((status) => <option key={status}>{status}</option>)}</select>
            </div>

            <div className="mt-5 grid gap-4">
              {filteredRecords.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-5 text-slate-300 print:text-slate-700">No records match the current filters.</p> : null}
              {filteredRecords.map((record) => {
                const certificationStatus = getCertificationStatus(record);
                const statusClass = certificationStatus === "Expired" ? "border-rose-300/40 bg-rose-300/10 text-rose-100" : certificationStatus === "Expiring Soon" ? "border-amber-300/40 bg-amber-300/10 text-amber-100" : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100";
                return (
                  <article key={record.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 print:break-inside-avoid print:border-slate-300 print:bg-white">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-black text-white print:text-slate-950">{record.employeeName}</h3>
                        <p className="text-sm text-slate-300 print:text-slate-700">{record.role} • {record.department} • {record.trainingModule}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="w-fit rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-100 print:border-slate-300 print:bg-white print:text-slate-700">{record.passFailStatus}</span>
                        <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] print:border-slate-300 print:bg-white print:text-slate-700 ${statusClass}`}>{certificationStatus}</span>
                      </div>
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <div><dt className="font-bold text-slate-400 print:text-slate-600">Trainer</dt><dd className="text-white print:text-slate-950">{record.trainerName}</dd></div>
                      <div><dt className="font-bold text-slate-400 print:text-slate-600">Training date</dt><dd className="text-white print:text-slate-950">{record.trainingDate}</dd></div>
                      <div><dt className="font-bold text-slate-400 print:text-slate-600">Quiz score</dt><dd className="text-white print:text-slate-950">{record.quizScore}</dd></div>
                      <div><dt className="font-bold text-slate-400 print:text-slate-600">Certification</dt><dd className="text-white print:text-slate-950">{record.certificationEarned || "Not earned"}</dd></div>
                      <div><dt className="font-bold text-slate-400 print:text-slate-600">Expiration</dt><dd className="text-white print:text-slate-950">{getExpirationLabel(record)}</dd></div>
                      <div><dt className="font-bold text-slate-400 print:text-slate-600">Supervisor sign-off</dt><dd className="text-white print:text-slate-950">{record.supervisorSignOff}</dd></div>
                    </dl>
                    {record.notes ? <p className="mt-4 rounded-2xl bg-white/5 p-3 text-sm leading-6 text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-800">{record.notes}</p> : null}
                    <div className="mt-4 flex gap-3 print:hidden">
                      <button onClick={() => editRecord(record)} className="rounded-xl border border-emerald-300/40 px-4 py-2 text-sm font-bold text-emerald-100">Edit</button>
                      <button onClick={() => deleteRecord(record.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 text-sm font-bold text-rose-100">Delete</button>
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
