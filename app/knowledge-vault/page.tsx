"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type VaultType = "Lesson Learned" | "Setup Tip" | "Troubleshooting Fix" | "Safety Note" | "Customer Requirement" | "Maintenance Note";
type VaultStatus = "Draft" | "Validated" | "Needs Review";

type VaultEntry = {
  id: string;
  title: string;
  type: VaultType;
  status: VaultStatus;
  owner: string;
  area: string;
  machine: string;
  mold: string;
  part: string;
  material: string;
  problem: string;
  answer: string;
  source: string;
  tags: string;
  updatedAt: string;
};

const storageKey = "molding-mentor-knowledge-vault";
const vaultTypes: VaultType[] = ["Lesson Learned", "Setup Tip", "Troubleshooting Fix", "Safety Note", "Customer Requirement", "Maintenance Note"];
const vaultStatuses: VaultStatus[] = ["Draft", "Validated", "Needs Review"];

const starterEntries: VaultEntry[] = [
  {
    id: "starter-flash-vent-check",
    title: "Flash after startup: verify clamp and vent condition before chasing temperature",
    type: "Troubleshooting Fix",
    status: "Validated",
    owner: "Process Team",
    area: "Injection molding",
    machine: "Any hydraulic press",
    mold: "Family tools with known vent wear",
    part: "Thin-wall housings",
    material: "PP / ABS",
    problem: "Flash appears at the parting line after startup or after a mold change.",
    answer: "Confirm the process sheet clamp tonnage, inspect the parting line for debris, check vent wear, and compare cushion/transfer position to the last approved run before increasing clamp pressure.",
    source: "Internal startup troubleshooting standard",
    tags: "flash, startup, clamp, venting, mold change",
    updatedAt: "2026-06-24T00:00:00.000Z",
  },
  {
    id: "starter-splay-drying-log",
    title: "Splay: review drying log and purge history first",
    type: "Setup Tip",
    status: "Validated",
    owner: "Materials Lead",
    area: "Materials",
    machine: "Dryer bank",
    mold: "All",
    part: "Clear or cosmetic parts",
    material: "Nylon / PC / PET",
    problem: "Silver streaks or splay show up shortly after a material change.",
    answer: "Check dryer temperature, drying time, dew point, lot change timing, and purge notes before adjusting back pressure or barrel temperature.",
    source: "Material handling lesson learned",
    tags: "splay, drying, material, purge, moisture",
    updatedAt: "2026-06-24T00:00:00.000Z",
  },
];

const emptyEntry = (): Omit<VaultEntry, "id" | "updatedAt"> => ({
  title: "",
  type: "Lesson Learned",
  status: "Draft",
  owner: "",
  area: "",
  machine: "",
  mold: "",
  part: "",
  material: "",
  problem: "",
  answer: "",
  source: "",
  tags: "",
});

function searchableText(entry: VaultEntry) {
  return Object.values(entry).join(" ").toLowerCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export default function KnowledgeVaultPage() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [form, setForm] = useState(emptyEntry);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | VaultType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | VaultStatus>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as VaultEntry[];
        if (Array.isArray(parsed)) setEntries(parsed);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    } else {
      setEntries(starterEntries);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries, isLoaded]);

  const stats = useMemo(() => ({
    total: entries.length,
    validated: entries.filter((entry) => entry.status === "Validated").length,
    review: entries.filter((entry) => entry.status === "Needs Review").length,
  }), [entries]);

  const filteredEntries = useMemo(() => entries
    .filter((entry) => typeFilter === "All" || entry.type === typeFilter)
    .filter((entry) => statusFilter === "All" || entry.status === statusFilter)
    .filter((entry) => !query.trim() || searchableText(entry).includes(query.trim().toLowerCase()))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [entries, query, statusFilter, typeFilter]);

  const selectedEntry = entries.find((entry) => entry.id === selectedId) ?? filteredEntries[0];

  function resetForm() {
    setForm(emptyEntry());
    setEditingId(null);
  }

  function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();
    const nextEntry = { ...form, id: editingId ?? crypto.randomUUID(), updatedAt };
    setEntries((current) => editingId ? current.map((entry) => entry.id === editingId ? nextEntry : entry) : [nextEntry, ...current]);
    setSelectedId(nextEntry.id);
    resetForm();
  }

  function editEntry(entry: VaultEntry) {
    setForm({
      title: entry.title,
      type: entry.type,
      status: entry.status,
      owner: entry.owner,
      area: entry.area,
      machine: entry.machine,
      mold: entry.mold,
      part: entry.part,
      material: entry.material,
      problem: entry.problem,
      answer: entry.answer,
      source: entry.source,
      tags: entry.tags,
    });
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteEntry(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-white/10 p-6 shadow-2xl shadow-cyan-950/30 print:border-0 print:bg-white print:shadow-none">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10 print:hidden">← Back home</Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.32em] text-cyan-200 print:text-slate-600">Knowledge Vault MVP</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl print:text-slate-950">A searchable vault for validated shop-floor answers.</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 print:text-slate-700">Capture tribal knowledge, classify it by machine, mold, material, part, and topic, then give technicians one place to find the approved answer before making process changes.</p>
            </div>
            <button onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 print:hidden" type="button">Print vault view</button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3 print:grid-cols-3">
          {[{ label: "Vault entries", value: stats.total }, { label: "Validated answers", value: stats.validated }, { label: "Need review", value: stats.review }].map((stat) => (
            <article key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 print:border-slate-300 print:bg-white">
              <p className="text-4xl font-black text-white print:text-slate-950">{stat.value}</p>
              <h2 className="mt-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100 print:text-slate-700">{stat.label}</h2>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] print:block">
          <form onSubmit={saveEntry} className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 print:hidden sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-black text-white">{editingId ? "Edit vault entry" : "Add knowledge"}</h2>
              {editingId ? <button type="button" onClick={resetForm} className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-200">Cancel edit</button> : null}
            </div>
            <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="What answer should people search for?" /></label>
            <label className="grid gap-2 text-sm font-bold text-slate-200">Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as VaultType })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">{vaultTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-200">Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as VaultStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">{vaultStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            {["owner", "area", "machine", "mold", "part", "material", "source", "tags"].map((field) => <label key={field} className="grid gap-2 text-sm font-bold capitalize text-slate-200">{field}<input value={form[field as keyof typeof form]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" /></label>)}
            <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Problem, question, or situation<textarea required value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} rows={3} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" /></label>
            <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Approved answer or best-known guidance<textarea required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" /></label>
            <button className="rounded-2xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 hover:bg-cyan-200 sm:col-span-2" type="submit">{editingId ? "Save vault update" : "Save to vault"}</button>
          </form>

          <aside className="space-y-4 print:hidden">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <h2 className="text-xl font-black text-white">Search vault</h2>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search defect, mold, material, answer, tag..." className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "All" | VaultType)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"><option>All</option>{vaultTypes.map((type) => <option key={type}>{type}</option>)}</select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "All" | VaultStatus)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white"><option>All</option>{vaultStatuses.map((status) => <option key={status}>{status}</option>)}</select>
              </div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <h2 className="text-xl font-black text-white">Results ({filteredEntries.length})</h2>
              <div className="mt-4 space-y-3">
                {filteredEntries.length === 0 ? <p className="text-sm leading-6 text-slate-300">No vault entries match. Clear filters or save a new answer.</p> : null}
                {filteredEntries.map((entry) => <article key={entry.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><button type="button" onClick={() => setSelectedId(entry.id)} className="text-left text-lg font-black text-cyan-100 hover:text-cyan-50">{entry.title}</button><p className="mt-1 text-sm text-slate-400">{entry.type} · {entry.status} · {entry.machine || "Any machine"}</p><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => editEntry(entry)} className="rounded-full bg-emerald-300 px-3 py-1.5 text-xs font-black text-slate-950" type="button">Edit</button><button onClick={() => deleteEntry(entry.id)} className="rounded-full bg-rose-300 px-3 py-1.5 text-xs font-black text-slate-950" type="button">Delete</button></div></article>)}
              </div>
            </section>
          </aside>
        </section>

        {selectedEntry ? <section className="rounded-[2rem] border border-white/10 bg-white p-5 text-slate-950 shadow-xl shadow-slate-950/30 sm:p-8 print:border-0 print:p-0 print:shadow-none"><p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">Selected vault answer</p><h2 className="mt-2 text-3xl font-black">{selectedEntry.title}</h2><p className="mt-2 text-sm font-semibold text-slate-600">{selectedEntry.type} · {selectedEntry.status} · Updated {formatDate(selectedEntry.updatedAt)}</p><dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">{[["Owner", selectedEntry.owner], ["Area", selectedEntry.area], ["Machine", selectedEntry.machine], ["Mold", selectedEntry.mold], ["Part", selectedEntry.part], ["Material", selectedEntry.material], ["Source", selectedEntry.source], ["Tags", selectedEntry.tags]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 p-3"><dt className="font-black text-slate-500">{label}</dt><dd className="mt-1 font-bold">{value || "—"}</dd></div>)}</dl><div className="mt-6 grid gap-4 md:grid-cols-2"><article className="rounded-2xl border border-slate-200 p-4"><h3 className="font-black text-slate-900">Problem / question</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{selectedEntry.problem}</p></article><article className="rounded-2xl border border-slate-200 p-4"><h3 className="font-black text-slate-900">Approved answer</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{selectedEntry.answer}</p></article></div></section> : null}
      </section>
    </main>
  );
}
