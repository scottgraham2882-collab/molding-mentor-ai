"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ApprovalStatus = "Pending" | "Approved" | "Rejected";

type StartupApproval = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  shift: string;
  machineNumber: string;
  moldNumber: string;
  partNumber: string;
  material: string;
  operatorName: string;
  processTechnicianName: string;
  qualityInspectorName: string;
  approvalStatus: ApprovalStatus;
  checks: Record<string, boolean>;
};

type Field = {
  name: keyof Omit<StartupApproval, "checks">;
  label: string;
  placeholder?: string;
  type?: "date" | "select";
  options?: string[];
};

const STORAGE_KEY = "molding-mentor-startup-approvals";

const startupChecks = [
  "Correct mold installed",
  "Correct material loaded",
  "Dryer settings verified",
  "Process sheet verified",
  "Safety guards checked",
  "First shots inspected",
  "Part weight verified",
  "Critical dimensions checked",
  "Visual defects checked",
  "Packaging verified",
];

const blankChecks = startupChecks.reduce<Record<string, boolean>>((checks, check) => {
  checks[check] = false;
  return checks;
}, {});

const blankApproval: StartupApproval = {
  id: "",
  createdAt: "",
  updatedAt: "",
  date: "",
  shift: "",
  machineNumber: "",
  moldNumber: "",
  partNumber: "",
  material: "",
  operatorName: "",
  processTechnicianName: "",
  qualityInspectorName: "",
  approvalStatus: "Pending",
  checks: blankChecks,
};

const fields: Field[] = [
  { name: "date", label: "Date", type: "date" },
  { name: "shift", label: "Shift", type: "select", options: ["", "1st", "2nd", "3rd", "Weekend", "Other"] },
  { name: "machineNumber", label: "Machine number", placeholder: "Press 12" },
  { name: "moldNumber", label: "Mold number", placeholder: "M-1048" },
  { name: "partNumber", label: "Part number", placeholder: "PN-204-A" },
  { name: "material", label: "Material", placeholder: "ABS black, lot 7712" },
  { name: "operatorName", label: "Operator name", placeholder: "A. Smith" },
  { name: "processTechnicianName", label: "Process technician name", placeholder: "J. Rivera" },
  { name: "qualityInspectorName", label: "Quality inspector name", placeholder: "M. Chen" },
  { name: "approvalStatus", label: "Approval status", type: "select", options: ["Pending", "Approved", "Rejected"] },
];

function newBlankApproval() {
  return { ...blankApproval, checks: { ...blankChecks } };
}

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function StartupApprovalPage() {
  const [approval, setApproval] = useState<StartupApproval>(newBlankApproval);
  const [savedApprovals, setSavedApprovals] = useState<StartupApproval[]>([]);
  const [status, setStatus] = useState("Draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedApprovals(JSON.parse(saved) as StartupApproval[]);
  }, []);

  const approvalTitle = useMemo(
    () => approval.partNumber || approval.moldNumber || approval.machineNumber || "Untitled startup approval",
    [approval.machineNumber, approval.moldNumber, approval.partNumber],
  );

  const completedChecks = startupChecks.filter((check) => approval.checks[check]).length;
  const allChecksComplete = completedChecks === startupChecks.length;

  function updateField(name: Field["name"], value: string) {
    setApproval((current) => ({ ...current, [name]: value }));
  }

  function toggleCheck(check: string) {
    setApproval((current) => ({
      ...current,
      checks: { ...current.checks, [check]: !current.checks[check] },
    }));
  }

  function persist(nextApproval: StartupApproval, nextApprovals: StartupApproval[]) {
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
    setStatus(`Saved ${approvalTitle}`);
  }

  function editApproval(savedApproval: StartupApproval) {
    setApproval({ ...savedApproval, checks: { ...blankChecks, ...savedApproval.checks } });
    setStatus(`Editing ${savedApproval.partNumber || savedApproval.moldNumber || "saved approval"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteApproval(approvalId: string) {
    const nextApprovals = savedApprovals.filter((saved) => saved.id !== approvalId);
    setSavedApprovals(nextApprovals);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextApprovals));
    if (approval.id === approvalId) setApproval(newBlankApproval());
    setStatus("Deleted saved approval");
  }

  function startNewApproval() {
    setApproval(newBlankApproval());
    setStatus("New draft ready");
  }

  function printApproval() {
    setStatus("Opening print-friendly report");
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:p-0 print:shadow-none sm:p-8">
          <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:mt-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Production startup control</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Startup Approval System</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Verify mold, material, process, safety, inspection, and packaging readiness before releasing startup production.</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100 print:hidden">{status}</div>
          </div>
        </header>

        <form onSubmit={saveApproval} className="grid gap-5 lg:grid-cols-[1fr_22rem] print:block">
          <div className="space-y-5">
            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 print:mb-4 print:break-inside-avoid print:border-slate-300 print:bg-white print:p-4 print:shadow-none sm:p-6">
              <h2 className="text-xl font-bold text-white print:text-slate-950">Approval details</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400 print:text-slate-600">Capture the required startup approval fields and sign-off status.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.name} className={field.name === "approvalStatus" ? "sm:col-span-2" : ""}>
                    <span className="text-sm font-semibold text-slate-200 print:text-slate-700">{field.label}</span>
                    {field.type === "select" ? (
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

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 print:break-inside-avoid print:border-slate-300 print:bg-white print:p-4 print:shadow-none sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white print:text-slate-950">Startup checks</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400 print:text-slate-600">Tap each item as it is verified on the floor.</p>
                </div>
                <p className="text-sm font-bold text-cyan-200 print:text-slate-700">{completedChecks} / {startupChecks.length} complete</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {startupChecks.map((check) => (
                  <label key={check} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-cyan-300/40 print:border-slate-300 print:bg-white">
                    <input type="checkbox" checked={approval.checks[check]} onChange={() => toggleCheck(check)} className="h-5 w-5 accent-cyan-300" />
                    <span className="text-sm font-semibold text-slate-100 print:text-slate-800">{check}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5 print:hidden">
            <section className="sticky top-4 rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current approval</p>
              <h2 className="mt-3 text-2xl font-black text-white">{approvalTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Last saved: {formatDateTime(approval.updatedAt)}</p>
              <p className={`mt-3 rounded-2xl px-3 py-2 text-sm font-bold ${allChecksComplete ? "bg-emerald-300/10 text-emerald-200" : "bg-amber-300/10 text-amber-200"}`}>{allChecksComplete ? "All startup checks complete" : "Startup checks still open"}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save approval</button>
                <button type="button" onClick={startNewApproval} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New approval</button>
                <button type="button" onClick={printApproval} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print-friendly report</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved approvals</h2>
              <div className="mt-4 space-y-3">
                {savedApprovals.length === 0 ? <p className="text-sm text-slate-400">Saved startup approvals will appear here for review, editing, printing, or deletion.</p> : null}
                {savedApprovals.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editApproval(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.partNumber || saved.moldNumber || "Untitled approval"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.machineNumber || "No machine"} • {saved.approvalStatus} • {formatDateTime(saved.updatedAt)}</span>
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
