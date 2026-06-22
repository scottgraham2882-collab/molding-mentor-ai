"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ProcessSheet = {
  id: string;
  createdAt: string;
  updatedAt: string;
  customer: string;
  partNumber: string;
  moldNumber: string;
  machineNumber: string;
  material: string;
  dryingTemperature: string;
  dryingTime: string;
  fillSpeed: string;
  transferPosition: string;
  peakInjectionPressure: string;
  holdPressure: string;
  holdTime: string;
  coolingTime: string;
  moldTemperature: string;
  screwSpeed: string;
  backPressure: string;
  partWeight: string;
  criticalDimensions: string;
  visualInspectionNotes: string;
};

type Field = {
  name: keyof ProcessSheet;
  label: string;
  placeholder?: string;
  multiline?: boolean;
};

type Section = {
  title: string;
  description: string;
  fields: Field[];
};

const STORAGE_KEY = "molding-mentor-process-sheets";

const blankSheet: ProcessSheet = {
  id: "",
  createdAt: "",
  updatedAt: "",
  customer: "",
  partNumber: "",
  moldNumber: "",
  machineNumber: "",
  material: "",
  dryingTemperature: "",
  dryingTime: "",
  fillSpeed: "",
  transferPosition: "",
  peakInjectionPressure: "",
  holdPressure: "",
  holdTime: "",
  coolingTime: "",
  moldTemperature: "",
  screwSpeed: "",
  backPressure: "",
  partWeight: "",
  criticalDimensions: "",
  visualInspectionNotes: "",
};

const sections: Section[] = [
  {
    title: "Job details",
    description: "Identify the customer, tool, press, and resin preparation conditions.",
    fields: [
      { name: "customer", label: "Customer", placeholder: "Acme Medical" },
      { name: "partNumber", label: "Part Number", placeholder: "PN-1048-A" },
      { name: "moldNumber", label: "Mold Number", placeholder: "M-22" },
      { name: "machineNumber", label: "Machine Number", placeholder: "Press 07" },
      { name: "material", label: "Material", placeholder: "PC/ABS, natural" },
      { name: "dryingTemperature", label: "Drying Temperature", placeholder: "180°F" },
      { name: "dryingTime", label: "Drying Time", placeholder: "4 hr" },
    ],
  },
  {
    title: "Fill settings",
    description: "Capture the first-stage velocity profile and transfer target.",
    fields: [
      { name: "fillSpeed", label: "Fill Speed", placeholder: "3.5 in/s" },
      { name: "transferPosition", label: "Transfer Position", placeholder: "0.42 in cushion" },
      { name: "peakInjectionPressure", label: "Peak Injection Pressure", placeholder: "12,500 psi" },
    ],
  },
  {
    title: "Pack settings",
    description: "Document hold pressure and time used after velocity-to-pressure transfer.",
    fields: [
      { name: "holdPressure", label: "Hold Pressure", placeholder: "7,800 psi" },
      { name: "holdTime", label: "Hold Time", placeholder: "6.0 s" },
    ],
  },
  {
    title: "Cooling",
    description: "Record cooling time and actual mold temperature targets.",
    fields: [
      { name: "coolingTime", label: "Cooling Time", placeholder: "18 s" },
      { name: "moldTemperature", label: "Mold Temperature", placeholder: "95°F" },
    ],
  },
  {
    title: "Recovery",
    description: "Track screw recovery settings that influence melt quality and consistency.",
    fields: [
      { name: "screwSpeed", label: "Screw Speed", placeholder: "75 rpm" },
      { name: "backPressure", label: "Back Pressure", placeholder: "90 psi" },
    ],
  },
  {
    title: "Quality checks",
    description: "Keep the acceptance checks with the setup sheet for faster startup approval.",
    fields: [
      { name: "partWeight", label: "Part Weight", placeholder: "24.6 g" },
      { name: "criticalDimensions", label: "Critical Dimensions", placeholder: "Bore ID 12.70 ± 0.05 mm", multiline: true },
      { name: "visualInspectionNotes", label: "Visual Inspection Notes", placeholder: "No flash, splay, sinks, or gate blush accepted.", multiline: true },
    ],
  },
];

function formatDate(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ProcessSheetBuilder() {
  const [sheet, setSheet] = useState<ProcessSheet>(blankSheet);
  const [savedSheets, setSavedSheets] = useState<ProcessSheet[]>([]);
  const [status, setStatus] = useState("Draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedSheets(JSON.parse(saved) as ProcessSheet[]);
  }, []);

  const activeTitle = useMemo(() => {
    return sheet.partNumber || sheet.moldNumber || sheet.customer || "Untitled process sheet";
  }, [sheet.customer, sheet.moldNumber, sheet.partNumber]);

  function updateField(name: keyof ProcessSheet, value: string) {
    setSheet((current) => ({ ...current, [name]: value }));
  }

  function persist(nextSheet: ProcessSheet, nextSheets: ProcessSheet[]) {
    setSheet(nextSheet);
    setSavedSheets(nextSheets);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSheets));
  }

  function saveSheet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const nextSheet = {
      ...sheet,
      id: sheet.id || crypto.randomUUID(),
      createdAt: sheet.createdAt || timestamp,
      updatedAt: timestamp,
    };
    const nextSheets = [nextSheet, ...savedSheets.filter((saved) => saved.id !== nextSheet.id)];
    persist(nextSheet, nextSheets);
    setStatus(`Saved ${activeTitle}`);
  }

  function editSheet(savedSheet: ProcessSheet) {
    setSheet(savedSheet);
    setStatus(`Editing ${savedSheet.partNumber || savedSheet.moldNumber || "saved sheet"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startNewSheet() {
    setSheet(blankSheet);
    setStatus("New draft ready");
  }

  function printSheet() {
    setStatus("Opening print-friendly view");
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:p-0 print:shadow-none sm:p-8">
          <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:mt-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Process control</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Process Sheet Builder</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Build, save, edit, print, and export injection molding setup sheets from a mobile-first dark workspace.</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100 print:hidden">{status}</div>
          </div>
        </header>

        <form onSubmit={saveSheet} className="grid gap-5 lg:grid-cols-[1fr_22rem] print:block">
          <div className="space-y-5">
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
                        <textarea value={String(sheet[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:min-h-20 print:border-slate-300 print:bg-white print:text-slate-950" />
                      ) : (
                        <input value={String(sheet[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 print:hidden">
            <section className="sticky top-4 rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current sheet</p>
              <h2 className="mt-3 text-2xl font-black text-white">{activeTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Last saved: {formatDate(sheet.updatedAt)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save process sheet</button>
                <button type="button" onClick={startNewSheet} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New sheet</button>
                <button type="button" onClick={printSheet} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print-friendly view</button>
                <button type="button" onClick={printSheet} className="rounded-2xl border border-violet-300/30 bg-violet-300/10 px-4 py-3 font-bold text-violet-100 transition hover:bg-violet-300/20">Export to PDF</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved sheets</h2>
              <div className="mt-4 space-y-3">
                {savedSheets.length === 0 ? <p className="text-sm text-slate-400">Saved process sheets will appear here for quick editing.</p> : null}
                {savedSheets.map((saved) => (
                  <button key={saved.id} type="button" onClick={() => editSheet(saved)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left transition hover:border-cyan-300/50">
                    <span className="block font-bold text-white">{saved.partNumber || saved.moldNumber || "Untitled sheet"}</span>
                    <span className="mt-1 block text-xs text-slate-400">{saved.customer || "No customer"} • {formatDate(saved.updatedAt)}</span>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </form>
      </section>
    </main>
  );
}
