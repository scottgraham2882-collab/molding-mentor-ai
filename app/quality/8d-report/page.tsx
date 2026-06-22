"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type EightDStatus = "Open" | "In Progress" | "Pending Verification" | "Closed";

type EightDReport = {
  id: string;
  createdAt: string;
  updatedAt: string;
  reportDate: string;
  complaintReference: string;
  partNumber: string;
  moldNumber: string;
  machineNumber: string;
  customer: string;
  team: string;
  problemDescription: string;
  interimContainmentAction: string;
  rootCauseAnalysis: string;
  permanentCorrectiveAction: string;
  implementCorrectiveAction: string;
  preventRecurrence: string;
  teamRecognitionClosure: string;
  owner: string;
  dueDate: string;
  status: EightDStatus;
};

type Field = {
  name: keyof EightDReport;
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

const STORAGE_KEY = "molding-mentor-8d-reports";
const statusOptions: EightDStatus[] = ["Open", "In Progress", "Pending Verification", "Closed"];

const blankReport: EightDReport = {
  id: "",
  createdAt: "",
  updatedAt: "",
  reportDate: "",
  complaintReference: "",
  partNumber: "",
  moldNumber: "",
  machineNumber: "",
  customer: "",
  team: "",
  problemDescription: "",
  interimContainmentAction: "",
  rootCauseAnalysis: "",
  permanentCorrectiveAction: "",
  implementCorrectiveAction: "",
  preventRecurrence: "",
  teamRecognitionClosure: "",
  owner: "",
  dueDate: "",
  status: "Open",
};

const sections: Section[] = [
  {
    title: "Report links",
    description: "Connect the 8D to the related complaint, molded part, tool, and press.",
    fields: [
      { name: "reportDate", label: "Report date", type: "date" },
      { name: "complaintReference", label: "Related complaint", placeholder: "Complaint #, NCR, RMA, or customer CAR" },
      { name: "customer", label: "Customer / source", placeholder: "Internal audit, Acme Components, line reject..." },
      { name: "partNumber", label: "Part number", placeholder: "PN-1048-A" },
      { name: "moldNumber", label: "Mold number", placeholder: "M-22" },
      { name: "machineNumber", label: "Machine number", placeholder: "Press 07" },
    ],
  },
  {
    title: "D1: Team",
    description: "List the cross-functional people responsible for investigation, action, verification, and approval.",
    fields: [{ name: "team", label: "Team members and roles", placeholder: "Quality lead, process tech, toolroom, production, material handler, customer contact...", type: "textarea" }],
  },
  {
    title: "D2: Problem Description",
    description: "Use objective facts: what, where, when, how many, detection point, requirement missed, and customer risk.",
    fields: [{ name: "problemDescription", label: "Problem description", placeholder: "Describe the defect, evidence, quantity affected, lot/date range, acceptance criteria, and impact.", type: "textarea" }],
  },
  {
    title: "D3: Interim Containment Action",
    description: "Protect the customer while the root cause is being verified.",
    fields: [{ name: "interimContainmentAction", label: "Containment action", placeholder: "Stop shipment, quarantine stock, 100% sort, add inspection, notify shifts, protect customer inventory...", type: "textarea" }],
  },
  {
    title: "D4: Root Cause Analysis",
    description: "Document verified technical and systemic causes using evidence from process, mold, machine, material, method, or measurement checks.",
    fields: [{ name: "rootCauseAnalysis", label: "Root cause analysis", placeholder: "5-Why, fishbone, process data, setup records, tooling findings, material checks, escape point, and verification evidence.", type: "textarea" }],
  },
  {
    title: "D5: Permanent Corrective Action",
    description: "Select the permanent action that removes the verified cause and define how it will be validated.",
    fields: [{ name: "permanentCorrectiveAction", label: "Permanent corrective action", placeholder: "Tool repair, process window update, fixture/poka-yoke, parameter lock, inspection method, validation sample plan...", type: "textarea" }],
  },
  {
    title: "D6: Implement Corrective Action",
    description: "Record implementation details, owners, timing, and objective evidence that the action was completed.",
    fields: [
      { name: "implementCorrectiveAction", label: "Implementation evidence", placeholder: "Who completed the action, date, changed documents, trial results, approvals, capability data, or first-good verification.", type: "textarea" },
      { name: "owner", label: "Owner", placeholder: "J. Rivera" },
      { name: "dueDate", label: "Due date", type: "date" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
    ],
  },
  {
    title: "D7: Prevent Recurrence",
    description: "Update the system so the same failure cannot return on this or similar molded products.",
    fields: [{ name: "preventRecurrence", label: "Prevention plan", placeholder: "Control plan, PFMEA, setup sheet, training, PM, layered audit, lesson learned, similar mold review...", type: "textarea" }],
  },
  {
    title: "D8: Team Recognition / Closure",
    description: "Close the 8D with effectiveness review, lessons learned, approval notes, and team recognition.",
    fields: [{ name: "teamRecognitionClosure", label: "Closure and recognition", placeholder: "Effectiveness check results, closure approval, customer response, and recognition for contributors.", type: "textarea" }],
  },
];

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

export default function EightDReportPage() {
  const [report, setReport] = useState<EightDReport>(blankReport);
  const [savedReports, setSavedReports] = useState<EightDReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | EightDStatus>("All");
  const [statusMessage, setStatusMessage] = useState("8D draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedReports(JSON.parse(saved) as EightDReport[]);
  }, []);

  const reportTitle = useMemo(
    () => report.complaintReference || report.partNumber || report.problemDescription || "Untitled 8D report",
    [report.complaintReference, report.partNumber, report.problemDescription],
  );

  const filteredReports = useMemo(
    () => savedReports.filter((saved) => statusFilter === "All" || saved.status === statusFilter),
    [savedReports, statusFilter],
  );

  const statusCounts = useMemo(
    () => statusOptions.reduce((counts, option) => ({ ...counts, [option]: savedReports.filter((saved) => saved.status === option).length }), {} as Record<EightDStatus, number>),
    [savedReports],
  );

  function updateField(name: keyof EightDReport, value: string) {
    setReport((current) => ({ ...current, [name]: value }));
  }

  function persist(nextReport: EightDReport, nextReports: EightDReport[]) {
    setReport(nextReport);
    setSavedReports(nextReports);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
  }

  function saveReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const nextReport = { ...report, id: report.id || crypto.randomUUID(), createdAt: report.createdAt || timestamp, updatedAt: timestamp };
    const nextReports = [nextReport, ...savedReports.filter((saved) => saved.id !== nextReport.id)];
    persist(nextReport, nextReports);
    setStatusMessage(`Saved ${reportTitle}`);
  }

  function editReport(savedReport: EightDReport) {
    setReport(savedReport);
    setStatusMessage(`Editing ${savedReport.complaintReference || savedReport.partNumber || "saved 8D"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteReport(reportId: string) {
    const nextReports = savedReports.filter((saved) => saved.id !== reportId);
    setSavedReports(nextReports);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
    if (report.id === reportId) setReport(blankReport);
    setStatusMessage("Deleted saved 8D report");
  }

  function startNewReport() {
    setReport(blankReport);
    setStatusMessage("New 8D draft ready");
  }

  function printReport() {
    setStatusMessage("Opening print-friendly 8D report");
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:p-0 print:shadow-none sm:p-8">
          <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between print:mt-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Quality tools</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">8D Problem Solving Report</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create, save, edit, filter, delete, and print structured 8D reports with linked complaint, part, mold, and machine details.</p>
            </div>
            <div className="grid gap-3 print:hidden lg:min-w-80">
              <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">{statusMessage}</div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4 lg:grid-cols-2">
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

        <form onSubmit={saveReport} className="grid gap-5 print:block">
          {sections.map((section) => (
            <section key={section.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 print:break-inside-avoid print:border-slate-300 print:bg-white print:p-3 sm:p-6">
              <div className="mb-5">
                <h2 className="text-2xl font-black text-white print:text-lg print:text-slate-950">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300 print:text-slate-700">{section.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <label key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
                    <span className="text-sm font-bold text-slate-200 print:text-slate-800">{field.label}</span>
                    {field.type === "textarea" ? (
                      <textarea value={report[field.name]} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 print:min-h-20 print:border-slate-300 print:bg-white print:text-slate-950" />
                    ) : field.type === "select" ? (
                      <select value={report[field.name]} onChange={(event) => updateField(field.name, event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 print:border-slate-300 print:bg-white print:text-slate-950">
                        {field.options?.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    ) : (
                      <input type={field.type || "text"} value={report[field.name]} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 print:border-slate-300 print:bg-white print:text-slate-950" />
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}

          <div className="sticky bottom-4 z-10 grid gap-3 rounded-[1.5rem] border border-cyan-300/20 bg-slate-900/95 p-3 shadow-2xl shadow-slate-950/50 backdrop-blur print:hidden sm:grid-cols-3">
            <button type="submit" className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950">Save 8D report</button>
            <button type="button" onClick={startNewReport} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-white">New report</button>
            <button type="button" onClick={printReport} className="rounded-2xl border border-emerald-300/40 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-100">Print report</button>
          </div>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 print:hidden sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Saved 8D reports</h2>
              <p className="mt-2 text-sm text-slate-300">Stored in this browser using local storage. Select a status to filter the report list.</p>
            </div>
            <label className="text-sm font-bold text-slate-200">
              Filter by status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | EightDStatus)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300 sm:min-w-56">
                <option>All</option>
                {statusOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-4">
            {filteredReports.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-slate-400">No saved 8D reports match this filter.</p>
            ) : filteredReports.map((saved) => (
              <article key={saved.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">{saved.status}</p>
                    <h3 className="mt-2 text-xl font-black text-white">{saved.complaintReference || saved.partNumber || "Untitled 8D report"}</h3>
                    <p className="mt-2 text-sm text-slate-300">Part {saved.partNumber || "—"} · Mold {saved.moldNumber || "—"} · Machine {saved.machineNumber || "—"} · Due {formatDate(saved.dueDate)}</p>
                    <p className="mt-1 text-xs text-slate-500">Updated {formatDateTime(saved.updatedAt)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:min-w-48">
                    <button type="button" onClick={() => editReport(saved)} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">Edit</button>
                    <button type="button" onClick={() => deleteReport(saved.id)} className="rounded-xl border border-rose-300/40 bg-rose-300/10 px-4 py-2 text-sm font-black text-rose-100">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
