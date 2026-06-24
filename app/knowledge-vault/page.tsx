"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type VaultEntry = {
  id: string;
  problem: string;
  rootCause: string;
  fix: string;
  prevention: string;
  submittedBy: string;
  submittedAt: string;
};

const storageKey = "moldingMentorKnowledgeVault";

const emptyEntry: VaultEntry = {
  id: "",
  problem: "",
  rootCause: "",
  fix: "",
  prevention: "",
  submittedBy: "",
  submittedAt: "",
};

function nowStamp() {
  return new Date().toISOString();
}

function formatDate(value: string) {
  if (!value) return "Just now";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function KnowledgeVaultPage() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [formEntry, setFormEntry] = useState<VaultEntry>(emptyEntry);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as VaultEntry[];
      if (Array.isArray(parsed)) setEntries(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return entries;

    return entries.filter((entry) =>
      Object.values(entry).join(" ").toLowerCase().includes(search),
    );
  }, [entries, searchTerm]);

  function updateField(field: keyof VaultEntry, value: string) {
    setFormEntry((current) => ({ ...current, [field]: value }));
  }

  function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entryToSave = {
      ...formEntry,
      id: crypto.randomUUID(),
      submittedAt: nowStamp(),
    };

    setEntries((current) => [entryToSave, ...current]);
    setFormEntry(emptyEntry);
  }

  function deleteEntry(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-cyan-300/20 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10">
            ← Back home
          </Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Knowledge Vault</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Capture lessons from the production floor.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Keep the tool simple: record the problem, root cause, fix, prevention, and who submitted it so teams can learn,
            troubleshoot, preserve knowledge, and collaborate.
          </p>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <form onSubmit={saveEntry} className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">New lesson</p>
              <h2 className="text-2xl font-black text-white">What did the floor learn?</h2>
            </div>

            <div className="mt-5 grid gap-4">
              {[
                ["problem", "Problem", "What happened? What did the team see?"],
                ["rootCause", "Root Cause", "What actually caused it?"],
                ["fix", "Fix", "What corrected the issue?"],
                ["prevention", "Prevention", "How can the team prevent it next time?"],
              ].map(([field, label, placeholder]) => (
                <label key={field}>
                  <span className="text-sm font-bold text-slate-200">{label}</span>
                  <textarea
                    required
                    value={formEntry[field as keyof VaultEntry]}
                    onChange={(event) => updateField(field as keyof VaultEntry, event.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
                  />
                </label>
              ))}

              <label>
                <span className="text-sm font-bold text-slate-200">Submitted By</span>
                <input
                  required
                  value={formEntry.submittedBy}
                  onChange={(event) => updateField("submittedBy", event.target.value)}
                  placeholder="Name, shift, or team"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
                />
              </label>
            </div>

            <button className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 hover:bg-cyan-200" type="submit">
              Save lesson to vault
            </button>
          </form>

          <aside className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">Vault search</p>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search problem, fix, person..."
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
            />
            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-3xl font-black text-white">{entries.length}</p>
              <p className="text-sm font-bold text-cyan-100">saved production-floor lessons</p>
            </div>
          </aside>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">Saved knowledge</p>
              <h2 className="text-2xl font-black text-white">Lessons in the vault</h2>
            </div>
            <p className="text-sm font-semibold text-slate-300">Showing {filteredEntries.length} of {entries.length}</p>
          </div>

          <div className="mt-5 grid gap-4">
            {filteredEntries.length ? filteredEntries.map((entry) => (
              <article key={entry.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Submitted by {entry.submittedBy}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-400">{formatDate(entry.submittedAt)}</p>
                  </div>
                  <button onClick={() => deleteEntry(entry.id)} className="rounded-full border border-rose-300/30 px-3 py-1.5 text-sm font-bold text-rose-100 hover:bg-rose-300/10" type="button">
                    Delete
                  </button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    ["Problem", entry.problem],
                    ["Root Cause", entry.rootCause],
                    ["Fix", entry.fix],
                    ["Prevention", entry.prevention],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">{label}</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">{value}</p>
                    </div>
                  ))}
                </div>
              </article>
            )) : (
              <div className="rounded-3xl border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-center">
                <p className="text-lg font-black text-white">No lessons found yet.</p>
                <p className="mt-2 text-sm text-cyan-100">Add the first production-floor lesson or clear your search.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
