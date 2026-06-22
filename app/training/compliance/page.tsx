"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ComplianceRecord = {
  id: string;
  reportDate: string;
  department: string;
  totalEmployees: number;
  completedAssignments: number;
  overdueAssignments: number;
  activeCertifications: number;
  expiringCertifications: number;
  expiredCertifications: number;
  averageQuizScore: number;
  notes: string;
  updatedAt: string;
};

type ComplianceForm = Omit<ComplianceRecord, "id" | "updatedAt">;

const storageKey = "moldingMentor.trainingComplianceRecords";

const emptyForm: ComplianceForm = {
  reportDate: new Date().toISOString().slice(0, 10),
  department: "",
  totalEmployees: 0,
  completedAssignments: 0,
  overdueAssignments: 0,
  activeCertifications: 0,
  expiringCertifications: 0,
  expiredCertifications: 0,
  averageQuizScore: 0,
  notes: "",
};

const numberFields: Array<{ key: keyof ComplianceForm; label: string; helper: string }> = [
  { key: "totalEmployees", label: "Total employees", helper: "Employees covered by this report" },
  { key: "completedAssignments", label: "Training assignments completed", helper: "Assignments finished in scope" },
  { key: "overdueAssignments", label: "Training assignments overdue", helper: "Assignments past due" },
  { key: "activeCertifications", label: "Active certifications", helper: "Current certifications" },
  { key: "expiringCertifications", label: "Expiring certifications", helper: "Due to expire soon" },
  { key: "expiredCertifications", label: "Expired certifications", helper: "Already expired" },
  { key: "averageQuizScore", label: "Average quiz score", helper: "Team average percent" },
];

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function metricCards(record: ComplianceRecord | ComplianceForm) {
  const completionRate = record.totalEmployees > 0 ? (record.completedAssignments / record.totalEmployees) * 100 : 0;
  const overdueRate = record.totalEmployees > 0 ? (record.overdueAssignments / record.totalEmployees) * 100 : 0;
  const activeCertRate = record.totalEmployees > 0 ? (record.activeCertifications / record.totalEmployees) * 100 : 0;
  const expiringCertRate = record.totalEmployees > 0 ? (record.expiringCertifications / record.totalEmployees) * 100 : 0;
  const expiredCertRate = record.totalEmployees > 0 ? (record.expiredCertifications / record.totalEmployees) * 100 : 0;

  return [
    { label: "Total employees", value: record.totalEmployees, progress: 100, tone: "from-cyan-300 to-blue-400" },
    { label: "Training assignments completed", value: record.completedAssignments, progress: completionRate, tone: "from-emerald-300 to-cyan-400" },
    { label: "Training assignments overdue", value: record.overdueAssignments, progress: overdueRate, tone: "from-rose-300 to-orange-400" },
    { label: "Active certifications", value: record.activeCertifications, progress: activeCertRate, tone: "from-lime-300 to-emerald-400" },
    { label: "Expiring certifications", value: record.expiringCertifications, progress: expiringCertRate, tone: "from-amber-300 to-yellow-400" },
    { label: "Expired certifications", value: record.expiredCertifications, progress: expiredCertRate, tone: "from-red-300 to-rose-500" },
    { label: "Average quiz score", value: `${record.averageQuizScore}%`, progress: record.averageQuizScore, tone: "from-violet-300 to-cyan-400" },
  ];
}

export default function TrainingCompliancePage() {
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [form, setForm] = useState<ComplianceForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setRecords(JSON.parse(saved) as ComplianceRecord[]);
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

  const latestRecord = records[0];
  const dashboardRecord = latestRecord ?? form;
  const cards = useMemo(() => metricCards(dashboardRecord), [dashboardRecord]);
  const completionPercent = clampPercent(dashboardRecord.totalEmployees > 0 ? (dashboardRecord.completedAssignments / dashboardRecord.totalEmployees) * 100 : 0);
  const certificationHealth = clampPercent(
    dashboardRecord.totalEmployees > 0 ? (dashboardRecord.activeCertifications / dashboardRecord.totalEmployees) * 100 : 0,
  );

  function updateNumber(key: keyof ComplianceForm, value: string) {
    const parsed = Number(value);
    setForm((current) => ({ ...current, [key]: Number.isNaN(parsed) ? 0 : Math.max(0, parsed) }));
  }

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextRecord = {
      ...form,
      department: form.department.trim(),
      notes: form.notes.trim(),
      averageQuizScore: clampPercent(form.averageQuizScore),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setRecords((current) => current.map((record) => (record.id === editingId ? { ...nextRecord, id: editingId } : record)));
    } else {
      setRecords((current) => [{ ...nextRecord, id: crypto.randomUUID() }, ...current]);
    }

    setForm({ ...emptyForm, reportDate: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
  }

  function editRecord(record: ComplianceRecord) {
    setForm({
      reportDate: record.reportDate,
      department: record.department,
      totalEmployees: record.totalEmployees,
      completedAssignments: record.completedAssignments,
      overdueAssignments: record.overdueAssignments,
      activeCertifications: record.activeCertifications,
      expiringCertifications: record.expiringCertifications,
      expiredCertifications: record.expiredCertifications,
      averageQuizScore: record.averageQuizScore,
      notes: record.notes,
    });
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ ...emptyForm, reportDate: new Date().toISOString().slice(0, 10) });
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Training Tools</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-slate-950">Training Compliance Dashboard</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Manually enter compliance snapshots, save them to this browser, review history, and print a concise training compliance report.
              </p>
            </div>
            <button onClick={() => window.print()} className="rounded-2xl border border-cyan-300/40 px-5 py-3 text-sm font-black text-cyan-100 print:hidden">Print compliance report</button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
          {cards.map((card) => (
            <article key={card.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 print:border-slate-300 print:bg-white print:shadow-none">
              <p className="text-3xl font-black text-white print:text-slate-950">{card.value}</p>
              <h2 className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-slate-300 print:text-slate-600">{card.label}</h2>
              <div className="mt-4 h-2 rounded-full bg-slate-800 print:bg-slate-200">
                <div className={`h-2 rounded-full bg-gradient-to-r ${card.tone}`} style={{ width: `${clampPercent(card.progress)}%` }} />
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] print:block">
          <form onSubmit={saveRecord} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
            <h2 className="text-2xl font-black text-white">{editingId ? "Edit compliance record" : "Manual compliance entry"}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-200">Report date<input required type="date" value={form.reportDate} onChange={(event) => setForm({ ...form, reportDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Department / area<input required value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              {numberFields.map((field) => (
                <label key={field.key} className="grid gap-2 text-sm font-bold text-slate-200">{field.label}<input required min="0" max={field.key === "averageQuizScore" ? "100" : undefined} type="number" value={String(form[field.key])} onChange={(event) => updateNumber(field.key, event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /><span className="text-xs font-normal text-slate-400">{field.helper}</span></label>
              ))}
              <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Compliance notes<textarea rows={4} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Save compliance record"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm({ ...emptyForm, reportDate: new Date().toISOString().slice(0, 10) }); }} className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-200">Cancel</button> : null}
            </div>
          </form>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white print:text-slate-950">Compliance history</h2>
                <p className="mt-1 text-sm text-slate-300 print:text-slate-700">{records.length} saved records in browser local storage.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center print:hidden">
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3"><p className="text-2xl font-black">{completionPercent}%</p><p className="text-xs text-emerald-100">Assignment completion</p></div>
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3"><p className="text-2xl font-black">{certificationHealth}%</p><p className="text-xs text-cyan-100">Certification coverage</p></div>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {records.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-5 text-slate-300 print:text-slate-700">No compliance history yet. Save a manual entry to build the report.</p> : null}
              {records.map((record) => (
                <article key={record.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 print:break-inside-avoid print:border-slate-300 print:bg-white">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white print:text-slate-950">{record.department}</h3>
                      <p className="text-sm text-slate-300 print:text-slate-700">Report date: {record.reportDate} • Updated {new Date(record.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 print:border-slate-300 print:bg-white print:text-slate-700">Quiz avg {record.averageQuizScore}%</span>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div><dt className="font-bold text-slate-400 print:text-slate-600">Employees</dt><dd className="text-white print:text-slate-950">{record.totalEmployees}</dd></div>
                    <div><dt className="font-bold text-slate-400 print:text-slate-600">Completed / overdue</dt><dd className="text-white print:text-slate-950">{record.completedAssignments} / {record.overdueAssignments}</dd></div>
                    <div><dt className="font-bold text-slate-400 print:text-slate-600">Certs active / expiring / expired</dt><dd className="text-white print:text-slate-950">{record.activeCertifications} / {record.expiringCertifications} / {record.expiredCertifications}</dd></div>
                  </dl>
                  {record.notes ? <p className="mt-4 rounded-2xl bg-white/5 p-3 text-sm leading-6 text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-800">{record.notes}</p> : null}
                  <div className="mt-4 flex gap-3 print:hidden">
                    <button onClick={() => editRecord(record)} className="rounded-xl border border-emerald-300/40 px-4 py-2 text-sm font-bold text-emerald-100">Edit</button>
                    <button onClick={() => deleteRecord(record.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 text-sm font-bold text-rose-100">Delete</button>
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
