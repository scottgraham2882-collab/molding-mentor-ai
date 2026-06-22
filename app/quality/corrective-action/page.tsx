"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CorrectiveActionStatus = "Open" | "In Progress" | "Closed";

type CorrectiveActionReport = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  customer: string;
  partNumber: string;
  moldNumber: string;
  machineNumber: string;
  problemDescription: string;
  defectType: string;
  containmentAction: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  responsiblePerson: string;
  dueDate: string;
  status: CorrectiveActionStatus;
  verificationNotes: string;
};

type Field = {
  name: keyof CorrectiveActionReport;
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

const STORAGE_KEY = "molding-mentor-corrective-action-reports";
const statusOptions: CorrectiveActionStatus[] = ["Open", "In Progress", "Closed"];

const blankReport: CorrectiveActionReport = {
  id: "",
  createdAt: "",
  updatedAt: "",
  date: "",
  customer: "",
  partNumber: "",
  moldNumber: "",
  machineNumber: "",
  problemDescription: "",
  defectType: "",
  containmentAction: "",
  rootCause: "",
  correctiveAction: "",
  preventiveAction: "",
  responsiblePerson: "",
  dueDate: "",
  status: "Open",
  verificationNotes: "",
};

const sections: Section[] = [
  {
    title: "Issue details",
    description: "Identify the customer impact, affected product, equipment, and defect condition.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "customer", label: "Customer", placeholder: "Acme Medical" },
      { name: "partNumber", label: "Part number", placeholder: "PN-1048-A" },
      { name: "moldNumber", label: "Mold number", placeholder: "M-22" },
      { name: "machineNumber", label: "Machine number", placeholder: "Press 07" },
      { name: "defectType", label: "Defect type", placeholder: "Flash, short shot, splay, contamination..." },
      {
        name: "problemDescription",
        label: "Problem description",
        placeholder: "Describe what failed, where it was found, quantity affected, and customer or internal requirement missed.",
        type: "textarea",
      },
    ],
  },
  {
    title: "Action plan",
    description: "Document containment, root cause, corrective action, and recurrence prevention.",
    fields: [
      {
        name: "containmentAction",
        label: "Containment action",
        placeholder: "Stopped shipment, isolated WIP, started 100% sort, notified customer and production lead.",
        type: "textarea",
      },
      {
        name: "rootCause",
        label: "Root cause",
        placeholder: "Use 5-Why, process evidence, tooling condition, material checks, or setup records to state the confirmed cause.",
        type: "textarea",
      },
      {
        name: "correctiveAction",
        label: "Corrective action",
        placeholder: "Specific action taken to eliminate the confirmed root cause, including process/tooling/document updates.",
        type: "textarea",
      },
      {
        name: "preventiveAction",
        label: "Preventive action",
        placeholder: "Training, audit, poka-yoke, PM, control plan, or lesson learned that prevents recurrence.",
        type: "textarea",
      },
    ],
  },
  {
    title: "Ownership and verification",
    description: "Assign responsibility, due date, status, and objective verification notes before closing.",
    fields: [
      { name: "responsiblePerson", label: "Responsible person", placeholder: "J. Rivera" },
      { name: "dueDate", label: "Due date", type: "date" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
      {
        name: "verificationNotes",
        label: "Verification notes",
        placeholder: "First-good samples, audit results, capability data, customer approval, or follow-up date confirming effectiveness.",
        type: "textarea",
      },
    ],
  },
];

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function dueDateLabel(value: string) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

export default function CorrectiveActionPage() {
  const [report, setReport] = useState<CorrectiveActionReport>(blankReport);
  const [savedReports, setSavedReports] = useState<CorrectiveActionReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | CorrectiveActionStatus>("All");
  const [statusMessage, setStatusMessage] = useState("Draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedReports(JSON.parse(saved) as CorrectiveActionReport[]);
  }, []);

  const reportTitle = useMemo(
    () => report.partNumber || report.customer || report.defectType || "Untitled corrective action report",
    [report.customer, report.defectType, report.partNumber],
  );

  const filteredReports = useMemo(
    () => savedReports.filter((saved) => statusFilter === "All" || saved.status === statusFilter),
    [savedReports, statusFilter],
  );

  const statusCounts = useMemo(
    () => statusOptions.reduce((counts, option) => ({ ...counts, [option]: savedReports.filter((saved) => saved.status === option).length }), {} as Record<CorrectiveActionStatus, number>),
    [savedReports],
  );

  function updateField(name: keyof CorrectiveActionReport, value: string) {
    setReport((current) => ({ ...current, [name]: value }));
  }

  function persist(nextReport: CorrectiveActionReport, nextReports: CorrectiveActionReport[]) {
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
    setStatusMessage(`Saved ${reportTitle}`);
  }

  function editReport(savedReport: CorrectiveActionReport) {
    setReport(savedReport);
    setStatusMessage(`Editing ${savedReport.partNumber || savedReport.customer || "saved report"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteReport(reportId: string) {
    const nextReports = savedReports.filter((saved) => saved.id !== reportId);
    setSavedReports(nextReports);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
    if (report.id === reportId) setReport(blankReport);
    setStatusMessage("Deleted saved corrective action report");
  }

  function startNewReport() {
    setReport(blankReport);
    setStatusMessage("New draft ready");
  }

  function printReport() {
    setStatusMessage("Opening print-friendly view");
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
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Corrective Action / Root Cause Report</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create, save, edit, filter, delete, and print corrective action reports from a mobile-first dark workspace.</p>
            </div>
            <div className="grid gap-3 sm:min-w-56 print:hidden">
              <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">{statusMessage}</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {statusOptions.map((option) => (
                  <div key={option} className="rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3">
                    <p className="text-2xl font-black text-white">{statusCounts[option]}</p>
                    <p className="mt-1 font-bold text-slate-300">{option}</p>
                  </div>
                ))}
              </div>
            </div>
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
                          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
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
              <p className="mt-1 text-sm text-slate-400">Due: {dueDateLabel(report.dueDate)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save report</button>
                <button type="button" onClick={startNewReport} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New report</button>
                <button type="button" onClick={printReport} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print-friendly view</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">Saved reports</h2>
                  <p className="mt-1 text-xs text-slate-400">Showing {filteredReports.length} of {savedReports.length}</p>
                </div>
                <label className="min-w-32">
                  <span className="sr-only">Filter by status</span>
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | CorrectiveActionStatus)} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm font-bold text-white outline-none focus:border-cyan-300">
                    <option value="All">All status</option>
                    {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              <div className="mt-4 space-y-3">
                {filteredReports.length === 0 ? <p className="text-sm text-slate-400">Saved corrective action reports will appear here for quick review, filtering, and editing.</p> : null}
                {filteredReports.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editReport(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.partNumber || saved.customer || "Untitled report"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.customer || "No customer"} • {saved.status} • Due {dueDateLabel(saved.dueDate)}</span>
                      <span className="mt-1 block text-xs text-slate-500">Updated {formatDateTime(saved.updatedAt)}</span>
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
