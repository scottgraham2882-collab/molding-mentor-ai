"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ScheduleStatus = "Scheduled" | "Running" | "Complete" | "Delayed" | "On Hold";

type ScheduleEntry = {
  id: string;
  date: string;
  shift: string;
  machineNumber: string;
  moldNumber: string;
  partNumber: string;
  customer: string;
  material: string;
  plannedQuantity: string;
  actualQuantity: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  notes: string;
  updatedAt: string;
};

type EntryForm = Omit<ScheduleEntry, "id" | "updatedAt">;

type Field = {
  key: keyof EntryForm;
  label: string;
  type?: "text" | "date" | "time" | "number" | "textarea" | "select";
  placeholder?: string;
  options?: readonly string[];
};

type Filters = {
  date: string;
  shift: string;
  machineNumber: string;
  customer: string;
  status: string;
};

const storageKey = "molding-mentor-production-schedule";
const statusOptions = ["Scheduled", "Running", "Complete", "Delayed", "On Hold"] as const;

const emptyEntry: EntryForm = {
  date: new Date().toISOString().slice(0, 10),
  shift: "",
  machineNumber: "",
  moldNumber: "",
  partNumber: "",
  customer: "",
  material: "",
  plannedQuantity: "",
  actualQuantity: "",
  startTime: "",
  endTime: "",
  status: "Scheduled",
  notes: "",
};

const emptyFilters: Filters = {
  date: "",
  shift: "",
  machineNumber: "",
  customer: "",
  status: "",
};

const fields: Field[] = [
  { key: "date", label: "Date", type: "date" },
  { key: "shift", label: "Shift", placeholder: "A, B, C, day, night..." },
  { key: "machineNumber", label: "Machine number", placeholder: "Press 12" },
  { key: "moldNumber", label: "Mold number", placeholder: "M-1042" },
  { key: "partNumber", label: "Part number", placeholder: "PN-77821" },
  { key: "customer", label: "Customer", placeholder: "Customer name" },
  { key: "material", label: "Material", placeholder: "PP black, lot #..." },
  { key: "plannedQuantity", label: "Planned quantity", type: "number", placeholder: "10000" },
  { key: "actualQuantity", label: "Actual quantity", type: "number", placeholder: "8750" },
  { key: "startTime", label: "Start time", type: "time" },
  { key: "endTime", label: "End time", type: "time" },
  { key: "status", label: "Status", type: "select", options: statusOptions },
  { key: "notes", label: "Notes", type: "textarea", placeholder: "Setup risks, staffing notes, material constraints, changeover details..." },
];

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatQuantity(value: string) {
  const quantity = toNumber(value);
  return quantity ? quantity.toLocaleString() : "—";
}

function statusClass(status: ScheduleStatus) {
  switch (status) {
    case "Running":
      return "border-emerald-300/40 bg-emerald-300/15 text-emerald-100";
    case "Complete":
      return "border-cyan-300/40 bg-cyan-300/15 text-cyan-100";
    case "Delayed":
      return "border-amber-300/40 bg-amber-300/15 text-amber-100";
    case "On Hold":
      return "border-rose-300/40 bg-rose-300/15 text-rose-100";
    default:
      return "border-slate-300/30 bg-slate-300/10 text-slate-100";
  }
}

export default function ProductionSchedulePage() {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [form, setForm] = useState<EntryForm>(emptyEntry);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedEntries = window.localStorage.getItem(storageKey);
    if (storedEntries) setEntries(JSON.parse(storedEntries) as ScheduleEntry[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries, isLoaded]);

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => !filters.date || entry.date === filters.date)
      .filter((entry) => !filters.shift || entry.shift.toLowerCase().includes(filters.shift.toLowerCase()))
      .filter((entry) => !filters.machineNumber || entry.machineNumber.toLowerCase().includes(filters.machineNumber.toLowerCase()))
      .filter((entry) => !filters.customer || entry.customer.toLowerCase().includes(filters.customer.toLowerCase()))
      .filter((entry) => !filters.status || entry.status === filters.status)
      .sort((a, b) => `${a.date}-${a.startTime}`.localeCompare(`${b.date}-${b.startTime}`));
  }, [entries, filters]);

  const totals = useMemo(
    () => filteredEntries.reduce(
      (summary, entry) => ({
        planned: summary.planned + toNumber(entry.plannedQuantity),
        actual: summary.actual + toNumber(entry.actualQuantity),
      }),
      { planned: 0, actual: 0 },
    ),
    [filteredEntries],
  );

  function resetForm() {
    setForm({ ...emptyEntry, date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();

    if (editingId) {
      setEntries((current) => current.map((entry) => (entry.id === editingId ? { ...form, id: editingId, updatedAt } : entry)));
      resetForm();
      return;
    }

    setEntries((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editEntry(entry: ScheduleEntry) {
    const { id, updatedAt, ...editableEntry } = entry;
    void id;
    void updatedAt;
    setForm(editableEntry);
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteEntry(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6 print:max-w-none print:space-y-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-0 print:bg-white print:p-0 print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Production tools</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Production Schedule Board</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Build a daily production plan, track planned versus actual quantity, and print the filtered schedule for shift communication.
              </p>
            </div>
            <button type="button" onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 print:hidden">
              Print schedule
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6 print:hidden">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-white">{editingId ? "Edit schedule entry" : "Create schedule entry"}</h2>
            {editingId ? <button type="button" onClick={resetForm} className="text-sm font-bold text-cyan-200">Cancel edit</button> : null}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2 lg:col-span-3" : undefined}>
                <span className="text-sm font-bold text-slate-200">{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
                ) : field.type === "select" ? (
                  <select value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value as ScheduleStatus }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300">
                    {field.options?.map((option) => <option key={option}>{option}</option>)}
                  </select>
                ) : (
                  <input type={field.type ?? "text"} min={field.type === "number" ? "0" : undefined} value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} required={["date", "shift", "machineNumber", "partNumber", "plannedQuantity"].includes(field.key)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
                )}
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-200 sm:w-auto">
            {editingId ? "Save changes" : "Save schedule entry"}
          </button>
        </form>

        <section className="grid gap-4 sm:grid-cols-3 print:grid-cols-3">
          <article className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-sm font-bold text-cyan-100 print:text-slate-600">Entries shown</p><p className="mt-2 text-3xl font-black text-white print:text-slate-950">{filteredEntries.length}</p></article>
          <article className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-sm font-bold text-emerald-100 print:text-slate-600">Planned quantity</p><p className="mt-2 text-3xl font-black text-white print:text-slate-950">{totals.planned.toLocaleString()}</p></article>
          <article className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-sm font-bold text-amber-100 print:text-slate-600">Actual quantity</p><p className="mt-2 text-3xl font-black text-white print:text-slate-950">{totals.actual.toLocaleString()}</p></article>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 print:hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black text-white">Filter saved schedule</h2>
            <button type="button" onClick={() => setFilters(emptyFilters)} className="text-left text-sm font-bold text-cyan-200 sm:text-right">Clear filters</button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input type="date" value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" aria-label="Filter by date" />
            <input value={filters.shift} onChange={(event) => setFilters((current) => ({ ...current, shift: event.target.value }))} placeholder="Shift" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" />
            <input value={filters.machineNumber} onChange={(event) => setFilters((current) => ({ ...current, machineNumber: event.target.value }))} placeholder="Machine" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" />
            <input value={filters.customer} onChange={(event) => setFilters((current) => ({ ...current, customer: event.target.value }))} placeholder="Customer" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" />
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" aria-label="Filter by status">
              <option value="">All statuses</option>
              {statusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
        </section>

        <section className="space-y-4" aria-label="Saved production schedule">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-black text-white print:text-slate-950">Saved schedule</h2><p className="text-sm font-bold text-slate-400 print:text-slate-600">{entries.length} total saved</p></div>
          {filteredEntries.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-slate-300 print:border-slate-300 print:bg-white print:text-slate-700">No schedule entries match the current filters.</div>
          ) : (
            filteredEntries.map((entry) => {
              const planned = toNumber(entry.plannedQuantity);
              const actual = toNumber(entry.actualQuantity);
              const completion = planned ? Math.min(100, Math.round((actual / planned) * 100)) : 0;

              return (
                <article key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30 print:break-inside-avoid print:border-slate-300 print:bg-white print:shadow-none">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-black text-white print:text-slate-950">{formatDate(entry.date)} · Shift {entry.shift || "—"}</h3><span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] print:border-slate-300 print:bg-white print:text-slate-700 ${statusClass(entry.status)}`}>{entry.status}</span></div>
                      <p className="mt-2 text-sm text-cyan-200 print:text-slate-700">Machine {entry.machineNumber || "—"} · Mold {entry.moldNumber || "—"} · Part {entry.partNumber || "—"} · {entry.customer || "Customer not listed"}</p>
                    </div>
                    <div className="flex gap-2 print:hidden"><button type="button" onClick={() => editEntry(entry)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">Edit</button><button type="button" onClick={() => deleteEntry(entry.id)} className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-bold text-red-100">Delete</button></div>
                  </div>
                  <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Time</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">{entry.startTime || "—"} to {entry.endTime || "—"}</dd></div>
                    <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Material</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">{entry.material || "—"}</dd></div>
                    <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Planned vs actual</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">{formatQuantity(entry.plannedQuantity)} planned / {formatQuantity(entry.actualQuantity)} actual</dd></div>
                    <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Completion</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">{completion}%</dd></div>
                  </dl>
                  {entry.notes ? <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-white/[0.05] p-4 text-sm leading-6 text-slate-200 print:border print:border-slate-200 print:bg-white print:text-slate-900">{entry.notes}</p> : null}
                </article>
              );
            })
          )}
        </section>
      </section>
    </main>
  );
}
