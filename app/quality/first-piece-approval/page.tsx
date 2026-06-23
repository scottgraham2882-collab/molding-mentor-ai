"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ApprovalStatus = "Pending" | "Approved" | "Rejected";

type FirstPieceApproval = {
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
  operatorName: string;
  processTechnicianName: string;
  qualityInspectorName: string;
  partWeight: string;
  visualInspectionResult: string;
  criticalDimensions: string;
  packagingVerification: string;
  defectsFound: string;
  approvalStatus: ApprovalStatus;
  rejectionReason: string;
  notes: string;
};

type Field = {
  name: keyof FirstPieceApproval;
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

const STORAGE_KEY = "molding-mentor-first-piece-approvals";

const blankApproval: FirstPieceApproval = {
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
  operatorName: "",
  processTechnicianName: "",
  qualityInspectorName: "",
  partWeight: "",
  visualInspectionResult: "",
  criticalDimensions: "",
  packagingVerification: "",
  defectsFound: "",
  approvalStatus: "Pending",
  rejectionReason: "",
  notes: "",
};

const sections: Section[] = [
  {
    title: "Production details",
    description: "Capture the job, machine, material, and team members responsible for the first-piece decision.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "shift", label: "Shift", type: "select", options: ["", "1st", "2nd", "3rd", "Weekend", "Other"] },
      { name: "customer", label: "Customer", placeholder: "Acme Medical" },
      { name: "partNumber", label: "Part number", placeholder: "PN-1048-A" },
      { name: "moldNumber", label: "Mold number", placeholder: "M-22" },
      { name: "machineNumber", label: "Machine number", placeholder: "Press 07" },
      { name: "material", label: "Material", placeholder: "PP 20% talc, black" },
      { name: "operatorName", label: "Operator name", placeholder: "A. Smith" },
      { name: "processTechnicianName", label: "Process technician name", placeholder: "J. Rivera" },
      { name: "qualityInspectorName", label: "Quality inspector name", placeholder: "M. Chen" },
    ],
  },
  {
    title: "First-piece checks",
    description: "Record measured, visual, packaging, and defect findings before releasing production.",
    fields: [
      { name: "partWeight", label: "Part weight", placeholder: "24.6 g" },
      { name: "visualInspectionResult", label: "Visual inspection result", type: "select", options: ["", "Pass", "Pass with notes", "Fail", "Hold for review"] },
      { name: "criticalDimensions", label: "Critical dimensions", placeholder: "Bore ID 12.70 mm / spec 12.65-12.75 mm / PASS", type: "textarea" },
      { name: "packagingVerification", label: "Packaging verification", placeholder: "Label, quantity, bag/box, lot/date code, customer-specific packaging verified.", type: "textarea" },
      { name: "defectsFound", label: "Defects found", placeholder: "None observed, or list flash/splay/sinks/short shots with location and quantity.", type: "textarea" },
    ],
  },
  {
    title: "Approval decision",
    description: "Set the disposition and document rejection reason or release notes.",
    fields: [
      { name: "approvalStatus", label: "Approval status", type: "select", options: ["Pending", "Approved", "Rejected"] },
      { name: "rejectionReason", label: "Rejection reason", placeholder: "Required when rejected: describe nonconformance and required correction.", type: "textarea" },
      { name: "notes", label: "Notes", placeholder: "Sample quantity, containment actions, setup changes, customer requirements, or sign-off notes.", type: "textarea" },
    ],
  },
];

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function matchesFilter(value: string, filter: string) {
  return value.toLowerCase().includes(filter.trim().toLowerCase());
}

export default function FirstPieceApprovalPage() {
  const [approval, setApproval] = useState<FirstPieceApproval>(blankApproval);
  const [savedApprovals, setSavedApprovals] = useState<FirstPieceApproval[]>([]);
  const [statusMessage, setStatusMessage] = useState("Draft ready");
  const [filters, setFilters] = useState({ status: "", partNumber: "", moldNumber: "", machineNumber: "", date: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedApprovals(JSON.parse(saved) as FirstPieceApproval[]);
  }, []);

  const approvalTitle = useMemo(
    () => approval.partNumber || approval.moldNumber || approval.customer || "Untitled first piece approval",
    [approval.customer, approval.moldNumber, approval.partNumber],
  );

  const filteredApprovals = useMemo(
    () =>
      savedApprovals.filter(
        (saved) =>
          (!filters.status || saved.approvalStatus === filters.status) &&
          matchesFilter(saved.partNumber, filters.partNumber) &&
          matchesFilter(saved.moldNumber, filters.moldNumber) &&
          matchesFilter(saved.machineNumber, filters.machineNumber) &&
          matchesFilter(saved.date, filters.date),
      ),
    [filters, savedApprovals],
  );

  function updateField(name: keyof FirstPieceApproval, value: string) {
    setApproval((current) => ({ ...current, [name]: value }));
  }

  function persist(nextApproval: FirstPieceApproval, nextApprovals: FirstPieceApproval[]) {
    setApproval(nextApproval);
    setSavedApprovals(nextApprovals);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextApprovals));
  }

  function saveApproval(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const nextApproval = {
      ...approval,
      id: approval.id || crypto.randomUUID(),
      createdAt: approval.createdAt || timestamp,
      updatedAt: timestamp,
    };
    const nextApprovals = [nextApproval, ...savedApprovals.filter((saved) => saved.id !== nextApproval.id)];
    persist(nextApproval, nextApprovals);
    setStatusMessage(`Saved ${approvalTitle}`);
  }

  function editApproval(savedApproval: FirstPieceApproval) {
    setApproval(savedApproval);
    setStatusMessage(`Editing ${savedApproval.partNumber || savedApproval.moldNumber || "saved approval"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteApproval(approvalId: string) {
    const nextApprovals = savedApprovals.filter((saved) => saved.id !== approvalId);
    setSavedApprovals(nextApprovals);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextApprovals));
    if (approval.id === approvalId) setApproval(blankApproval);
    setStatusMessage("Deleted saved approval");
  }

  function startNewApproval() {
    setApproval(blankApproval);
    setStatusMessage("New draft ready");
  }

  function printApproval() {
    setStatusMessage("Opening print-friendly approval report");
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
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Digital First Piece Approval</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create, save, review, edit, delete, filter, and print first-piece approvals from a mobile-first dark workspace.</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100 print:hidden">{statusMessage}</div>
          </div>
        </header>

        <form onSubmit={saveApproval} className="grid gap-5 lg:grid-cols-[1fr_24rem] print:block">
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
                        <textarea value={String(approval[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:min-h-20 print:border-slate-300 print:bg-white print:text-slate-950" />
                      ) : field.type === "select" ? (
                        <select value={String(approval[field.name])} onChange={(event) => updateField(field.name, event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950">
                          {field.options?.map((option) => <option key={option} value={option}>{option || "Select..."}</option>)}
                        </select>
                      ) : (
                        <input type={field.type || "text"} value={String(approval[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 print:hidden">
            <section className="sticky top-4 rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current approval</p>
              <h2 className="mt-3 text-2xl font-black text-white">{approvalTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Last saved: {formatDateTime(approval.updatedAt)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save approval</button>
                <button type="button" onClick={startNewApproval} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New approval</button>
                <button type="button" onClick={printApproval} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print-friendly report</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved approvals</h2>
              <div className="mt-4 grid gap-3">
                <select aria-label="Filter by approval status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300">
                  <option value="">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {(["partNumber", "moldNumber", "machineNumber", "date"] as const).map((key) => (
                  <input key={key} type={key === "date" ? "date" : "text"} aria-label={`Filter by ${key}`} value={filters[key]} onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))} placeholder={`Filter by ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {filteredApprovals.length === 0 ? <p className="text-sm text-slate-400">Saved first-piece approvals matching the filters will appear here for review and editing.</p> : null}
                {filteredApprovals.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editApproval(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.partNumber || saved.moldNumber || "Untitled approval"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.customer || "No customer"} • {saved.approvalStatus} • Mold {saved.moldNumber || "—"} • Machine {saved.machineNumber || "—"}</span>
                      <span className="mt-1 block text-xs text-slate-500">{saved.date || "No date"} • Updated {formatDateTime(saved.updatedAt)}</span>
                    </button>
                    <button type="button" onClick={() => deleteApproval(saved.id)} className="mt-3 rounded-xl border border-rose-300/30 px-3 py-2 text-sm font-bold text-rose-200 transition hover:bg-rose-300/10">Delete</button>
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
