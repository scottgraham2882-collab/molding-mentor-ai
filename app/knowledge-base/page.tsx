"use client";

import Link from "next/link";

import { RecommendedNextStep } from "../../components/RecommendedNextStep";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Lesson = {
  id: string;
  title: string;
  date: string;
  author: string;
  machineNumber: string;
  moldNumber: string;
  partNumber: string;
  material: string;
  defect: string;
  problemEncountered: string;
  rootCauseDiscovered: string;
  solutionImplemented: string;
  resultsAchieved: string;
  keyLessonLearned: string;
  newTechnicianTeaching: string;
  tags: string;
};

const storageKey = "moldingMentorLessonsLearned";

function today() {
  return new Date().toISOString().slice(0, 10);
}

const emptyLesson: Lesson = {
  id: "",
  title: "",
  date: today(),
  author: "",
  machineNumber: "",
  moldNumber: "",
  partNumber: "",
  material: "",
  defect: "",
  problemEncountered: "",
  rootCauseDiscovered: "",
  solutionImplemented: "",
  resultsAchieved: "",
  keyLessonLearned: "",
  newTechnicianTeaching: "",
  tags: "",
};

const textFields: Array<[keyof Lesson, string, boolean]> = [
  ["problemEncountered", "Problem encountered", true],
  ["rootCauseDiscovered", "Root cause discovered", true],
  ["solutionImplemented", "Solution implemented", true],
  ["resultsAchieved", "Results achieved", true],
  ["keyLessonLearned", "Key lesson learned", true],
  ["newTechnicianTeaching", "What would you teach a new technician about this problem?", true],
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function splitTags(tags: string) {
  return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
}

function fieldMatches(value: string, filter: string) {
  return !filter || normalize(value).includes(normalize(filter));
}

export default function KnowledgeBasePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [formLesson, setFormLesson] = useState<Lesson>(emptyLesson);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ defect: "", machine: "", mold: "", material: "", tag: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Lesson[];
      if (Array.isArray(parsed)) setLessons(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(lessons));
  }, [lessons]);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];

  const filteredLessons = useMemo(() => {
    const keywords = normalize(searchTerm);
    return lessons.filter((lesson) => {
      const searchable = Object.values(lesson).join(" ").toLowerCase();
      return (!keywords || searchable.includes(keywords))
        && fieldMatches(lesson.defect, filters.defect)
        && fieldMatches(lesson.machineNumber, filters.machine)
        && fieldMatches(lesson.moldNumber, filters.mold)
        && fieldMatches(lesson.material, filters.material)
        && (!filters.tag || splitTags(lesson.tags).some((tag) => normalize(tag).includes(normalize(filters.tag))));
    });
  }, [filters, lessons, searchTerm]);

  const relatedLessons = useMemo(() => {
    if (!selectedLesson) return [];
    const selectedTags = new Set(splitTags(selectedLesson.tags).map(normalize));
    return lessons
      .filter((lesson) => lesson.id !== selectedLesson.id)
      .map((lesson) => ({ lesson, score: splitTags(lesson.tags).filter((tag) => selectedTags.has(normalize(tag))).length }))
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((match) => match.lesson);
  }, [lessons, selectedLesson]);

  function updateField(field: keyof Lesson, value: string) {
    setFormLesson((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setFormLesson({ ...emptyLesson, date: today() });
    setEditingId(null);
  }

  function saveLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lessonToSave = { ...formLesson, id: editingId ?? crypto.randomUUID() };
    setLessons((current) => editingId ? current.map((lesson) => lesson.id === editingId ? lessonToSave : lesson) : [lessonToSave, ...current]);
    setSelectedLessonId(lessonToSave.id);
    resetForm();
  }

  function editLesson(lesson: Lesson) {
    setFormLesson(lesson);
    setEditingId(lesson.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteLesson(id: string) {
    setLessons((current) => current.filter((lesson) => lesson.id !== id));
    if (selectedLessonId === id) setSelectedLessonId(null);
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-cyan-300/20 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:hidden">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10">← Back home</Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Lessons Learned Knowledge Base</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Save shop-floor wisdom before it walks away.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Capture what happened, what caused it, how the team fixed it, and what you would teach a new technician next time.</p>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] print:block">
          <form onSubmit={saveLesson} className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">Create or edit</p><h2 className="text-2xl font-black text-white">Lesson record</h2></div>
              {editingId ? <button type="button" onClick={resetForm} className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-200">Cancel edit</button> : null}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-200">Title</span><input required value={formLesson.title} onChange={(e) => updateField("title", e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
              <label><span className="text-sm font-bold text-slate-200">Date</span><input required type="date" value={formLesson.date} onChange={(e) => updateField("date", e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
              <label><span className="text-sm font-bold text-slate-200">Author</span><input required value={formLesson.author} onChange={(e) => updateField("author", e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
              {[["machineNumber", "Machine number"], ["moldNumber", "Mold number"], ["partNumber", "Part number"], ["material", "Material"], ["defect", "Defect (optional)"], ["tags", "Tags (comma separated)"]].map(([field, label]) => (
                <label key={field}><span className="text-sm font-bold text-slate-200">{label}</span><input value={formLesson[field as keyof Lesson]} onChange={(e) => updateField(field as keyof Lesson, e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
              ))}
              {textFields.map(([field, label, required]) => (
                <label key={field} className="sm:col-span-2"><span className="text-sm font-bold text-slate-200">{label}</span><textarea required={required} value={formLesson[field]} onChange={(e) => updateField(field, e.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
              ))}
            </div>
            <button className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 hover:bg-cyan-200" type="submit">{editingId ? "Save updated lesson" : "Create lesson learned record"}</button>
          </form>

          <aside className="space-y-4 print:hidden">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-5">
              <h2 className="text-xl font-black text-white">Search and filter</h2>
              <input placeholder="Search any keyword" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[["defect", "Defect"], ["machine", "Machine"], ["mold", "Mold"], ["material", "Material"], ["tag", "Tag"]].map(([field, label]) => (
                  <input key={field} placeholder={`Filter by ${label.toLowerCase()}`} value={filters[field as keyof typeof filters]} onChange={(e) => setFilters((current) => ({ ...current, [field]: e.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
                ))}
              </div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-5">
              <h2 className="text-xl font-black text-white">Saved lessons ({filteredLessons.length})</h2>
              <div className="mt-4 space-y-3">
                {filteredLessons.length === 0 ? <p className="text-sm leading-6 text-slate-300">No saved lessons match yet. Create the first record or clear filters.</p> : null}
                {filteredLessons.map((lesson) => (
                  <article key={lesson.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <button type="button" onClick={() => setSelectedLessonId(lesson.id)} className="text-left text-lg font-black text-cyan-100 hover:text-cyan-50">{lesson.title}</button>
                    <p className="mt-1 text-sm text-slate-400">{lesson.date} • Machine {lesson.machineNumber || "—"} • Mold {lesson.moldNumber || "—"}</p>
                    <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => editLesson(lesson)} className="rounded-full bg-emerald-300 px-3 py-1.5 text-xs font-black text-slate-950" type="button">Edit</button><button onClick={() => deleteLesson(lesson.id)} className="rounded-full bg-rose-300 px-3 py-1.5 text-xs font-black text-slate-950" type="button">Delete</button></div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>

        {selectedLesson ? (
          <section className="mt-6 rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-xl shadow-slate-950/30 sm:p-8 print:mt-0 print:border-0 print:p-0 print:shadow-none">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between print:block"><div><p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">Print-friendly lesson report</p><h2 className="mt-2 text-3xl font-black">{selectedLesson.title}</h2><p className="mt-2 text-sm font-semibold text-slate-600">{selectedLesson.date} • By {selectedLesson.author || "Unknown"}</p></div><button onClick={() => window.print()} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white print:hidden" type="button">Print report</button></div>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[["Machine", selectedLesson.machineNumber], ["Mold", selectedLesson.moldNumber], ["Part", selectedLesson.partNumber], ["Material", selectedLesson.material], ["Defect", selectedLesson.defect || "None listed"], ["Tags", selectedLesson.tags]].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 p-3"><dt className="font-black text-slate-500">{label}</dt><dd className="mt-1 font-bold">{value || "—"}</dd></div>
              ))}
            </dl>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {textFields.map(([field, label]) => <article key={field} className="rounded-2xl border border-slate-200 p-4"><h3 className="font-black text-slate-900">{label}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{selectedLesson[field]}</p></article>)}
            </div>
            <section className="mt-6 rounded-2xl border border-slate-200 p-4 print:hidden"><h3 className="text-xl font-black">Related Lessons</h3>{relatedLessons.length === 0 ? <p className="mt-2 text-sm text-slate-600">Add matching tags to other records to connect related lessons.</p> : null}<div className="mt-3 grid gap-3 md:grid-cols-3">{relatedLessons.map((lesson) => <button key={lesson.id} onClick={() => setSelectedLessonId(lesson.id)} className="rounded-2xl bg-slate-100 p-4 text-left font-bold text-slate-900" type="button">{lesson.title}</button>)}</div></section>
          </section>
        ) : null}

        <RecommendedNextStep
          label="Knowledge Search"
          href="/knowledge-search"
          reason="After saving a lesson learned, use search to confirm it is easy to find by defect, mold, machine, material, part number, or plain-language symptom."
          related={[{ label: "Defect Library", href: "/defects" }, { label: "Troubleshooting Wizard", href: "/troubleshooting" }]}
        />
      </div>
    </main>
  );
}
