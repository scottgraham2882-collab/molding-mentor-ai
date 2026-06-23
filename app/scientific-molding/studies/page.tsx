"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const studyTypes = [
  "Fill Study",
  "Gate Seal Study",
  "Pressure Drop Study",
  "Decoupled Molding I",
  "Decoupled Molding II",
  "Process Window Study",
] as const;

type StudyType = (typeof studyTypes)[number];

type StudyRecord = {
  id: string;
  studyDate: string;
  partNumber: string;
  moldNumber: string;
  machineNumber: string;
  material: string;
  studyType: StudyType;
  objective: string;
  results: string;
  recommendations: string;
  approvedBy: string;
  notes: string;
  updatedAt: string;
};

type StudyFormState = Omit<StudyRecord, "id" | "updatedAt">;

const storageKey = "scientific-molding-study-records";

const emptyForm: StudyFormState = {
  studyDate: new Date().toISOString().slice(0, 10),
  partNumber: "",
  moldNumber: "",
  machineNumber: "",
  material: "",
  studyType: "Fill Study",
  objective: "",
  results: "",
  recommendations: "",
  approvedBy: "",
  notes: "",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-200">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function inputClass() {
  return "w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-base font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10";
}

export default function ScientificMoldingStudiesPage() {
  const [studies, setStudies] = useState<StudyRecord[]>([]);
  const [form, setForm] = useState<StudyFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ studyType: "All", partNumber: "", machineNumber: "", studyDate: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setStudies(JSON.parse(saved) as StudyRecord[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(studies));
  }, [studies]);

  const filteredStudies = useMemo(() => {
    return studies.filter((study) => {
      const matchesType = filters.studyType === "All" || study.studyType === filters.studyType;
      const matchesPart = study.partNumber.toLowerCase().includes(filters.partNumber.toLowerCase());
      const matchesMachine = study.machineNumber.toLowerCase().includes(filters.machineNumber.toLowerCase());
      const matchesDate = !filters.studyDate || study.studyDate === filters.studyDate;
      return matchesType && matchesPart && matchesMachine && matchesDate;
    });
  }, [filters, studies]);

  const countsByType = useMemo(() => {
    return studyTypes.map((type) => ({ type, count: studies.filter((study) => study.studyType === type).length }));
  }, [studies]);

  function updateForm(field: keyof StudyFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();

    if (editingId) {
      setStudies((current) =>
        current.map((study) => (study.id === editingId ? { ...form, id: editingId, updatedAt: timestamp } : study)),
      );
      setEditingId(null);
    } else {
      setStudies((current) => [{ ...form, id: crypto.randomUUID(), updatedAt: timestamp }, ...current]);
    }

    setForm(emptyForm);
  }

  function editStudy(study: StudyRecord) {
    setForm({
      studyDate: study.studyDate,
      partNumber: study.partNumber,
      moldNumber: study.moldNumber,
      machineNumber: study.machineNumber,
      material: study.material,
      studyType: study.studyType,
      objective: study.objective,
      results: study.results,
      recommendations: study.recommendations,
      approvedBy: study.approvedBy,
      notes: study.notes,
    });
    setEditingId(study.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteStudy(id: string) {
    setStudies((current) => current.filter((study) => study.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <div className="mx-auto w-full max-w-6xl print:max-w-none">
        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/70 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:hidden">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10">← Back home</Link>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Scientific Molding Tools</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Study Manager</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">Create, store, filter, edit, delete, and print disciplined scientific molding study records from a mobile-first dark workspace.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4"><p className="text-3xl font-black text-white">{studies.length}</p><p className="text-sm text-slate-300">Saved studies</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4"><p className="text-3xl font-black text-white">{filteredStudies.length}</p><p className="text-sm text-slate-300">Matching filters</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4"><p className="text-3xl font-black text-white">6</p><p className="text-sm text-slate-300">Study types</p></div>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr] print:hidden">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6">
            <h2 className="text-2xl font-black text-white">{editingId ? "Edit study" : "Create study record"}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Study date"><input className={inputClass()} type="date" value={form.studyDate} onChange={(e) => updateForm("studyDate", e.target.value)} required /></Field>
              <Field label="Study type"><select className={inputClass()} value={form.studyType} onChange={(e) => updateForm("studyType", e.target.value as StudyType)}>{studyTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
              <Field label="Part number"><input className={inputClass()} value={form.partNumber} onChange={(e) => updateForm("partNumber", e.target.value)} required /></Field>
              <Field label="Mold number"><input className={inputClass()} value={form.moldNumber} onChange={(e) => updateForm("moldNumber", e.target.value)} /></Field>
              <Field label="Machine number"><input className={inputClass()} value={form.machineNumber} onChange={(e) => updateForm("machineNumber", e.target.value)} required /></Field>
              <Field label="Material"><input className={inputClass()} value={form.material} onChange={(e) => updateForm("material", e.target.value)} /></Field>
            </div>
            <div className="mt-4 grid gap-4">
              {(["objective", "results", "recommendations", "notes"] as const).map((field) => (
                <Field key={field} label={field[0].toUpperCase() + field.slice(1)}><textarea className={`${inputClass()} min-h-28`} value={form[field]} onChange={(e) => updateForm(field, e.target.value)} /></Field>
              ))}
              <Field label="Approved by"><input className={inputClass()} value={form.approvedBy} onChange={(e) => updateForm("approvedBy", e.target.value)} /></Field>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950 hover:bg-cyan-200" type="submit">{editingId ? "Save changes" : "Save study"}</button>
              {editingId ? <button className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-200" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</button> : null}
            </div>
          </form>

          <aside className="rounded-3xl border border-cyan-300/20 bg-cyan-950/20 p-5 sm:p-6">
            <h2 className="text-2xl font-black text-white">Filters & study mix</h2>
            <div className="mt-5 grid gap-4">
              <Field label="Study type"><select className={inputClass()} value={filters.studyType} onChange={(e) => setFilters((f) => ({ ...f, studyType: e.target.value }))}><option>All</option>{studyTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
              <Field label="Part number"><input className={inputClass()} value={filters.partNumber} onChange={(e) => setFilters((f) => ({ ...f, partNumber: e.target.value }))} placeholder="Search part" /></Field>
              <Field label="Machine number"><input className={inputClass()} value={filters.machineNumber} onChange={(e) => setFilters((f) => ({ ...f, machineNumber: e.target.value }))} placeholder="Search machine" /></Field>
              <Field label="Date"><input className={inputClass()} type="date" value={filters.studyDate} onChange={(e) => setFilters((f) => ({ ...f, studyDate: e.target.value }))} /></Field>
            </div>
            <div className="mt-6 grid gap-2">{countsByType.map((item) => <div key={item.type} className="flex justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm"><span>{item.type}</span><strong>{item.count}</strong></div>)}</div>
            <button onClick={() => window.print()} className="mt-6 w-full rounded-2xl border border-cyan-300/40 px-5 py-3 font-black text-cyan-100 hover:bg-cyan-300/10">Print filtered report</button>
          </aside>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 print:mt-0 print:rounded-none print:border-0 print:bg-white print:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200 print:text-slate-600">Print-friendly report</p><h2 className="text-3xl font-black text-white print:text-slate-950">Saved studies</h2></div>
            <p className="text-sm text-slate-300 print:text-slate-600">Showing {filteredStudies.length} of {studies.length} records</p>
          </div>
          <div className="mt-5 grid gap-4">
            {filteredStudies.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-5 text-slate-300 print:text-slate-700">No studies match the current filters.</p> : null}
            {filteredStudies.map((study) => (
              <article key={study.id} className="break-inside-avoid rounded-3xl border border-white/10 bg-slate-950/70 p-5 print:border-slate-300 print:bg-white">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div><p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200 print:text-slate-600">{study.studyType}</p><h3 className="mt-2 text-2xl font-black text-white print:text-slate-950">Part {study.partNumber || "—"}</h3></div>
                  <div className="text-sm text-slate-300 print:text-slate-700"><p>{study.studyDate}</p><p>Machine {study.machineNumber || "—"}</p></div>
                </div>
                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="font-bold text-slate-400">Mold</dt><dd>{study.moldNumber || "—"}</dd></div><div><dt className="font-bold text-slate-400">Material</dt><dd>{study.material || "—"}</dd></div>
                  {["objective", "results", "recommendations", "notes"] .map((key) => <div key={key} className="sm:col-span-2"><dt className="font-bold text-slate-400">{key[0].toUpperCase() + key.slice(1)}</dt><dd className="whitespace-pre-wrap text-slate-200 print:text-slate-800">{study[key as keyof StudyRecord] || "—"}</dd></div>)}
                  <div><dt className="font-bold text-slate-400">Approved by</dt><dd>{study.approvedBy || "—"}</dd></div>
                </dl>
                <div className="mt-5 flex gap-3 print:hidden"><button onClick={() => editStudy(study)} className="rounded-xl bg-cyan-300 px-4 py-2 font-bold text-slate-950">Edit</button><button onClick={() => deleteStudy(study.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 font-bold text-rose-100">Delete</button></div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
