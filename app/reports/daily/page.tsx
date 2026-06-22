"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type DailyReport = {
  id: string;
  date: string;
  shift: string;
  supervisorName: string;
  totalPartsProduced: string;
  goodParts: string;
  scrapParts: string;
  downtimeMinutes: string;
  topDowntimeReason: string;
  topDefect: string;
  machinesRunning: string;
  machinesDown: string;
  qualityConcerns: string;
  safetyConcerns: string;
  staffingNotes: string;
  maintenanceNotes: string;
  nextShiftPriorities: string;
  updatedAt: string;
};

type ReportForm = Omit<DailyReport, "id" | "updatedAt">;

type Field = {
  key: keyof ReportForm;
  label: string;
  type?: "date" | "number" | "textarea" | "text";
  placeholder?: string;
  required?: boolean;
};

const storageKey = "molding-mentor-plant-daily-reports";

const emptyReport: ReportForm = {
  date: new Date().toISOString().slice(0, 10),
  shift: "",
  supervisorName: "",
  totalPartsProduced: "",
  goodParts: "",
  scrapParts: "",
  downtimeMinutes: "",
  topDowntimeReason: "",
  topDefect: "",
  machinesRunning: "",
  machinesDown: "",
  qualityConcerns: "",
  safetyConcerns: "",
  staffingNotes: "",
  maintenanceNotes: "",
  nextShiftPriorities: "",
};

const fields: Field[] = [
  { key: "date", label: "Date", type: "date", required: true },
  { key: "shift", label: "Shift", placeholder: "Day, night, A, B, C...", required: true },
  { key: "supervisorName", label: "Supervisor name", placeholder: "Supervisor on duty", required: true },
  { key: "totalPartsProduced", label: "Total parts produced", type: "number", placeholder: "12500" },
  { key: "goodParts", label: "Good parts", type: "number", placeholder: "12150" },
  { key: "scrapParts", label: "Scrap parts", type: "number", placeholder: "350" },
  { key: "downtimeMinutes", label: "Downtime minutes", type: "number", placeholder: "45" },
  { key: "topDowntimeReason", label: "Top downtime reason", placeholder: "Mold change, material outage, maintenance..." },
  { key: "topDefect", label: "Top defect", placeholder: "Short shot, flash, splay..." },
  { key: "machinesRunning", label: "Machines running", type: "number", placeholder: "18" },
  { key: "machinesDown", label: "Machines down", type: "number", placeholder: "2" },
  { key: "qualityConcerns", label: "Quality concerns", type: "textarea", placeholder: "Open holds, inspection focus, customer risk..." },
  { key: "safetyConcerns", label: "Safety concerns", type: "textarea", placeholder: "Incidents, near misses, blocked aisles, PPE gaps..." },
  { key: "staffingNotes", label: "Staffing notes", type: "textarea", placeholder: "Call-ins, coverage gaps, training needs..." },
  { key: "maintenanceNotes", label: "Maintenance notes", type: "textarea", placeholder: "Work orders, repairs completed, follow-up needed..." },
  { key: "nextShiftPriorities", label: "Next shift priorities", type: "textarea", placeholder: "Top checks, hot jobs, escalation items..." },
];

const numberFields = new Set<keyof ReportForm>([
  "totalPartsProduced",
  "goodParts",
  "scrapParts",
  "downtimeMinutes",
  "machinesRunning",
  "machinesDown",
]);

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function getScrapPercentage(report: Pick<ReportForm, "totalPartsProduced" | "scrapParts">) {
  const total = toNumber(report.totalPartsProduced);
  const scrap = toNumber(report.scrapParts);
  if (!total) return "0.0";
  return ((scrap / total) * 100).toFixed(1);
}

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

export default function PlantDailyReportPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [form, setForm] = useState<ReportForm>(emptyReport);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedReports = window.localStorage.getItem(storageKey);
    if (storedReports) setReports(JSON.parse(storedReports) as DailyReport[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(reports));
  }, [isLoaded, reports]);

  const sortedReports = useMemo(
    () => [...reports].sort((a, b) => `${b.date}-${b.updatedAt}`.localeCompare(`${a.date}-${a.updatedAt}`)),
    [reports],
  );

  const currentScrapPercentage = getScrapPercentage(form);

  function resetForm() {
    setForm({ ...emptyReport, date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();

    if (editingId) {
      setReports((current) => current.map((report) => (report.id === editingId ? { ...form, id: editingId, updatedAt } : report)));
      resetForm();
      return;
    }

    setReports((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editReport(report: DailyReport) {
    setForm({
      date: report.date,
      shift: report.shift,
      supervisorName: report.supervisorName,
      totalPartsProduced: report.totalPartsProduced,
      goodParts: report.goodParts,
      scrapParts: report.scrapParts,
      downtimeMinutes: report.downtimeMinutes,
      topDowntimeReason: report.topDowntimeReason,
      topDefect: report.topDefect,
      machinesRunning: report.machinesRunning,
      machinesDown: report.machinesDown,
      qualityConcerns: report.qualityConcerns,
      safetyConcerns: report.safetyConcerns,
      staffingNotes: report.staffingNotes,
      maintenanceNotes: report.maintenanceNotes,
      nextShiftPriorities: report.nextShiftPriorities,
    });
    setEditingId(report.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteReport(id: string) {
    setReports((current) => current.filter((report) => report.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6 print:max-w-none print:space-y-4">
        <header className="rounded-[2rem] border border-emerald-300/20 bg-slate-900 p-5 shadow-2xl shadow-emerald-950/30 sm:p-8 print:border-0 print:bg-white print:p-0 print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300 print:text-slate-600">Reports · Supervisor tools</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Plant Daily Report</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Summarize shift production, scrap, downtime, machine status, concerns, and next-shift priorities in a printable daily report.
              </p>
            </div>
            <button type="button" onClick={() => window.print()} className="rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-200 print:hidden">
              Print reports
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6 print:hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-white">{editingId ? "Edit daily report" : "Create daily report"}</h2>
              <p className="mt-1 text-sm text-slate-400">Scrap percentage auto-calculates from scrap parts divided by total parts produced.</p>
            </div>
            <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">Scrap percentage</p>
              <p className="text-2xl font-black text-white">{currentScrapPercentage}%</p>
            </div>
          </div>
          {editingId ? <button type="button" onClick={resetForm} className="mt-4 text-sm font-bold text-cyan-200">Cancel edit</button> : null}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
                <span className="text-sm font-bold text-slate-200">{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300" />
                ) : (
                  <input type={field.type ?? "text"} min={numberFields.has(field.key) ? "0" : undefined} value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} required={field.required} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300" />
                )}
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-200 sm:w-auto">
            {editingId ? "Save changes" : "Save daily report"}
          </button>
        </form>

        <section className="space-y-4" aria-label="Saved plant daily reports">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white print:text-slate-950">Saved reports</h2>
            <p className="text-sm font-bold text-slate-400 print:text-slate-600">{reports.length} total</p>
          </div>

          {sortedReports.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-emerald-300/30 bg-emerald-300/10 p-6 text-slate-300 print:border-slate-300 print:bg-white print:text-slate-700">No daily reports saved yet. Create the first report above.</div>
          ) : (
            sortedReports.map((report) => (
              <article key={report.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30 print:break-inside-avoid print:border-slate-300 print:bg-white print:shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white print:text-slate-950">{formatDate(report.date)} · Shift {report.shift || "—"}</h3>
                    <p className="mt-1 text-sm text-emerald-200 print:text-slate-700">Supervisor {report.supervisorName || "—"} · Scrap {getScrapPercentage(report)}% · Downtime {report.downtimeMinutes || "0"} min</p>
                  </div>
                  <div className="flex gap-2 print:hidden">
                    <button type="button" onClick={() => editReport(report)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">Edit</button>
                    <button type="button" onClick={() => deleteReport(report.id)} className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-bold text-red-100">Delete</button>
                  </div>
                </div>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Production</dt><dd className="mt-2 text-sm leading-6 text-slate-100 print:text-slate-900">Total: {report.totalPartsProduced || "0"}<br />Good: {report.goodParts || "0"}<br />Scrap: {report.scrapParts || "0"}</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Machines</dt><dd className="mt-2 text-sm leading-6 text-slate-100 print:text-slate-900">Running: {report.machinesRunning || "0"}<br />Down: {report.machinesDown || "0"}</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Top issues</dt><dd className="mt-2 text-sm leading-6 text-slate-100 print:text-slate-900">Downtime: {report.topDowntimeReason || "—"}<br />Defect: {report.topDefect || "—"}</dd></div>
                  {fields.slice(11).map((field) => (
                    <div key={field.key} className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white lg:col-span-3">
                      <dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">{field.label}</dt>
                      <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100 print:text-slate-900">{report[field.key] || "—"}</dd>
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
