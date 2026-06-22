"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type InspectionReport = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  shift: string;
  customer: string;
  partNumber: string;
  moldNumber: string;
  machineNumber: string;
  material: string;
  inspectorName: string;
  partWeight: string;
  visualInspectionResult: string;
  criticalDimensionChecks: string;
  defectsFound: string;
  approvalStatus: string;
  notes: string;
};

type Field = {
  name: keyof InspectionReport;
  label: string;
  placeholder?: string;
  type?: "date" | "select" | "textarea";
  options?: string[];
};

type Section = {
  title: string;
  description: string;
  fields: Field[];
};

const STORAGE_KEY = "molding-mentor-first-article-reports";

const blankReport: InspectionReport = {
  id: "",
  createdAt: "",
  updatedAt: "",
  date: "",
  shift: "",
  customer: "",
  partNumber: "",
  moldNumber: "",
  machineNumber: "",
  material: "",
  inspectorName: "",
  partWeight: "",
  visualInspectionResult: "",
  criticalDimensionChecks: "",
  defectsFound: "",
  approvalStatus: "Pending review",
  notes: "",
};

const sections: Section[] = [
  {
    title: "Report details",
    description: "Capture the production context for the first article approval record.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "shift", label: "Shift", type: "select", options: ["", "1st", "2nd", "3rd", "Weekend", "Other"] },
      { name: "customer", label: "Customer", placeholder: "Acme Medical" },
      { name: "partNumber", label: "Part number", placeholder: "PN-1048-A" },
      { name: "moldNumber", label: "Mold number", placeholder: "M-22" },
      { name: "machineNumber", label: "Machine number", placeholder: "Press 07" },
      { name: "material", label: "Material", placeholder: "PC/ABS, natural" },
      { name: "inspectorName", label: "Inspector name", placeholder: "J. Rivera" },
    ],
  },
  {
    title: "Inspection results",
    description: "Document measured, visual, and defect findings before approving the run.",
    fields: [
      { name: "partWeight", label: "Part weight", placeholder: "24.6 g" },
      {
        name: "visualInspectionResult",
        label: "Visual inspection result",
        type: "select",
        options: ["", "Pass", "Pass with notes", "Fail", "Hold for review"],
      },
      {
        name: "criticalDimensionChecks",
        label: "Critical dimension checks",
        placeholder: "Bore ID 12.70 mm / spec 12.65-12.75 mm / PASS",
        type: "textarea",
      },
      {
        name: "defectsFound",
        label: "Defects found",
        placeholder: "None observed, or list flash/splay/sinks/short shots with location and quantity.",
        type: "textarea",
      },
      {
        name: "approvalStatus",
        label: "Approval status",
        type: "select",
        options: ["Pending review", "Approved", "Rejected", "Conditional approval", "Quality hold"],
      },
      { name: "notes", label: "Notes", placeholder: "Containment actions, sample quantity, customer-specific requirements, or sign-off notes.", type: "textarea" },
    ],
  },
];

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function FirstArticleInspectionPage() {
  const [report, setReport] = useState<InspectionReport>(blankReport);
  const [savedReports, setSavedReports] = useState<InspectionReport[]>([]);
  const [status, setStatus] = useState("Draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedReports(JSON.parse(saved) as InspectionReport[]);
  }, []);

  const reportTitle = useMemo(
    () => report.partNumber || report.moldNumber || report.customer || "Untitled first article report",
    [report.customer, report.moldNumber, report.partNumber],
  );

  function updateField(name: keyof InspectionReport, value: string) {
    setReport((current) => ({ ...current, [name]: value }));
  }

  function persist(nextReport: InspectionReport, nextReports: InspectionReport[]) {
    setReport(nextReport);
    setSavedReports(nextReports);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
  }

  function saveReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const nextReport = {
      ...report,
      id: report.id || crypto.randomUUID(),
      createdAt: report.createdAt || timestamp,
      updatedAt: timestamp,
    };
    const nextReports = [nextReport, ...savedReports.filter((saved) => saved.id !== nextReport.id)];
    persist(nextReport, nextReports);
    setStatus(`Saved ${reportTitle}`);
  }

  function editReport(savedReport: InspectionReport) {
    setReport(savedReport);
    setStatus(`Editing ${savedReport.partNumber || savedReport.moldNumber || "saved report"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteReport(reportId: string) {
    const nextReports = savedReports.filter((saved) => saved.id !== reportId);
    setSavedReports(nextReports);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
    if (report.id === reportId) setReport(blankReport);
    setStatus("Deleted saved report");
  }

  function startNewReport() {
    setReport(blankReport);
    setStatus("New draft ready");
  }

  function printReport() {
    setStatus("Opening print-friendly view");
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:p-0 print:shadow-none sm:p-8">
          <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:mt-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Quality tools</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">First Article Inspection Report</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create, save, edit, delete, and print first article reports from a mobile-first dark workspace.</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100 print:hidden">{status}</div>
          </div>
        </header>

        <form onSubmit={saveReport} className="grid gap-5 lg:grid-cols-[1fr_22rem] print:block">
          <div className="space-y-5">
            {sections.map((section) => (
              <section key={section.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 print:mb-4 print:break-inside-avoid print:border-slate-300 print:bg-white print:p-4 print:shadow-none sm:p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-white print:text-slate-950">{section.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400 print:text-slate-600">{section.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <label key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                      <span className="text-sm font-semibold text-slate-200 print:text-slate-700">{field.label}</span>
                      {field.type === "textarea" ? (
                        <textarea value={String(report[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:min-h-20 print:border-slate-300 print:bg-white print:text-slate-950" />
                      ) : field.type === "select" ? (
                        <select value={String(report[field.name])} onChange={(event) => updateField(field.name, event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950">
                          {field.options?.map((option) => <option key={option} value={option}>{option || "Select..."}</option>)}
                        </select>
                      ) : (
                        <input type={field.type || "text"} value={String(report[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 print:hidden">
            <section className="sticky top-4 rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current report</p>
              <h2 className="mt-3 text-2xl font-black text-white">{reportTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Last saved: {formatDateTime(report.updatedAt)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save report</button>
                <button type="button" onClick={startNewReport} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New report</button>
                <button type="button" onClick={printReport} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print-friendly view</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved reports</h2>
              <div className="mt-4 space-y-3">
                {savedReports.length === 0 ? <p className="text-sm text-slate-400">Saved first article reports will appear here for quick review and editing.</p> : null}
                {savedReports.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editReport(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.partNumber || saved.moldNumber || "Untitled report"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.customer || "No customer"} • {saved.approvalStatus} • {formatDateTime(saved.updatedAt)}</span>
                    </button>
                    <button type="button" onClick={() => deleteReport(saved.id)} className="mt-3 rounded-xl border border-rose-300/30 px-3 py-2 text-sm font-bold text-rose-200 transition hover:bg-rose-300/10">Delete</button>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </form>
      </section>
    </main>
  );
}
