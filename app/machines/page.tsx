"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type MachineRecord = {
  id: string;
  machineNumber: string;
  brand: string;
  model: string;
  clampTonnage: string;
  materialCommonlyRun: string;
  screwSize: string;
  shotCapacity: string;
  lastPmDate: string;
  knownIssues: string;
  hydraulicNotes: string;
  electricalNotes: string;
  robotAutomationNotes: string;
  maintenanceHistory: string;
  processNotes: string;
  updatedAt: string;
};

type MachineForm = Omit<MachineRecord, "id" | "updatedAt">;

type Field = {
  key: keyof MachineForm;
  label: string;
  type?: "text" | "date" | "number" | "textarea";
  placeholder?: string;
  required?: boolean;
};

const storageKey = "molding-mentor-machine-history-records";

const createEmptyRecord = (): MachineForm => ({
  machineNumber: "",
  brand: "",
  model: "",
  clampTonnage: "",
  materialCommonlyRun: "",
  screwSize: "",
  shotCapacity: "",
  lastPmDate: "",
  knownIssues: "",
  hydraulicNotes: "",
  electricalNotes: "",
  robotAutomationNotes: "",
  maintenanceHistory: "",
  processNotes: "",
});

const fields: Field[] = [
  { key: "machineNumber", label: "Machine number", placeholder: "IMM-12", required: true },
  { key: "brand", label: "Brand", placeholder: "Husky, Engel, Nissei...", required: true },
  { key: "model", label: "Model", placeholder: "Hylectric H300", required: true },
  { key: "clampTonnage", label: "Clamp tonnage", type: "number", placeholder: "300", required: true },
  { key: "materialCommonlyRun", label: "Material commonly run", placeholder: "ABS, PC/ABS, PP GF30..." },
  { key: "screwSize", label: "Screw size", placeholder: "70 mm / 2.75 in" },
  { key: "shotCapacity", label: "Shot capacity", placeholder: "24 oz PS / 680 g" },
  { key: "lastPmDate", label: "Last PM date", type: "date" },
  { key: "knownIssues", label: "Known issues", type: "textarea", placeholder: "Pump whine at high back pressure, tie bar sensor intermittent, worn barrel check ring..." },
  { key: "hydraulicNotes", label: "Hydraulic notes", type: "textarea", placeholder: "Pump replaced 2025, clamp manifold seep, oil analysis notes..." },
  { key: "electricalNotes", label: "Electrical notes", type: "textarea", placeholder: "Servo drive alarms, heater relay notes, cabinet cooling fan replaced..." },
  { key: "robotAutomationNotes", label: "Robot/automation notes", type: "textarea", placeholder: "Robot model, EOAT notes, conveyor interface, safety gate handshake..." },
  { key: "maintenanceHistory", label: "Maintenance history", type: "textarea", placeholder: "Date, PM task, issue found, corrective action, technician, parts used..." },
  { key: "processNotes", label: "Process notes", type: "textarea", placeholder: "Startup behavior, recovery limits, pressure response, jobs that run best on this press..." },
];

function formatDate(value: string) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

export default function MachinesPage() {
  const [records, setRecords] = useState<MachineRecord[]>([]);
  const [form, setForm] = useState(createEmptyRecord);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedRecords = window.localStorage.getItem(storageKey);
    if (storedRecords) setRecords(JSON.parse(storedRecords) as MachineRecord[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(records));
  }, [records, isLoaded]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...records]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .filter((record) => {
        if (!query) return true;
        return [record.machineNumber, record.brand, record.model, record.clampTonnage].some((value) => value.toLowerCase().includes(query));
      });
  }, [records, search]);

  function resetForm() {
    setForm(createEmptyRecord());
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();

    if (editingId) {
      setRecords((current) => current.map((record) => (record.id === editingId ? { ...form, id: editingId, updatedAt } : record)));
      resetForm();
      return;
    }

    setRecords((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editRecord(record: MachineRecord) {
    setForm({
      machineNumber: record.machineNumber,
      brand: record.brand,
      model: record.model,
      clampTonnage: record.clampTonnage,
      materialCommonlyRun: record.materialCommonlyRun,
      screwSize: record.screwSize,
      shotCapacity: record.shotCapacity,
      lastPmDate: record.lastPmDate,
      knownIssues: record.knownIssues,
      hydraulicNotes: record.hydraulicNotes,
      electricalNotes: record.electricalNotes,
      robotAutomationNotes: record.robotAutomationNotes,
      maintenanceHistory: record.maintenanceHistory,
      processNotes: record.processNotes,
    });
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6 print:max-w-none print:space-y-4">
        <header className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:rounded-none print:border-b print:border-slate-300 print:bg-white print:p-0 print:pb-4 print:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_32%)] print:hidden" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Machine history database</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Machine History Database</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
              Save machine history, machine notes, maintenance records, and process knowledge in this browser with a print-friendly report for process, maintenance, and automation teams.
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3 print:hidden" aria-label="Machine database overview">
          <article className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5"><p className="text-4xl font-black text-white">{records.length}</p><h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Saved machines</h2></article>
          <article className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-5"><p className="text-4xl font-black text-white">{filteredRecords.length}</p><h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-100">Matching records</h2></article>
          <button type="button" onClick={() => window.print()} className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 text-left font-black text-cyan-100 transition hover:border-cyan-300/40">Print machine history report →</button>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6 print:hidden">
          <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black text-white">{editingId ? "Edit machine record" : "Add machine record"}</h2>{editingId ? <button type="button" onClick={resetForm} className="text-sm font-bold text-cyan-200">Cancel edit</button> : null}</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
                <span className="text-sm font-bold text-slate-200">{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
                ) : (
                  <input type={field.type ?? "text"} value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} required={field.required} min={field.type === "number" ? 1 : undefined} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
                )}
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-200 sm:w-auto">{editingId ? "Save changes" : "Save machine record"}</button>
        </form>

        <section className="space-y-4" aria-label="Saved machine records">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between print:block">
            <div><h2 className="text-2xl font-black text-white print:text-slate-950">Machine history report</h2><p className="text-sm text-slate-400 print:text-slate-600">Search by machine number, brand, model, or clamp tonnage.</p></div>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search machines..." className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300 print:hidden" />
          </div>

          {filteredRecords.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-slate-300 print:border-slate-300 print:bg-white print:text-slate-700">No machine records found. Add the first record above.</div>
          ) : (
            filteredRecords.map((record) => (
              <article key={record.id} className="break-inside-avoid rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30 print:rounded-none print:border-slate-300 print:bg-white print:shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div><h3 className="text-xl font-black text-white print:text-slate-950">Machine {record.machineNumber}</h3><p className="mt-1 text-sm text-cyan-200 print:text-slate-700">{record.brand || "No brand"} · Model {record.model || "—"} · {record.clampTonnage || "—"} tons</p><p className="mt-1 text-sm text-slate-300 print:text-slate-700">Material: {record.materialCommonlyRun || "—"} · Screw: {record.screwSize || "—"} · Shot: {record.shotCapacity || "—"} · Last PM: {formatDate(record.lastPmDate)}</p></div>
                  <div className="flex gap-2 print:hidden"><button type="button" onClick={() => editRecord(record)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">Edit</button><button type="button" onClick={() => deleteRecord(record.id)} className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-bold text-red-100">Delete</button></div>
                </div>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[["Known issues", record.knownIssues], ["Hydraulic notes", record.hydraulicNotes], ["Electrical notes", record.electricalNotes], ["Robot/automation notes", record.robotAutomationNotes], ["Maintenance history", record.maintenanceHistory], ["Process notes", record.processNotes]].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white/[0.05] p-4 print:bg-slate-50"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">{label}</dt><dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100 print:text-slate-900">{value || "—"}</dd></div>
                  ))}
                </dl>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
