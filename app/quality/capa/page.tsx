"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CapaStatus = "Open" | "In Progress" | "Verified" | "Closed";

type CapaRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  capaNumber: string;
  dateOpened: string;
  issueDescription: string;
  defectCategory: string;
  rootCause: string;
  immediateContainmentAction: string;
  correctiveAction: string;
  preventiveAction: string;
  assignedOwner: string;
  dueDate: string;
  status: CapaStatus;
  verificationNotes: string;
};

type Field = {
  name: keyof CapaRecord;
  label: string;
  placeholder?: string;
  type?: "date" | "select" | "textarea";
  options?: string[];
};

const STORAGE_KEY = "molding-mentor-capa-records";
const statusOptions: CapaStatus[] = ["Open", "In Progress", "Verified", "Closed"];
const defectCategories = ["Dimensional", "Cosmetic", "Material", "Process", "Tooling", "Assembly", "Packaging", "Documentation", "Customer Complaint", "Other"];

const blankRecord: CapaRecord = {
  id: "",
  createdAt: "",
  updatedAt: "",
  capaNumber: "",
  dateOpened: "",
  issueDescription: "",
  defectCategory: "",
  rootCause: "",
  immediateContainmentAction: "",
  correctiveAction: "",
  preventiveAction: "",
  assignedOwner: "",
  dueDate: "",
  status: "Open",
  verificationNotes: "",
};

const fields: Field[] = [
  { name: "capaNumber", label: "CAPA number", placeholder: "CAPA-2026-001" },
  { name: "dateOpened", label: "Date opened", type: "date" },
  {
    name: "issueDescription",
    label: "Issue description",
    placeholder: "Describe the nonconformance, source, affected product, quantity, and customer or internal requirement.",
    type: "textarea",
  },
  { name: "defectCategory", label: "Defect category", type: "select", options: ["", ...defectCategories] },
  {
    name: "rootCause",
    label: "Root cause",
    placeholder: "State the verified root cause based on evidence, 5-Why, process data, tooling review, or audit findings.",
    type: "textarea",
  },
  {
    name: "immediateContainmentAction",
    label: "Immediate containment action",
    placeholder: "Quarantine, 100% sort, stop shipment, notify production/customer, identify suspect lots, or add temporary inspection.",
    type: "textarea",
  },
  {
    name: "correctiveAction",
    label: "Corrective action",
    placeholder: "Permanent action that removes the confirmed root cause, including owner and completion evidence.",
    type: "textarea",
  },
  {
    name: "preventiveAction",
    label: "Preventive action",
    placeholder: "Systemic action to prevent recurrence: training, audit, control plan, poka-yoke, PM, standard work, or lesson learned.",
    type: "textarea",
  },
  { name: "assignedOwner", label: "Assigned owner", placeholder: "J. Rivera" },
  { name: "dueDate", label: "Due date", type: "date" },
  { name: "status", label: "Status", type: "select", options: statusOptions },
  {
    name: "verificationNotes",
    label: "Verification notes",
    placeholder: "Effectiveness check, audit result, first-good samples, capability data, complaint trend, or closure approval.",
    type: "textarea",
  },
];

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function isOverdue(record: CapaRecord) {
  if (!record.dueDate || record.status === "Closed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${record.dueDate}T00:00:00`) < today;
}

export default function CapaPage() {
  const [record, setRecord] = useState<CapaRecord>(blankRecord);
  const [records, setRecords] = useState<CapaRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | CapaStatus>("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dueDateFilter, setDueDateFilter] = useState("All");
  const [message, setMessage] = useState("CAPA draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setRecords(JSON.parse(saved) as CapaRecord[]);
  }, []);

  const title = record.capaNumber || record.issueDescription || "New CAPA record";
  const ownerOptions = useMemo(() => Array.from(new Set(records.map((item) => item.assignedOwner).filter(Boolean))).sort(), [records]);
  const categoryOptions = useMemo(() => Array.from(new Set(records.map((item) => item.defectCategory).filter(Boolean))).sort(), [records]);

  const dashboard = useMemo(
    () => ({
      open: records.filter((item) => item.status !== "Closed").length,
      overdue: records.filter(isOverdue).length,
      closed: records.filter((item) => item.status === "Closed").length,
    }),
    [records],
  );

  const filteredRecords = useMemo(
    () =>
      records.filter((item) => {
        const dueMatch =
          dueDateFilter === "All" ||
          (dueDateFilter === "Overdue" && isOverdue(item)) ||
          (dueDateFilter === "No due date" && !item.dueDate) ||
          item.dueDate === dueDateFilter;

        return (
          (statusFilter === "All" || item.status === statusFilter) &&
          (ownerFilter === "All" || item.assignedOwner === ownerFilter) &&
          (categoryFilter === "All" || item.defectCategory === categoryFilter) &&
          dueMatch
        );
      }),
    [categoryFilter, dueDateFilter, ownerFilter, records, statusFilter],
  );

  function updateField(name: keyof CapaRecord, value: string) {
    setRecord((current) => ({ ...current, [name]: value }));
  }

  function persist(nextRecord: CapaRecord, nextRecords: CapaRecord[]) {
    setRecord(nextRecord);
    setRecords(nextRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
  }

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const nextRecord = {
      ...record,
      id: record.id || crypto.randomUUID(),
      capaNumber: record.capaNumber || `CAPA-${new Date().getFullYear()}-${String(records.length + 1).padStart(3, "0")}`,
      createdAt: record.createdAt || timestamp,
      updatedAt: timestamp,
    };
    persist(nextRecord, [nextRecord, ...records.filter((item) => item.id !== nextRecord.id)]);
    setMessage(`Saved ${nextRecord.capaNumber}`);
  }

  function editRecord(savedRecord: CapaRecord) {
    setRecord(savedRecord);
    setMessage(`Editing ${savedRecord.capaNumber}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(id: string) {
    const nextRecords = records.filter((item) => item.id !== id);
    setRecords(nextRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    if (record.id === id) setRecord(blankRecord);
    setMessage("Deleted CAPA record");
  }

  function startNewRecord() {
    setRecord(blankRecord);
    setMessage("New CAPA draft ready");
  }

  function printReport() {
    setMessage("Opening print-friendly CAPA report");
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:p-0 print:shadow-none sm:p-8">
          <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end print:mt-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Quality tools</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Corrective Action Tracker (CAPA)</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create CAPA records, save them to browser storage, filter owners and defects, manage overdue work, and print a clean report.</p>
            </div>
            <div className="grid gap-3 print:hidden sm:grid-cols-3 lg:min-w-[28rem]">
              <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3"><p className="text-3xl font-black">{dashboard.open}</p><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Open</p></div>
              <div className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-3"><p className="text-3xl font-black">{dashboard.overdue}</p><p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-100">Overdue</p></div>
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3"><p className="text-3xl font-black">{dashboard.closed}</p><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">Closed</p></div>
            </div>
          </div>
        </header>

        <form onSubmit={saveRecord} className="grid gap-5 xl:grid-cols-[1fr_24rem] print:block">
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 print:border-slate-300 print:bg-white print:p-4 print:shadow-none sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between print:hidden">
              <div><h2 className="text-2xl font-black text-white">CAPA form</h2><p className="mt-1 text-sm text-slate-400">{message}</p></div>
              <div className="flex flex-wrap gap-2"><button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 hover:bg-cyan-200">Save CAPA</button><button type="button" onClick={startNewRecord} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 hover:border-cyan-300/50">New</button><button type="button" onClick={printReport} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 hover:bg-emerald-300/20">Print report</button></div>
            </div>
            <div className="hidden print:block"><h2 className="text-2xl font-black">CAPA Report: {title}</h2><p className="mt-1 text-sm">Last updated {formatDateTime(record.updatedAt)}</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <span className="text-sm font-semibold text-slate-200 print:text-slate-700">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea value={String(record[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                  ) : field.type === "select" ? (
                    <select value={String(record[field.name])} onChange={(event) => updateField(field.name, event.target.value as CapaStatus)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950">
                      {field.options?.map((option) => <option key={option || "blank"} value={option}>{option || "Select category"}</option>)}
                    </select>
                  ) : (
                    <input type={field.type || "text"} value={String(record[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                  )}
                </label>
              ))}
            </div>
          </section>

          <aside className="space-y-5 print:hidden">
            <section className="rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Filters</p>
              <div className="mt-4 grid gap-3">
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | CapaStatus)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-3 text-sm font-bold text-white"><option value="All">All status</option>{statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
                <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-3 text-sm font-bold text-white"><option value="All">All owners</option>{ownerOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-3 text-sm font-bold text-white"><option value="All">All defect categories</option>{categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
                <select value={dueDateFilter} onChange={(event) => setDueDateFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-3 text-sm font-bold text-white"><option value="All">All due dates</option><option value="Overdue">Overdue only</option><option value="No due date">No due date</option>{records.filter((item) => item.dueDate).map((item) => item.dueDate).filter((value, index, array) => array.indexOf(value) === index).sort().map((date) => <option key={date} value={date}>{formatDate(date)}</option>)}</select>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <div><h2 className="text-lg font-bold text-white">Saved CAPAs</h2><p className="mt-1 text-xs text-slate-400">Showing {filteredRecords.length} of {records.length}</p></div>
              <div className="mt-4 space-y-3">
                {filteredRecords.length === 0 ? <p className="text-sm text-slate-400">Saved CAPA records will appear here for review, editing, deletion, and filtering.</p> : null}
                {filteredRecords.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editRecord(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.capaNumber}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.status} • {saved.assignedOwner || "No owner"} • {saved.defectCategory || "No category"}</span>
                      <span className={isOverdue(saved) ? "mt-1 block text-xs font-bold text-rose-200" : "mt-1 block text-xs text-slate-500"}>Due {formatDate(saved.dueDate)}</span>
                    </button>
                    <button type="button" onClick={() => deleteRecord(saved.id)} className="mt-3 rounded-xl border border-rose-300/30 px-3 py-2 text-sm font-bold text-rose-200 hover:bg-rose-300/10">Delete</button>
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
