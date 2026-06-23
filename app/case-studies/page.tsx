"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type CaseStudy = {
  id: string;
  title: string;
  date: string;
  material: string;
  moldNumber: string;
  machineNumber: string;
  defect: string;
  problemDescription: string;
  whatChanged: string;
  investigationSteps: string;
  rootCause: string;
  solution: string;
  result: string;
  lessonsLearned: string;
  teachNewTechnician: string;
};

type CaseStudyFormField = {
  key: keyof Omit<CaseStudy, "id">;
  label: string;
  helper: string;
  multiline?: boolean;
};

const storageKey = "moldingMentorCaseStudies";

const emptyCaseStudy: Omit<CaseStudy, "id"> = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  material: "",
  moldNumber: "",
  machineNumber: "",
  defect: "",
  problemDescription: "",
  whatChanged: "",
  investigationSteps: "",
  rootCause: "",
  solution: "",
  result: "",
  lessonsLearned: "",
  teachNewTechnician: "",
};

const formFields: CaseStudyFormField[] = [
  { key: "title", label: "Title", helper: "Short name for this troubleshooting story." },
  { key: "date", label: "Date", helper: "When the issue happened." },
  { key: "material", label: "Material", helper: "Example: ABS, PP, PC/ABS, nylon 6/6." },
  { key: "moldNumber", label: "Mold number", helper: "Use the shop mold ID or tool number." },
  { key: "machineNumber", label: "Machine number", helper: "Use the press or workcell number." },
  { key: "defect", label: "Defect", helper: "Example: flash, splay, short shot, warp." },
  { key: "problemDescription", label: "Problem description", helper: "Describe what the team saw in plain language.", multiline: true },
  { key: "whatChanged", label: "What changed", helper: "Record the known change before the problem started.", multiline: true },
  { key: "investigationSteps", label: "Investigation steps", helper: "List what was checked, measured, or ruled out.", multiline: true },
  { key: "rootCause", label: "Root cause", helper: "The verified reason the defect happened.", multiline: true },
  { key: "solution", label: "Solution", helper: "The corrective action that fixed the issue.", multiline: true },
  { key: "result", label: "Result", helper: "What improved after the solution was applied.", multiline: true },
  { key: "lessonsLearned", label: "Lessons learned", helper: "What the team should remember next time.", multiline: true },
  {
    key: "teachNewTechnician",
    label: "What would you teach a new technician from this experience?",
    helper: "Write the coaching point you would pass to someone learning the trade.",
    multiline: true,
  },
];

const relatedLinks = [
  { label: "Defect Library", href: "/defects", helper: "Review symptoms and first checks." },
  { label: "Troubleshooting Wizard", href: "/troubleshooting", helper: "Walk through a guided defect path." },
  { label: "AI Coach", href: "/coach", helper: "Ask for plain-language next steps." },
  { label: "Knowledge Search", href: "/knowledge-search", helper: "Search saved learning and tools." },
];

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [form, setForm] = useState(emptyCaseStudy);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ defect: "", material: "", mold: "", machine: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) setCaseStudies(JSON.parse(saved) as CaseStudy[]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(caseStudies));
  }, [caseStudies]);

  const filteredCaseStudies = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return caseStudies.filter((study) => {
      const combined = Object.values(study).join(" ").toLowerCase();
      const matchesSearch = !search || combined.includes(search);
      const matchesDefect = !filters.defect || study.defect.toLowerCase().includes(filters.defect.toLowerCase());
      const matchesMaterial = !filters.material || study.material.toLowerCase().includes(filters.material.toLowerCase());
      const matchesMold = !filters.mold || study.moldNumber.toLowerCase().includes(filters.mold.toLowerCase());
      const matchesMachine = !filters.machine || study.machineNumber.toLowerCase().includes(filters.machine.toLowerCase());
      return matchesSearch && matchesDefect && matchesMaterial && matchesMold && matchesMachine;
    });
  }, [caseStudies, filters, searchTerm]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim()) return;

    if (editingId) {
      setCaseStudies((current) => current.map((study) => (study.id === editingId ? { ...form, id: editingId } : study)));
    } else {
      setCaseStudies((current) => [{ ...form, id: crypto.randomUUID() }, ...current]);
    }
    setForm({ ...emptyCaseStudy, date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
  }

  function editCaseStudy(study: CaseStudy) {
    const { id, ...editableFields } = study;
    setForm(editableFields);
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteCaseStudy(id: string) {
    setCaseStudies((current) => current.filter((study) => study.id !== id));
    if (editingId === id) setEditingId(null);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-300/10">← Back home</Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Case Studies Library</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Save real molding troubleshooting stories</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">Capture what happened, what changed, how the team investigated, and what a new technician should learn from the experience.</p>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-cyan-300/20 bg-slate-900/80 p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-white">{editingId ? "Edit case study" : "Create case study"}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {formFields.map((field) => (
                <label key={field.key} className={field.multiline ? "sm:col-span-2" : ""}>
                  <span className="text-sm font-bold text-slate-100">{field.label}</span>
                  <span className="mt-1 block text-xs text-slate-400">{field.helper}</span>
                  {field.multiline ? (
                    <textarea value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} className="mt-2 min-h-24 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none focus:border-cyan-300" />
                  ) : (
                    <input type={field.key === "date" ? "date" : "text"} value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none focus:border-cyan-300" />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200">{editingId ? "Save changes" : "Save case study"}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyCaseStudy); }} className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-white/10">Cancel edit</button>}
            </div>
          </form>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5">
              <h2 className="text-xl font-bold text-white">Beginner tip</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">A good case study tells the next person what not to guess at. Start with the visible defect, then document the checks that proved the root cause.</p>
            </section>
            <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <h2 className="text-xl font-bold text-white">Related links</h2>
              <div className="mt-4 grid gap-3">
                {relatedLinks.map((link) => <Link key={link.href} href={link.href} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-cyan-300/40"><span className="font-bold text-cyan-100">{link.label}</span><span className="mt-1 block text-sm text-slate-400">{link.helper}</span></Link>)}
              </div>
            </section>
          </aside>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/75 p-4 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Search and filter case studies</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <input aria-label="Search case studies" placeholder="Search all notes" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none focus:border-cyan-300 lg:col-span-2" />
            <input placeholder="Filter defect" value={filters.defect} onChange={(event) => setFilters({ ...filters, defect: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none focus:border-cyan-300" />
            <input placeholder="Filter material" value={filters.material} onChange={(event) => setFilters({ ...filters, material: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none focus:border-cyan-300" />
            <input placeholder="Filter mold" value={filters.mold} onChange={(event) => setFilters({ ...filters, mold: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none focus:border-cyan-300" />
            <input placeholder="Filter machine" value={filters.machine} onChange={(event) => setFilters({ ...filters, machine: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white outline-none focus:border-cyan-300" />
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {filteredCaseStudies.map((study) => (
            <article key={study.id} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="text-sm font-semibold text-cyan-300">{study.date || "No date"}</p><h2 className="mt-1 text-2xl font-bold text-white">{study.title}</h2></div>
                <div className="flex gap-2"><button onClick={() => editCaseStudy(study)} className="rounded-xl border border-cyan-300/30 px-3 py-2 text-xs font-bold text-cyan-100">Edit</button><button onClick={() => deleteCaseStudy(study.id)} className="rounded-xl border border-rose-300/30 px-3 py-2 text-xs font-bold text-rose-100">Delete</button></div>
              </div>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <Info label="Material" value={study.material} /><Info label="Mold" value={study.moldNumber} /><Info label="Machine" value={study.machineNumber} /><Info label="Defect" value={study.defect} />
              </dl>
              <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
                <Narrative title="Problem" value={study.problemDescription} /><Narrative title="What changed" value={study.whatChanged} /><Narrative title="Investigation" value={study.investigationSteps} /><Narrative title="Root cause" value={study.rootCause} /><Narrative title="Solution" value={study.solution} /><Narrative title="Result" value={study.result} /><Narrative title="Lessons learned" value={study.lessonsLearned} /><Narrative title="Teach a new technician" value={study.teachNewTechnician} />
              </div>
            </article>
          ))}
          {filteredCaseStudies.length === 0 && <p className="rounded-3xl border border-dashed border-white/15 p-8 text-center text-slate-400 md:col-span-2">No case studies found. Create one above or clear your search filters.</p>}
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-950/50 p-3"><dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</dt><dd className="mt-1 text-slate-100">{value || "—"}</dd></div>;
}

function Narrative({ title, value }: { title: string; value: string }) {
  if (!value.trim()) return null;
  return <section><h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">{title}</h3><p className="mt-1 whitespace-pre-line">{value}</p></section>;
}
