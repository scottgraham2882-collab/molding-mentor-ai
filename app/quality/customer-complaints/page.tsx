"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ComplaintStatus = "Open" | "In Progress" | "Closed";

type CustomerComplaint = {
  id: string;
  createdAt: string;
  updatedAt: string;
  complaintDate: string;
  customer: string;
  partNumber: string;
  moldNumber: string;
  machineNumber: string;
  defectReported: string;
  quantityAffected: string;
  customerConcern: string;
  containmentAction: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  responsiblePerson: string;
  dueDate: string;
  status: ComplaintStatus;
};

type Field = {
  name: keyof CustomerComplaint;
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

const STORAGE_KEY = "molding-mentor-customer-complaints";
const statusOptions: ComplaintStatus[] = ["Open", "In Progress", "Closed"];

const blankComplaint: CustomerComplaint = {
  id: "",
  createdAt: "",
  updatedAt: "",
  complaintDate: "",
  customer: "",
  partNumber: "",
  moldNumber: "",
  machineNumber: "",
  defectReported: "",
  quantityAffected: "",
  customerConcern: "",
  containmentAction: "",
  rootCause: "",
  correctiveAction: "",
  preventiveAction: "",
  responsiblePerson: "",
  dueDate: "",
  status: "Open",
};

const sections: Section[] = [
  {
    title: "D1-D2: Complaint and team facts",
    description: "Capture the customer, product, equipment, symptom, and size of the reported quality escape.",
    fields: [
      { name: "complaintDate", label: "Complaint date", type: "date" },
      { name: "customer", label: "Customer", placeholder: "Acme Components" },
      { name: "partNumber", label: "Part number", placeholder: "PN-1048-A" },
      { name: "moldNumber", label: "Mold number", placeholder: "M-22" },
      { name: "machineNumber", label: "Machine number", placeholder: "Press 07" },
      { name: "defectReported", label: "Defect reported", placeholder: "Flash, short shot, splay, contamination..." },
      { name: "quantityAffected", label: "Quantity affected", placeholder: "125", type: "number" },
      {
        name: "customerConcern",
        label: "Customer concern",
        placeholder: "Describe the customer impact, requirement missed, shipment at risk, and any photos or evidence received.",
        type: "textarea",
      },
    ],
  },
  {
    title: "D3-D7: Containment, cause, and actions",
    description: "Document immediate protection, confirmed cause, corrective action, and prevention of recurrence.",
    fields: [
      {
        name: "containmentAction",
        label: "Containment action",
        placeholder: "Quarantined stock, stopped shipment, sorted finished goods/WIP, notified shifts, and protected customer inventory.",
        type: "textarea",
      },
      {
        name: "rootCause",
        label: "Root cause",
        placeholder: "State the verified technical and system root cause using evidence from process, mold, machine, material, or method checks.",
        type: "textarea",
      },
      {
        name: "correctiveAction",
        label: "Corrective action",
        placeholder: "Permanent action that removes the confirmed cause, including process/tooling/document updates and validation plan.",
        type: "textarea",
      },
      {
        name: "preventiveAction",
        label: "Preventive action",
        placeholder: "Control plan, training, PM, audit, poka-yoke, lesson learned, or standard work update to prevent recurrence.",
        type: "textarea",
      },
    ],
  },
  {
    title: "D8: Ownership and closure",
    description: "Assign accountability and track the due date and closure status for the complaint response.",
    fields: [
      { name: "responsiblePerson", label: "Responsible person", placeholder: "J. Rivera" },
      { name: "dueDate", label: "Due date", type: "date" },
      { name: "status", label: "Status", type: "select", options: statusOptions },
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

export default function CustomerComplaintPage() {
  const [complaint, setComplaint] = useState<CustomerComplaint>(blankComplaint);
  const [savedComplaints, setSavedComplaints] = useState<CustomerComplaint[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | ComplaintStatus>("All");
  const [customerFilter, setCustomerFilter] = useState("");
  const [partFilter, setPartFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState("Complaint draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedComplaints(JSON.parse(saved) as CustomerComplaint[]);
  }, []);

  const complaintTitle = useMemo(
    () => complaint.customer || complaint.partNumber || complaint.defectReported || "Untitled customer complaint",
    [complaint.customer, complaint.defectReported, complaint.partNumber],
  );

  const filteredComplaints = useMemo(
    () => savedComplaints.filter((saved) => {
      const matchesStatus = statusFilter === "All" || saved.status === statusFilter;
      const matchesCustomer = saved.customer.toLowerCase().includes(customerFilter.toLowerCase().trim());
      const matchesPart = saved.partNumber.toLowerCase().includes(partFilter.toLowerCase().trim());
      return matchesStatus && matchesCustomer && matchesPart;
    }),
    [customerFilter, partFilter, savedComplaints, statusFilter],
  );

  const statusCounts = useMemo(
    () => statusOptions.reduce((counts, option) => ({ ...counts, [option]: savedComplaints.filter((saved) => saved.status === option).length }), {} as Record<ComplaintStatus, number>),
    [savedComplaints],
  );

  function updateField(name: keyof CustomerComplaint, value: string) {
    setComplaint((current) => ({ ...current, [name]: value }));
  }

  function persist(nextComplaint: CustomerComplaint, nextComplaints: CustomerComplaint[]) {
    setComplaint(nextComplaint);
    setSavedComplaints(nextComplaints);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextComplaints));
  }

  function saveComplaint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const nextComplaint = {
      ...complaint,
      id: complaint.id || crypto.randomUUID(),
      createdAt: complaint.createdAt || timestamp,
      updatedAt: timestamp,
    };
    const nextComplaints = [nextComplaint, ...savedComplaints.filter((saved) => saved.id !== nextComplaint.id)];
    persist(nextComplaint, nextComplaints);
    setStatusMessage(`Saved ${complaintTitle}`);
  }

  function editComplaint(savedComplaint: CustomerComplaint) {
    setComplaint(savedComplaint);
    setStatusMessage(`Editing ${savedComplaint.customer || savedComplaint.partNumber || "saved complaint"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteComplaint(complaintId: string) {
    const nextComplaints = savedComplaints.filter((saved) => saved.id !== complaintId);
    setSavedComplaints(nextComplaints);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextComplaints));
    if (complaint.id === complaintId) setComplaint(blankComplaint);
    setStatusMessage("Deleted saved complaint");
  }

  function startNewComplaint() {
    setComplaint(blankComplaint);
    setStatusMessage("New complaint draft ready");
  }

  function printComplaint() {
    setStatusMessage("Opening 8D print report");
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
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Customer Complaint Tracker</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create complaint records, save them in this browser, filter open work, and print a clean 8D-style customer response.</p>
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

        <form onSubmit={saveComplaint} className="grid gap-5 lg:grid-cols-[1fr_22rem] print:block">
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
                        <textarea value={String(complaint[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:min-h-20 print:border-slate-300 print:bg-white print:text-slate-950" />
                      ) : field.type === "select" ? (
                        <select value={String(complaint[field.name])} onChange={(event) => updateField(field.name, event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950">
                          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input type={field.type || "text"} value={String(complaint[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 print:hidden">
            <section className="sticky top-4 rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current complaint</p>
              <h2 className="mt-3 text-2xl font-black text-white">{complaintTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Complaint date: {formatDate(complaint.complaintDate)}</p>
              <p className="mt-1 text-sm text-slate-400">Last saved: {formatDateTime(complaint.updatedAt)}</p>
              <p className="mt-1 text-sm text-slate-400">Due: {formatDate(complaint.dueDate)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save complaint</button>
                <button type="button" onClick={startNewComplaint} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New complaint</button>
                <button type="button" onClick={printComplaint} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print 8D report</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved complaints</h2>
              <p className="mt-1 text-xs text-slate-400">Showing {filteredComplaints.length} of {savedComplaints.length}</p>
              <div className="mt-4 grid gap-3">
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | ComplaintStatus)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm font-bold text-white outline-none focus:border-cyan-300">
                  <option value="All">All status</option>
                  {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <input value={customerFilter} onChange={(event) => setCustomerFilter(event.target.value)} placeholder="Filter by customer" className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
                <input value={partFilter} onChange={(event) => setPartFilter(event.target.value)} placeholder="Filter by part number" className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
              </div>
              <div className="mt-4 space-y-3">
                {filteredComplaints.length === 0 ? <p className="text-sm text-slate-400">Saved customer complaints will appear here for review, filtering, editing, deletion, and print preparation.</p> : null}
                {filteredComplaints.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editComplaint(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.customer || saved.partNumber || "Untitled complaint"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.partNumber || "No part"} • {saved.status} • Due {formatDate(saved.dueDate)}</span>
                      <span className="mt-1 block text-xs text-slate-500">Updated {formatDateTime(saved.updatedAt)}</span>
                    </button>
                    <button type="button" onClick={() => deleteComplaint(saved.id)} className="mt-3 rounded-xl border border-rose-300/30 px-3 py-2 text-sm font-bold text-rose-200 transition hover:bg-rose-300/10">Delete</button>
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
