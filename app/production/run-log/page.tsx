"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type RunLog = {
  id: string;
  date: string;
  shift: string;
  machineNumber: string;
  moldNumber: string;
  partNumber: string;
  operatorName: string;
  startTime: string;
  endTime: string;
  targetCycleTime: string;
  actualCycleTime: string;
  goodParts: string;
  scrapParts: string;
  downtimeMinutes: string;
  notes: string;
  updatedAt: string;
};

type RunLogForm = Omit<RunLog, "id" | "updatedAt">;

type Field = {
  key: keyof RunLogForm;
  label: string;
  type?: "text" | "date" | "time" | "number" | "textarea";
  placeholder?: string;
  required?: boolean;
};

type Filters = Pick<RunLogForm, "date" | "shift" | "machineNumber" | "moldNumber" | "partNumber">;

type RunMetrics = {
  runMinutes: number;
  totalParts: number;
  scrapPercentage: number;
  partsPerHour: number;
};

const storageKey = "molding-mentor-production-run-logs";

const emptyLog: RunLogForm = {
  date: new Date().toISOString().slice(0, 10),
  shift: "",
  machineNumber: "",
  moldNumber: "",
  partNumber: "",
  operatorName: "",
  startTime: "",
  endTime: "",
  targetCycleTime: "",
  actualCycleTime: "",
  goodParts: "",
  scrapParts: "",
  downtimeMinutes: "",
  notes: "",
};

const emptyFilters: Filters = {
  date: "",
  shift: "",
  machineNumber: "",
  moldNumber: "",
  partNumber: "",
};

const fields: Field[] = [
  { key: "date", label: "Date", type: "date", required: true },
  { key: "shift", label: "Shift", placeholder: "A, B, C, day, night...", required: true },
  { key: "machineNumber", label: "Machine number", placeholder: "Press 12", required: true },
  { key: "moldNumber", label: "Mold number", placeholder: "M-1042", required: true },
  { key: "partNumber", label: "Part number", placeholder: "PN-77821", required: true },
  { key: "operatorName", label: "Operator name", placeholder: "Operator full name" },
  { key: "startTime", label: "Start time", type: "time", required: true },
  { key: "endTime", label: "End time", type: "time", required: true },
  { key: "targetCycleTime", label: "Target cycle time", type: "number", placeholder: "Seconds" },
  { key: "actualCycleTime", label: "Actual cycle time", type: "number", placeholder: "Seconds" },
  { key: "goodParts", label: "Good parts", type: "number", placeholder: "8500", required: true },
  { key: "scrapParts", label: "Scrap parts", type: "number", placeholder: "125" },
  { key: "downtimeMinutes", label: "Downtime minutes", type: "number", placeholder: "30" },
  { key: "notes", label: "Notes", type: "textarea", placeholder: "Process adjustments, quality concerns, downtime reasons, staffing notes..." },
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
  return hours * 60 + minutes;
}

function getMetrics(log: RunLogForm): RunMetrics {
  const start = timeToMinutes(log.startTime);
  let end = timeToMinutes(log.endTime);
  if (log.startTime && log.endTime && end < start) end += 24 * 60;
  const elapsedMinutes = log.startTime && log.endTime ? Math.max(0, end - start) : 0;
  const runMinutes = Math.max(0, elapsedMinutes - toNumber(log.downtimeMinutes));
  const totalParts = toNumber(log.goodParts) + toNumber(log.scrapParts);
  const scrapPercentage = totalParts ? (toNumber(log.scrapParts) / totalParts) * 100 : 0;
  const partsPerHour = runMinutes ? (totalParts / runMinutes) * 60 : 0;

  return { runMinutes, totalParts, scrapPercentage, partsPerHour };
}

function formatNumber(value: number, digits = 0) {
  return value.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export default function ProductionRunLogPage() {
  const [logs, setLogs] = useState<RunLog[]>([]);
  const [form, setForm] = useState<RunLogForm>(emptyLog);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedLogs = window.localStorage.getItem(storageKey);
    if (storedLogs) setLogs(JSON.parse(storedLogs) as RunLog[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(logs));
  }, [logs, isLoaded]);

  const filteredLogs = useMemo(() => logs
    .filter((log) => !filters.date || log.date === filters.date)
    .filter((log) => !filters.shift || log.shift.toLowerCase().includes(filters.shift.toLowerCase()))
    .filter((log) => !filters.machineNumber || log.machineNumber.toLowerCase().includes(filters.machineNumber.toLowerCase()))
    .filter((log) => !filters.moldNumber || log.moldNumber.toLowerCase().includes(filters.moldNumber.toLowerCase()))
    .filter((log) => !filters.partNumber || log.partNumber.toLowerCase().includes(filters.partNumber.toLowerCase()))
    .sort((a, b) => `${b.date}-${b.startTime}`.localeCompare(`${a.date}-${a.startTime}`)), [logs, filters]);

  const totals = useMemo(() => filteredLogs.reduce((summary, log) => {
    const metrics = getMetrics(log);
    return {
      runMinutes: summary.runMinutes + metrics.runMinutes,
      goodParts: summary.goodParts + toNumber(log.goodParts),
      scrapParts: summary.scrapParts + toNumber(log.scrapParts),
      totalParts: summary.totalParts + metrics.totalParts,
    };
  }, { runMinutes: 0, goodParts: 0, scrapParts: 0, totalParts: 0 }), [filteredLogs]);

  const totalScrapPercentage = totals.totalParts ? (totals.scrapParts / totals.totalParts) * 100 : 0;
  const totalPartsPerHour = totals.runMinutes ? (totals.totalParts / totals.runMinutes) * 60 : 0;

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

  function editLog(log: RunLog) {
    const { id, updatedAt, ...editableLog } = log;
    void id;
    void updatedAt;
    setForm(editableLog);
    setEditingId(log.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteLog(id: string) {
    setLogs((current) => current.filter((log) => log.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6 print:max-w-none print:space-y-4">
        <header className="rounded-[2rem] border border-emerald-300/20 bg-slate-900 p-5 shadow-2xl shadow-emerald-950/30 sm:p-8 print:border-0 print:bg-white print:p-0 print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300 print:text-slate-600">Production tools</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Production Run Log</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">Create shift run records, calculate run metrics automatically, and print a filtered production report for handoff or daily review.</p>
            </div>
            <button type="button" onClick={() => window.print()} className="rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-200 print:hidden">Print report</button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6 print:hidden">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-white">{editingId ? "Edit run log" : "Create run log"}</h2>
            {editingId ? <button type="button" onClick={resetForm} className="text-sm font-bold text-cyan-200">Cancel edit</button> : null}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2 lg:col-span-3" : undefined}>
                <span className="text-sm font-bold text-slate-200">{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300" />
                ) : (
                  <input type={field.type ?? "text"} step={field.type === "number" ? "0.01" : undefined} min={field.type === "number" ? "0" : undefined} value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} required={field.required} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300" />
                )}
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-200 sm:w-auto">{editingId ? "Save changes" : "Save run log"}</button>
        </form>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 print:grid-cols-5">
          <article className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-sm font-bold text-cyan-100 print:text-slate-600">Logs shown</p><p className="mt-2 text-3xl font-black text-white print:text-slate-950">{filteredLogs.length}</p></article>
          <article className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-sm font-bold text-emerald-100 print:text-slate-600">Total parts</p><p className="mt-2 text-3xl font-black text-white print:text-slate-950">{totals.totalParts.toLocaleString()}</p></article>
          <article className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-sm font-bold text-amber-100 print:text-slate-600">Scrap %</p><p className="mt-2 text-3xl font-black text-white print:text-slate-950">{formatNumber(totalScrapPercentage, 1)}%</p></article>
          <article className="rounded-3xl border border-violet-300/20 bg-violet-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-sm font-bold text-violet-100 print:text-slate-600">Parts/hour</p><p className="mt-2 text-3xl font-black text-white print:text-slate-950">{formatNumber(totalPartsPerHour)}</p></article>
          <article className="rounded-3xl border border-sky-300/20 bg-sky-300/10 p-5 print:border-slate-300 print:bg-white"><p className="text-sm font-bold text-sky-100 print:text-slate-600">Run time</p><p className="mt-2 text-3xl font-black text-white print:text-slate-950">{formatNumber(totals.runMinutes / 60, 1)}h</p></article>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 print:hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-black text-white">Filter saved logs</h2><button type="button" onClick={() => setFilters(emptyFilters)} className="text-left text-sm font-bold text-cyan-200 sm:text-right">Clear filters</button></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input type="date" value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-emerald-300" aria-label="Filter by date" />
            <input value={filters.shift} onChange={(event) => setFilters((current) => ({ ...current, shift: event.target.value }))} placeholder="Shift" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300" />
            <input value={filters.machineNumber} onChange={(event) => setFilters((current) => ({ ...current, machineNumber: event.target.value }))} placeholder="Machine" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300" />
            <input value={filters.moldNumber} onChange={(event) => setFilters((current) => ({ ...current, moldNumber: event.target.value }))} placeholder="Mold" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300" />
            <input value={filters.partNumber} onChange={(event) => setFilters((current) => ({ ...current, partNumber: event.target.value }))} placeholder="Part number" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300" />
          </div>
        </section>

        <section className="space-y-4" aria-label="Saved production run logs">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-black text-white print:text-slate-950">Saved run logs</h2><p className="text-sm font-bold text-slate-400 print:text-slate-600">{logs.length} total saved</p></div>
          {filteredLogs.length === 0 ? <div className="rounded-[1.5rem] border border-dashed border-emerald-300/30 bg-emerald-300/10 p-6 text-slate-300 print:border-slate-300 print:bg-white print:text-slate-700">No run logs match the current filters.</div> : filteredLogs.map((log) => {
            const metrics = getMetrics(log);
            return (
              <article key={log.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30 print:break-inside-avoid print:border-slate-300 print:bg-white print:shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div><h3 className="text-xl font-black text-white print:text-slate-950">{formatDate(log.date)} · Shift {log.shift || "—"}</h3><p className="mt-2 text-sm text-emerald-200 print:text-slate-700">Machine {log.machineNumber || "—"} · Mold {log.moldNumber || "—"} · Part {log.partNumber || "—"} · Operator {log.operatorName || "—"}</p></div>
                  <div className="flex gap-2 print:hidden"><button type="button" onClick={() => editLog(log)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">Edit</button><button type="button" onClick={() => deleteLog(log.id)} className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-bold text-red-100">Delete</button></div>
                </div>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Run time</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">{log.startTime || "—"} to {log.endTime || "—"} · {formatNumber(metrics.runMinutes)} min net</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Cycle time</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">Target {log.targetCycleTime || "—"}s · Actual {log.actualCycleTime || "—"}s</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Parts</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">{toNumber(log.goodParts).toLocaleString()} good / {toNumber(log.scrapParts).toLocaleString()} scrap / {metrics.totalParts.toLocaleString()} total</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Performance</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">{formatNumber(metrics.scrapPercentage, 1)}% scrap · {formatNumber(metrics.partsPerHour)} parts/hr · {toNumber(log.downtimeMinutes)} min down</dd></div>
                </dl>
                {log.notes ? <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-white/[0.05] p-4 text-sm leading-6 text-slate-200 print:border print:border-slate-200 print:bg-white print:text-slate-900">{log.notes}</p> : null}
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
