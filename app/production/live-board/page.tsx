"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Status = "Running" | "Setup" | "Down" | "Quality Hold" | "Material Change" | "Complete";

type MachineStatus = {
  id: string;
  machineNumber: string;
  moldNumber: string;
  partNumber: string;
  operator: string;
  currentStatus: Status;
  targetCycleTime: string;
  actualCycleTime: string;
  targetQuantity: string;
  actualQuantity: string;
  scrapQuantity: string;
  downtimeMinutes: string;
  currentIssue: string;
  nextAction: string;
  updatedAt: string;
};

type MachineStatusForm = Omit<MachineStatus, "id" | "updatedAt">;

type Field = {
  key: keyof MachineStatusForm;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
};

const storageKey = "molding-mentor-real-time-production-board";

const statuses: Status[] = ["Running", "Setup", "Down", "Quality Hold", "Material Change", "Complete"];
const summaryStatuses: Status[] = ["Running", "Setup", "Down", "Quality Hold"];

const emptyStatus: MachineStatusForm = {
  machineNumber: "",
  moldNumber: "",
  partNumber: "",
  operator: "",
  currentStatus: "Running",
  targetCycleTime: "",
  actualCycleTime: "",
  targetQuantity: "",
  actualQuantity: "",
  scrapQuantity: "",
  downtimeMinutes: "",
  currentIssue: "",
  nextAction: "",
};

const fields: Field[] = [
  { key: "machineNumber", label: "Machine number", placeholder: "Press 12", required: true },
  { key: "moldNumber", label: "Mold number", placeholder: "M-1042", required: true },
  { key: "partNumber", label: "Part number", placeholder: "PN-77821", required: true },
  { key: "operator", label: "Operator", placeholder: "Operator name" },
  { key: "currentStatus", label: "Current status", type: "select", required: true },
  { key: "targetCycleTime", label: "Target cycle time", type: "number", placeholder: "Seconds" },
  { key: "actualCycleTime", label: "Actual cycle time", type: "number", placeholder: "Seconds" },
  { key: "targetQuantity", label: "Target quantity", type: "number", placeholder: "12000" },
  { key: "actualQuantity", label: "Actual quantity", type: "number", placeholder: "8500" },
  { key: "scrapQuantity", label: "Scrap quantity", type: "number", placeholder: "125" },
  { key: "downtimeMinutes", label: "Downtime minutes", type: "number", placeholder: "30" },
  { key: "currentIssue", label: "Current issue", type: "textarea", placeholder: "Short shots at cavity 4, awaiting setup tech..." },
  { key: "nextAction", label: "Next action", type: "textarea", placeholder: "Verify dryer dew point, restart after first-piece approval..." },
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDateTime(value: string) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function getStatusClass(status: Status) {
  const classes: Record<Status, string> = {
    Running: "border-emerald-300/40 bg-emerald-300/15 text-emerald-100",
    Setup: "border-cyan-300/40 bg-cyan-300/15 text-cyan-100",
    Down: "border-red-300/40 bg-red-300/15 text-red-100",
    "Quality Hold": "border-amber-300/40 bg-amber-300/15 text-amber-100",
    "Material Change": "border-violet-300/40 bg-violet-300/15 text-violet-100",
    Complete: "border-slate-300/30 bg-slate-300/10 text-slate-100",
  };
  return classes[status];
}

export default function RealTimeProductionBoardPage() {
  const [cards, setCards] = useState<MachineStatus[]>([]);
  const [form, setForm] = useState<MachineStatusForm>(emptyStatus);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [machineFilter, setMachineFilter] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedCards = window.localStorage.getItem(storageKey);
    if (storedCards) setCards(JSON.parse(storedCards) as MachineStatus[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(cards));
  }, [cards, isLoaded]);

  const filteredCards = useMemo(() => cards
    .filter((card) => statusFilter === "All" || card.currentStatus === statusFilter)
    .filter((card) => !machineFilter || card.machineNumber.toLowerCase().includes(machineFilter.toLowerCase()))
    .sort((a, b) => a.machineNumber.localeCompare(b.machineNumber, undefined, { numeric: true })), [cards, statusFilter, machineFilter]);

  const summaryCounts = useMemo(() => summaryStatuses.reduce<Record<Status, number>>((summary, status) => {
    summary[status] = cards.filter((card) => card.currentStatus === status).length;
    return summary;
  }, { Running: 0, Setup: 0, Down: 0, "Quality Hold": 0, "Material Change": 0, Complete: 0 }), [cards]);

  function resetForm() {
    setForm(emptyStatus);
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();

    if (editingId) {
      setCards((current) => current.map((card) => (card.id === editingId ? { ...form, id: editingId, updatedAt } : card)));
      resetForm();
      return;
    }

    setCards((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editCard(card: MachineStatus) {
    const { id, updatedAt, ...editableCard } = card;
    void id;
    void updatedAt;
    setForm(editableCard);
    setEditingId(card.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteCard(id: string) {
    setCards((current) => current.filter((card) => card.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6 print:max-w-none print:space-y-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-0 print:bg-white print:p-0 print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Production tools</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Real-Time Production Board</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">Track live machine status, cycle time, quantities, scrap, downtime, issues, and next actions from a mobile-first floor board.</p>
            </div>
            <button type="button" onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 print:hidden">Print board</button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6 print:hidden">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-white">{editingId ? "Edit machine status" : "Add machine status card"}</h2>
            {editingId ? <button type="button" onClick={resetForm} className="text-sm font-bold text-cyan-200">Cancel edit</button> : null}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2 lg:col-span-3" : undefined}>
                <span className="text-sm font-bold text-slate-200">{field.label}</span>
                {field.type === "select" ? (
                  <select value={form.currentStatus} onChange={(event) => setForm((current) => ({ ...current, currentStatus: event.target.value as Status }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300">
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
                ) : (
                  <input type={field.type ?? "text"} step={field.type === "number" ? "0.01" : undefined} min={field.type === "number" ? "0" : undefined} value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} required={field.required} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
                )}
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-200 sm:w-auto">{editingId ? "Save changes" : "Add status card"}</button>
        </form>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4">
          {summaryStatuses.map((status) => (
            <article key={status} className={`rounded-3xl border p-5 print:border-slate-300 print:bg-white ${getStatusClass(status)}`}><p className="text-sm font-bold print:text-slate-600">{status}</p><p className="mt-2 text-4xl font-black text-white print:text-slate-950">{summaryCounts[status]}</p></article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 print:hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-black text-white">Filter production board</h2><button type="button" onClick={() => { setStatusFilter("All"); setMachineFilter(""); }} className="text-left text-sm font-bold text-cyan-200 sm:text-right">Clear filters</button></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | Status)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" aria-label="Filter by status"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
            <input value={machineFilter} onChange={(event) => setMachineFilter(event.target.value)} placeholder="Filter by machine number" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2" aria-label="Machine status cards">
          {filteredCards.length === 0 ? <div className="rounded-[1.5rem] border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-slate-300 print:border-slate-300 print:bg-white print:text-slate-700 lg:col-span-2">No machine status cards match the current filters.</div> : filteredCards.map((card) => {
            const completion = toNumber(card.targetQuantity) ? Math.min(100, (toNumber(card.actualQuantity) / toNumber(card.targetQuantity)) * 100) : 0;
            return (
              <article key={card.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30 print:break-inside-avoid print:border-slate-300 print:bg-white print:shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div><span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${getStatusClass(card.currentStatus)} print:border-slate-300 print:bg-white print:text-slate-700`}>{card.currentStatus}</span><h3 className="mt-3 text-2xl font-black text-white print:text-slate-950">Machine {card.machineNumber || "—"}</h3><p className="mt-2 text-sm text-cyan-200 print:text-slate-700">Mold {card.moldNumber || "—"} · Part {card.partNumber || "—"} · Operator {card.operator || "—"}</p></div>
                  <div className="flex gap-2 print:hidden"><button type="button" onClick={() => editCard(card)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">Edit</button><button type="button" onClick={() => deleteCard(card.id)} className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-bold text-red-100">Delete</button></div>
                </div>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Cycle time</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">Target {card.targetCycleTime || "—"}s · Actual {card.actualCycleTime || "—"}s</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Quantities</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">{toNumber(card.actualQuantity).toLocaleString()} / {toNumber(card.targetQuantity).toLocaleString()} target · {toNumber(card.scrapQuantity).toLocaleString()} scrap</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Downtime</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">{toNumber(card.downtimeMinutes).toLocaleString()} minutes</dd></div>
                  <div className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">Progress</dt><dd className="mt-2 text-sm text-slate-100 print:text-slate-900">{completion.toFixed(1)}% complete</dd></div>
                </dl>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800 print:border print:border-slate-200 print:bg-white"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${completion}%` }} /></div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <p className="whitespace-pre-wrap rounded-2xl bg-white/[0.05] p-4 text-sm leading-6 text-slate-200 print:border print:border-slate-200 print:bg-white print:text-slate-900"><strong>Current issue:</strong> {card.currentIssue || "None reported"}</p>
                  <p className="whitespace-pre-wrap rounded-2xl bg-white/[0.05] p-4 text-sm leading-6 text-slate-200 print:border print:border-slate-200 print:bg-white print:text-slate-900"><strong>Next action:</strong> {card.nextAction || "Continue monitoring"}</p>
                </div>
                <p className="mt-4 text-xs font-bold text-slate-500 print:text-slate-600">Last updated {formatDateTime(card.updatedAt)}</p>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
