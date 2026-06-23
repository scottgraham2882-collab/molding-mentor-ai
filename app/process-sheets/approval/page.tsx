"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ApprovalStatus = "Draft" | "Pending Review" | "Approved" | "Rejected" | "Obsolete";

type ApprovalSectionKey =
  | "fillSettingsApproval"
  | "packHoldSettingsApproval"
  | "coolingSettingsApproval"
  | "recoverySettingsApproval"
  | "qualityChecksApproval"
  | "materialDryingApproval";

type ProcessSheetApproval = {
  id: string;
  createdAt: string;
  updatedAt: string;
  processSheetNumber: string;
  revisionLevel: string;
  customer: string;
  partNumber: string;
  moldNumber: string;
  machineNumber: string;
  material: string;
  preparedBy: string;
  reviewedBy: string;
  approvedBy: string;
  approvalDate: string;
  status: ApprovalStatus;
  changeReason: string;
  approvalNotes: string;
} & Record<ApprovalSectionKey, string>;

type Field = {
  name: keyof ProcessSheetApproval;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  type?: "date";
};

const STORAGE_KEY = "molding-mentor-process-sheet-approvals";

const approvalStatuses: ApprovalStatus[] = ["Draft", "Pending Review", "Approved", "Rejected", "Obsolete"];

const blankApproval: ProcessSheetApproval = {
  id: "",
  createdAt: "",
  updatedAt: "",
  processSheetNumber: "",
  revisionLevel: "",
  customer: "",
  partNumber: "",
  moldNumber: "",
  machineNumber: "",
  material: "",
  preparedBy: "",
  reviewedBy: "",
  approvedBy: "",
  approvalDate: "",
  status: "Draft",
  changeReason: "",
  approvalNotes: "",
  fillSettingsApproval: "",
  packHoldSettingsApproval: "",
  coolingSettingsApproval: "",
  recoverySettingsApproval: "",
  qualityChecksApproval: "",
  materialDryingApproval: "",
};

const detailFields: Field[] = [
  { name: "processSheetNumber", label: "Process sheet number", placeholder: "PS-2026-014" },
  { name: "revisionLevel", label: "Revision level", placeholder: "Rev C" },
  { name: "customer", label: "Customer", placeholder: "Acme Medical" },
  { name: "partNumber", label: "Part number", placeholder: "PN-1048-A" },
  { name: "moldNumber", label: "Mold number", placeholder: "M-22" },
  { name: "machineNumber", label: "Machine number", placeholder: "Press 07" },
  { name: "material", label: "Material", placeholder: "PC/ABS natural" },
  { name: "preparedBy", label: "Prepared by", placeholder: "Process technician" },
  { name: "reviewedBy", label: "Reviewed by", placeholder: "Quality engineer" },
  { name: "approvedBy", label: "Approved by", placeholder: "Manufacturing manager" },
  { name: "approvalDate", label: "Approval date", type: "date" },
  { name: "changeReason", label: "Change reason", placeholder: "Document what changed and why", multiline: true },
  { name: "approvalNotes", label: "Approval notes", placeholder: "Open conditions, evidence reviewed, or rejection notes", multiline: true },
];

const approvalSections: { key: ApprovalSectionKey; title: string; description: string; placeholder: string }[] = [
  {
    key: "fillSettingsApproval",
    title: "Fill settings approval",
    description: "Confirm fill speed profile, transfer position, fill-only study evidence, and peak pressure targets.",
    placeholder: "Fill settings reviewed against validated process window...",
  },
  {
    key: "packHoldSettingsApproval",
    title: "Pack/hold settings approval",
    description: "Verify hold pressure, hold time, cushion stability, gate seal evidence, and part-weight consistency.",
    placeholder: "Pack and hold settings approved with gate seal data...",
  },
  {
    key: "coolingSettingsApproval",
    title: "Cooling settings approval",
    description: "Review cooling time, mold temperature, water flow, and dimensional stability requirements.",
    placeholder: "Cooling settings reviewed for dimensional repeatability...",
  },
  {
    key: "recoverySettingsApproval",
    title: "Recovery settings approval",
    description: "Approve screw speed, back pressure, recovery time, melt quality, and shot-size consistency.",
    placeholder: "Recovery settings verified within cycle time and melt-quality limits...",
  },
  {
    key: "qualityChecksApproval",
    title: "Quality checks approval",
    description: "Capture first article, visual, dimensional, and control-plan checks required before release.",
    placeholder: "Quality checks completed and linked to inspection plan...",
  },
  {
    key: "materialDryingApproval",
    title: "Material drying approval",
    description: "Confirm resin lot, drying temperature, drying time, dew point, and handling requirements.",
    placeholder: "Material drying conditions verified before approval...",
  },
];

function formatDate(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function ProcessSheetApprovalPage() {
  const [approval, setApproval] = useState<ProcessSheetApproval>(blankApproval);
  const [approvals, setApprovals] = useState<ProcessSheetApproval[]>([]);
  const [filter, setFilter] = useState({ status: "All", partNumber: "", moldNumber: "", revisionLevel: "" });
  const [message, setMessage] = useState("Draft approval ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setApprovals(JSON.parse(saved) as ProcessSheetApproval[]);
  }, []);

  const activeTitle = useMemo(
    () => approval.processSheetNumber || approval.partNumber || approval.moldNumber || "Untitled approval",
    [approval.moldNumber, approval.partNumber, approval.processSheetNumber],
  );

  const filteredApprovals = approvals.filter((saved) => {
    const matchesStatus = filter.status === "All" || saved.status === filter.status;
    const matchesPart = saved.partNumber.toLowerCase().includes(filter.partNumber.toLowerCase());
    const matchesMold = saved.moldNumber.toLowerCase().includes(filter.moldNumber.toLowerCase());
    const matchesRevision = saved.revisionLevel.toLowerCase().includes(filter.revisionLevel.toLowerCase());
    return matchesStatus && matchesPart && matchesMold && matchesRevision;
  });

  function updateField(name: keyof ProcessSheetApproval, value: string) {
    setApproval((current) => ({ ...current, [name]: value }));
  }

  function persist(nextApproval: ProcessSheetApproval, nextApprovals: ProcessSheetApproval[]) {
    setApproval(nextApproval);
    setApprovals(nextApprovals);
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
    const nextApprovals = [nextApproval, ...approvals.filter((saved) => saved.id !== nextApproval.id)];
    persist(nextApproval, nextApprovals);
    setMessage(`Saved ${nextApproval.processSheetNumber || nextApproval.partNumber || "approval record"}`);
  }

  function editApproval(saved: ProcessSheetApproval) {
    setApproval(saved);
    setMessage(`Editing ${saved.processSheetNumber || saved.partNumber || "approval record"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteApproval(id: string) {
    const nextApprovals = approvals.filter((saved) => saved.id !== id);
    setApprovals(nextApprovals);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextApprovals));
    if (approval.id === id) setApproval(blankApproval);
    setMessage("Deleted approval record");
  }

  function newApproval() {
    setApproval(blankApproval);
    setMessage("New approval draft ready");
  }

  function printReport() {
    setMessage("Opening print-friendly approval report");
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:p-0 print:shadow-none sm:p-8">
          <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between print:mt-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Process sheet control</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Electronic Process Sheet Approval</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create, approve, store, filter, edit, delete, and print approval records for controlled injection molding process sheets.</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100 print:hidden">{message}</div>
          </div>
        </header>

        <form onSubmit={saveApproval} className="grid gap-5 xl:grid-cols-[1fr_24rem] print:block">
          <div className="space-y-5">
            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 print:mb-4 print:break-inside-avoid print:border-slate-300 print:bg-white print:p-4 print:shadow-none sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-white print:text-slate-950">Approval record details</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400 print:text-slate-600">Identify the controlled sheet, revision, product, sign-offs, status, reason for change, and approval notes.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {detailFields.map((field) => (
                  <label key={field.name} className={field.multiline ? "sm:col-span-2 lg:col-span-3" : ""}>
                    <span className="text-sm font-semibold text-slate-200 print:text-slate-700">{field.label}</span>
                    {field.multiline ? (
                      <textarea value={String(approval[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:min-h-20 print:border-slate-300 print:bg-white print:text-slate-950" />
                    ) : (
                      <input type={field.type || "text"} value={String(approval[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                    )}
                  </label>
                ))}
                <label>
                  <span className="text-sm font-semibold text-slate-200 print:text-slate-700">Status</span>
                  <select value={approval.status} onChange={(event) => updateField("status", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950">
                    {approvalStatuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
              </div>
            </section>

            {approvalSections.map((section) => (
              <section key={section.key} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 print:mb-4 print:break-inside-avoid print:border-slate-300 print:bg-white print:p-4 print:shadow-none sm:p-6">
                <h2 className="text-xl font-bold text-white print:text-slate-950">{section.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400 print:text-slate-600">{section.description}</p>
                <textarea value={approval[section.key]} onChange={(event) => updateField(section.key, event.target.value)} placeholder={section.placeholder} rows={4} className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:min-h-20 print:border-slate-300 print:bg-white print:text-slate-950" />
              </section>
            ))}
          </div>

          <aside className="space-y-5 print:hidden">
            <section className="sticky top-4 rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current approval</p>
              <h2 className="mt-3 text-2xl font-black text-white">{activeTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Status: <span className="font-bold text-emerald-200">{approval.status}</span></p>
              <p className="mt-1 text-sm text-slate-400">Last saved: {formatDate(approval.updatedAt)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Create / save approval</button>
                <button type="button" onClick={newApproval} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New approval</button>
                <button type="button" onClick={printReport} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print approval report</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Filter saved approvals</h2>
              <div className="mt-4 grid gap-3">
                <select value={filter.status} onChange={(event) => setFilter((current) => ({ ...current, status: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300">
                  <option>All</option>
                  {approvalStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
                <input value={filter.partNumber} onChange={(event) => setFilter((current) => ({ ...current, partNumber: event.target.value }))} placeholder="Filter by part number" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
                <input value={filter.moldNumber} onChange={(event) => setFilter((current) => ({ ...current, moldNumber: event.target.value }))} placeholder="Filter by mold number" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
                <input value={filter.revisionLevel} onChange={(event) => setFilter((current) => ({ ...current, revisionLevel: event.target.value }))} placeholder="Filter by revision" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved approvals</h2>
              <p className="mt-1 text-sm text-slate-400">{filteredApprovals.length} of {approvals.length} records shown</p>
              <div className="mt-4 space-y-3">
                {filteredApprovals.length === 0 ? <p className="text-sm text-slate-400">No approval records match the current filters.</p> : null}
                {filteredApprovals.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white">{saved.processSheetNumber || saved.partNumber || "Untitled approval"}</h3>
                        <p className="mt-1 text-xs text-slate-400">{saved.partNumber || "No part"} • {saved.moldNumber || "No mold"} • {saved.revisionLevel || "No revision"}</p>
                        <p className="mt-1 text-xs font-bold text-cyan-200">{saved.status}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Updated {formatDate(saved.updatedAt)}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => editApproval(saved)} className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100">Edit</button>
                      <button type="button" onClick={() => deleteApproval(saved.id)} className="rounded-xl border border-rose-300/30 bg-rose-300/10 px-3 py-2 text-sm font-bold text-rose-100">Delete</button>
                    </div>
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
