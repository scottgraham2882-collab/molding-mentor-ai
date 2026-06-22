"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type WeeklyReport = {
  id: string;
  weekStartingDate: string;
  supervisorName: string;
  totalPartsProduced: string;
  totalGoodParts: string;
  totalScrapParts: string;
  totalDowntimeMinutes: string;
  topDowntimeReasons: string;
  topDefects: string;
  customerComplaints: string;
  safetyConcerns: string;
  maintenanceConcerns: string;
  trainingCompleted: string;
  openCorrectiveActions: string;
  winsForWeek: string;
  prioritiesForNextWeek: string;
  updatedAt: string;
};

type ReportForm = Omit<WeeklyReport, "id" | "updatedAt">;

type Field = {
  key: keyof ReportForm;
  label: string;
  type?: "text" | "date" | "number" | "textarea";
  placeholder?: string;
  required?: boolean;
};

const storageKey = "molding-mentor-weekly-management-reports";

const createEmptyReport = (): ReportForm => ({
  weekStartingDate: new Date().toISOString().slice(0, 10),
  supervisorName: "",
  totalPartsProduced: "",
  totalGoodParts: "",
  totalScrapParts: "",
  totalDowntimeMinutes: "",
  topDowntimeReasons: "",
  topDefects: "",
  customerComplaints: "",
  safetyConcerns: "",
  maintenanceConcerns: "",
  trainingCompleted: "",
  openCorrectiveActions: "",
  winsForWeek: "",
  prioritiesForNextWeek: "",
});

const fields: Field[] = [
  { key: "weekStartingDate", label: "Week starting date", type: "date", required: true },
  { key: "supervisorName", label: "Supervisor / manager name", placeholder: "Dana Lopez", required: true },
  { key: "totalPartsProduced", label: "Total parts produced", type: "number", placeholder: "125000", required: true },
  { key: "totalGoodParts", label: "Total good parts", type: "number", placeholder: "122500", required: true },
  { key: "totalScrapParts", label: "Total scrap parts", type: "number", placeholder: "2500", required: true },
  { key: "totalDowntimeMinutes", label: "Total downtime minutes", type: "number", placeholder: "315", required: true },
  { key: "topDowntimeReasons", label: "Top 3 downtime reasons", type: "textarea", placeholder: "1. Mold maintenance - 120 min\n2. Material change - 85 min\n3. Robot fault - 60 min" },
  { key: "topDefects", label: "Top 3 defects", type: "textarea", placeholder: "1. Flash\n2. Short shots\n3. Splay" },
  { key: "customerComplaints", label: "Customer complaints", type: "textarea", placeholder: "Complaint count, customer, part number, and status" },
  { key: "safetyConcerns", label: "Safety concerns", type: "textarea", placeholder: "Near misses, unsafe conditions, PPE issues, or no concerns" },
  { key: "maintenanceConcerns", label: "Maintenance concerns", type: "textarea", placeholder: "Press, mold, dryer, robot, grinder, or facility concerns" },
  { key: "trainingCompleted", label: "Training completed", type: "textarea", placeholder: "Employees, modules, certifications, and cross-training completed" },
  { key: "openCorrectiveActions", label: "Open corrective actions", type: "textarea", placeholder: "Owner, action, due date, and current status" },
  { key: "winsForWeek", label: "Wins for the week", type: "textarea", placeholder: "Output records, scrap reduction, audit wins, teamwork, or customer wins" },
  { key: "prioritiesForNextWeek", label: "Priorities for next week", type: "textarea", placeholder: "Top actions, production risks, training focus, maintenance priorities" },
];

function toCount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function calculateScrapPercentage(totalProduced: string, totalScrap: string) {
  const produced = toCount(totalProduced);
  const scrap = toCount(totalScrap);
  if (!produced) return "0.00";
  return ((scrap / produced) * 100).toFixed(2);
}

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function printReport() {
  window.print();
}

export default function WeeklyManagementReportPage() {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [form, setForm] = useState<ReportForm>(createEmptyReport);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedReports = window.localStorage.getItem(storageKey);
    if (storedReports) {
      setReports(JSON.parse(storedReports) as WeeklyReport[]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(reports));
    }
  }, [reports, isLoaded]);

  const sortedReports = useMemo(
    () => [...reports].sort((a, b) => `${b.weekStartingDate}-${b.updatedAt}`.localeCompare(`${a.weekStartingDate}-${a.updatedAt}`)),
    [reports],
  );

  const scrapPercentage = calculateScrapPercentage(form.totalPartsProduced, form.totalScrapParts);
  const totalReports = reports.length;
  const latestReport = sortedReports[0];

  function resetForm() {
    setForm(createEmptyReport());
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

  function editReport(report: WeeklyReport) {
    setForm({
      weekStartingDate: report.weekStartingDate,
      supervisorName: report.supervisorName,
      totalPartsProduced: report.totalPartsProduced,
      totalGoodParts: report.totalGoodParts,
      totalScrapParts: report.totalScrapParts,
      totalDowntimeMinutes: report.totalDowntimeMinutes,
      topDowntimeReasons: report.topDowntimeReasons,
      topDefects: report.topDefects,
      customerComplaints: report.customerComplaints,
      safetyConcerns: report.safetyConcerns,
      maintenanceConcerns: report.maintenanceConcerns,
      trainingCompleted: report.trainingCompleted,
      openCorrectiveActions: report.openCorrectiveActions,
      winsForWeek: report.winsForWeek,
      prioritiesForNextWeek: report.prioritiesForNextWeek,
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
        <header className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:rounded-none print:border-slate-300 print:bg-white print:p-4 print:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_32%)] print:hidden" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Reports</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Weekly Management Report</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
              Create a weekly production, quality, safety, training, and action-plan summary. Reports are saved to this browser and can be edited, deleted, or printed.
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3 print:hidden" aria-label="Weekly report overview">
          <article className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5 shadow-xl shadow-cyan-950/20">
            <p className="text-4xl font-black text-white">{totalReports}</p>
            <h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Saved reports</h2>
            <p className="mt-2 text-sm text-slate-300">Stored locally in this browser</p>
          </article>
          <article className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-emerald-950/20">
            <p className="text-4xl font-black text-white">{scrapPercentage}%</p>
            <h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-100">Scrap percentage</h2>
            <p className="mt-2 text-sm text-slate-300">Auto-calculated from current form totals</p>
          </article>
          <article className="rounded-[1.5rem] border border-violet-300/20 bg-violet-300/10 p-5 shadow-xl shadow-violet-950/20">
            <p className="text-2xl font-black text-white">{latestReport ? formatDate(latestReport.weekStartingDate) : "No reports"}</p>
            <h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-violet-100">Latest week</h2>
            <p className="mt-2 text-sm text-slate-300">Most recent saved weekly report</p>
          </article>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-7 print:hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">{editingId ? "Edit report" : "Create report"}</p>
              <h2 className="mt-2 text-2xl font-black text-white">Weekly summary inputs</h2>
            </div>
            <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">
              Scrap percentage: {scrapPercentage}%
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                <span className="text-sm font-bold text-slate-200">{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    value={form[field.key]}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10"
                  />
                ) : (
                  <input
                    value={form[field.key]}
                    onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                    placeholder={field.placeholder}
                    required={field.required}
                    type={field.type ?? "text"}
                    min={field.type === "number" ? "0" : undefined}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10"
                  />
                )}
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200">
              {editingId ? "Save report changes" : "Create weekly report"}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10">
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        <section className="space-y-4" aria-label="Saved weekly reports">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Saved reports</p>
              <h2 className="mt-2 text-2xl font-black text-white">Weekly report history</h2>
            </div>
            <button type="button" onClick={printReport} className="rounded-2xl border border-cyan-300/30 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/10">
              Print weekly reports
            </button>
          </div>

          {sortedReports.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.04] p-6 text-sm text-slate-300 print:hidden">
              No weekly reports saved yet. Complete the form above to create your first management report.
            </div>
          ) : (
            sortedReports.map((report) => {
              const savedScrapPercentage = calculateScrapPercentage(report.totalPartsProduced, report.totalScrapParts);
              const summaryItems = [
                ["Total produced", report.totalPartsProduced || "0"],
                ["Good parts", report.totalGoodParts || "0"],
                ["Scrap parts", report.totalScrapParts || "0"],
                ["Scrap %", `${savedScrapPercentage}%`],
                ["Downtime minutes", report.totalDowntimeMinutes || "0"],
              ];
              const narrativeItems = [
                ["Top 3 downtime reasons", report.topDowntimeReasons],
                ["Top 3 defects", report.topDefects],
                ["Customer complaints", report.customerComplaints],
                ["Safety concerns", report.safetyConcerns],
                ["Maintenance concerns", report.maintenanceConcerns],
                ["Training completed", report.trainingCompleted],
                ["Open corrective actions", report.openCorrectiveActions],
                ["Wins for the week", report.winsForWeek],
                ["Priorities for next week", report.prioritiesForNextWeek],
              ];

              return (
                <article key={report.id} className="break-inside-avoid rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:rounded-none print:border-slate-300 print:bg-white print:p-4 print:shadow-none">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300 print:text-slate-600">Week of {formatDate(report.weekStartingDate)}</p>
                      <h3 className="mt-2 text-2xl font-black text-white print:text-slate-950">{report.supervisorName || "Unnamed supervisor"}</h3>
                      <p className="mt-1 text-xs text-slate-400 print:text-slate-600">Last updated {new Date(report.updatedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 print:hidden">
                      <button type="button" onClick={() => editReport(report)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10">Edit</button>
                      <button type="button" onClick={() => deleteReport(report.id)} className="rounded-xl border border-rose-300/30 px-4 py-2 text-sm font-bold text-rose-100 hover:bg-rose-300/10">Delete</button>
                    </div>
                  </div>

                  <dl className="mt-5 grid gap-3 sm:grid-cols-5">
                    {summaryItems.map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 print:border-slate-200 print:bg-slate-50">
                        <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">{label}</dt>
                        <dd className="mt-2 text-xl font-black text-white print:text-slate-950">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {narrativeItems.map(([label, value]) => (
                      <section key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 print:border-slate-200 print:bg-white">
                        <h4 className="text-sm font-black text-cyan-100 print:text-slate-950">{label}</h4>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300 print:text-slate-700">{value || "None reported"}</p>
                      </section>
                    ))}
                  </div>
                </article>
              );
            })
          )}
        </section>
      </section>
    </main>
  );
}
