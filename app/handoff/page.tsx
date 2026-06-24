"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Shift = "" | "1st" | "2nd" | "3rd";
type Priority = "" | "Low" | "Medium" | "High";

type HandoffNote = {
  id: string;
  machineArea: string;
  shift: Shift;
  priority: Priority;
  note: string;
  submittedBy: string;
  createdAt: string;
};

type HandoffForm = Omit<HandoffNote, "id" | "createdAt">;

const storageKey = "moldingMentorSimpleHandoffNotes";

const emptyForm: HandoffForm = {
  machineArea: "",
  shift: "",
  priority: "",
  note: "",
  submittedBy: "",
};

const priorityStyles: Record<Exclude<Priority, "">, string> = {
  Low: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  Medium: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  High: "border-red-300/30 bg-red-300/10 text-red-100",
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function HandoffPage() {
  const [notes, setNotes] = useState<HandoffNote[]>([]);
  const [form, setForm] = useState<HandoffForm>(emptyForm);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedNotes = window.localStorage.getItem(storageKey);
      if (savedNotes) setNotes(JSON.parse(savedNotes) as HandoffNote[]);
    } catch {
      setNotes([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(notes));
    }
  }, [isLoaded, notes]);

  const newestNotes = useMemo(
    () => [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [notes],
  );

  function updateField(field: keyof HandoffForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextForm: HandoffForm = {
      machineArea: form.machineArea.trim(),
      shift: form.shift,
      priority: form.priority,
      note: form.note.trim(),
      submittedBy: form.submittedBy.trim(),
    };

    if (!nextForm.machineArea || !nextForm.shift || !nextForm.priority || !nextForm.note || !nextForm.submittedBy) {
      setError("Please complete every field before saving the handoff note.");
      return;
    }

    setNotes((current) => [
      {
        ...nextForm,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setForm(emptyForm);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Shift Handoff Log</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Leave the next shift ready</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Capture the important machine, area, and troubleshooting notes that help people learn, preserve knowledge, and keep the team moving together.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Add a handoff note</h2>
              <p className="mt-1 text-sm text-slate-300">Keep it short, clear, and useful for the people coming in next.</p>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">All fields required</p>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-300/30 bg-red-300/10 p-4 text-sm font-bold text-red-100" role="alert">
              {error}
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-bold text-slate-200">Machine / Area</span>
              <input
                value={form.machineArea}
                onChange={(event) => updateField("machineArea", event.target.value)}
                placeholder="Press 12, assembly cell, toolroom..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
              />
            </label>

            <label>
              <span className="text-sm font-bold text-slate-200">Shift</span>
              <select
                value={form.shift}
                onChange={(event) => updateField("shift", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
              >
                <option value="">Select shift</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
              </select>
            </label>

            <label>
              <span className="text-sm font-bold text-slate-200">Priority</span>
              <select
                value={form.priority}
                onChange={(event) => updateField("priority", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label>
              <span className="text-sm font-bold text-slate-200">Submitted By</span>
              <input
                value={form.submittedBy}
                onChange={(event) => updateField("submittedBy", event.target.value)}
                placeholder="Name or initials"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="text-sm font-bold text-slate-200">Note</span>
              <textarea
                value={form.note}
                onChange={(event) => updateField("note", event.target.value)}
                placeholder="What should the next shift know, check, or continue troubleshooting?"
                rows={5}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
              />
            </label>
          </div>

          <button type="submit" className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-200 sm:w-auto">
            Save handoff note
          </button>
        </form>

        <section className="space-y-4" aria-label="Saved handoff notes">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-white">Saved notes</h2>
            <p className="text-sm font-bold text-slate-400">Newest first · {notes.length} total</p>
          </div>

          {newestNotes.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-slate-300">
              No handoff notes saved yet. Add the first note above so the next shift has a clear starting point.
            </div>
          ) : (
            newestNotes.map((savedNote) => (
              <article key={savedNote.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white">{savedNote.machineArea}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {savedNote.shift} shift · Submitted by {savedNote.submittedBy} · {formatDateTime(savedNote.createdAt)}
                    </p>
                  </div>
                  <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${savedNote.priority ? priorityStyles[savedNote.priority] : "border-slate-300/30 bg-slate-300/10 text-slate-100"}`}>
                    {savedNote.priority}
                  </span>
                </div>
                <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-white/[0.05] p-4 text-sm leading-6 text-slate-100">{savedNote.note}</p>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
