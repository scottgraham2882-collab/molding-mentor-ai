"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type PmStatus = "Current" | "Due Soon" | "Overdue" | "Completed";

type PmSchedule = {
  id: string;
  moldNumber: string;
  customer: string;
  partNumber: string;
  numberOfCycles: string;
  pmIntervalCycles: string;
  lastPmDate: string;
  nextPmDueDate: string;
  maintenanceType: string;
  technicianAssigned: string;
  knownMoldIssues: string;
  pmStatus: PmStatus;
  notes: string;
  updatedAt: string;
};

type PmForm = Omit<PmSchedule, "id" | "updatedAt">;

type Field = {
  key: keyof PmForm;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
};

type Filters = {
  moldNumber: string;
  status: "All" | PmStatus;
  customer: string;
  dueDate: string;
};

const storageKey = "molding-mentor-mold-pm-schedules";
const pmStatuses: PmStatus[] = ["Current", "Due Soon", "Overdue", "Completed"];

const createEmptySchedule = (): PmForm => ({
  moldNumber: "",
  customer: "",
  partNumber: "",
  numberOfCycles: "",
  pmIntervalCycles: "",
  lastPmDate: "",
  nextPmDueDate: "",
  maintenanceType: "",
  technicianAssigned: "",
  knownMoldIssues: "",
  pmStatus: "Current",
  notes: "",
});

const fields: Field[] = [
  { key: "moldNumber", label: "Mold number", placeholder: "M-1042", required: true },
  { key: "customer", label: "Customer", placeholder: "Acme Medical", required: true },
  { key: "partNumber", label: "Part number", placeholder: "PN-7788", required: true },
  { key: "numberOfCycles", label: "Number of cycles", type: "number", placeholder: "185000", required: true },
  { key: "pmIntervalCycles", label: "PM interval cycles", type: "number", placeholder: "250000", required: true },
  { key: "lastPmDate", label: "Last PM date", type: "date" },
  { key: "nextPmDueDate", label: "Next PM due date", type: "date", required: true },
  { key: "maintenanceType", label: "Maintenance type", placeholder: "Clean, inspect, polish shutoffs..." },
  { key: "technicianAssigned", label: "Technician assigned", placeholder: "J. Smith" },
  { key: "pmStatus", label: "PM status", type: "select", required: true },
  { key: "knownMoldIssues", label: "Known mold issues", type: "textarea", placeholder: "Flash at parting line, sticky lifter, water leak history..." },
  { key: "notes", label: "Notes", type: "textarea", placeholder: "Parts ordered, downtime window, special checks, supervisor notes..." },
];

function formatDate(value: string) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function statusClasses(status: PmStatus) {
  if (status === "Current") return "border-emerald-300/30 bg-emerald-300/10 text-emerald-100";
  if (status === "Due Soon") return "border-amber-300/30 bg-amber-300/10 text-amber-100";
  if (status === "Overdue") return "border-red-300/30 bg-red-300/10 text-red-100";
  return "border-cyan-300/30 bg-cyan-300/10 text-cyan-100";
}

export default function MoldPmSchedulerPage() {
  const [schedules, setSchedules] = useState<PmSchedule[]>([]);
  const [form, setForm] = useState(createEmptySchedule);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ moldNumber: "", status: "All", customer: "", dueDate: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedSchedules = window.localStorage.getItem(storageKey);
    if (storedSchedules) setSchedules(JSON.parse(storedSchedules) as PmSchedule[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(schedules));
  }, [isLoaded, schedules]);

  const counts = useMemo(() => ({
    Current: schedules.filter((schedule) => schedule.pmStatus === "Current").length,
    "Due Soon": schedules.filter((schedule) => schedule.pmStatus === "Due Soon").length,
    Overdue: schedules.filter((schedule) => schedule.pmStatus === "Overdue").length,
  }), [schedules]);

  const filteredSchedules = useMemo(() => {
    const moldQuery = filters.moldNumber.trim().toLowerCase();
    const customerQuery = filters.customer.trim().toLowerCase();

    return [...schedules]
      .sort((a, b) => a.nextPmDueDate.localeCompare(b.nextPmDueDate) || b.updatedAt.localeCompare(a.updatedAt))
      .filter((schedule) => {
        const matchesMold = !moldQuery || schedule.moldNumber.toLowerCase().includes(moldQuery);
        const matchesCustomer = !customerQuery || schedule.customer.toLowerCase().includes(customerQuery);
        const matchesStatus = filters.status === "All" || schedule.pmStatus === filters.status;
        const matchesDueDate = !filters.dueDate || schedule.nextPmDueDate === filters.dueDate;
        return matchesMold && matchesCustomer && matchesStatus && matchesDueDate;
      });
  }, [filters, schedules]);

  function resetForm() {
    setForm(createEmptySchedule());
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();

    if (editingId) {
      setSchedules((current) => current.map((schedule) => (schedule.id === editingId ? { ...form, id: editingId, updatedAt } : schedule)));
      resetForm();
      return;
    }

    setSchedules((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editSchedule(schedule: PmSchedule) {
    setForm({
      moldNumber: schedule.moldNumber,
      customer: schedule.customer,
      partNumber: schedule.partNumber,
      numberOfCycles: schedule.numberOfCycles,
      pmIntervalCycles: schedule.pmIntervalCycles,
      lastPmDate: schedule.lastPmDate,
      nextPmDueDate: schedule.nextPmDueDate,
      maintenanceType: schedule.maintenanceType,
      technicianAssigned: schedule.technicianAssigned,
      knownMoldIssues: schedule.knownMoldIssues,
      pmStatus: schedule.pmStatus,
      notes: schedule.notes,
    });
    setEditingId(schedule.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteSchedule(id: string) {
    setSchedules((current) => current.filter((schedule) => schedule.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6 print:max-w-none print:space-y-4">
        <header className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:rounded-none print:border-b print:border-slate-300 print:bg-white print:p-0 print:pb-4 print:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_32%)] print:hidden" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Mold tools</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Mold Preventive Maintenance Scheduler</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">Create, save, filter, edit, delete, and print mold PM schedules with cycle intervals, due dates, ownership, known issues, and status counts.</p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-4 print:hidden" aria-label="PM schedule counts">
          {(["Current", "Due Soon", "Overdue"] as const).map((status) => <article key={status} className={`rounded-[1.5rem] border p-5 ${statusClasses(status)}`}><p className="text-4xl font-black text-white">{counts[status]}</p><h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em]">{status}</h2></article>)}
          <button type="button" onClick={() => window.print()} className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 text-left font-black text-cyan-100 transition hover:border-cyan-300/40">Print PM schedule report →</button>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6 print:hidden">
          <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black text-white">{editingId ? "Edit PM schedule" : "Create PM schedule"}</h2>{editingId ? <button type="button" onClick={resetForm} className="text-sm font-bold text-cyan-200">Cancel edit</button> : null}</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map((field) => <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : undefined}><span className="text-sm font-bold text-slate-200">{field.label}</span>{field.type === "textarea" ? <textarea value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" /> : field.type === "select" ? <select value={form.pmStatus} onChange={(event) => setForm((current) => ({ ...current, pmStatus: event.target.value as PmStatus }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300">{pmStatuses.map((status) => <option key={status}>{status}</option>)}</select> : <input type={field.type ?? "text"} value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} required={field.required} min={field.type === "number" ? 0 : undefined} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />}</label>)}
          </div>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-200 sm:w-auto">{editingId ? "Save changes" : "Save PM schedule"}</button>
        </form>

        <section className="space-y-4" aria-label="Saved PM schedules">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between print:block"><div><h2 className="text-2xl font-black text-white print:text-slate-950">PM schedule report</h2><p className="text-sm text-slate-400 print:text-slate-600">Filter by mold number, status, customer, or exact due date.</p></div></div>
          <div className="grid gap-3 sm:grid-cols-4 print:hidden"><input value={filters.moldNumber} onChange={(event) => setFilters({ ...filters, moldNumber: event.target.value })} placeholder="Filter mold number" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" /><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value as Filters["status"] })} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300"><option>All</option>{pmStatuses.map((status) => <option key={status}>{status}</option>)}</select><input value={filters.customer} onChange={(event) => setFilters({ ...filters, customer: event.target.value })} placeholder="Filter customer" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" /><input type="date" value={filters.dueDate} onChange={(event) => setFilters({ ...filters, dueDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" /></div>

          {filteredSchedules.length === 0 ? <div className="rounded-[1.5rem] border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-slate-300 print:border-slate-300 print:bg-white print:text-slate-700">No PM schedules found. Create the first schedule above.</div> : filteredSchedules.map((schedule) => <article key={schedule.id} className="break-inside-avoid rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30 print:rounded-none print:border-slate-300 print:bg-white print:shadow-none"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200 print:text-slate-600">Due {formatDate(schedule.nextPmDueDate)}</p><h3 className="mt-2 text-xl font-black text-white print:text-slate-950">Mold {schedule.moldNumber}</h3><p className="mt-1 text-sm text-slate-300 print:text-slate-700">{schedule.customer || "No customer"} · Part {schedule.partNumber || "—"} · Tech {schedule.technicianAssigned || "Unassigned"}</p></div><div className="flex flex-wrap gap-2"><span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${statusClasses(schedule.pmStatus)} print:border-slate-400 print:bg-white print:text-slate-950`}>{schedule.pmStatus}</span><button type="button" onClick={() => editSchedule(schedule)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 print:hidden">Edit</button><button type="button" onClick={() => deleteSchedule(schedule.id)} className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-bold text-red-100 print:hidden">Delete</button></div></div><dl className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white/[0.05] p-4 print:bg-slate-50"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Cycle plan</dt><dd className="mt-2 text-sm leading-6 text-slate-100 print:text-slate-900">{schedule.numberOfCycles || "0"} cycles / {schedule.pmIntervalCycles || "—"} interval<br />Last PM: {formatDate(schedule.lastPmDate)}</dd></div>{[["Maintenance type", schedule.maintenanceType], ["Known mold issues", schedule.knownMoldIssues], ["Notes", schedule.notes]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white/[0.05] p-4 print:bg-slate-50"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">{label}</dt><dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100 print:text-slate-900">{value || "—"}</dd></div>)}</dl></article>)}
        </section>
      </section>
    </main>
  );
}
