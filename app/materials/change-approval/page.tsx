"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ApprovalStatus = "Pending" | "Approved" | "Rejected";

type MaterialChangeApproval = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  partNumber: string;
  moldNumber: string;
  machineNumber: string;
  currentMaterial: string;
  newMaterial: string;
  supplier: string;
  lotNumber: string;
  reasonForChange: string;
  riskAssessment: string;
  trialResults: string;
  qualityApproval: string;
  processTechnicianApproval: string;
  supervisorApproval: string;
  status: ApprovalStatus;
  notes: string;
};

type Field = {
  name: keyof MaterialChangeApproval;
  label: string;
  placeholder?: string;
  type?: "date" | "textarea" | "select";
};

type Section = {
  title: string;
  description: string;
  fields: Field[];
};

const STORAGE_KEY = "molding-mentor-material-change-approvals";

const blankApproval: MaterialChangeApproval = {
  id: "",
  createdAt: "",
  updatedAt: "",
  date: new Date().toISOString().slice(0, 10),
  partNumber: "",
  moldNumber: "",
  machineNumber: "",
  currentMaterial: "",
  newMaterial: "",
  supplier: "",
  lotNumber: "",
  reasonForChange: "",
  riskAssessment: "",
  trialResults: "",
  qualityApproval: "",
  processTechnicianApproval: "",
  supervisorApproval: "",
  status: "Pending",
  notes: "",
};

const sections: Section[] = [
  {
    title: "Part, mold, and machine",
    description: "Identify the job and production equipment affected by the proposed material change.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "partNumber", label: "Part number", placeholder: "PN-10482-A" },
      { name: "moldNumber", label: "Mold number", placeholder: "M-226" },
      { name: "machineNumber", label: "Machine number", placeholder: "Press 12" },
    ],
  },
  {
    title: "Material details",
    description: "Record the current material, replacement material, supplier, and incoming lot details.",
    fields: [
      { name: "currentMaterial", label: "Current material", placeholder: "ABS natural, grade, colorant" },
      { name: "newMaterial", label: "New material", placeholder: "PC/ABS black, alternate grade" },
      { name: "supplier", label: "Supplier", placeholder: "Approved supplier or distributor" },
      { name: "lotNumber", label: "Lot number", placeholder: "LOT-2026-0623" },
    ],
  },
  {
    title: "Evaluation and approvals",
    description: "Document why the change is needed, what risks were reviewed, trial outcome, sign-offs, and final status.",
    fields: [
      { name: "reasonForChange", label: "Reason for change", type: "textarea", placeholder: "Shortage, customer approval, resin discontinuation, cost-down trial..." },
      { name: "riskAssessment", label: "Risk assessment", type: "textarea", placeholder: "Fit/function, color, dimensional, drying, processing, regulatory, customer notification..." },
      { name: "trialResults", label: "Trial results", type: "textarea", placeholder: "Trial date, run hours, samples reviewed, dimensions, defects, Cp/Cpk, open actions..." },
      { name: "qualityApproval", label: "Quality approval", placeholder: "Name / date / comments" },
      { name: "processTechnicianApproval", label: "Process technician approval", placeholder: "Name / date / comments" },
      { name: "supervisorApproval", label: "Supervisor approval", placeholder: "Name / date / comments" },
      { name: "status", label: "Approval status", type: "select" },
      { name: "notes", label: "Notes", type: "textarea", placeholder: "Customer notification, deviation number, containment plan, attachments location..." },
    ],
  },
];

const statuses: ApprovalStatus[] = ["Pending", "Approved", "Rejected"];

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function MaterialChangeApprovalPage() {
  const [approval, setApproval] = useState<MaterialChangeApproval>(blankApproval);
  const [savedApprovals, setSavedApprovals] = useState<MaterialChangeApproval[]>([]);
  const [filters, setFilters] = useState({ partNumber: "", material: "", status: "", date: "" });
  const [statusMessage, setStatusMessage] = useState("Material change approval draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedApprovals(JSON.parse(saved) as MaterialChangeApproval[]);
  }, []);

  const approvalTitle = useMemo(
    () => approval.partNumber || approval.newMaterial || approval.currentMaterial || "Untitled material change",
    [approval.currentMaterial, approval.newMaterial, approval.partNumber],
  );

  const filteredApprovals = useMemo(() => {
    return savedApprovals.filter((saved) => {
      const partMatch = saved.partNumber.toLowerCase().includes(filters.partNumber.toLowerCase().trim());
      const materialQuery = filters.material.toLowerCase().trim();
      const materialMatch = !materialQuery || [saved.currentMaterial, saved.newMaterial, saved.supplier, saved.lotNumber].join(" ").toLowerCase().includes(materialQuery);
      const statusMatch = !filters.status || saved.status === filters.status;
      const dateMatch = !filters.date || saved.date === filters.date;
      return partMatch && materialMatch && statusMatch && dateMatch;
    });
  }, [filters, savedApprovals]);

  const statusCounts = useMemo(
    () => statuses.map((status) => ({ status, count: savedApprovals.filter((saved) => saved.status === status).length })),
    [savedApprovals],
  );

  function updateField(name: keyof MaterialChangeApproval, value: string) {
    setApproval((current) => ({ ...current, [name]: value }));
  }

  function persist(nextApproval: MaterialChangeApproval, nextApprovals: MaterialChangeApproval[]) {
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

  function editApproval(savedApproval: MaterialChangeApproval) {
    setApproval(savedApproval);
    setStatusMessage(`Editing ${savedApproval.partNumber || savedApproval.newMaterial || "material change"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteApproval(approvalId: string) {
    const nextApprovals = savedApprovals.filter((saved) => saved.id !== approvalId);
    setSavedApprovals(nextApprovals);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextApprovals));
    if (approval.id === approvalId) setApproval({ ...blankApproval, date: new Date().toISOString().slice(0, 10) });
    setStatusMessage("Deleted material change approval");
  }

  function startNewApproval() {
    setApproval({ ...blankApproval, date: new Date().toISOString().slice(0, 10) });
    setStatusMessage("New material change approval draft ready");
  }

  function printApproval() {
    setStatusMessage("Opening print-friendly approval form");
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:p-0 print:shadow-none sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_34%)] print:hidden" />
          <div className="relative">
            <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:mt-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Material Tools</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Material Change Approval Form</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create, approve, save, edit, filter, delete, and print controlled material change approvals before production uses a new resin, supplier, or lot.</p>
              </div>
              <div className="grid gap-3 sm:min-w-72 print:hidden">
                <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">{statusMessage}</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {statusCounts.map((item) => (
                    <div key={item.status} className="rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3">
                      <p className="text-2xl font-black text-white">{item.count}</p>
                      <p className="mt-1 font-bold text-slate-300">{item.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <form onSubmit={saveApproval} className="grid gap-5 lg:grid-cols-[1fr_22rem] print:block">
          <div className="space-y-5">
            {sections.map((section) => (
              <section key={section.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 print:mb-4 print:break-inside-avoid print:border-slate-300 print:bg-white print:p-4 print:shadow-none sm:p-6">
                <div className="mb-5">
                  <h2 className="text-2xl font-black text-white print:text-slate-950">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300 print:text-slate-700">{section.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <label key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                      <span className="text-sm font-bold text-slate-200 print:text-slate-800">{field.label}</span>
                      {field.type === "textarea" ? (
                        <textarea value={approval[field.name]} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 print:border-slate-300 print:bg-white print:text-slate-950" />
                      ) : field.type === "select" ? (
                        <select value={approval.status} onChange={(event) => updateField("status", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 print:border-slate-300 print:bg-white print:text-slate-950">
                          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      ) : (
                        <input value={approval[field.name]} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} type={field.type || "text"} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 print:border-slate-300 print:bg-white print:text-slate-950" />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-4 print:mt-4 print:break-inside-avoid">
            <section className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5 shadow-xl shadow-cyan-950/20 print:border-slate-300 print:bg-white print:shadow-none">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-200 print:text-slate-600">Current approval</p>
              <h2 className="mt-3 text-2xl font-black text-white print:text-slate-950">{approvalTitle}</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="font-bold text-slate-400 print:text-slate-600">Status</dt><dd className="text-white print:text-slate-950">{approval.status}</dd></div>
                <div><dt className="font-bold text-slate-400 print:text-slate-600">Change date</dt><dd className="text-white print:text-slate-950">{formatDate(approval.date)}</dd></div>
                <div><dt className="font-bold text-slate-400 print:text-slate-600">Last saved</dt><dd className="text-white print:text-slate-950">{formatDateTime(approval.updatedAt)}</dd></div>
              </dl>
              <div className="mt-5 grid gap-3 print:hidden">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">Save approval</button>
                <button type="button" onClick={startNewApproval} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-black text-white transition hover:border-cyan-300/40 hover:bg-white/10">New approval</button>
                <button type="button" onClick={printApproval} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300/15">Print form</button>
              </div>
            </section>
          </aside>
        </form>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 print:hidden sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Saved approvals</p>
              <h2 className="mt-2 text-2xl font-black text-white">Review, filter, edit, or delete saved records</h2>
            </div>
            <p className="text-sm font-bold text-slate-300">Showing {filteredApprovals.length} of {savedApprovals.length}</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input value={filters.partNumber} onChange={(event) => setFilters((current) => ({ ...current, partNumber: event.target.value }))} placeholder="Filter by part number" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" />
            <input value={filters.material} onChange={(event) => setFilters((current) => ({ ...current, material: event.target.value }))} placeholder="Filter by material, supplier, lot" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" />
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300">
              <option value="">All statuses</option>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <input value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} type="date" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300" />
          </div>
          <div className="mt-5 grid gap-3">
            {filteredApprovals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-slate-300">No saved approvals match the current filters.</div>
            ) : filteredApprovals.map((saved) => (
              <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black text-white">{saved.partNumber || "No part number"}</h3>
                      <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">{saved.status}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{saved.currentMaterial || "Current material not set"} → {saved.newMaterial || "New material not set"}</p>
                    <p className="text-sm text-slate-400">{formatDate(saved.date)} • Mold {saved.moldNumber || "—"} • Machine {saved.machineNumber || "—"} • Lot {saved.lotNumber || "—"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editApproval(saved)} className="rounded-xl border border-cyan-300/30 px-3 py-2 text-xs font-black text-cyan-100 transition hover:bg-cyan-300/10">Edit</button>
                    <button type="button" onClick={() => deleteApproval(saved.id)} className="rounded-xl border border-rose-300/30 px-3 py-2 text-xs font-black text-rose-100 transition hover:bg-rose-300/10">Delete</button>
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
