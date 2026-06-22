"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type MaintenanceEntry = {
  id: string;
  date: string;
  machineNumber: string;
  moldNumber: string;
  maintenanceType: string;
  technicianName: string;
  tasksCompleted: string;
  issuesFound: string;
  partsReplaced: string;
  nextDueDate: string;
  notes: string;
  updatedAt: string;
};

type MaintenanceForm = Omit<MaintenanceEntry, "id" | "updatedAt">;

type Field = {
  key: keyof MaintenanceForm;
  label: string;
  type?: "text" | "date" | "textarea";
  placeholder?: string;
  required?: boolean;
};

const storageKey = "molding-mentor-maintenance-entries";

const createEmptyEntry = (): MaintenanceForm => ({
  date: new Date().toISOString().slice(0, 10),
  machineNumber: "",
  moldNumber: "",
  maintenanceType: "",
  technicianName: "",
  tasksCompleted: "",
  issuesFound: "",
  partsReplaced: "",
  nextDueDate: "",
  notes: "",
});

const fields: Field[] = [
  { key: "date", label: "Date", type: "date", required: true },
  { key: "machineNumber", label: "Machine number", placeholder: "Press 12", required: true },
  { key: "moldNumber", label: "Mold number", placeholder: "M-1042", required: true },
  { key: "maintenanceType", label: "Maintenance type", placeholder: "Daily, weekly, preventive, repair...", required: true },
  { key: "technicianName", label: "Technician name", placeholder: "Alex Rivera", required: true },
  { key: "nextDueDate", label: "Next due date", type: "date", required: true },
  { key: "tasksCompleted", label: "Tasks completed", type: "textarea", placeholder: "Lubricated tie bars, checked guards, cleaned filters...", required: true },
  { key: "issuesFound", label: "Issues found", type: "textarea", placeholder: "Leaks, worn hoses, loose heater bands, alarm history..." },
  { key: "partsReplaced", label: "Parts replaced", type: "textarea", placeholder: "Nozzle tip, hydraulic filter, thermocouple..." },
  { key: "notes", label: "Notes", type: "textarea", placeholder: "Follow-up work, lockout details, supervisor notes..." },
];

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function daysUntil(date: string) {
  if (!date) return Number.POSITIVE_INFINITY;
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dueDate = new Date(`${date}T00:00:00`).getTime();
  return Math.ceil((dueDate - startOfToday) / 86_400_000);
}

function dueStatus(date: string) {
  const days = daysUntil(date);
  if (!Number.isFinite(days)) return "No due date";
  if (days < 0) return `${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"} overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

export default function MaintenancePage() {
  const [entries, setEntries] = useState<MaintenanceEntry[]>([]);
  const [form, setForm] = useState(createEmptyEntry);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedEntries = window.localStorage.getItem(storageKey);
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries) as MaintenanceEntry[]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => `${b.date}-${b.updatedAt}`.localeCompare(`${a.date}-${a.updatedAt}`)),
    [entries],
  );

  const upcomingEntries = useMemo(
    () =>
      [...entries]
        .filter((entry) => entry.nextDueDate)
        .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate))
        .slice(0, 5),
    [entries],
  );

  function resetForm() {
    setForm(createEmptyEntry());
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

  function editEntry(entry: MaintenanceEntry) {
    setForm({
      date: entry.date,
      machineNumber: entry.machineNumber,
      moldNumber: entry.moldNumber,
      maintenanceType: entry.maintenanceType,
      technicianName: entry.technicianName,
      tasksCompleted: entry.tasksCompleted,
      issuesFound: entry.issuesFound,
      partsReplaced: entry.partsReplaced,
      nextDueDate: entry.nextDueDate,
      notes: entry.notes,
    });
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteEntry(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="relative overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-slate-900 p-5 shadow-2xl shadow-emerald-950/30 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.16),transparent_32%)]" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Preventive maintenance</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Maintenance Tracker</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              Capture mold and machine PM work, review upcoming due dates, and keep entries saved in this browser until a shared database is added.
            </p>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_1.4fr]" aria-label="Maintenance overview">
          <article className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5 shadow-xl shadow-cyan-950/20">
            <p className="text-4xl font-black text-white">{entries.length}</p>
            <h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Saved maintenance entries</h2>
            <p className="mt-2 text-sm text-slate-300">Local browser records for machines, molds, tasks, findings, and follow-up dates.</p>
          </article>

          <article className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-emerald-950/20">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100">Upcoming maintenance due</h2>
            {upcomingEntries.length === 0 ? (
              <p className="mt-3 text-sm text-slate-300">No upcoming due dates yet. Add a maintenance entry with a next due date.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {upcomingEntries.map((entry) => (
                  <li key={entry.id} className="rounded-2xl bg-slate-950/50 px-4 py-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-bold text-white">Machine {entry.machineNumber || "—"} · Mold {entry.moldNumber || "—"}</span>
                      <span className="text-sm font-black text-emerald-100">{dueStatus(entry.nextDueDate)}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{formatDate(entry.nextDueDate)} · {entry.maintenanceType || "Maintenance"}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-white">{editingId ? "Edit maintenance entry" : "Add maintenance entry"}</h2>
            {editingId ? <button type="button" onClick={resetForm} className="text-sm font-bold text-cyan-200">Cancel edit</button> : null}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
                <span className="text-sm font-bold text-slate-200">{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    value={form[field.key]}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
                  />
                ) : (
                  <input
                    type={field.type ?? "text"}
                    value={form[field.key]}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
                  />
                )}
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-200 sm:w-auto">
            {editingId ? "Save changes" : "Save maintenance entry"}
          </button>
        </form>

        <section className="space-y-4" aria-label="Saved maintenance entries">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Saved entries</h2>
            <p className="text-sm font-bold text-slate-400">{entries.length} total</p>
          </div>

          {sortedEntries.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-emerald-300/30 bg-emerald-300/10 p-6 text-slate-300">
              No maintenance entries saved yet. Add the first PM record above.
            </div>
          ) : (
            sortedEntries.map((entry) => (
              <article key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white">{formatDate(entry.date)} · {entry.maintenanceType || "Maintenance"}</h3>
                    <p className="mt-1 text-sm text-cyan-200">Machine {entry.machineNumber || "—"} · Mold {entry.moldNumber || "—"} · {entry.technicianName || "No technician"}</p>
                    <p className="mt-1 text-sm font-bold text-emerald-200">Next due: {formatDate(entry.nextDueDate)} ({dueStatus(entry.nextDueDate)})</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editEntry(entry)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">Edit</button>
                    <button type="button" onClick={() => deleteEntry(entry.id)} className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-bold text-red-100">Delete</button>
                  </div>
                </div>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Tasks completed", entry.tasksCompleted],
                    ["Issues found", entry.issuesFound],
                    ["Parts replaced", entry.partsReplaced],
                    ["Notes", entry.notes],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white/[0.05] p-4">
                      <dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</dt>
                      <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
