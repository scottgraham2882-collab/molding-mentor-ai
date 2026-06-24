"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type VaultEntry = {
  problem: string;
  rootCause: string;
  fix: string;
  prevention: string;
  submittedBy: string;
};

const emptyEntry: VaultEntry = {
  problem: "",
  rootCause: "",
  fix: "",
  prevention: "",
  submittedBy: "",
};

const lessonFields: Array<{
  name: keyof VaultEntry;
  label: string;
  prompt: string;
  rows?: number;
}> = [
  {
    name: "problem",
    label: "Problem",
    prompt: "What happened? What did the team see?",
  },
  {
    name: "rootCause",
    label: "Root Cause",
    prompt: "What actually caused it?",
  },
  {
    name: "fix",
    label: "Fix",
    prompt: "What corrected the issue?",
  },
  {
    name: "prevention",
    label: "Prevention",
    prompt: "How can the team prevent it next time?",
  },
  {
    name: "submittedBy",
    label: "Submitted By",
    prompt: "Name, shift, or team",
    rows: 1,
  },
];

export default function KnowledgeVaultPage() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [formEntry, setFormEntry] = useState<VaultEntry>(emptyEntry);

  function updateField(field: keyof VaultEntry, value: string) {
    setFormEntry((current) => ({ ...current, [field]: value }));
  }

  function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEntries((current) => [formEntry, ...current]);
    setFormEntry(emptyEntry);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-3xl border border-cyan-300/20 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link
            href="/"
            className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
            Knowledge Vault
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">
            Capture lessons from the production floor.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            A simple MVP for people-first learning: document the problem, root cause, fix,
            prevention, and who shared the lesson so teams can troubleshoot together and preserve
            practical knowledge.
          </p>
        </header>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">
              New lesson
            </p>
            <h2 className="text-2xl font-black text-white">What did the floor learn?</h2>
          </div>

          <form onSubmit={saveEntry} className="mt-5 grid gap-4">
            {lessonFields.map((field) => (
              <label key={field.name}>
                <span className="text-sm font-bold text-slate-200">{field.label}</span>
                {field.rows === 1 ? (
                  <input
                    required
                    value={formEntry[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    placeholder={field.prompt}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
                  />
                ) : (
                  <textarea
                    required
                    value={formEntry[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    placeholder={field.prompt}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500"
                  />
                )}
              </label>
            ))}

            <button
              className="rounded-2xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 hover:bg-cyan-200"
              type="submit"
            >
              Save lesson
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">
              Shared knowledge
            </p>
            <h2 className="text-2xl font-black text-white">Lessons captured this session</h2>
          </div>

          <div className="mt-5 grid gap-4">
            {entries.length ? (
              entries.map((entry, entryIndex) => (
                <article
                  key={`${entry.submittedBy}-${entryIndex}`}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 p-4"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                    Submitted by {entry.submittedBy}
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {lessonFields
                      .filter((field) => field.name !== "submittedBy")
                      .map((field) => (
                        <div
                          key={field.name}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                        >
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                            {field.label}
                          </p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                            {entry[field.name]}
                          </p>
                        </div>
                      ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-center">
                <p className="text-lg font-black text-white">No lessons captured yet.</p>
                <p className="mt-2 text-sm text-cyan-100">
                  Add the first simple lesson to help the next person troubleshoot faster.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
