"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type SupplierIssueStatus = "Open" | "Waiting on Supplier" | "In Review" | "Closed";

type SupplierIssue = {
  id: string;
  createdAt: string;
  updatedAt: string;
  dateOpened: string;
  supplierName: string;
  materialOrComponent: string;
  lotNumber: string;
  poNumber: string;
  issueDescription: string;
  defectCategory: string;
  quantityAffected: string;
  containmentAction: string;
  supplierContact: string;
  correctiveActionRequested: string;
  dueDate: string;
  status: SupplierIssueStatus;
  verificationNotes: string;
};

type Field = {
  name: keyof SupplierIssue;
  label: string;
  placeholder?: string;
  type?: "date" | "number" | "select" | "textarea";
  options?: string[];
};

type Section = {
  title: string;
  description: string;
  fields: Field[];
};

const STORAGE_KEY = "molding-mentor-supplier-quality-issues";
const statusOptions: SupplierIssueStatus[] = ["Open", "Waiting on Supplier", "In Review", "Closed"];

const blankIssue: SupplierIssue = {
  id: "",
  createdAt: "",
  updatedAt: "",
  dateOpened: "",
  supplierName: "",
  materialOrComponent: "",
  lotNumber: "",
  poNumber: "",
  issueDescription: "",
  defectCategory: "",
  quantityAffected: "",
  containmentAction: "",
  supplierContact: "",
  correctiveActionRequested: "",
  dueDate: "",
  status: "Open",
  verificationNotes: "",
};

const sections: Section[] = [
  {
    title: "Supplier and material details",
    description: "Identify the supplier, purchased material or component, lot, purchase order, and date the issue was opened.",
    fields: [
      { name: "dateOpened", label: "Date opened", type: "date" },
      { name: "supplierName", label: "Supplier name", placeholder: "Acme Resin Supply" },
      { name: "materialOrComponent", label: "Material or component", placeholder: "PP resin, insert, colorant, packaging..." },
      { name: "lotNumber", label: "Lot number", placeholder: "LOT-2406-18" },
      { name: "poNumber", label: "PO number", placeholder: "PO-10482" },
      { name: "supplierContact", label: "Supplier contact", placeholder: "Name, email, phone" },
    ],
  },
  {
    title: "Issue and containment",
    description: "Capture the defect, affected quantity, and immediate containment to protect production and customers.",
    fields: [
      {
        name: "issueDescription",
        label: "Issue description",
        placeholder: "Describe the nonconformance, discovery point, evidence, suspect shipment, and production/customer risk.",
        type: "textarea",
      },
      { name: "defectCategory", label: "Defect category", placeholder: "Contamination, wrong material, dimensions, packaging, COA mismatch..." },
      { name: "quantityAffected", label: "Quantity affected", placeholder: "500", type: "number" },
      {
        name: "containmentAction",
        label: "Containment action",
        placeholder: "Quarantined inventory, stopped use, sorted lots, notified production, and protected customer shipments.",
        type: "textarea",
      },
    ],
  },
  {
    title: "Supplier response and verification",
    description: "Track requested corrective action, due date, current status, and effectiveness verification notes.",
    fields: [
      {
        name: "correctiveActionRequested",
        label: "Corrective action requested",
        placeholder: "Request 8D, replacement material, credit, sort certification, process correction, or updated COA.",
        type: "textarea",
      },
      { name: "dueDate", label: "Due date", type: "date" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
      {
        name: "verificationNotes",
        label: "Verification notes",
        placeholder: "Record supplier response review, replacement lot results, receiving inspection, trial outcome, and closure evidence.",
        type: "textarea",
      },
    ],
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

function isOverdue(issue: SupplierIssue) {
  if (!issue.dueDate || issue.status === "Closed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${issue.dueDate}T00:00:00`) < today;
}

export default function SupplierIssueTrackerPage() {
  const [issue, setIssue] = useState<SupplierIssue>(blankIssue);
  const [savedIssues, setSavedIssues] = useState<SupplierIssue[]>([]);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | SupplierIssueStatus>("All");
  const [materialFilter, setMaterialFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState("Supplier issue draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedIssues(JSON.parse(saved) as SupplierIssue[]);
  }, []);

  const issueTitle = useMemo(
    () => issue.supplierName || issue.materialOrComponent || issue.defectCategory || "Untitled supplier issue",
    [issue.defectCategory, issue.materialOrComponent, issue.supplierName],
  );

  const filteredIssues = useMemo(
    () => savedIssues.filter((saved) => {
      const matchesSupplier = saved.supplierName.toLowerCase().includes(supplierFilter.toLowerCase().trim());
      const matchesStatus = statusFilter === "All" || saved.status === statusFilter;
      const matchesMaterial = saved.materialOrComponent.toLowerCase().includes(materialFilter.toLowerCase().trim());
      const matchesDueDate = !dueDateFilter || saved.dueDate === dueDateFilter;
      return matchesSupplier && matchesStatus && matchesMaterial && matchesDueDate;
    }),
    [dueDateFilter, materialFilter, savedIssues, statusFilter, supplierFilter],
  );

  const counts = useMemo(
    () => ({
      open: savedIssues.filter((saved) => saved.status !== "Closed").length,
      overdue: savedIssues.filter(isOverdue).length,
      closed: savedIssues.filter((saved) => saved.status === "Closed").length,
    }),
    [savedIssues],
  );

  function updateField(name: keyof SupplierIssue, value: string) {
    setIssue((current) => ({ ...current, [name]: value }));
  }

  function persist(nextIssue: SupplierIssue, nextIssues: SupplierIssue[]) {
    setIssue(nextIssue);
    setSavedIssues(nextIssues);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIssues));
  }

  function saveIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const nextIssue = {
      ...issue,
      id: issue.id || crypto.randomUUID(),
      createdAt: issue.createdAt || timestamp,
      updatedAt: timestamp,
    };
    const nextIssues = [nextIssue, ...savedIssues.filter((saved) => saved.id !== nextIssue.id)];
    persist(nextIssue, nextIssues);
    setStatusMessage(`Saved ${issueTitle}`);
  }

  function editIssue(savedIssue: SupplierIssue) {
    setIssue(savedIssue);
    setStatusMessage(`Editing ${savedIssue.supplierName || savedIssue.materialOrComponent || "supplier issue"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteIssue(issueId: string) {
    const nextIssues = savedIssues.filter((saved) => saved.id !== issueId);
    setSavedIssues(nextIssues);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIssues));
    if (issue.id === issueId) setIssue(blankIssue);
    setStatusMessage("Deleted supplier issue");
  }

  function startNewIssue() {
    setIssue(blankIssue);
    setStatusMessage("New supplier issue draft ready");
  }

  function printReport() {
    setStatusMessage("Opening supplier issue print report");
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
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Supplier Quality Issue Tracker</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create supplier quality records, save them in this browser, filter supplier response work, and print a clean supplier issue report.</p>
            </div>
            <div className="grid gap-3 sm:min-w-64 print:hidden">
              <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">{statusMessage}</div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3"><p className="text-2xl font-black text-white">{counts.open}</p><p className="mt-1 font-bold text-slate-300">Open</p></div>
                <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-2 py-3"><p className="text-2xl font-black text-rose-100">{counts.overdue}</p><p className="mt-1 font-bold text-rose-100">Overdue</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3"><p className="text-2xl font-black text-white">{counts.closed}</p><p className="mt-1 font-bold text-slate-300">Closed</p></div>
              </div>
            </div>
          </div>
        </header>

        <form onSubmit={saveIssue} className="grid gap-5 lg:grid-cols-[1fr_22rem] print:block">
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
                        <textarea value={String(issue[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:min-h-20 print:border-slate-300 print:bg-white print:text-slate-950" />
                      ) : field.type === "select" ? (
                        <select value={String(issue[field.name])} onChange={(event) => updateField(field.name, event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950">
                          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input type={field.type || "text"} value={String(issue[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 print:hidden">
            <section className="sticky top-4 rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current supplier issue</p>
              <h2 className="mt-3 text-2xl font-black text-white">{issueTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Opened: {formatDate(issue.dateOpened)}</p>
              <p className="mt-1 text-sm text-slate-400">Due: {formatDate(issue.dueDate)}</p>
              <p className="mt-1 text-sm text-slate-400">Last saved: {formatDateTime(issue.updatedAt)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save supplier issue</button>
                <button type="button" onClick={startNewIssue} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New issue</button>
                <button type="button" onClick={printReport} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print supplier report</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved supplier issues</h2>
              <p className="mt-1 text-xs text-slate-400">Showing {filteredIssues.length} of {savedIssues.length}</p>
              <div className="mt-4 grid gap-3">
                <input value={supplierFilter} onChange={(event) => setSupplierFilter(event.target.value)} placeholder="Filter by supplier" className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | SupplierIssueStatus)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm font-bold text-white outline-none focus:border-cyan-300">
                  <option value="All">All status</option>
                  {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <input value={materialFilter} onChange={(event) => setMaterialFilter(event.target.value)} placeholder="Filter by material" className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
                <input type="date" value={dueDateFilter} onChange={(event) => setDueDateFilter(event.target.value)} aria-label="Filter by due date" className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
              </div>
              <div className="mt-4 space-y-3">
                {filteredIssues.length === 0 ? <p className="text-sm text-slate-400">Saved supplier quality issues will appear here for review, filtering, editing, deletion, and print preparation.</p> : null}
                {filteredIssues.map((saved) => (
                  <article key={saved.id} className={`rounded-2xl border p-4 ${isOverdue(saved) ? "border-rose-300/30 bg-rose-300/10" : "border-white/10 bg-slate-950/60"}`}>
                    <button type="button" onClick={() => editIssue(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.supplierName || saved.materialOrComponent || "Untitled supplier issue"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.materialOrComponent || "No material"} • {saved.status} • Due {formatDate(saved.dueDate)}</span>
                      <span className="mt-1 block text-xs text-slate-500">Lot {saved.lotNumber || "not set"} • PO {saved.poNumber || "not set"}</span>
                      <span className="mt-1 block text-xs text-slate-500">Updated {formatDateTime(saved.updatedAt)}</span>
                    </button>
                    <button type="button" onClick={() => deleteIssue(saved.id)} className="mt-3 rounded-xl border border-rose-300/30 px-3 py-2 text-sm font-bold text-rose-200 transition hover:bg-rose-300/10">Delete</button>
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
