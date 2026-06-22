"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type HandoffLog = {
  id: string;
  date: string;
  shift: string;
  machineNumber: string;
  moldNumber: string;
  material: string;
  currentIssue: string;
  processChangesMade: string;
  qualityConcerns: string;
  downtimeNotes: string;
  partsOnHold: string;
  nextShiftInstructions: string;
  updatedAt: string;
};

type Field = {
  key: keyof Omit<HandoffLog, "id" | "updatedAt">;
  label: string;
  type?: "text" | "date" | "textarea";
  placeholder?: string;
};

const storageKey = "molding-mentor-shift-handoff-logs";

const emptyLog: Omit<HandoffLog, "id" | "updatedAt"> = {
  date: new Date().toISOString().slice(0, 10),
  shift: "",
  machineNumber: "",
  moldNumber: "",
  material: "",
  currentIssue: "",
  processChangesMade: "",
  qualityConcerns: "",
  downtimeNotes: "",
  partsOnHold: "",
  nextShiftInstructions: "",
};

const fields: Field[] = [
  { key: "date", label: "Date", type: "date" },
  { key: "shift", label: "Shift", placeholder: "Day, night, A, B, C..." },
  { key: "machineNumber", label: "Machine number", placeholder: "Press 12" },
  { key: "moldNumber", label: "Mold number", placeholder: "M-1042" },
  { key: "material", label: "Material", placeholder: "ABS natural, lot #..." },
  { key: "currentIssue", label: "Current issue", type: "textarea", placeholder: "Active process, tooling, material, or quality issue" },
  { key: "processChangesMade", label: "Process changes made", type: "textarea", placeholder: "Temperature, pressure, speed, cushion, clamp, or setup changes" },
  { key: "qualityConcerns", label: "Quality concerns", type: "textarea", placeholder: "Defects seen, inspection notes, containment actions" },
  { key: "downtimeNotes", label: "Downtime notes", type: "textarea", placeholder: "Reason, duration, maintenance status" },
  { key: "partsOnHold", label: "Parts on hold", type: "textarea", placeholder: "Quantity, location, reason, tag number" },
  { key: "nextShiftInstructions", label: "Next shift instructions", type: "textarea", placeholder: "Checks to run, limits not to exceed, people to contact" },
];

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

export default function ShiftHandoffPage() {
  const [logs, setLogs] = useState<HandoffLog[]>([]);
  const [form, setForm] = useState(emptyLog);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedLogs = window.localStorage.getItem(storageKey);
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs) as HandoffLog[]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(logs));
    }
  }, [isLoaded, logs]);

  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => `${b.date}-${b.updatedAt}`.localeCompare(`${a.date}-${a.updatedAt}`)),
    [logs],
  );

  function resetForm() {
    setForm({ ...emptyLog, date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();

    if (editingId) {
      setLogs((current) => current.map((log) => (log.id === editingId ? { ...form, id: editingId, updatedAt } : log)));
      resetForm();
      return;
    }

    setLogs((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editLog(log: HandoffLog) {
    setForm({
      date: log.date,
      shift: log.shift,
      machineNumber: log.machineNumber,
      moldNumber: log.moldNumber,
      material: log.material,
      currentIssue: log.currentIssue,
      processChangesMade: log.processChangesMade,
      qualityConcerns: log.qualityConcerns,
      downtimeNotes: log.downtimeNotes,
      partsOnHold: log.partsOnHold,
      nextShiftInstructions: log.nextShiftInstructions,
    });
    setEditingId(log.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteLog(id: string) {
    setLogs((current) => current.filter((log) => log.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6 print:max-w-none print:space-y-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-0 print:bg-white print:p-0 print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Shift communication</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Shift Handoff Logs</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Capture machine status, process changes, quality holds, and instructions so the next crew starts with clear priorities.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 print:hidden"
            >
              Print logs
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6 print:hidden">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-white">{editingId ? "Edit handoff log" : "Add new handoff log"}</h2>
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
                    value={form[field.key]}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                    placeholder={field.placeholder}
                    required={["date", "shift", "machineNumber"].includes(field.key)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
                  />
                )}
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-200 sm:w-auto">
            {editingId ? "Save changes" : "Save handoff log"}
          </button>
        </form>

        <section className="space-y-4" aria-label="Saved shift handoff logs">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white print:text-slate-950">Saved logs</h2>
            <p className="text-sm font-bold text-slate-400 print:text-slate-600">{logs.length} total</p>
          </div>

          {sortedLogs.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-slate-300 print:border-slate-300 print:bg-white print:text-slate-700">
              No handoff logs saved yet. Add the first log above.
            </div>
          ) : (
            sortedLogs.map((log) => (
              <article key={log.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30 print:break-inside-avoid print:border-slate-300 print:bg-white print:shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white print:text-slate-950">{formatDate(log.date)} · Shift {log.shift || "—"}</h3>
                    <p className="mt-1 text-sm text-cyan-200 print:text-slate-700">Machine {log.machineNumber || "—"} · Mold {log.moldNumber || "—"} · {log.material || "Material not listed"}</p>
                  </div>
                  <div className="flex gap-2 print:hidden">
                    <button type="button" onClick={() => editLog(log)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">Edit</button>
                    <button type="button" onClick={() => deleteLog(log.id)} className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-bold text-red-100">Delete</button>
                  </div>
                </div>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  {fields.slice(5).map((field) => (
                    <div key={field.key} className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white">
                      <dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">{field.label}</dt>
                      <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100 print:text-slate-900">{log[field.key] || "—"}</dd>
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
