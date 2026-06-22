"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type OeeEntry = {
  id: string;
  date: string;
  jobName: string;
  plannedProductionTime: string;
  downtimeMinutes: string;
  idealCycleTime: string;
  totalPartsProduced: string;
  goodPartsProduced: string;
  scrapParts: string;
  notes: string;
  updatedAt: string;
};

type OeeForm = Omit<OeeEntry, "id" | "updatedAt">;

type Field = {
  key: keyof OeeForm;
  label: string;
  type?: "text" | "date" | "number" | "textarea";
  placeholder?: string;
  required?: boolean;
  suffix?: string;
};

const storageKey = "molding-mentor-oee-entries";

const fields: Field[] = [
  { key: "date", label: "Run date", type: "date", required: true },
  { key: "jobName", label: "Machine / job", placeholder: "Press 12 - PN-88421", required: true },
  { key: "plannedProductionTime", label: "Planned production time", type: "number", placeholder: "480", required: true, suffix: "minutes" },
  { key: "downtimeMinutes", label: "Downtime minutes", type: "number", placeholder: "35", required: true, suffix: "minutes" },
  { key: "idealCycleTime", label: "Ideal cycle time", type: "number", placeholder: "28", required: true, suffix: "seconds" },
  { key: "totalPartsProduced", label: "Total parts produced", type: "number", placeholder: "920", required: true, suffix: "pcs" },
  { key: "goodPartsProduced", label: "Good parts produced", type: "number", placeholder: "890", required: true, suffix: "pcs" },
  { key: "scrapParts", label: "Scrap parts", type: "number", placeholder: "30", required: true, suffix: "pcs" },
  { key: "notes", label: "Report notes", type: "textarea", placeholder: "Downtime reasons, defects, containment, or next-shift actions" },
];

const createEmptyEntry = (): OeeForm => ({
  date: new Date().toISOString().slice(0, 10),
  jobName: "",
  plannedProductionTime: "",
  downtimeMinutes: "",
  idealCycleTime: "",
  totalPartsProduced: "",
  goodPartsProduced: "",
  scrapParts: "",
  notes: "",
});

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(999, value));
}

function calculateMetrics(entry: OeeForm) {
  const planned = toNumber(entry.plannedProductionTime);
  const downtime = Math.max(0, Number(entry.downtimeMinutes) || 0);
  const operating = Math.max(planned - downtime, 0);
  const idealCycle = toNumber(entry.idealCycleTime);
  const totalParts = toNumber(entry.totalPartsProduced);
  const goodParts = toNumber(entry.goodPartsProduced);
  const scrapParts = Math.max(0, Number(entry.scrapParts) || 0);
  const availability = planned ? operating / planned : 0;
  const performance = operating ? (idealCycle * totalParts) / (operating * 60) : 0;
  const quality = totalParts ? goodParts / totalParts : 0;
  const oee = availability * performance * quality;
  const scrapPercentage = totalParts ? scrapParts / totalParts : 0;
  const downtimePercentage = planned ? downtime / planned : 0;

  return {
    availability: clampPercent(availability * 100),
    performance: clampPercent(performance * 100),
    quality: clampPercent(quality * 100),
    oee: clampPercent(oee * 100),
    scrapPercentage: clampPercent(scrapPercentage * 100),
    downtimePercentage: clampPercent(downtimePercentage * 100),
    operating,
  };
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function BarChart({ label, value, tone = "cyan" }: { label: string; value: number; tone?: "cyan" | "emerald" | "amber" | "rose" }) {
  const color = {
    cyan: "from-cyan-300 to-blue-400",
    emerald: "from-emerald-300 to-lime-400",
    amber: "from-amber-300 to-orange-400",
    rose: "from-rose-300 to-red-400",
  }[tone];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 print:border-slate-200 print:bg-white">
      <div className="flex items-center justify-between gap-4 text-sm font-bold">
        <span className="text-slate-200 print:text-slate-700">{label}</span>
        <span className="text-white print:text-slate-950">{formatPercent(value)}</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800 print:bg-slate-200">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

export default function OeePage() {
  const [entries, setEntries] = useState<OeeEntry[]>([]);
  const [form, setForm] = useState<OeeForm>(createEmptyEntry);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedEntries = window.localStorage.getItem(storageKey);
    if (storedEntries) setEntries(JSON.parse(storedEntries) as OeeEntry[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries, isLoaded]);

  const currentMetrics = useMemo(() => calculateMetrics(form), [form]);
  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => `${b.date}-${b.updatedAt}`.localeCompare(`${a.date}-${a.updatedAt}`)),
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

  function editEntry(entry: OeeEntry) {
    setForm({
      date: entry.date,
      jobName: entry.jobName,
      plannedProductionTime: entry.plannedProductionTime,
      downtimeMinutes: entry.downtimeMinutes,
      idealCycleTime: entry.idealCycleTime,
      totalPartsProduced: entry.totalPartsProduced,
      goodPartsProduced: entry.goodPartsProduced,
      scrapParts: entry.scrapParts,
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
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl space-y-6 print:max-w-none print:space-y-4">
        <header className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:shadow-none sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_32%)] print:hidden" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Operations dashboard</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white print:text-slate-950 sm:text-5xl">OEE Dashboard</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">
                Calculate availability, performance, quality, OEE, scrap, and downtime from production inputs. Entries are saved in this browser only.
              </p>
            </div>
            <button onClick={() => window.print()} className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20 print:hidden">
              Print report
            </button>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] print:block">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 print:hidden sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-white">{editingId ? "Edit OEE entry" : "Add OEE entry"}</h2>
              {editingId ? <button type="button" onClick={resetForm} className="text-sm font-bold text-cyan-200">Cancel edit</button> : null}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {fields.map((field) => (
                <label key={field.key}>
                  <span className="text-sm font-bold text-slate-200">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
                  ) : (
                    <div className="relative mt-2">
                      <input type={field.type ?? "text"} min={field.type === "number" ? "0" : undefined} step={field.type === "number" ? "any" : undefined} value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} required={field.required} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
                      {field.suffix ? <span className="absolute right-4 top-3 text-sm font-bold text-slate-500">{field.suffix}</span> : null}
                    </div>
                  )}
                </label>
              ))}
            </div>
            <button type="submit" className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-200">
              {editingId ? "Save changes" : "Save OEE entry"}
            </button>
          </form>

          <section className="space-y-4" aria-label="OEE charts">
            <article className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-xl shadow-emerald-950/20 print:border-slate-300 print:bg-white print:shadow-none">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100 print:text-slate-600">OEE score</p>
              <p className="mt-3 text-6xl font-black text-white print:text-slate-950">{formatPercent(currentMetrics.oee)}</p>
              <p className="mt-2 text-sm text-slate-300 print:text-slate-700">Operating time: {currentMetrics.operating.toFixed(0)} minutes</p>
            </article>
            <div className="grid gap-4 sm:grid-cols-2">
              <BarChart label="Availability" value={currentMetrics.availability} tone="cyan" />
              <BarChart label="Performance" value={currentMetrics.performance} tone="emerald" />
              <BarChart label="Quality" value={currentMetrics.quality} tone="amber" />
              <BarChart label="Scrap percentage" value={currentMetrics.scrapPercentage} tone="rose" />
              <div className="sm:col-span-2"><BarChart label="Downtime percentage" value={currentMetrics.downtimePercentage} tone="rose" /></div>
            </div>
          </section>
        </section>

        <section className="space-y-4" aria-label="OEE history">
          <h2 className="text-2xl font-black text-white print:text-slate-950">View history</h2>
          {sortedEntries.length === 0 ? (
            <article className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.04] p-6 text-sm text-slate-300 print:border-slate-300 print:bg-white print:text-slate-700">No OEE entries saved yet.</article>
          ) : (
            <div className="grid gap-4">
              {sortedEntries.map((entry) => {
                const metrics = calculateMetrics(entry);
                return (
                  <article key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-lg shadow-slate-950/30 print:break-inside-avoid print:border-slate-300 print:bg-white print:shadow-none">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200 print:text-slate-600">{formatDate(entry.date)}</p>
                        <h3 className="mt-1 text-xl font-black text-white print:text-slate-950">{entry.jobName}</h3>
                        <p className="mt-2 text-sm text-slate-300 print:text-slate-700">Planned {entry.plannedProductionTime} min · Downtime {entry.downtimeMinutes} min · Total {entry.totalPartsProduced} pcs · Good {entry.goodPartsProduced} pcs · Scrap {entry.scrapParts} pcs</p>
                      </div>
                      <div className="flex gap-2 print:hidden">
                        <button onClick={() => editEntry(entry)} className="rounded-xl bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">Edit</button>
                        <button onClick={() => deleteEntry(entry.id)} className="rounded-xl bg-rose-300/10 px-4 py-2 text-sm font-bold text-rose-100">Delete</button>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <BarChart label="OEE" value={metrics.oee} tone="emerald" />
                      <BarChart label="Availability" value={metrics.availability} tone="cyan" />
                      <BarChart label="Performance" value={metrics.performance} tone="amber" />
                      <BarChart label="Quality" value={metrics.quality} tone="emerald" />
                    </div>
                    {entry.notes ? <p className="mt-4 rounded-2xl bg-slate-950/50 p-4 text-sm text-slate-300 print:bg-slate-100 print:text-slate-700">{entry.notes}</p> : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
