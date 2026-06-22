"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type WorkInstructionStatus = "Draft" | "Active" | "Under Review" | "Archived";

type WorkInstruction = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  documentNumber: string;
  revisionLevel: string;
  department: string;
  machineArea: string;
  status: WorkInstructionStatus;
  purpose: string;
  requiredPpe: string;
  requiredTools: string;
  stepInstructions: string;
  safetyWarnings: string;
  qualityChecks: string;
  imageNotes: string;
  preparedBy: string;
  approvedBy: string;
  effectiveDate: string;
};

type Field = {
  name: keyof WorkInstruction;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  type?: "date";
};

type Section = {
  title: string;
  description: string;
  fields: Field[];
};

const STORAGE_KEY = "molding-mentor-work-instructions";
const statusOptions: WorkInstructionStatus[] = ["Draft", "Active", "Under Review", "Archived"];

const blankInstruction: WorkInstruction = {
  id: "",
  createdAt: "",
  updatedAt: "",
  title: "",
  documentNumber: "",
  revisionLevel: "",
  department: "",
  machineArea: "",
  status: "Draft",
  purpose: "",
  requiredPpe: "",
  requiredTools: "",
  stepInstructions: "",
  safetyWarnings: "",
  qualityChecks: "",
  imageNotes: "",
  preparedBy: "",
  approvedBy: "",
  effectiveDate: "",
};

const sections: Section[] = [
  {
    title: "Document control",
    description: "Identify the instruction, ownership, revision, and effective date before it reaches the floor.",
    fields: [
      { name: "title", label: "Work instruction title", placeholder: "Startup verification for Press 12" },
      { name: "documentNumber", label: "Document number", placeholder: "WI-MOLD-012" },
      { name: "revisionLevel", label: "Revision level", placeholder: "Rev. B" },
      { name: "department", label: "Department", placeholder: "Molding" },
      { name: "machineArea", label: "Machine / process area", placeholder: "Press 12 / Cell 4" },
      { name: "effectiveDate", label: "Effective date", type: "date" },
    ],
  },
  {
    title: "Instruction scope",
    description: "Capture the reason for the instruction and the resources operators need before starting.",
    fields: [
      { name: "purpose", label: "Purpose", placeholder: "Explain when and why this instruction must be followed.", multiline: true },
      { name: "requiredPpe", label: "Required PPE", placeholder: "Safety glasses, gloves, sleeves, hearing protection", multiline: true },
      { name: "requiredTools", label: "Required tools", placeholder: "Torque wrench, clean lint-free cloth, purge shield", multiline: true },
    ],
  },
  {
    title: "Execution details",
    description: "Write clear steps, warnings, and quality gates that can be printed for shop-floor use.",
    fields: [
      { name: "stepInstructions", label: "Step-by-step instructions", placeholder: "1. Verify the mold is clamped...\n2. Confirm water circuits...", multiline: true },
      { name: "safetyWarnings", label: "Safety warnings", placeholder: "Never reach past guarding while the machine is in automatic mode.", multiline: true },
      { name: "qualityChecks", label: "Quality checks", placeholder: "Inspect first five parts for flash, shorts, splay, and critical dimensions.", multiline: true },
      { name: "imageNotes", label: "Photos or image placeholders", placeholder: "Photo 1: Correct hose routing. Photo 2: Acceptable gate trim sample.", multiline: true },
    ],
  },
  {
    title: "Approval",
    description: "Record who prepared and approved the work instruction.",
    fields: [
      { name: "preparedBy", label: "Prepared by", placeholder: "Process Technician" },
      { name: "approvedBy", label: "Approved by", placeholder: "Production Manager" },
    ],
  },
];

function formatDate(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function WorkInstructionBuilder() {
  const [instruction, setInstruction] = useState<WorkInstruction>(blankInstruction);
  const [savedInstructions, setSavedInstructions] = useState<WorkInstruction[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [machineFilter, setMachineFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | WorkInstructionStatus>("All");
  const [statusMessage, setStatusMessage] = useState("Draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedInstructions(JSON.parse(saved) as WorkInstruction[]);
  }, []);

  const activeTitle = useMemo(() => instruction.title || instruction.documentNumber || "Untitled work instruction", [instruction.documentNumber, instruction.title]);
  const departments = useMemo(() => ["All", ...Array.from(new Set(savedInstructions.map((item) => item.department).filter(Boolean))).sort()], [savedInstructions]);
  const machines = useMemo(() => ["All", ...Array.from(new Set(savedInstructions.map((item) => item.machineArea).filter(Boolean))).sort()], [savedInstructions]);
  const filteredInstructions = useMemo(() => savedInstructions.filter((item) => {
    const departmentMatches = departmentFilter === "All" || item.department === departmentFilter;
    const machineMatches = machineFilter === "All" || item.machineArea === machineFilter;
    const statusMatches = statusFilter === "All" || item.status === statusFilter;
    return departmentMatches && machineMatches && statusMatches;
  }), [departmentFilter, machineFilter, savedInstructions, statusFilter]);

  function updateField(name: keyof WorkInstruction, value: string) {
    setInstruction((current) => ({ ...current, [name]: value }));
  }

  function persist(nextInstruction: WorkInstruction, nextInstructions: WorkInstruction[]) {
    setInstruction(nextInstruction);
    setSavedInstructions(nextInstructions);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextInstructions));
  }

  function saveInstruction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const nextInstruction = { ...instruction, id: instruction.id || crypto.randomUUID(), createdAt: instruction.createdAt || timestamp, updatedAt: timestamp };
    const nextInstructions = [nextInstruction, ...savedInstructions.filter((item) => item.id !== nextInstruction.id)];
    persist(nextInstruction, nextInstructions);
    setStatusMessage(`Saved ${nextInstruction.title || nextInstruction.documentNumber || "work instruction"}`);
  }

  function editInstruction(savedInstruction: WorkInstruction) {
    setInstruction(savedInstruction);
    setStatusMessage(`Editing ${savedInstruction.title || savedInstruction.documentNumber || "saved instruction"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteInstruction(id: string) {
    const nextInstructions = savedInstructions.filter((item) => item.id !== id);
    setSavedInstructions(nextInstructions);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextInstructions));
    if (instruction.id === id) setInstruction(blankInstruction);
    setStatusMessage("Deleted saved work instruction");
  }

  function startNewInstruction() {
    setInstruction(blankInstruction);
    setStatusMessage("New draft ready");
  }

  function printInstruction() {
    setStatusMessage("Opening print-friendly work instruction");
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:p-0 print:shadow-none sm:p-8">
          <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:mt-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Management tools</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Work Instruction Builder</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create, save, filter, edit, delete, and print controlled work instructions from a mobile-first dark workspace.</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100 print:hidden">{statusMessage}</div>
          </div>
        </header>

        <form onSubmit={saveInstruction} className="grid gap-5 lg:grid-cols-[1fr_24rem] print:block">
          <div className="space-y-5">
            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 print:mb-4 print:break-inside-avoid print:border-slate-300 print:bg-white print:p-4 sm:p-6">
              <label>
                <span className="text-sm font-semibold text-slate-200 print:text-slate-700">Status</span>
                <select value={instruction.status} onChange={(event) => updateField("status", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950">
                  {statusOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            </section>

            {sections.map((section) => (
              <section key={section.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 print:mb-4 print:break-inside-avoid print:border-slate-300 print:bg-white print:p-4 print:shadow-none sm:p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-white print:text-slate-950">{section.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400 print:text-slate-600">{section.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <label key={field.name} className={field.multiline ? "sm:col-span-2" : ""}>
                      <span className="text-sm font-semibold text-slate-200 print:text-slate-700">{field.label}</span>
                      {field.multiline ? (
                        <textarea value={String(instruction[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={5} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:min-h-20 print:border-slate-300 print:bg-white print:text-slate-950" />
                      ) : (
                        <input type={field.type || "text"} value={String(instruction[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 print:hidden">
            <section className="sticky top-4 rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current instruction</p>
              <h2 className="mt-3 text-2xl font-black text-white">{activeTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Last saved: {formatDate(instruction.updatedAt)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save work instruction</button>
                <button type="button" onClick={startNewInstruction} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New instruction</button>
                <button type="button" onClick={printInstruction} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print-friendly view</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved work instructions</h2>
              <div className="mt-4 grid gap-3">
                <select aria-label="Filter by department" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white">
                  {departments.map((department) => <option key={department}>{department}</option>)}
                </select>
                <select aria-label="Filter by machine or process area" value={machineFilter} onChange={(event) => setMachineFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white">
                  {machines.map((machine) => <option key={machine}>{machine}</option>)}
                </select>
                <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | WorkInstructionStatus)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white">
                  {["All", ...statusOptions].map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="mt-4 space-y-3">
                {filteredInstructions.length === 0 ? <p className="text-sm text-slate-400">Saved work instructions that match your filters will appear here.</p> : null}
                {filteredInstructions.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editInstruction(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.title || saved.documentNumber || "Untitled instruction"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.department || "No department"} • {saved.machineArea || "No area"} • {saved.status}</span>
                      <span className="mt-1 block text-xs text-slate-500">Updated {formatDate(saved.updatedAt)}</span>
                    </button>
                    <button type="button" onClick={() => deleteInstruction(saved.id)} className="mt-3 rounded-xl border border-rose-300/30 px-3 py-2 text-xs font-bold text-rose-200 transition hover:bg-rose-300/10">Delete</button>
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
