"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ColorChangeRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  shift: string;
  materialType: string;
  previousColor: string;
  newColor: string;
  machineNumber: string;
  moldNumber: string;
  partNumber: string;
  purgeStartTime: string;
  purgeEndTime: string;
  scrapGenerated: string;
  firstGoodPartTime: string;
  operatorName: string;
  processTechnicianName: string;
  purgeCompoundUsed: string;
  notes: string;
};

type Field = {
  name: keyof ColorChangeRecord;
  label: string;
  placeholder?: string;
  type?: "date" | "time" | "textarea";
};

type Section = {
  title: string;
  description: string;
  fields: Field[];
};

const STORAGE_KEY = "molding-mentor-material-color-change-log";

const blankRecord: ColorChangeRecord = {
  id: "",
  createdAt: "",
  updatedAt: "",
  date: "",
  shift: "",
  materialType: "",
  previousColor: "",
  newColor: "",
  machineNumber: "",
  moldNumber: "",
  partNumber: "",
  purgeStartTime: "",
  purgeEndTime: "",
  scrapGenerated: "",
  firstGoodPartTime: "",
  operatorName: "",
  processTechnicianName: "",
  purgeCompoundUsed: "",
  notes: "",
};

const sections: Section[] = [
  {
    title: "Changeover identification",
    description: "Document the machine, mold, part, shift, and material identity before beginning the color change.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "shift", label: "Shift", placeholder: "1st, 2nd, 3rd, Weekend" },
      { name: "materialType", label: "Material type", placeholder: "ABS, Nylon, PC, PP..." },
      { name: "previousColor", label: "Previous color", placeholder: "Black, Natural, Blue 286..." },
      { name: "newColor", label: "New color", placeholder: "White, Red 185, custom masterbatch..." },
    ],
  },
  {
    title: "Color change timing",
    description: "Track purge compound usage, purge timing, scrap, and first-good-part timing for changeover accountability.",
    fields: [
      { name: "machineNumber", label: "Machine number", placeholder: "Machine 12" },
      { name: "moldNumber", label: "Mold number", placeholder: "M-1042" },
      { name: "partNumber", label: "Part number", placeholder: "PN-88421" },
      { name: "purgeStartTime", label: "Purge start time", type: "time" },
      { name: "purgeEndTime", label: "Purge end time", type: "time" },
      { name: "scrapGenerated", label: "Scrap generated during changeover", placeholder: "18 lb, 2 boxes, 45 parts..." },
      { name: "firstGoodPartTime", label: "First good part time", type: "time" },
      { name: "operatorName", label: "Operator name", placeholder: "Name or initials" },
      { name: "processTechnicianName", label: "Process technician name", placeholder: "Technician name or initials" },
    ],
  },
  {
    title: "Procedure notes",
    description: "Capture operator handoff notes, process technician guidance, contamination concerns, and approval comments.",
    fields: [
      { name: "purgeCompoundUsed", label: "Purge compound used", type: "textarea", placeholder: "Commercial purge, natural resin, none..." },
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

function getDuration(record: Pick<ColorChangeRecord, "purgeStartTime" | "purgeEndTime">) {
  if (!record.purgeStartTime || !record.purgeEndTime) return "Pending";
  const [startHour, startMinute] = record.purgeStartTime.split(":").map(Number);
  const [endHour, endMinute] = record.purgeEndTime.split(":").map(Number);
  let minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  if (minutes < 0) minutes += 24 * 60;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} hr`;
  return `${hours} hr ${remainder} min`;
}

export default function ColorChangeProcedureLogPage() {
  const [record, setRecord] = useState<ColorChangeRecord>(blankRecord);
  const [savedRecords, setSavedRecords] = useState<ColorChangeRecord[]>([]);
  const [filter, setFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState("Color change log draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedRecords(JSON.parse(saved) as ColorChangeRecord[]);
  }, []);

  const recordTitle = useMemo(
    () => record.partNumber || `${record.previousColor || "Previous color"} to ${record.newColor || "new color"}` || "Untitled color change log",
    [record.partNumber, record.previousColor, record.newColor],
  );

  const filteredRecords = useMemo(() => {
    const query = filter.toLowerCase().trim();
    if (!query) return savedRecords;
    return savedRecords.filter((saved) =>
      [saved.materialType, saved.previousColor, saved.newColor, saved.moldNumber, saved.partNumber, saved.machineNumber, saved.date]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [filter, savedRecords]);

  const completedChangeovers = useMemo(
    () => savedRecords.filter((saved) => saved.purgeStartTime && saved.purgeEndTime).length,
    [savedRecords],
  );

  function updateField(name: keyof ColorChangeRecord, value: string) {
    setRecord((current) => ({ ...current, [name]: value }));
  }

  function persist(nextRecord: ColorChangeRecord, nextRecords: ColorChangeRecord[]) {
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

  function editRecord(savedRecord: ColorChangeRecord) {
    setRecord(savedRecord);
    setStatusMessage(`Editing ${savedRecord.partNumber || savedRecord.newColor || "color change log"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(recordId: string) {
    const nextRecords = savedRecords.filter((saved) => saved.id !== recordId);
    setSavedRecords(nextRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    if (record.id === recordId) setRecord(blankRecord);
    setStatusMessage("Deleted color change log record");
  }

  function startNewRecord() {
    setRecord(blankRecord);
    setStatusMessage("New color change log draft ready");
  }

  function printReport() {
    setStatusMessage("Opening color change report");
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
                <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Color Change Procedure & Log</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create color change logs, save them to this browser, edit or delete saved records, filter by machine, mold, color, material, or date, and print a color change report.</p>
              </div>
              <div className="grid gap-3 sm:min-w-64 print:hidden">
                <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">{statusMessage}</div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3"><p className="text-2xl font-black text-white">{savedRecords.length}</p><p className="mt-1 font-bold text-slate-300">Logs</p></div>
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-2 py-3"><p className="text-2xl font-black text-emerald-100">{completedChangeovers}</p><p className="mt-1 font-bold text-emerald-100">Completed</p></div>
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
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current color change</p>
              <h2 className="mt-3 text-2xl font-black text-white">{recordTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Date: {formatDate(record.date)}</p>
              <p className="mt-1 text-sm text-slate-400">Machine: {record.machineNumber || "Not set"}</p>
              <p className="mt-1 text-sm text-slate-400">Total changeover time: {getDuration(record)}</p>
              <p className="mt-1 text-sm text-slate-400">Scrap generated: {record.scrapGenerated || "Not recorded"}</p>
              <p className="mt-1 text-sm text-slate-400">Last saved: {formatDateTime(record.updatedAt)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save color change log</button>
                <button type="button" onClick={startNewRecord} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New log</button>
                <button type="button" onClick={printReport} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print color change report</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved color change logs</h2>
              <p className="mt-1 text-xs text-slate-400">Showing {filteredRecords.length} of {savedRecords.length}</p>
              <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter machine, mold, color, material, or date" className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
              <div className="mt-4 space-y-3">
                {filteredRecords.length === 0 ? <p className="text-sm text-slate-400">Saved color change logs will appear here for review, filtering, editing, deletion, and print preparation.</p> : null}
                {filteredRecords.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editRecord(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.partNumber || `${saved.previousColor || "Previous"} to ${saved.newColor || "new"}`}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.previousColor || "No previous color"} → {saved.newColor || "No new color"} • {saved.materialType || "No material"}</span>
                      <span className="mt-1 block text-xs text-slate-500">Machine {saved.machineNumber || "not set"} • Mold {saved.moldNumber || "not set"} • {formatDate(saved.date)}</span>
                      <span className="mt-1 block text-xs text-slate-500">Total changeover {getDuration(saved)} • Scrap {saved.scrapGenerated || "not recorded"} • Updated {formatDateTime(saved.updatedAt)}</span>
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
