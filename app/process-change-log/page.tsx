"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ParameterKey =
  | "injectionSpeed"
  | "injectionPressure"
  | "transferPosition"
  | "holdPressure"
  | "holdTime"
  | "moldTemperature"
  | "meltTemperature"
  | "screwSpeed"
  | "backPressure";

type ProcessParameter = {
  before: string;
  after: string;
};

type ProcessChangeRecord = {
  id: string;
  dateTime: string;
  machineNumber: string;
  moldNumber: string;
  partNumber: string;
  material: string;
  userName: string;
  parameters: Record<ParameterKey, ProcessParameter>;
  reasonForChange: string;
  otherReason: string;
  result: string;
  notes: string;
  updatedAt: string;
};

type ProcessChangeForm = Omit<ProcessChangeRecord, "id" | "updatedAt">;

type FieldKey = keyof Pick<ProcessChangeForm, "dateTime" | "machineNumber" | "moldNumber" | "partNumber" | "material" | "userName">;

type FilterKey = "machineNumber" | "moldNumber" | "partNumber" | "date";

const storageKey = "molding-mentor-process-change-log";

const parameterFields: { key: ParameterKey; label: string; placeholder: string }[] = [
  { key: "injectionSpeed", label: "Injection Speed", placeholder: "in/sec or mm/s" },
  { key: "injectionPressure", label: "Injection Pressure", placeholder: "psi or bar" },
  { key: "transferPosition", label: "Transfer Position", placeholder: "in or mm" },
  { key: "holdPressure", label: "Hold Pressure", placeholder: "psi or bar" },
  { key: "holdTime", label: "Hold Time", placeholder: "seconds" },
  { key: "moldTemperature", label: "Mold Temperature", placeholder: "°F or °C" },
  { key: "meltTemperature", label: "Melt Temperature", placeholder: "°F or °C" },
  { key: "screwSpeed", label: "Screw Speed", placeholder: "rpm" },
  { key: "backPressure", label: "Back Pressure", placeholder: "psi or bar" },
];

const detailFields: { key: FieldKey; label: string; type?: string; placeholder?: string; required?: boolean }[] = [
  { key: "dateTime", label: "Date and Time", type: "datetime-local", required: true },
  { key: "machineNumber", label: "Machine Number", placeholder: "Press 12", required: true },
  { key: "moldNumber", label: "Mold Number", placeholder: "M-1042", required: true },
  { key: "partNumber", label: "Part Number", placeholder: "PN-88301", required: true },
  { key: "material", label: "Material", placeholder: "PP, ABS, Nylon 6/6...", required: true },
  { key: "userName", label: "User Name", placeholder: "Technician name", required: true },
];

const reasonOptions = ["Quality Issue", "Startup", "Material Change", "Mold Change", "Cycle Time Improvement", "Other"];
const resultOptions = ["Improvement", "No Change", "Worse"];

const createEmptyParameters = (): Record<ParameterKey, ProcessParameter> =>
  parameterFields.reduce(
    (parameters, field) => ({ ...parameters, [field.key]: { before: "", after: "" } }),
    {} as Record<ParameterKey, ProcessParameter>,
  );

const createEmptyForm = (): ProcessChangeForm => ({
  dateTime: new Date().toISOString().slice(0, 16),
  machineNumber: "",
  moldNumber: "",
  partNumber: "",
  material: "",
  userName: "",
  parameters: createEmptyParameters(),
  reasonForChange: "Quality Issue",
  otherReason: "",
  result: "Improvement",
  notes: "",
});

function formatDateTime(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function ProcessChangeLogPage() {
  const [records, setRecords] = useState<ProcessChangeRecord[]>([]);
  const [form, setForm] = useState(createEmptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<Record<FilterKey, string>>({ machineNumber: "", moldNumber: "", partNumber: "", date: "" });

  useEffect(() => {
    const storedRecords = window.localStorage.getItem(storageKey);
    if (storedRecords) setRecords(JSON.parse(storedRecords) as ProcessChangeRecord[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(records));
  }, [records, isLoaded]);

  const filteredRecords = useMemo(() => {
    return [...records]
      .filter((record) => {
        const matchesMachine = record.machineNumber.toLowerCase().includes(filters.machineNumber.toLowerCase());
        const matchesMold = record.moldNumber.toLowerCase().includes(filters.moldNumber.toLowerCase());
        const matchesPart = record.partNumber.toLowerCase().includes(filters.partNumber.toLowerCase());
        const matchesDate = !filters.date || record.dateTime.slice(0, 10) === filters.date;
        return matchesMachine && matchesMold && matchesPart && matchesDate;
      })
      .sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }, [filters, records]);

  function resetForm() {
    setForm(createEmptyForm());
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

  function editRecord(record: ProcessChangeRecord) {
    setForm({
      dateTime: record.dateTime,
      machineNumber: record.machineNumber,
      moldNumber: record.moldNumber,
      partNumber: record.partNumber,
      material: record.material,
      userName: record.userName,
      parameters: record.parameters,
      reasonForChange: record.reasonForChange,
      otherReason: record.otherReason,
      result: record.result,
      notes: record.notes,
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
      <section className="mx-auto max-w-7xl space-y-6 print:max-w-none print:space-y-4">
        <header className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:p-0 print:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_32%)] print:hidden" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-700">Scientific molding documentation</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Process Change Log</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
              Record before-and-after process changes, reasons, results, and observations. Records are saved to this browser and can be filtered, edited, deleted, or printed.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3 print:hidden" aria-label="Process change summary">
          <article className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-5">
            <p className="text-4xl font-black text-white">{records.length}</p>
            <h2 className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-100">Saved records</h2>
          </article>
          <article className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5 md:col-span-2">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-100">Print-friendly view</p>
            <p className="mt-2 text-sm text-slate-300">Use your browser print command to print the filtered history without form controls.</p>
          </article>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Create process change record</p>
              <h2 className="mt-2 text-2xl font-black text-white">{editingId ? "Edit saved record" : "New record"}</h2>
            </div>
            {editingId ? <button type="button" onClick={resetForm} className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-slate-200">Cancel edit</button> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {detailFields.map((field) => (
              <label key={field.key} className="space-y-2 text-sm font-bold text-slate-200">
                <span>{field.label}</span>
                <input
                  type={field.type ?? "text"}
                  required={field.required}
                  value={form[field.key]}
                  placeholder={field.placeholder}
                  onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
                />
              </label>
            ))}
          </div>

          <section className="space-y-4">
            <h3 className="text-lg font-black text-white">Process Parameters</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              {parameterFields.map((parameter) => (
                <div key={parameter.key} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="font-bold text-cyan-100">{parameter.label}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(["before", "after"] as const).map((side) => (
                      <label key={side} className="space-y-2 text-sm font-bold capitalize text-slate-300">
                        <span>{side}</span>
                        <input
                          value={form.parameters[parameter.key][side]}
                          placeholder={parameter.placeholder}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              parameters: {
                                ...current.parameters,
                                [parameter.key]: { ...current.parameters[parameter.key], [side]: event.target.value },
                              },
                            }))
                          }
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-3">
            <label className="space-y-2 text-sm font-bold text-slate-200">
              <span>Reason for Change</span>
              <select value={form.reasonForChange} onChange={(event) => setForm((current) => ({ ...current, reasonForChange: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300">
                {reasonOptions.map((reason) => <option key={reason}>{reason}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-200">
              <span>Other reason detail</span>
              <input value={form.otherReason} onChange={(event) => setForm((current) => ({ ...current, otherReason: event.target.value }))} placeholder="Use when Other is selected" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300" />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-200">
              <span>Results</span>
              <select value={form.result} onChange={(event) => setForm((current) => ({ ...current, result: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300">
                {resultOptions.map((result) => <option key={result}>{result}</option>)}
              </select>
            </label>
          </div>

          <label className="block space-y-2 text-sm font-bold text-slate-200">
            <span>Notes - Detailed observations</span>
            <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} rows={5} placeholder="Document defect evidence, sample size, process response, operator observations, and next checks." className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300" />
          </label>

          <button type="submit" className="w-full rounded-2xl bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 shadow-lg shadow-cyan-950/30 sm:w-auto">
            {editingId ? "Save record changes" : "Create process change record"}
          </button>
        </form>

        <section className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 sm:p-6 print:border-0 print:bg-white print:p-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300 print:text-slate-700">View history</p>
              <h2 className="mt-2 text-2xl font-black text-white print:text-slate-950">Process change history</h2>
            </div>
            <button type="button" onClick={() => window.print()} className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-bold text-cyan-100 print:hidden">Print filtered view</button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
            {([
              ["machineNumber", "Filter by machine"],
              ["moldNumber", "Filter by mold"],
              ["partNumber", "Filter by part"],
              ["date", "Filter by date"],
            ] as [FilterKey, string][]).map(([key, label]) => (
              <label key={key} className="space-y-2 text-sm font-bold text-slate-200">
                <span>{label}</span>
                <input type={key === "date" ? "date" : "text"} value={filters[key]} onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300" />
              </label>
            ))}
          </div>

          <div className="space-y-4">
            {filteredRecords.length === 0 ? <p className="rounded-2xl border border-dashed border-white/15 p-5 text-sm text-slate-300 print:text-slate-700">No matching records yet.</p> : null}
            {filteredRecords.map((record) => (
              <article key={record.id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4 sm:p-5 print:break-inside-avoid print:border-slate-300 print:bg-white">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white print:text-slate-950">Machine {record.machineNumber} · Mold {record.moldNumber}</h3>
                    <p className="mt-1 text-sm text-slate-300 print:text-slate-700">{formatDateTime(record.dateTime)} · Part {record.partNumber} · {record.material}</p>
                    <p className="mt-1 text-sm text-slate-300 print:text-slate-700">User: {record.userName}</p>
                  </div>
                  <div className="flex gap-2 print:hidden">
                    <button type="button" onClick={() => editRecord(record)} className="rounded-full border border-cyan-300/40 px-3 py-2 text-sm font-bold text-cyan-100">Edit</button>
                    <button type="button" onClick={() => deleteRecord(record.id)} className="rounded-full border border-rose-300/40 px-3 py-2 text-sm font-bold text-rose-100">Delete</button>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <p className="rounded-2xl bg-white/[0.06] p-3 text-sm print:border print:border-slate-200 print:bg-white"><strong>Reason:</strong> {record.reasonForChange}{record.otherReason ? ` - ${record.otherReason}` : ""}</p>
                  <p className="rounded-2xl bg-white/[0.06] p-3 text-sm print:border print:border-slate-200 print:bg-white"><strong>Result:</strong> {record.result}</p>
                  <p className="rounded-2xl bg-white/[0.06] p-3 text-sm print:border print:border-slate-200 print:bg-white"><strong>Updated:</strong> {formatDateTime(record.updatedAt)}</p>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="text-cyan-100 print:text-slate-950"><tr><th className="py-2">Parameter</th><th>Before</th><th>After</th></tr></thead>
                    <tbody className="divide-y divide-white/10 print:divide-slate-200">
                      {parameterFields.map((parameter) => <tr key={parameter.key}><td className="py-2 font-bold">{parameter.label}</td><td>{record.parameters[parameter.key]?.before || "—"}</td><td>{record.parameters[parameter.key]?.after || "—"}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                {record.notes ? <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-white/[0.06] p-3 text-sm print:border print:border-slate-200 print:bg-white"><strong>Notes:</strong> {record.notes}</p> : null}
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
