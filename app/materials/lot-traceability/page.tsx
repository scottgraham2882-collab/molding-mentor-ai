"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type LotTraceabilityRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  dateReceived: string;
  materialType: string;
  resinSupplier: string;
  materialGrade: string;
  lotNumber: string;
  poNumber: string;
  dryerUsed: string;
  dryingTemperature: string;
  dryingTime: string;
  machineNumber: string;
  moldNumber: string;
  partNumber: string;
  productionDate: string;
  quantityProduced: string;
  issuesObserved: string;
  notes: string;
};

type Field = {
  name: keyof LotTraceabilityRecord;
  label: string;
  placeholder?: string;
  type?: "date" | "number" | "textarea";
};

type Section = {
  title: string;
  description: string;
  fields: Field[];
};

const STORAGE_KEY = "molding-mentor-material-lot-traceability";

const blankRecord: LotTraceabilityRecord = {
  id: "",
  createdAt: "",
  updatedAt: "",
  dateReceived: "",
  materialType: "",
  resinSupplier: "",
  materialGrade: "",
  lotNumber: "",
  poNumber: "",
  dryerUsed: "",
  dryingTemperature: "",
  dryingTime: "",
  machineNumber: "",
  moldNumber: "",
  partNumber: "",
  productionDate: "",
  quantityProduced: "",
  issuesObserved: "",
  notes: "",
};

const sections: Section[] = [
  {
    title: "Receiving and supplier details",
    description: "Capture the resin shipment identity needed to connect production records back to the supplier lot and purchase order.",
    fields: [
      { name: "dateReceived", label: "Date received", type: "date" },
      { name: "materialType", label: "Material type", placeholder: "ABS, PC, PP, Nylon, TPE..." },
      { name: "resinSupplier", label: "Resin supplier", placeholder: "Supplier or distributor name" },
      { name: "materialGrade", label: "Material grade", placeholder: "Grade, color, additive package" },
      { name: "lotNumber", label: "Lot number", placeholder: "LOT-2406-18" },
      { name: "poNumber", label: "PO number", placeholder: "PO-10482" },
    ],
  },
  {
    title: "Drying and production setup",
    description: "Record drying conditions and the machine, mold, and part that consumed the material lot.",
    fields: [
      { name: "dryerUsed", label: "Dryer used", placeholder: "Dryer 2, hopper dryer, desiccant cart..." },
      { name: "dryingTemperature", label: "Drying temperature", placeholder: "180°F / 82°C" },
      { name: "dryingTime", label: "Drying time", placeholder: "4 hours" },
      { name: "machineNumber", label: "Machine number", placeholder: "Press 12" },
      { name: "moldNumber", label: "Mold number", placeholder: "M-1045" },
      { name: "partNumber", label: "Part number", placeholder: "PN-88321-A" },
    ],
  },
  {
    title: "Production output and observations",
    description: "Tie the lot to the run date, produced quantity, observed issues, and traceability notes for later review.",
    fields: [
      { name: "productionDate", label: "Production date", type: "date" },
      { name: "quantityProduced", label: "Quantity produced", type: "number", placeholder: "12500" },
      { name: "issuesObserved", label: "Issues observed", type: "textarea", placeholder: "Splay, contamination, color shift, moisture evidence, no issues observed..." },
      { name: "notes", label: "Notes", type: "textarea", placeholder: "COA checked, retained sample location, quarantine details, customer job, shift comments..." },
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

export default function MaterialLotTraceabilityPage() {
  const [record, setRecord] = useState<LotTraceabilityRecord>(blankRecord);
  const [savedRecords, setSavedRecords] = useState<LotTraceabilityRecord[]>([]);
  const [filter, setFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState("Lot traceability draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedRecords(JSON.parse(saved) as LotTraceabilityRecord[]);
  }, []);

  const recordTitle = useMemo(
    () => record.lotNumber || record.materialGrade || record.materialType || "Untitled material lot",
    [record.lotNumber, record.materialGrade, record.materialType],
  );

  const filteredRecords = useMemo(() => {
    const query = filter.toLowerCase().trim();
    if (!query) return savedRecords;
    return savedRecords.filter((saved) =>
      [saved.lotNumber, saved.resinSupplier, saved.materialType, saved.machineNumber, saved.moldNumber, saved.partNumber]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [filter, savedRecords]);

  const totalQuantity = useMemo(
    () => savedRecords.reduce((total, saved) => total + Number(saved.quantityProduced || 0), 0),
    [savedRecords],
  );

  function updateField(name: keyof LotTraceabilityRecord, value: string) {
    setRecord((current) => ({ ...current, [name]: value }));
  }

  function persist(nextRecord: LotTraceabilityRecord, nextRecords: LotTraceabilityRecord[]) {
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

  function editRecord(savedRecord: LotTraceabilityRecord) {
    setRecord(savedRecord);
    setStatusMessage(`Editing ${savedRecord.lotNumber || savedRecord.materialGrade || "material lot"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(recordId: string) {
    const nextRecords = savedRecords.filter((saved) => saved.id !== recordId);
    setSavedRecords(nextRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    if (record.id === recordId) setRecord(blankRecord);
    setStatusMessage("Deleted lot traceability record");
  }

  function startNewRecord() {
    setRecord(blankRecord);
    setStatusMessage("New lot traceability draft ready");
  }

  function printReport() {
    setStatusMessage("Opening lot traceability print report");
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 print:border-slate-300 print:bg-white print:p-0 print:shadow-none sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_34%)] print:hidden" />
          <div className="relative">
            <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:mt-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300 print:text-slate-600">Material Tools</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Material Lot Traceability Tracker</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Create, save, edit, filter, delete, and print lot traceability records that connect received resin lots to drying conditions and production output.</p>
              </div>
              <div className="grid gap-3 sm:min-w-64 print:hidden">
                <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">{statusMessage}</div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3"><p className="text-2xl font-black text-white">{savedRecords.length}</p><p className="mt-1 font-bold text-slate-300">Records</p></div>
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-2 py-3"><p className="text-2xl font-black text-emerald-100">{totalQuantity.toLocaleString()}</p><p className="mt-1 font-bold text-emerald-100">Produced</p></div>
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
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Current lot record</p>
              <h2 className="mt-3 text-2xl font-black text-white">{recordTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">Received: {formatDate(record.dateReceived)}</p>
              <p className="mt-1 text-sm text-slate-400">Production: {formatDate(record.productionDate)}</p>
              <p className="mt-1 text-sm text-slate-400">Last saved: {formatDateTime(record.updatedAt)}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-200">Save lot record</button>
                <button type="button" onClick={startNewRecord} className="rounded-2xl border border-white/10 px-4 py-3 font-bold text-slate-100 transition hover:border-cyan-300/50">New record</button>
                <button type="button" onClick={printReport} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 font-bold text-emerald-100 transition hover:bg-emerald-300/20">Print traceability report</button>
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-bold text-white">Saved lot records</h2>
              <p className="mt-1 text-xs text-slate-400">Showing {filteredRecords.length} of {savedRecords.length}</p>
              <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter lot, supplier, material, machine, mold, or part" className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300" />
              <div className="mt-4 space-y-3">
                {filteredRecords.length === 0 ? <p className="text-sm text-slate-400">Saved material lot records will appear here for filtering, editing, deletion, and print preparation.</p> : null}
                {filteredRecords.map((saved) => (
                  <article key={saved.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <button type="button" onClick={() => editRecord(saved)} className="w-full text-left">
                      <span className="block font-bold text-white">{saved.lotNumber || saved.materialGrade || "Untitled material lot"}</span>
                      <span className="mt-1 block text-xs text-slate-400">{saved.resinSupplier || "No supplier"} • {saved.materialType || "No material"}</span>
                      <span className="mt-1 block text-xs text-slate-500">Machine {saved.machineNumber || "not set"} • Mold {saved.moldNumber || "not set"} • Part {saved.partNumber || "not set"}</span>
                      <span className="mt-1 block text-xs text-slate-500">Produced {Number(saved.quantityProduced || 0).toLocaleString()} • Updated {formatDateTime(saved.updatedAt)}</span>
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
