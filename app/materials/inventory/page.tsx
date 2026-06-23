"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type InventoryStatus = "Available" | "Quarantined" | "Low Stock" | "Used Up";

type InventoryRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  materialType: string;
  materialGrade: string;
  supplier: string;
  lotNumber: string;
  quantityOnHand: string;
  unitOfMeasure: string;
  storageLocation: string;
  dateReceived: string;
  expirationDate: string;
  status: InventoryStatus;
  notes: string;
};

type Field = {
  name: keyof InventoryRecord;
  label: string;
  placeholder?: string;
  type?: "date" | "number" | "textarea" | "select";
};

const STORAGE_KEY = "molding-mentor-material-inventory";
const statuses: InventoryStatus[] = ["Available", "Quarantined", "Low Stock", "Used Up"];

const blankRecord: InventoryRecord = {
  id: "",
  createdAt: "",
  updatedAt: "",
  materialType: "",
  materialGrade: "",
  supplier: "",
  lotNumber: "",
  quantityOnHand: "",
  unitOfMeasure: "lbs",
  storageLocation: "",
  dateReceived: "",
  expirationDate: "",
  status: "Available",
  notes: "",
};

const fields: Field[] = [
  { name: "materialType", label: "Material type", placeholder: "ABS, PC, PP, Nylon, TPE..." },
  { name: "materialGrade", label: "Material grade", placeholder: "Grade, color, filler, additive package" },
  { name: "supplier", label: "Supplier", placeholder: "Supplier or distributor" },
  { name: "lotNumber", label: "Lot number", placeholder: "LOT-2406-18" },
  { name: "quantityOnHand", label: "Quantity on hand", type: "number", placeholder: "1250" },
  { name: "unitOfMeasure", label: "Unit of measure", placeholder: "lbs, kg, bags, gaylords" },
  { name: "storageLocation", label: "Storage location", placeholder: "Warehouse A / Rack 4 / Silo 2" },
  { name: "dateReceived", label: "Date received", type: "date" },
  { name: "expirationDate", label: "Expiration date", type: "date" },
  { name: "status", label: "Status", type: "select" },
  { name: "notes", label: "Notes", type: "textarea", placeholder: "COA status, retain sample, drying limits, quarantine reason, cycle count notes..." },
];

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function MaterialInventoryPage() {
  const [record, setRecord] = useState<InventoryRecord>(blankRecord);
  const [savedRecords, setSavedRecords] = useState<InventoryRecord[]>([]);
  const [filter, setFilter] = useState("");
  const [statusMessage, setStatusMessage] = useState("Inventory draft ready");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedRecords(JSON.parse(saved) as InventoryRecord[]);
  }, []);

  const recordTitle = useMemo(
    () => record.lotNumber || record.materialGrade || record.materialType || "Untitled inventory record",
    [record.lotNumber, record.materialGrade, record.materialType],
  );

  const filteredRecords = useMemo(() => {
    const query = filter.toLowerCase().trim();
    if (!query) return savedRecords;
    return savedRecords.filter((saved) =>
      [saved.materialType, saved.materialGrade, saved.supplier, saved.lotNumber, saved.status, saved.storageLocation]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [filter, savedRecords]);

  const lowStockCount = useMemo(() => savedRecords.filter((saved) => saved.status === "Low Stock").length, [savedRecords]);
  const quarantinedCount = useMemo(() => savedRecords.filter((saved) => saved.status === "Quarantined").length, [savedRecords]);

  function updateField(name: keyof InventoryRecord, value: string) {
    setRecord((current) => ({ ...current, [name]: value }));
  }

  function persist(nextRecord: InventoryRecord, nextRecords: InventoryRecord[]) {
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

  function editRecord(savedRecord: InventoryRecord) {
    setRecord(savedRecord);
    setStatusMessage(`Editing ${savedRecord.lotNumber || savedRecord.materialGrade || "inventory record"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(recordId: string) {
    const nextRecords = savedRecords.filter((saved) => saved.id !== recordId);
    setSavedRecords(nextRecords);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    if (record.id === recordId) setRecord(blankRecord);
    setStatusMessage("Deleted inventory record");
  }

  function startNewRecord() {
    setRecord(blankRecord);
    setStatusMessage("New inventory draft ready");
  }

  function printReport() {
    setStatusMessage("Opening print-friendly inventory report");
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
                <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-3xl print:text-slate-950 sm:text-5xl">Material Inventory Tracker</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700 sm:text-base">Add, save, edit, filter, delete, and print resin inventory records with lot, supplier, storage, status, and expiration details.</p>
              </div>
              <div className="grid gap-3 sm:min-w-72 print:hidden">
                <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">{statusMessage}</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3"><p className="text-2xl font-black text-white">{savedRecords.length}</p><p className="mt-1 font-bold text-slate-300">Records</p></div>
                  <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-2 py-3"><p className="text-2xl font-black text-amber-100">{lowStockCount}</p><p className="mt-1 font-bold text-amber-100">Low Stock</p></div>
                  <div className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-2 py-3"><p className="text-2xl font-black text-rose-100">{quarantinedCount}</p><p className="mt-1 font-bold text-rose-100">Quarantined</p></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <form onSubmit={saveRecord} className="grid gap-5 lg:grid-cols-[1fr_22rem] print:hidden">
          <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 sm:p-6">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-white">Inventory record</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">Use one record per supplier lot, storage location, or stock status change.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                  <span className="text-sm font-bold text-slate-200">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea value={record[field.name]} onChange={(event) => updateField(field.name, event.target.value)} placeholder={field.placeholder} className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10" />
                  ) : field.type === "select" ? (
                    <select value={record.status} onChange={(event) => updateField("status", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10">
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  ) : (
                    <input value={record[field.name]} onChange={(event) => updateField(field.name, event.target.value)} type={field.type || "text"} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10" />
                  )}
                </label>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
              <h2 className="text-xl font-black text-white">Record actions</h2>
              <p className="mt-2 text-sm text-cyan-100">Current draft: {recordTitle}</p>
              <div className="mt-5 grid gap-3">
                <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">{record.id ? "Update inventory record" : "Add inventory record"}</button>
                <button type="button" onClick={startNewRecord} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15">Start new record</button>
                <button type="button" onClick={printReport} className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300/15">Print inventory report</button>
              </div>
            </section>
            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <label>
                <span className="text-sm font-bold text-slate-200">Filter saved inventory</span>
                <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Material, supplier, lot, status, or location" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10" />
              </label>
            </section>
          </aside>
        </form>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 print:border-0 print:bg-white print:p-0 print:shadow-none sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300 print:text-slate-600">Saved inventory</p>
              <h2 className="mt-2 text-2xl font-black text-white print:text-slate-950">Print-friendly inventory report</h2>
            </div>
            <p className="text-sm text-slate-300 print:text-slate-700">Showing {filteredRecords.length} of {savedRecords.length} records</p>
          </div>

          <div className="mt-5 grid gap-4">
            {filteredRecords.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-6 text-center text-sm text-slate-300 print:border-slate-300 print:bg-white print:text-slate-700">No inventory records match this filter.</div>
            ) : filteredRecords.map((saved) => (
              <article key={saved.id} className="break-inside-avoid rounded-2xl border border-white/10 bg-slate-950/60 p-4 print:border-slate-300 print:bg-white sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white print:text-slate-950">{saved.materialType || "Material"} · {saved.materialGrade || "Grade not set"}</h3>
                    <p className="mt-1 text-sm text-slate-300 print:text-slate-700">Lot {saved.lotNumber || "Not set"} · {saved.supplier || "Supplier not set"}</p>
                  </div>
                  <span className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 print:border-slate-300 print:bg-white print:text-slate-800">{saved.status}</span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div><dt className="font-bold text-slate-400 print:text-slate-600">Quantity</dt><dd className="mt-1 text-white print:text-slate-950">{saved.quantityOnHand || "0"} {saved.unitOfMeasure}</dd></div>
                  <div><dt className="font-bold text-slate-400 print:text-slate-600">Location</dt><dd className="mt-1 text-white print:text-slate-950">{saved.storageLocation || "Not set"}</dd></div>
                  <div><dt className="font-bold text-slate-400 print:text-slate-600">Received</dt><dd className="mt-1 text-white print:text-slate-950">{formatDate(saved.dateReceived)}</dd></div>
                  <div><dt className="font-bold text-slate-400 print:text-slate-600">Expires</dt><dd className="mt-1 text-white print:text-slate-950">{formatDate(saved.expirationDate)}</dd></div>
                </dl>
                {saved.notes ? <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-white/[0.05] p-3 text-sm text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-800">{saved.notes}</p> : null}
                <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between print:text-slate-600">
                  <span>Updated {formatDateTime(saved.updatedAt)}</span>
                  <div className="flex gap-2 print:hidden">
                    <button type="button" onClick={() => editRecord(saved)} className="rounded-xl border border-cyan-300/30 px-3 py-2 font-bold text-cyan-100 hover:bg-cyan-300/10">Edit</button>
                    <button type="button" onClick={() => deleteRecord(saved.id)} className="rounded-xl border border-rose-300/30 px-3 py-2 font-bold text-rose-100 hover:bg-rose-300/10">Delete</button>
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
