"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type MentorNote = {
  id: string;
  noteTitle: string;
  author: string;
  topic: string;
  relatedDefect: string;
  relatedMachine: string;
  relatedMold: string;
  whatILearned: string;
  whatIWouldTell: string;
  commonMistake: string;
  tags: string;
  updatedAt: string;
};

type MentorNoteForm = Omit<MentorNote, "id" | "updatedAt">;

type FilterKey = "topic" | "relatedDefect" | "relatedMachine" | "relatedMold" | "tags";

const storageKey = "moldingMentorMentorNotes";

const emptyForm: MentorNoteForm = {
  noteTitle: "",
  author: "",
  topic: "",
  relatedDefect: "",
  relatedMachine: "",
  relatedMold: "",
  whatILearned: "",
  whatIWouldTell: "",
  commonMistake: "",
  tags: "",
};

const quickLinks = [
  { label: "Knowledge Search", href: "/knowledge-search", helper: "Find related lessons, defects, and shop-floor tools." },
  { label: "AI Coach", href: "/coach", helper: "Turn a note into safer troubleshooting questions." },
  { label: "Defect Library", href: "/defects", helper: "Compare the note to common defect causes and checks." },
];

const fieldLabels: Record<keyof MentorNoteForm, string> = {
  noteTitle: "Note title",
  author: "Author",
  topic: "Topic",
  relatedDefect: "Related defect",
  relatedMachine: "Related machine",
  relatedMold: "Related mold",
  whatILearned: "What I learned",
  whatIWouldTell: "What I would tell a new technician",
  commonMistake: "Common mistake to avoid",
  tags: "Tags",
};

const filterLabels: Record<FilterKey, string> = {
  topic: "Topic",
  relatedDefect: "Defect",
  relatedMachine: "Machine",
  relatedMold: "Mold",
  tags: "Tag",
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function searchableText(note: MentorNote) {
  return Object.values(note).join(" ").toLowerCase();
}

function uniqueOptions(notes: MentorNote[], key: FilterKey) {
  const values = notes.flatMap((note) => {
    const value = note[key].trim();
    if (!value) return [];
    return key === "tags" ? value.split(",").map((tag) => tag.trim()).filter(Boolean) : [value];
  });

  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export default function MentorNotesPage() {
  const [notes, setNotes] = useState<MentorNote[]>([]);
  const [form, setForm] = useState<MentorNoteForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterKey, setFilterKey] = useState<FilterKey>("topic");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    try {
      const savedNotes = window.localStorage.getItem(storageKey);
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch {
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes]);

  const filterOptions = useMemo(() => uniqueOptions(notes, filterKey), [filterKey, notes]);

  const visibleNotes = useMemo(() => {
    const query = normalize(search);
    const selectedFilter = normalize(filterValue);

    return notes
      .filter((note) => !query || searchableText(note).includes(query))
      .filter((note) => {
        if (!selectedFilter) return true;
        if (filterKey === "tags") {
          return note.tags.split(",").some((tag) => normalize(tag) === selectedFilter);
        }
        return normalize(note[filterKey]) === selectedFilter;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [filterKey, filterValue, notes, search]);

  function updateField(field: keyof MentorNoteForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = form.noteTitle.trim();

    if (!trimmedTitle) return;

    const nextNote: MentorNote = {
      ...form,
      noteTitle: trimmedTitle,
      id: editingId ?? crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };

    setNotes((current) => editingId ? current.map((note) => note.id === editingId ? nextNote : note) : [nextNote, ...current]);
    resetForm();
  }

  function editNote(note: MentorNote) {
    setForm({
      noteTitle: note.noteTitle,
      author: note.author,
      topic: note.topic,
      relatedDefect: note.relatedDefect,
      relatedMachine: note.relatedMachine,
      relatedMold: note.relatedMold,
      whatILearned: note.whatILearned,
      whatIWouldTell: note.whatIWouldTell,
      commonMistake: note.commonMistake,
      tags: note.tags,
    });
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNote(id: string) {
    setNotes((current) => current.filter((note) => note.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10">← Back home</Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Mentor Notes</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Save shop-floor teaching notes.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Experienced technicians and supervisors can leave short, plain-language notes so newer employees know what was learned, what to watch, and what mistake to avoid.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm font-bold text-cyan-50 hover:border-cyan-300/40 hover:bg-cyan-300/10">
                <span className="block text-base font-black text-white">{link.label} →</span>
                <span className="mt-1 block leading-5 text-slate-300">{link.helper}</span>
              </Link>
            ))}
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/10 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Create / Edit</p>
                <h2 className="mt-1 text-2xl font-black text-white">{editingId ? "Edit mentor note" : "New mentor note"}</h2>
              </div>
              {editingId ? <button type="button" onClick={resetForm} className="rounded-full border border-white/10 px-3 py-2 text-sm font-black text-slate-200 hover:bg-white/10">Cancel</button> : null}
            </div>

            <div className="mt-5 grid gap-4">
              {(["noteTitle", "author", "topic", "relatedDefect", "relatedMachine", "relatedMold"] as (keyof MentorNoteForm)[]).map((field) => (
                <label key={field} className="block">
                  <span className="text-sm font-bold text-slate-200">{fieldLabels[field]}{field === "noteTitle" ? " *" : ""}</span>
                  <input value={form[field]} onChange={(event) => updateField(field, event.target.value)} className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 py-3 text-white outline-none ring-cyan-300/30 placeholder:text-slate-500 focus:ring-4" placeholder={field === "tags" ? "startup, flash, water" : fieldLabels[field]} required={field === "noteTitle"} />
                </label>
              ))}

              {(["whatILearned", "whatIWouldTell", "commonMistake"] as (keyof MentorNoteForm)[]).map((field) => (
                <label key={field} className="block">
                  <span className="text-sm font-bold text-slate-200">{fieldLabels[field]}</span>
                  <textarea value={form[field]} onChange={(event) => updateField(field, event.target.value)} className="mt-2 min-h-28 w-full rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 py-3 text-white outline-none ring-cyan-300/30 placeholder:text-slate-500 focus:ring-4" placeholder="Write it like you are coaching someone on the floor." />
                </label>
              ))}

              <label className="block">
                <span className="text-sm font-bold text-slate-200">Tags</span>
                <input value={form.tags} onChange={(event) => updateField("tags", event.target.value)} className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 py-3 text-white outline-none ring-cyan-300/30 placeholder:text-slate-500 focus:ring-4" placeholder="flash, startup, mold water" />
              </label>
            </div>

            <button type="submit" className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 hover:bg-cyan-200">
              {editingId ? "Save changes" : "Save mentor note"}
            </button>
          </form>

          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Find notes</p>
                <h2 className="mt-1 text-2xl font-black text-white">Search and filter</h2>
              </div>
              <span className="rounded-full bg-slate-950/70 px-3 py-2 text-sm font-black text-cyan-100">{visibleNotes.length} of {notes.length}</span>
            </div>

            <div className="mt-4 grid gap-3">
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 py-3 text-white outline-none ring-cyan-300/30 placeholder:text-slate-500 focus:ring-4" placeholder="Search title, author, topic, defect, machine, mold, tags, or note text" />
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={filterKey} onChange={(event) => { setFilterKey(event.target.value as FilterKey); setFilterValue(""); }} className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 py-3 text-white outline-none ring-cyan-300/30 focus:ring-4">
                  {(Object.keys(filterLabels) as FilterKey[]).map((key) => <option key={key} value={key}>{filterLabels[key]}</option>)}
                </select>
                <select value={filterValue} onChange={(event) => setFilterValue(event.target.value)} className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 py-3 text-white outline-none ring-cyan-300/30 focus:ring-4">
                  <option value="">All {filterLabels[filterKey].toLowerCase()}s</option>
                  {filterOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {visibleNotes.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">No mentor notes yet. Add one simple lesson a new technician could use tomorrow.</p>
              ) : null}

              {visibleNotes.map((note) => (
                <article key={note.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">{note.noteTitle}</h3>
                      <p className="mt-1 text-sm font-bold text-cyan-100">{note.topic || "No topic"} · by {note.author || "Unknown author"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => editNote(note)} className="rounded-full bg-emerald-300 px-3 py-2 text-sm font-black text-slate-950 hover:bg-emerald-200">Edit</button>
                      <button type="button" onClick={() => deleteNote(note.id)} className="rounded-full border border-rose-300/40 px-3 py-2 text-sm font-black text-rose-100 hover:bg-rose-300/10">Delete</button>
                    </div>
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/5 p-3"><dt className="font-black text-slate-400">Defect</dt><dd className="mt-1 text-slate-100">{note.relatedDefect || "—"}</dd></div>
                    <div className="rounded-2xl bg-white/5 p-3"><dt className="font-black text-slate-400">Machine</dt><dd className="mt-1 text-slate-100">{note.relatedMachine || "—"}</dd></div>
                    <div className="rounded-2xl bg-white/5 p-3"><dt className="font-black text-slate-400">Mold</dt><dd className="mt-1 text-slate-100">{note.relatedMold || "—"}</dd></div>
                  </dl>

                  <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                    <p><span className="font-black text-emerald-200">What I learned: </span>{note.whatILearned || "—"}</p>
                    <p><span className="font-black text-cyan-200">Tell a new technician: </span>{note.whatIWouldTell || "—"}</p>
                    <p><span className="font-black text-amber-200">Common mistake to avoid: </span>{note.commonMistake || "—"}</p>
                  </div>

                  {note.tags ? <div className="mt-4 flex flex-wrap gap-2">{note.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => <span key={tag} className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">#{tag}</span>)}</div> : null}
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
