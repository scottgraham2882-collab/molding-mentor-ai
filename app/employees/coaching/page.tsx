"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type CoachingType = "Positive Feedback" | "Training Need" | "Quality Issue" | "Safety Concern" | "Attendance" | "Performance" | "Other";
type CoachingStatus = "Open" | "Follow-Up Needed" | "Resolved";

type CoachingRecord = {
  id: string;
  date: string;
  employeeName: string;
  role: string;
  supervisorName: string;
  coachingType: CoachingType;
  situationObserved: string;
  discussionNotes: string;
  expectations: string;
  followUpDate: string;
  status: CoachingStatus;
  employeeComments: string;
  updatedAt: string;
};

type CoachingForm = Omit<CoachingRecord, "id" | "updatedAt">;

type Filters = {
  employee: string;
  coachingType: "All" | CoachingType;
  status: "All" | CoachingStatus;
  date: string;
};

const storageKey = "molding-mentor-employee-coaching-records";
const coachingTypes: CoachingType[] = ["Positive Feedback", "Training Need", "Quality Issue", "Safety Concern", "Attendance", "Performance", "Other"];
const statuses: CoachingStatus[] = ["Open", "Follow-Up Needed", "Resolved"];

const createEmptyRecord = (): CoachingForm => ({
  date: new Date().toISOString().slice(0, 10),
  employeeName: "",
  role: "",
  supervisorName: "",
  coachingType: "Positive Feedback",
  situationObserved: "",
  discussionNotes: "",
  expectations: "",
  followUpDate: "",
  status: "Open",
  employeeComments: "",
});

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function TextInput({ label, value, onChange, required = false, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-200">
      {label}
      <input required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10" />
    </label>
  );
}

function NotesField({ label, value, onChange, required = false, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">
      {label}
      <textarea required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10" />
    </label>
  );
}

export default function EmployeeCoachingPage() {
  const [records, setRecords] = useState<CoachingRecord[]>([]);
  const [form, setForm] = useState<CoachingForm>(createEmptyRecord);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ employee: "", coachingType: "All", status: "All", date: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedRecords = window.localStorage.getItem(storageKey);
    if (savedRecords) setRecords(JSON.parse(savedRecords) as CoachingRecord[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(records));
  }, [records, isLoaded]);

  const filteredRecords = useMemo(() => records
    .filter((record) => !filters.employee || record.employeeName.toLowerCase().includes(filters.employee.toLowerCase()))
    .filter((record) => filters.coachingType === "All" || record.coachingType === filters.coachingType)
    .filter((record) => filters.status === "All" || record.status === filters.status)
    .filter((record) => !filters.date || record.date === filters.date)
    .sort((a, b) => `${b.date}-${b.updatedAt}`.localeCompare(`${a.date}-${a.updatedAt}`)),
  [records, filters]);

  const summary = useMemo(() => ({
    total: records.length,
    open: records.filter((record) => record.status === "Open").length,
    followUp: records.filter((record) => record.status === "Follow-Up Needed").length,
    resolved: records.filter((record) => record.status === "Resolved").length,
  }), [records]);

  function resetForm() {
    setForm(createEmptyRecord());
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();
    if (editingId) {
      setRecords((current) => current.map((record) => record.id === editingId ? { ...form, id: editingId, updatedAt } : record));
      resetForm();
      return;
    }
    setRecords((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editRecord(record: CoachingRecord) {
    setForm({
      date: record.date,
      employeeName: record.employeeName,
      role: record.role,
      supervisorName: record.supervisorName,
      coachingType: record.coachingType,
      situationObserved: record.situationObserved,
      discussionNotes: record.discussionNotes,
      expectations: record.expectations,
      followUpDate: record.followUpDate,
      status: record.status,
      employeeComments: record.employeeComments,
    });
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link href="/" className="w-fit text-sm font-bold text-cyan-200 hover:text-cyan-100 print:hidden">← Dashboard</Link>

        <header className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 print:border-0 print:bg-white print:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_30%)] print:hidden" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300 print:text-slate-600">Management Tools</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-slate-950">Employee Performance Coaching Log</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 print:text-slate-700">Document coaching conversations, expectations, follow-up needs, and employee comments with browser-saved records.</p>
            </div>
            <button onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 print:hidden">Print summary</button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-4 print:grid-cols-4">
          {[{ label: "Total", value: summary.total }, { label: "Open", value: summary.open }, { label: "Follow-up", value: summary.followUp }, { label: "Resolved", value: summary.resolved }].map((stat) => (
            <article key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 print:border-slate-300 print:bg-white">
              <p className="text-4xl font-black text-white print:text-slate-950">{stat.value}</p>
              <h2 className="mt-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100 print:text-slate-700">{stat.label}</h2>
            </article>
          ))}
        </section>

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 print:hidden sm:grid-cols-2">
          <h2 className="text-2xl font-black text-white sm:col-span-2">{editingId ? "Edit coaching record" : "Create coaching record"}</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Date<input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" /></label>
          <TextInput required label="Employee name" value={form.employeeName} onChange={(employeeName) => setForm({ ...form, employeeName })} placeholder="Employee name" />
          <TextInput required label="Role" value={form.role} onChange={(role) => setForm({ ...form, role })} placeholder="Operator, technician, setup..." />
          <TextInput required label="Supervisor name" value={form.supervisorName} onChange={(supervisorName) => setForm({ ...form, supervisorName })} placeholder="Supervisor name" />
          <label className="grid gap-2 text-sm font-bold text-slate-200">Coaching type<select value={form.coachingType} onChange={(e) => setForm({ ...form, coachingType: e.target.value as CoachingType })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">{coachingTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CoachingStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <NotesField required label="Situation observed" value={form.situationObserved} onChange={(situationObserved) => setForm({ ...form, situationObserved })} placeholder="What was observed? Include specific examples." />
          <NotesField required label="Coaching discussion notes" value={form.discussionNotes} onChange={(discussionNotes) => setForm({ ...form, discussionNotes })} placeholder="Summarize the discussion, questions, support offered, and agreement." />
          <NotesField required label="Expectations going forward" value={form.expectations} onChange={(expectations) => setForm({ ...form, expectations })} placeholder="What should happen next? Define measurable expectations." />
          <label className="grid gap-2 text-sm font-bold text-slate-200">Follow-up date<input type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" /></label>
          <div className="hidden sm:block" />
          <NotesField label="Employee comments" value={form.employeeComments} onChange={(employeeComments) => setForm({ ...form, employeeComments })} placeholder="Optional employee response or comments." />
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row"><button className="rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Create coaching record"}</button>{editingId ? <button type="button" onClick={resetForm} className="rounded-2xl border border-white/15 px-5 py-3 font-black text-white">Cancel edit</button> : null}</div>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 print:border-0 print:bg-white print:p-0">
          <div className="mb-5 grid gap-3 print:hidden sm:grid-cols-4">
            <input value={filters.employee} onChange={(e) => setFilters({ ...filters, employee: e.target.value })} placeholder="Filter by employee" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600" />
            <select value={filters.coachingType} onChange={(e) => setFilters({ ...filters, coachingType: e.target.value as Filters["coachingType"] })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option>All</option>{coachingTypes.map((type) => <option key={type}>{type}</option>)}</select>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as Filters["status"] })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
            <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
          </div>

          <div className="grid gap-4">
            {filteredRecords.length === 0 ? <p className="rounded-3xl border border-dashed border-white/15 p-6 text-slate-300 print:text-slate-700">No coaching records match the current filters.</p> : null}
            {filteredRecords.map((record) => (
              <article key={record.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 print:break-inside-avoid print:border-slate-300 print:bg-white">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200 print:text-slate-600">{record.coachingType} · {formatDate(record.date)}</p><h3 className="mt-2 text-2xl font-black text-white print:text-slate-950">{record.employeeName}</h3><p className="mt-1 text-sm text-slate-400 print:text-slate-700">{record.role} · Supervisor: {record.supervisorName}</p></div>
                  <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-200 print:border-slate-300 print:text-slate-700">{record.status}</span>
                </div>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="font-black text-cyan-100 print:text-slate-800">Situation observed</dt><dd className="mt-2 leading-6 text-slate-300 print:text-slate-700">{record.situationObserved}</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="font-black text-cyan-100 print:text-slate-800">Coaching discussion notes</dt><dd className="mt-2 leading-6 text-slate-300 print:text-slate-700">{record.discussionNotes}</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="font-black text-cyan-100 print:text-slate-800">Expectations going forward</dt><dd className="mt-2 leading-6 text-slate-300 print:text-slate-700">{record.expectations}</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="font-black text-cyan-100 print:text-slate-800">Follow-up date</dt><dd className="mt-2 text-slate-300 print:text-slate-700">{formatDate(record.followUpDate)}</dd>{record.employeeComments ? <><dt className="mt-4 font-black text-cyan-100 print:text-slate-800">Employee comments</dt><dd className="mt-2 leading-6 text-slate-300 print:text-slate-700">{record.employeeComments}</dd></> : null}</div>
                </dl>
                <div className="mt-5 flex gap-3 print:hidden"><button onClick={() => editRecord(record)} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">Edit</button><button onClick={() => deleteRecord(record.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 text-sm font-black text-rose-100">Delete</button></div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
