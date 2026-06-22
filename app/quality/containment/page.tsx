"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Disposition = "Rework" | "Scrap" | "Use As Is" | "Awaiting Review";

type ContainmentRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  partNumber: string;
  moldNumber: string;
  machineNumber: string;
  defectFound: string;
  quantityOnHold: string;
  locationOfHeldParts: string;
  suspectTimeRange: string;
  containmentAction: string;
  sortInstructions: string;
  disposition: Disposition;
  responsiblePerson: string;
  notes: string;
};

type Field = {
  name: keyof ContainmentRecord;
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

const STORAGE_KEY = "molding-mentor-containment-records";

const blankRecord: ContainmentRecord = {
  id: "",
  createdAt: "",
  updatedAt: "",
  date: "",
  partNumber: "",
  moldNumber: "",
  machineNumber: "",
  defectFound: "",
  quantityOnHold: "",
  locationOfHeldParts: "",
  suspectTimeRange: "",
  containmentAction: "",
  sortInstructions: "",
  disposition: "Awaiting Review",
  responsiblePerson: "",
  notes: "",
};

const sections: Section[] = [
  {
    title: "Hold details",
    description: "Identify the affected product, equipment, defect, quantity, and physical hold location.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "partNumber", label: "Part number", placeholder: "PN-1048-A" },
      { name: "moldNumber", label: "Mold number", placeholder: "M-22" },
      { name: "machineNumber", label: "Machine number", placeholder: "Press 07" },
      { name: "defectFound", label: "Defect found", placeholder: "Flash at gate, short shot, contamination..." },
      { name: "quantityOnHold", label: "Quantity on hold", placeholder: "1250", type: "number" },
      { name: "locationOfHeldParts", label: "Location of held parts", placeholder: "QA cage, red rack B, pallet 4" },
      { name: "suspectTimeRange", label: "Suspect time range", placeholder: "06:30-09:45, or last accepted check to discovery" },
    ],
  },
  {
    title: "Containment plan",
    description: "Record the immediate hold action, sorting criteria, disposition, owner, and follow-up notes.",
    fields: [
      {
        name: "containmentAction",
        label: "Containment action",
        placeholder: "Stopped press, tagged pallets, isolated WIP, notified supervisor and quality.",
        type: "textarea",
      },
      {
        name: "sortInstructions",
        label: "Sort instructions",
        placeholder: "Inspect 100% for flash over 0.15 mm at gate; segregate fails in red bins.",
        type: "textarea",
      },
      {
        name: "disposition",
        label: "Disposition",
        type: "select",
        options: ["Rework", "Scrap", "Use As Is", "Awaiting Review"],
      },
      { name: "responsiblePerson", label: "Responsible person", placeholder: "J. Rivera" },
      {
        name: "notes",
        label: "Notes",
        placeholder: "Customer notification, sample plan, MRB number, reinspection status, or follow-up actions.",
        type: "textarea",
      },
    ],
  },
];

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function quantityValue(record: ContainmentRecord) {
  const value = Number(record.quantityOnHold);
  return Number.isFinite(value) ? value : 0;
}

export default function ContainmentTrackerPage() {
  const [record, setRecord] = useState<ContainmentRecord>(blankRecord);
  const [savedRecords, setSavedRecords] = useState<ContainmentRecord[]>([]);
  const [status, setStatus] = useState("Draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedRecords(JSON.parse(saved) as ContainmentRecord[]);
  }, []);

  const recordTitle = useMemo(
    () => record.partNumber || record.defectFound || record.moldNumber || "Untitled containment record",
    [record.defectFound, record.moldNumber, record.partNumber],
  );

  const totalQuantityOnHold = useMemo(
    () => savedRecords.reduce((total, saved) => total + quantityValue(saved), 0),
    [savedRecords],
  );

  function updateField(name: keyof ContainmentRecord, value: string) {
    setRecord((current) => ({ ...current, [name]: value }));
  }

  function persist(nextRecord: ContainmentRecord, nextRecords: ContainmentRecord[]) {
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
    setStatus(`Saved ${recordTitle}`);
  }

  function editRecord(savedRecord: ContainmentRecord) {
    setRecord(savedRecord);
    setStatus(`Editing ${savedRecord.partNumber || savedRecord.defectFound || "saved record"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(recordId: string) {
    const nextRecords = savedRecords.filter((saved) => saved.id !== recordId);
    setSavedRecords(nextRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    if (record.id === recordId) setRecord(blankRecord);
    setStatus("Deleted saved containment record");
  }

  function startNewRecord() {
    setRecord(blankRecord);
    setStatus("New draft ready");
  }

  function printRecord() {
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
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Quality tools</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Quality Hold / Containment Tracker</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create containment records, keep local browser history, total held quantity, and print a clean hold summary for review.</p>
            </div>
            <div className="grid gap-3 sm:min-w-56 print:hidden">
              <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">{status}</div>
              <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">Total on hold</p>
                <p className="mt-1 text-3xl font-black text-white">{totalQuantityOnHold.toLocaleString()}</p>
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
                      ) : field.type === "select" ? (
                        <select value={String(record[field.name])} onChange={(event) => updateField(field.name, event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950">
                          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input type={field.type || "text"} min={field.type === "number" ? "0" : undefined} value={String(record[field.name])} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 print:border-slate-300 print:bg-white print:text-slate-950" />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 print:hidden">
            <section className="sticky top-4 rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current hold</p>
              <h2 className="mt-3 text-2xl font-black text-white">{recordTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Last saved: {formatDateTime(record.updatedAt)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save record</button>
                <button type="button" onClick={startNewRecord} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New record</button>
                <button type="button" onClick={printRecord} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print-friendly view</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-white">Saved records</h2>
                <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-black text-amber-100">{totalQuantityOnHold.toLocaleString()} held</span>
              </div>
              <div className="mt-4 space-y-3">
                {savedRecords.length === 0 ? <p className="text-sm text-slate-400">Saved containment records will appear here for quick review, editing, deletion, and total-on-hold tracking.</p> : null}
                {savedRecords.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editRecord(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.partNumber || saved.defectFound || "Untitled hold"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.quantityOnHold || "0"} held • {saved.disposition} • {formatDateTime(saved.updatedAt)}</span>
                      <span className="mt-2 block text-sm text-slate-300">{saved.locationOfHeldParts || "No location recorded"}</span>
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
