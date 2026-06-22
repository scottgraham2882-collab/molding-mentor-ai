"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Trend = "Up" | "Down" | "Flat";

type KpiRecord = {
  id: string;
  reportDate: string;
  executiveOwner: string;
  totalPartsProduced: string;
  scrapPercentage: string;
  downtimeMinutes: string;
  oeePercentage: string;
  openCorrectiveActions: string;
  customerComplaints: string;
  trainingCompletionPercentage: string;
  certificationsCompleted: string;
  notes: string;
  updatedAt: string;
};

type KpiForm = Omit<KpiRecord, "id" | "updatedAt">;

type NumericKpi = {
  key: keyof Pick<
    KpiRecord,
    | "totalPartsProduced"
    | "scrapPercentage"
    | "downtimeMinutes"
    | "oeePercentage"
    | "openCorrectiveActions"
    | "customerComplaints"
    | "trainingCompletionPercentage"
    | "certificationsCompleted"
  >;
  label: string;
  suffix?: string;
  tone: string;
  lowerIsBetter?: boolean;
};

const storageKey = "molding-mentor-executive-kpi-records";

const numericKpis: NumericKpi[] = [
  { key: "totalPartsProduced", label: "Total parts produced", tone: "from-cyan-300 to-blue-400" },
  { key: "scrapPercentage", label: "Scrap percentage", suffix: "%", tone: "from-rose-300 to-orange-400", lowerIsBetter: true },
  { key: "downtimeMinutes", label: "Downtime minutes", tone: "from-amber-300 to-yellow-400", lowerIsBetter: true },
  { key: "oeePercentage", label: "OEE percentage", suffix: "%", tone: "from-emerald-300 to-cyan-400" },
  { key: "openCorrectiveActions", label: "Open corrective actions", tone: "from-violet-300 to-fuchsia-400", lowerIsBetter: true },
  { key: "customerComplaints", label: "Customer complaints", tone: "from-red-300 to-rose-400", lowerIsBetter: true },
  { key: "trainingCompletionPercentage", label: "Training completion percentage", suffix: "%", tone: "from-lime-300 to-emerald-400" },
  { key: "certificationsCompleted", label: "Certifications completed", tone: "from-sky-300 to-cyan-400" },
];

const createEmptyForm = (): KpiForm => ({
  reportDate: new Date().toISOString().slice(0, 10),
  executiveOwner: "",
  totalPartsProduced: "",
  scrapPercentage: "",
  downtimeMinutes: "",
  oeePercentage: "",
  openCorrectiveActions: "",
  customerComplaints: "",
  trainingCompletionPercentage: "",
  certificationsCompleted: "",
  notes: "",
});

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function getTrend(current: string, previous?: string): Trend {
  if (previous === undefined) return "Flat";
  const currentValue = toNumber(current);
  const previousValue = toNumber(previous);
  if (currentValue > previousValue) return "Up";
  if (currentValue < previousValue) return "Down";
  return "Flat";
}

function trendBadge(trend: Trend, lowerIsBetter?: boolean) {
  const isPositive = trend === "Flat" || (trend === "Up" && !lowerIsBetter) || (trend === "Down" && lowerIsBetter);
  const classes = isPositive
    ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
    : "border-amber-300/30 bg-amber-300/10 text-amber-100";
  const arrow = trend === "Up" ? "↑" : trend === "Down" ? "↓" : "→";
  return { classes, label: `${arrow} ${trend}` };
}

export default function ExecutiveKpiDashboardPage() {
  const [records, setRecords] = useState<KpiRecord[]>([]);
  const [form, setForm] = useState<KpiForm>(createEmptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedRecords = window.localStorage.getItem(storageKey);
    if (storedRecords) setRecords(JSON.parse(storedRecords) as KpiRecord[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(records));
  }, [records, isLoaded]);

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => `${b.reportDate}-${b.updatedAt}`.localeCompare(`${a.reportDate}-${a.updatedAt}`)),
    [records],
  );

  const latestRecord = sortedRecords[0];
  const previousRecord = sortedRecords[1];
  const dashboardSource = latestRecord ?? ({ ...form, id: "preview", updatedAt: "" } as KpiRecord);

  function resetForm() {
    setForm(createEmptyForm());
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();

    if (editingId) {
      setRecords((current) => current.map((record) => (record.id === editingId ? { ...form, id: editingId, updatedAt } : record)));
      resetForm();
      return;
    }

    setRecords((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editRecord(record: KpiRecord) {
    setForm({
      reportDate: record.reportDate,
      executiveOwner: record.executiveOwner,
      totalPartsProduced: record.totalPartsProduced,
      scrapPercentage: record.scrapPercentage,
      downtimeMinutes: record.downtimeMinutes,
      oeePercentage: record.oeePercentage,
      openCorrectiveActions: record.openCorrectiveActions,
      customerComplaints: record.customerComplaints,
      trainingCompletionPercentage: record.trainingCompletionPercentage,
      certificationsCompleted: record.certificationsCompleted,
      notes: record.notes,
    });
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6 print:max-w-none print:space-y-4">
        <header className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:rounded-none print:border-slate-300 print:bg-white print:p-4 print:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.24),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_34%)] print:hidden" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Executive reports</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Executive KPI Dashboard</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Enter plant-level KPI snapshots, save them to this browser, review trend direction, and print a leadership-ready performance report.
              </p>
            </div>
            <button onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 print:hidden">
              Print KPI report
            </button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Executive KPI cards">
          {numericKpis.map((kpi) => {
            const trend = getTrend(dashboardSource[kpi.key], previousRecord?.[kpi.key]);
            const badge = trendBadge(trend, kpi.lowerIsBetter);
            return (
              <article key={kpi.key} className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4 shadow-xl shadow-slate-950/30 print:border-slate-300 print:bg-white print:shadow-none">
                <div className={`h-1.5 rounded-full bg-gradient-to-r ${kpi.tone}`} />
                <p className="mt-4 text-3xl font-black text-white print:text-slate-950">
                  {dashboardSource[kpi.key] || "0"}{kpi.suffix ?? ""}
                </p>
                <h2 className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-slate-200 print:text-slate-700">{kpi.label}</h2>
                <span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${badge.classes} print:border-slate-400 print:bg-white print:text-slate-700`}>
                  {badge.label}
                </span>
              </article>
            );
          })}
        </section>

        <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-7 print:hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">{editingId ? "Edit KPI record" : "Manual KPI input"}</p>
              <h2 className="mt-2 text-2xl font-black text-white">Leadership snapshot</h2>
            </div>
            {editingId && <button type="button" onClick={resetForm} className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-slate-100">Cancel edit</button>}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label>
              <span className="text-sm font-bold text-slate-200">Report date</span>
              <input required type="date" value={form.reportDate} onChange={(event) => setForm((current) => ({ ...current, reportDate: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" />
            </label>
            <label className="xl:col-span-3">
              <span className="text-sm font-bold text-slate-200">Executive owner</span>
              <input required value={form.executiveOwner} onChange={(event) => setForm((current) => ({ ...current, executiveOwner: event.target.value }))} placeholder="Plant manager or leadership team" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" />
            </label>
            {numericKpis.map((kpi) => (
              <label key={kpi.key}>
                <span className="text-sm font-bold text-slate-200">{kpi.label}</span>
                <input required min="0" step={kpi.suffix === "%" ? "0.01" : "1"} type="number" value={form[kpi.key]} onChange={(event) => setForm((current) => ({ ...current, [kpi.key]: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" />
              </label>
            ))}
            <label className="md:col-span-2 xl:col-span-4">
              <span className="text-sm font-bold text-slate-200">Executive notes</span>
              <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Key wins, risks, actions, owners, and next review date" className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" />
            </label>
          </div>

          <button className="mt-6 w-full rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950 shadow-lg shadow-emerald-950/30 sm:w-auto">
            {editingId ? "Save changes" : "Save KPI record"}
          </button>
        </form>

        <section className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30 sm:p-7 print:border-slate-300 print:bg-white print:shadow-none">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300 print:text-slate-600">History</p>
              <h2 className="mt-2 text-2xl font-black text-white print:text-slate-950">Saved KPI records</h2>
            </div>
            <p className="text-sm text-slate-300 print:text-slate-700">{records.length} record{records.length === 1 ? "" : "s"} stored locally</p>
          </div>

          <div className="mt-5 space-y-4">
            {sortedRecords.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 p-5 text-sm text-slate-300 print:text-slate-700">No KPI records saved yet. Enter a leadership snapshot to start the dashboard history.</p>
            ) : (
              sortedRecords.map((record, index) => (
                <article key={record.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 print:border-slate-300 print:bg-white">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white print:text-slate-950">{formatDate(record.reportDate)}</h3>
                      <p className="mt-1 text-sm text-slate-300 print:text-slate-700">Owner: {record.executiveOwner}</p>
                    </div>
                    <div className="flex gap-2 print:hidden">
                      <button onClick={() => editRecord(record)} className="rounded-xl border border-cyan-300/30 px-3 py-2 text-sm font-bold text-cyan-100">Edit</button>
                      <button onClick={() => deleteRecord(record.id)} className="rounded-xl border border-rose-300/30 px-3 py-2 text-sm font-bold text-rose-100">Delete</button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {numericKpis.map((kpi) => {
                      const previous = sortedRecords[index + 1];
                      const trend = getTrend(record[kpi.key], previous?.[kpi.key]);
                      return <p key={kpi.key} className="rounded-xl bg-slate-950/60 px-3 py-2 text-sm text-slate-200 print:bg-slate-100 print:text-slate-800"><strong>{kpi.label}:</strong> {record[kpi.key]}{kpi.suffix ?? ""} ({trend})</p>;
                    })}
                  </div>
                  {record.notes && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-950/50 p-3 text-sm text-slate-300 print:bg-slate-100 print:text-slate-800">{record.notes}</p>}
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
