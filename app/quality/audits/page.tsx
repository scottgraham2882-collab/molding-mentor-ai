"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type AuditType =
  | "Layered Process Audit"
  | "5S Audit"
  | "Safety Audit"
  | "Mold Setup Audit"
  | "First Article Audit"
  | "Process Sheet Audit";

type ChecklistItem = {
  id: string;
  text: string;
  result: "Pass" | "Fail" | "N/A" | "";
  note: string;
  correctiveAction: string;
};

type AuditStatus = "Draft" | "Open corrective actions" | "Passed" | "Failed";

type Audit = {
  id: string;
  createdAt: string;
  updatedAt: string;
  auditType: AuditType;
  date: string;
  machine: string;
  mold: string;
  partNumber: string;
  auditor: string;
  area: string;
  status: AuditStatus;
  notes: string;
  items: ChecklistItem[];
};

const STORAGE_KEY = "molding-mentor-audit-checklists";

const auditTypes: AuditType[] = [
  "Layered Process Audit",
  "5S Audit",
  "Safety Audit",
  "Mold Setup Audit",
  "First Article Audit",
  "Process Sheet Audit",
];

const checklistTemplates: Record<AuditType, string[]> = {
  "Layered Process Audit": [
    "Operator is following the current work instruction and control plan.",
    "Critical process settings match the approved process sheet.",
    "Required quality checks are complete, current, and documented.",
    "Parts, labels, and containers are protected from mix risk.",
    "Escalation process is understood for defects or out-of-window conditions.",
  ],
  "5S Audit": [
    "Only needed tools, gauges, materials, and documents are at the workstation.",
    "Tools and supplies are sorted, labeled, and returned to marked locations.",
    "Floors, press area, hopper area, and work surfaces are clean and safe.",
    "Visual standards, shadow boards, and aisle markings are being maintained.",
    "Abnormal conditions are tagged or assigned for follow-up.",
  ],
  "Safety Audit": [
    "Machine guarding, gates, and emergency stops are present and functional.",
    "Required PPE is available and worn correctly for the task.",
    "No slip, trip, pinch, burn, or electrical hazards are uncontrolled.",
    "Lockout/tagout expectations are understood for interventions.",
    "Material handling, purging, and hot-runner practices are safe.",
  ],
  "Mold Setup Audit": [
    "Mold is clamped, centered, protected, and connected per setup standard.",
    "Water, hydraulics, air, electrical, and hot runner connections are correct.",
    "Mold safety, low-pressure close, ejector, and robot settings are verified.",
    "Startup samples and process settings match the approved setup documentation.",
    "Setup issues, leaks, or tooling concerns are documented for follow-up.",
  ],
  "First Article Audit": [
    "First article samples are identified and traceable to date, shift, press, and mold.",
    "Critical dimensions and cosmetic requirements were checked to specification.",
    "Material, color, labels, packaging, and revision level are correct.",
    "Quality approval is documented before normal production release.",
    "Any deviations have containment and disposition instructions.",
  ],
  "Process Sheet Audit": [
    "Current process sheet is available at the press and revision controlled.",
    "Barrel, mold, hot runner, and dryer settings match documented targets.",
    "Injection, pack/hold, recovery, cooling, and cycle settings are in range.",
    "Alarms, limits, and key process variables are active where required.",
    "Process changes since last approval are recorded with rationale and results.",
  ],
};

function buildItems(type: AuditType): ChecklistItem[] {
  return checklistTemplates[type].map((text, index) => ({
    id: `${type}-${index}`,
    text,
    result: "",
    note: "",
    correctiveAction: "",
  }));
}

function newAudit(type: AuditType = "Layered Process Audit"): Audit {
  const now = new Date().toISOString();
  return {
    id: "",
    createdAt: "",
    updatedAt: "",
    auditType: type,
    date: now.slice(0, 10),
    machine: "",
    mold: "",
    partNumber: "",
    auditor: "",
    area: "",
    status: "Draft",
    notes: "",
    items: buildItems(type),
  };
}

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function calculateStatus(items: ChecklistItem[]): AuditStatus {
  if (items.some((item) => item.result === "Fail" && item.correctiveAction.trim())) return "Open corrective actions";
  if (items.some((item) => item.result === "Fail")) return "Failed";
  if (items.length > 0 && items.every((item) => item.result === "Pass" || item.result === "N/A")) return "Passed";
  return "Draft";
}

export default function AuditChecklistPage() {
  const [audit, setAudit] = useState<Audit>(() => newAudit());
  const [savedAudits, setSavedAudits] = useState<Audit[]>([]);
  const [message, setMessage] = useState("Ready to build an audit checklist");
  const [filters, setFilters] = useState({ type: "All", date: "", machine: "", status: "All" });

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setSavedAudits(JSON.parse(stored) as Audit[]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAudits));
  }, [savedAudits]);

  const score = useMemo(() => {
    const scored = audit.items.filter((item) => item.result === "Pass" || item.result === "Fail");
    const passed = scored.filter((item) => item.result === "Pass").length;
    return { passed, total: scored.length, percent: scored.length ? Math.round((passed / scored.length) * 100) : 0 };
  }, [audit.items]);

  const filteredAudits = savedAudits.filter((item) => {
    const typeMatch = filters.type === "All" || item.auditType === filters.type;
    const dateMatch = !filters.date || item.date === filters.date;
    const machineMatch = !filters.machine || item.machine.toLowerCase().includes(filters.machine.toLowerCase());
    const statusMatch = filters.status === "All" || item.status === filters.status;
    return typeMatch && dateMatch && machineMatch && statusMatch;
  });

  function updateAudit<K extends keyof Audit>(key: K, value: Audit[K]) {
    if (key === "auditType") {
      const auditType = value as AuditType;
      setAudit((current) => ({ ...current, auditType, items: buildItems(auditType), status: "Draft" }));
      return;
    }
    setAudit((current) => ({ ...current, [key]: value }));
  }

  function updateItem(id: string, patch: Partial<ChecklistItem>) {
    setAudit((current) => {
      const items = current.items.map((item) => (item.id === id ? { ...item, ...patch } : item));
      return { ...current, items, status: calculateStatus(items) };
    });
  }

  function saveAudit(event: FormEvent) {
    event.preventDefault();
    const now = new Date().toISOString();
    const record: Audit = {
      ...audit,
      id: audit.id || crypto.randomUUID(),
      createdAt: audit.createdAt || now,
      updatedAt: now,
      status: calculateStatus(audit.items),
    };
    setSavedAudits((current) => [record, ...current.filter((item) => item.id !== record.id)]);
    setAudit(record);
    setMessage(`${record.auditType} saved for ${record.machine || "unassigned machine"}.`);
  }

  function editAudit(record: Audit) {
    setAudit(record);
    setMessage(`Editing ${record.auditType} from ${formatDate(record.date)}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteAudit(id: string) {
    setSavedAudits((current) => current.filter((item) => item.id !== id));
    if (audit.id === id) setAudit(newAudit());
    setMessage("Audit deleted from this browser.");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:text-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:shadow-none">
          <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Back to dashboard</Link>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Quality Tools</p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-slate-950">Audit Checklist System</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Create mobile-first audit checklists, record pass/fail evidence, assign corrective actions, and print a clean report for layered process, 5S, safety, setup, first article, and process sheet audits.
              </p>
            </div>
            <button type="button" onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950 print:hidden">Print report</button>
          </div>
        </header>

        <form onSubmit={saveAudit} className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] print:block">
          <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 sm:p-6 print:border-slate-300 print:bg-white">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-bold">Audit type
                <select value={audit.auditType} onChange={(e) => updateAudit("auditType", e.target.value as AuditType)} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white print:border-slate-300 print:bg-white print:text-slate-950">
                  {auditTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm font-bold">Date
                <input type="date" value={audit.date} onChange={(e) => updateAudit("date", e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white print:border-slate-300 print:bg-white print:text-slate-950" />
              </label>
              {(["machine", "mold", "partNumber", "auditor", "area"] as const).map((field) => (
                <label key={field} className="space-y-2 text-sm font-bold capitalize">{field.replace(/([A-Z])/g, " $1")}
                  <input value={audit[field]} onChange={(e) => updateAudit(field, e.target.value)} placeholder={field === "machine" ? "Press 07" : ""} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white placeholder:text-slate-500 print:border-slate-300 print:bg-white print:text-slate-950" />
                </label>
              ))}
            </div>

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200 print:text-slate-700">Score</p>
              <p className="mt-2 text-3xl font-black text-white print:text-slate-950">{score.percent}% <span className="text-base text-slate-300 print:text-slate-700">({score.passed}/{score.total} passed)</span></p>
              <p className="mt-1 text-sm text-slate-300 print:text-slate-700">Status: {calculateStatus(audit.items)}</p>
            </div>

            <div className="space-y-4">
              {audit.items.map((item, index) => (
                <article key={item.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 print:border-slate-300 print:bg-white">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h2 className="font-black text-white print:text-slate-950">{index + 1}. {item.text}</h2>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Pass", "Fail", "N/A"] as const).map((result) => (
                        <button type="button" key={result} onClick={() => updateItem(item.id, { result })} className={`rounded-xl px-3 py-2 text-sm font-black ${item.result === result ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-950"}`}>{result}</button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <textarea value={item.note} onChange={(e) => updateItem(item.id, { note: e.target.value })} placeholder="Evidence / notes" className="min-h-24 rounded-2xl border border-white/10 bg-slate-900 p-3 text-sm text-white placeholder:text-slate-500 print:border-slate-300 print:bg-white print:text-slate-950" />
                    <textarea value={item.correctiveAction} onChange={(e) => updateItem(item.id, { correctiveAction: e.target.value })} placeholder="Corrective action / owner / due date" className="min-h-24 rounded-2xl border border-white/10 bg-slate-900 p-3 text-sm text-white placeholder:text-slate-500 print:border-slate-300 print:bg-white print:text-slate-950" />
                  </div>
                </article>
              ))}
            </div>

            <label className="space-y-2 text-sm font-bold">Overall notes
              <textarea value={audit.notes} onChange={(e) => updateAudit("notes", e.target.value)} className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 p-3 text-white print:border-slate-300 print:bg-white print:text-slate-950" />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row print:hidden">
              <button className="rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950">Save audit</button>
              <button type="button" onClick={() => { setAudit(newAudit()); setMessage("New audit started."); }} className="rounded-2xl border border-white/10 px-5 py-3 font-black text-white">New checklist</button>
            </div>
            <p className="text-sm font-bold text-cyan-200 print:hidden">{message}</p>
          </section>

          <aside className="space-y-5 print:hidden">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-2xl font-black text-white">Saved audits</h2>
              <div className="mt-4 grid gap-3">
                <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 p-3 text-white"><option>All</option>{auditTypes.map((type) => <option key={type}>{type}</option>)}</select>
                <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 p-3 text-white" />
                <input value={filters.machine} onChange={(e) => setFilters({ ...filters, machine: e.target.value })} placeholder="Filter by machine" className="rounded-2xl border border-white/10 bg-slate-950 p-3 text-white placeholder:text-slate-500" />
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 p-3 text-white"><option>All</option>{["Draft", "Open corrective actions", "Passed", "Failed"].map((status) => <option key={status}>{status}</option>)}</select>
              </div>
            </section>

            <section className="space-y-3">
              {filteredAudits.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-5 text-sm text-slate-300">No saved audits match the current filters.</p> : null}
              {filteredAudits.map((record) => (
                <article key={record.id} className="rounded-3xl border border-white/10 bg-slate-900 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-white">{record.auditType}</h3>
                      <p className="mt-1 text-sm text-slate-300">{formatDate(record.date)} • {record.machine || "No machine"}</p>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">{record.status}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => editAudit(record)} className="rounded-xl bg-cyan-300 px-3 py-2 text-sm font-black text-slate-950">Edit</button>
                    <button type="button" onClick={() => deleteAudit(record.id)} className="rounded-xl bg-rose-400 px-3 py-2 text-sm font-black text-white">Delete</button>
                  </div>
                </article>
              ))}
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}
