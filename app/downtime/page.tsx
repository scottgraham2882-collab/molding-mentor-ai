"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type DowntimeEntry = {
  id: string;
  date: string;
  shift: string;
  machineNumber: string;
  moldNumber: string;
  downtimeReason: string;
  downtimeMinutes: string;
  notes: string;
  correctiveAction: string;
  updatedAt: string;
};

type Field = {
  key: keyof Omit<DowntimeEntry, "id" | "updatedAt">;
  label: string;
  type?: "text" | "date" | "number" | "textarea";
  placeholder?: string;
  required?: boolean;
};

const storageKey = "molding-mentor-downtime-entries";

const createEmptyEntry = (): Omit<DowntimeEntry, "id" | "updatedAt"> => ({
  date: new Date().toISOString().slice(0, 10),
  shift: "",
  machineNumber: "",
  moldNumber: "",
  downtimeReason: "",
  downtimeMinutes: "",
  notes: "",
  correctiveAction: "",
});

const fields: Field[] = [
  { key: "date", label: "Date", type: "date", required: true },
  { key: "shift", label: "Shift", placeholder: "Day, night, A, B, C...", required: true },
  { key: "machineNumber", label: "Machine number", placeholder: "Press 12", required: true },
  { key: "moldNumber", label: "Mold number", placeholder: "M-1042" },
  { key: "downtimeReason", label: "Downtime reason", placeholder: "Tooling, material, maintenance, quality...", required: true },
  { key: "downtimeMinutes", label: "Downtime minutes", type: "number", placeholder: "45", required: true },
  { key: "notes", label: "Notes", type: "textarea", placeholder: "What happened, who was notified, and current status" },
  { key: "correctiveAction", label: "Corrective action", type: "textarea", placeholder: "Action taken to restart production or prevent recurrence" },
];

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function toMinutes(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export default function DowntimePage() {
  const [entries, setEntries] = useState<DowntimeEntry[]>([]);
  const [form, setForm] = useState(createEmptyEntry);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedEntries = window.localStorage.getItem(storageKey);
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries) as DowntimeEntry[]);
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

  const totalDowntimeMinutes = useMemo(
    () => entries.reduce((total, entry) => total + toMinutes(entry.downtimeMinutes), 0),
    [entries],
  );

  const downtimeByReason = useMemo(() => {
    const summary = entries.reduce<Record<string, number>>((totals, entry) => {
      const reason = entry.downtimeReason.trim() || "Unspecified";
      totals[reason] = (totals[reason] ?? 0) + toMinutes(entry.downtimeMinutes);
      return totals;
    }, {});

    return Object.entries(summary).sort(([, minutesA], [, minutesB]) => minutesB - minutesA);
  }, [entries]);

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

  function editEntry(entry: DowntimeEntry) {
    setForm({
      date: entry.date,
      shift: entry.shift,
      machineNumber: entry.machineNumber,
      moldNumber: entry.moldNumber,
      downtimeReason: entry.downtimeReason,
      downtimeMinutes: entry.downtimeMinutes,
      notes: entry.notes,
      correctiveAction: entry.correctiveAction,
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
        <header className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_32%)]" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Production tracking</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Downtime Tracker</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              Log downtime events, corrective actions, and reason-code totals from a mobile-first dark workspace. Entries are saved in this browser only.
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2" aria-label="Downtime totals">
          <article className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-emerald-950/20">
            <p className="text-4xl font-black text-white">{totalDowntimeMinutes}</p>
            <h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-100">Total downtime minutes</h2>
            <p className="mt-2 text-sm text-slate-300">Across {entries.length} saved {entries.length === 1 ? "entry" : "entries"}</p>
          </article>

          <article className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5 shadow-xl shadow-cyan-950/20">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Downtime by reason</h2>
            {downtimeByReason.length === 0 ? (
              <p className="mt-3 text-sm text-slate-300">No reason summary yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {downtimeByReason.map(([reason, minutes]) => (
                  <li key={reason} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/50 px-4 py-3">
                    <span className="text-sm font-bold text-white">{reason}</span>
                    <span className="shrink-0 text-sm font-black text-cyan-100">{minutes} min</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-white">{editingId ? "Edit downtime entry" : "Add downtime entry"}</h2>
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
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
                  />
                ) : (
                  <input
                    type={field.type ?? "text"}
                    min={field.type === "number" ? "0" : undefined}
                    step={field.type === "number" ? "1" : undefined}
                    value={form[field.key]}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
                  />
                )}
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-200 sm:w-auto">
            {editingId ? "Save changes" : "Save downtime entry"}
          </button>
        </form>

        <section className="space-y-4" aria-label="Saved downtime entries">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Saved entries</h2>
            <p className="text-sm font-bold text-slate-400">{entries.length} total</p>
          </div>

          {sortedEntries.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-slate-300">
              No downtime entries saved yet. Add the first event above.
            </div>
          ) : (
            sortedEntries.map((entry) => (
              <article key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white">{formatDate(entry.date)} · Shift {entry.shift || "—"}</h3>
                    <p className="mt-1 text-sm text-cyan-200">Machine {entry.machineNumber || "—"} · Mold {entry.moldNumber || "—"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editEntry(entry)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">Edit</button>
                    <button type="button" onClick={() => deleteEntry(entry.id)} className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-bold text-red-100">Delete</button>
                  </div>
                </div>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/[0.05] p-4">
                    <dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Downtime reason</dt>
                    <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100">{entry.downtimeReason || "—"}</dd>
                  </div>
                  <div className="rounded-2xl bg-white/[0.05] p-4">
                    <dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Downtime minutes</dt>
                    <dd className="mt-2 text-sm font-black leading-6 text-slate-100">{toMinutes(entry.downtimeMinutes)} min</dd>
                  </div>
                  <div className="rounded-2xl bg-white/[0.05] p-4">
                    <dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Notes</dt>
                    <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100">{entry.notes || "—"}</dd>
                  </div>
                  <div className="rounded-2xl bg-white/[0.05] p-4">
                    <dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Corrective action</dt>
                    <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100">{entry.correctiveAction || "—"}</dd>
                  </div>
                </dl>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
