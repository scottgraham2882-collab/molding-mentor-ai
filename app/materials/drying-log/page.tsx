"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type DryingLogRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  shift: string;
  materialType: string;
  materialGrade: string;
  supplier: string;
  lotNumber: string;
  dryerNumber: string;
  dryerTemperature: string;
  dryerDewPoint: string;
  dryingStartTime: string;
  dryingEndTime: string;
  operatorName: string;
  issuesObserved: string;
  notes: string;
};

type Field = {
  name: keyof DryingLogRecord;
  label: string;
  placeholder?: string;
  type?: "date" | "time" | "textarea";
};

type Section = {
  title: string;
  description: string;
  fields: Field[];
};

const STORAGE_KEY = "molding-mentor-material-drying-log";

const blankRecord: DryingLogRecord = {
  id: "",
  createdAt: "",
  updatedAt: "",
  date: "",
  shift: "",
  materialType: "",
  materialGrade: "",
  supplier: "",
  lotNumber: "",
  dryerNumber: "",
  dryerTemperature: "",
  dryerDewPoint: "",
  dryingStartTime: "",
  dryingEndTime: "",
  operatorName: "",
  issuesObserved: "",
  notes: "",
};

const sections: Section[] = [
  {
    title: "Material identification",
    description: "Capture the resin, supplier, and lot information operators need before material is released to production.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "shift", label: "Shift", placeholder: "1st, 2nd, 3rd, Weekend" },
      { name: "materialType", label: "Material type", placeholder: "ABS, Nylon, PC, PP..." },
      { name: "materialGrade", label: "Material grade", placeholder: "Grade, color, additive package" },
      { name: "supplier", label: "Supplier", placeholder: "Resin supplier or distributor" },
      { name: "lotNumber", label: "Lot number", placeholder: "LOT-2406-18" },
    ],
  },
  {
    title: "Dryer settings and timing",
    description: "Log dryer conditions, start and end time, and dew point evidence for traceable moisture control.",
    fields: [
      { name: "dryerNumber", label: "Dryer number", placeholder: "Dryer 2, Cart A, Hopper 12" },
      { name: "dryerTemperature", label: "Dryer temperature", placeholder: "180°F / 82°C" },
      { name: "dryerDewPoint", label: "Dryer dew point", placeholder: "-40°F / -40°C" },
      { name: "dryingStartTime", label: "Drying start time", type: "time" },
      { name: "dryingEndTime", label: "Drying end time", type: "time" },
      { name: "operatorName", label: "Operator name", placeholder: "Name or initials" },
    ],
  },
  {
    title: "Observations and notes",
    description: "Record moisture concerns, equipment issues, supplier questions, or release notes for future review.",
    fields: [
      { name: "issuesObserved", label: "Issues observed", type: "textarea", placeholder: "Wet material, high dew point, alarm, bridging, contamination, no issues observed..." },
      { name: "notes", label: "Notes", type: "textarea", placeholder: "TDS verified, material released, sample retained, next shift follow-up..." },
    ],
  },
];

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function getDuration(record: Pick<DryingLogRecord, "dryingStartTime" | "dryingEndTime">) {
  if (!record.dryingStartTime || !record.dryingEndTime) return "Pending";
  const [startHour, startMinute] = record.dryingStartTime.split(":").map(Number);
  const [endHour, endMinute] = record.dryingEndTime.split(":").map(Number);
  let minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  if (minutes < 0) minutes += 24 * 60;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} hr`;
  return `${hours} hr ${remainder} min`;
}

export default function MaterialDryingLogPage() {
  const [record, setRecord] = useState<DryingLogRecord>(blankRecord);
  const [savedRecords, setSavedRecords] = useState<DryingLogRecord[]>([]);
  const [filter, setFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState("Drying log draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedRecords(JSON.parse(saved) as DryingLogRecord[]);
  }, []);

  const recordTitle = useMemo(
    () => record.lotNumber || record.materialGrade || record.materialType || "Untitled drying log",
    [record.lotNumber, record.materialGrade, record.materialType],
  );

  const filteredRecords = useMemo(() => {
    const query = filter.toLowerCase().trim();
    if (!query) return savedRecords;
    return savedRecords.filter((saved) =>
      [saved.materialType, saved.materialGrade, saved.lotNumber, saved.dryerNumber, saved.date]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [filter, savedRecords]);

  const completedDryingRuns = useMemo(
    () => savedRecords.filter((saved) => saved.dryingStartTime && saved.dryingEndTime).length,
    [savedRecords],
  );

  function updateField(name: keyof DryingLogRecord, value: string) {
    setRecord((current) => ({ ...current, [name]: value }));
  }

  function persist(nextRecord: DryingLogRecord, nextRecords: DryingLogRecord[]) {
    setRecord(nextRecord);
    setSavedRecords(nextRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
  }

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();
    const nextRecord = {
      ...record,
      id: record.id || crypto.randomUUID(),
      createdAt: record.createdAt || timestamp,
      updatedAt: timestamp,
    };
    const nextRecords = [nextRecord, ...savedRecords.filter((saved) => saved.id !== nextRecord.id)];
    persist(nextRecord, nextRecords);
    setStatusMessage(`Saved ${recordTitle}`);
  }

  function editRecord(savedRecord: DryingLogRecord) {
    setRecord(savedRecord);
    setStatusMessage(`Editing ${savedRecord.lotNumber || savedRecord.materialGrade || "drying log"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(recordId: string) {
    const nextRecords = savedRecords.filter((saved) => saved.id !== recordId);
    setSavedRecords(nextRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    if (record.id === recordId) setRecord(blankRecord);
    setStatusMessage("Deleted drying log record");
  }

  function startNewRecord() {
    setRecord(blankRecord);
    setStatusMessage("New drying log draft ready");
  }

  function printReport() {
    setStatusMessage("Opening drying log print report");
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:p-0 print:shadow-none sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.18),transparent_34%)] print:hidden" />
          <div className="relative">
            <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:mt-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Material Tools</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Material Drying Log</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create, save, edit, filter, delete, and print material drying records with dryer conditions, lot identity, duration, and operator observations.</p>
              </div>
              <div className="grid gap-3 sm:min-w-64 print:hidden">
                <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">{statusMessage}</div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3"><p className="text-2xl font-black text-white">{savedRecords.length}</p><p className="mt-1 font-bold text-slate-300">Logs</p></div>
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-2 py-3"><p className="text-2xl font-black text-emerald-100">{completedDryingRuns}</p><p className="mt-1 font-bold text-emerald-100">Completed</p></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <form onSubmit={saveRecord} className="grid gap-5 lg:grid-cols-[1fr_22rem] print:block">
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
                        <textarea value={String(record[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:min-h-20 print:border-slate-300 print:bg-white print:text-slate-950" />
                      ) : (
                        <input type={field.type || "text"} value={String(record[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 print:hidden">
            <section className="sticky top-4 rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current drying record</p>
              <h2 className="mt-3 text-2xl font-black text-white">{recordTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Date: {formatDate(record.date)}</p>
              <p className="mt-1 text-sm text-slate-400">Dryer: {record.dryerNumber || "Not set"}</p>
              <p className="mt-1 text-sm text-slate-400">Duration: {getDuration(record)}</p>
              <p className="mt-1 text-sm text-slate-400">Last saved: {formatDateTime(record.updatedAt)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save drying log</button>
                <button type="button" onClick={startNewRecord} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New log</button>
                <button type="button" onClick={printReport} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print drying log</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved drying logs</h2>
              <p className="mt-1 text-xs text-slate-400">Showing {filteredRecords.length} of {savedRecords.length}</p>
              <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter material, lot, dryer, or date" className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
              <div className="mt-4 space-y-3">
                {filteredRecords.length === 0 ? <p className="text-sm text-slate-400">Saved drying logs will appear here for review, filtering, editing, deletion, and print preparation.</p> : null}
                {filteredRecords.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editRecord(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.lotNumber || saved.materialGrade || "Untitled drying log"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.materialType || "No material"} • {saved.supplier || "No supplier"}</span>
                      <span className="mt-1 block text-xs text-slate-500">Dryer {saved.dryerNumber || "not set"} • {formatDate(saved.date)}</span>
                      <span className="mt-1 block text-xs text-slate-500">Duration {getDuration(saved)} • Updated {formatDateTime(saved.updatedAt)}</span>
                    </button>
                    <button type="button" onClick={() => deleteRecord(saved.id)} className="mt-3 rounded-xl border border-rose-300/30 px-3 py-2 text-sm font-bold text-rose-200 transition hover:bg-rose-300/10">Delete</button>
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
