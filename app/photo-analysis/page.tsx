"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

import { defectGuides } from "../../lib/defect-data";

type DefectCategory = string;

type AnalysisResult = {
  likelyDefect: string;
  confidence: string;
  possibleCauses: string[];
  processChecks: string[];
  correctiveActions: string[];
};

const materials = ["ABS", "PP", "PE", "PC", "Nylon", "PBT", "Acetal", "TPE"];

const defectCategories = defectGuides.map((defect) => ({
  label: defect.name,
  value: defect.slug,
  helper: defect.description,
}));

function findDefect(category: DefectCategory) {
  return defectGuides.find((defect) => defect.slug === category) ?? defectGuides[0];
}

function buildAnalysis(material: string, category: DefectCategory, hasPhoto: boolean): AnalysisResult {
  const defect = findDefect(category);

  return {
    likelyDefect: defect.name,
    possibleCauses: defect.causes,
    processChecks: [...defect.checkFirst, ...defect.processAreas.map((area) => `Review related process area: ${area}.`)],
    correctiveActions: defect.actions,
    confidence: hasPhoto ? `Moderate — image uploaded, ${material} selected, and category context supplied.` : "Low — upload a photo to improve the review context.",
  };
}

export default function PhotoAnalysisPage() {
  const [material, setMaterial] = useState(materials[0]);
  const [category, setCategory] = useState<DefectCategory>(defectGuides[0].slug);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const result = useMemo(() => buildAnalysis(material, category, Boolean(photoUrl)), [category, material, photoUrl]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setPhotoUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setAnalyzed(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link href="/" className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10">
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Defect Photo Analysis</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Upload a molded part photo for guided AI review</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Add a part image, material, and visible defect type. This placeholder assistant uses rules for now to summarize likely causes, process checks, corrective actions, and the best troubleshooting tools to open next.
          </p>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_24rem]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <h2 className="text-2xl font-bold text-white">Photo intake</h2>
            <div className="mt-5 grid gap-5">
              <label className="rounded-3xl border border-dashed border-cyan-300/40 bg-slate-900/70 p-5 text-center transition hover:border-cyan-200 hover:bg-cyan-300/10">
                <span className="text-lg font-bold text-cyan-100">Upload molded part photo</span>
                <span className="mt-2 block text-sm leading-6 text-slate-300">Use a close, well-lit image that shows the defect location and flow direction.</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
              </label>

              {photoUrl ? (
                <figure className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="Uploaded molded part preview" className="max-h-[28rem] w-full object-contain" />
                  <figcaption className="border-t border-white/10 px-4 py-3 text-sm text-slate-300">{fileName}</figcaption>
                </figure>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center text-sm leading-6 text-slate-400">No photo uploaded yet.</div>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
              <h2 className="text-2xl font-bold text-white">Analysis setup</h2>
              <label htmlFor="material" className="mt-5 block text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Material</label>
              <select id="material" value={material} onChange={(event) => setMaterial(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300/60">
                {materials.map((option) => <option key={option}>{option}</option>)}
              </select>

              <fieldset className="mt-5">
                <legend className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Visible defect type</legend>
                <div className="mt-3 grid gap-3">
                  {defectCategories.map((option) => (
                    <label key={option.value} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 transition has-[:checked]:border-cyan-300/60 has-[:checked]:bg-cyan-300/10">
                      <span className="flex items-start gap-3">
                        <input type="radio" name="category" value={option.value} checked={category === option.value} onChange={() => setCategory(option.value)} className="mt-1" />
                        <span><span className="block font-bold text-white">{option.label}</span><span className="mt-1 block text-sm leading-5 text-slate-400">{option.helper}</span></span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button type="button" onClick={() => setAnalyzed(true)} className="mt-5 w-full rounded-2xl bg-cyan-300 px-6 py-3 text-base font-black text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30">
                Analyze image
              </button>
            </section>
          </aside>
        </section>

        {analyzed ? (
          <section className="mt-6 rounded-3xl border border-cyan-300/20 bg-slate-900/80 p-5 shadow-xl shadow-cyan-950/20 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Rule-based analysis result</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Likely defect: {result.likelyDefect}</h2>
                <p className="mt-2 text-sm font-semibold text-cyan-200">Confidence: {result.confidence}</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <section><h3 className="font-bold text-white">Possible causes</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.possibleCauses.map((item) => <li key={item}>• {item}</li>)}</ul></section>
                  <section><h3 className="font-bold text-white">Process checks</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.processChecks.map((item) => <li key={item}>• {item}</li>)}</ul></section>
                  <section className="md:col-span-2"><h3 className="font-bold text-white">Corrective actions</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.correctiveActions.map((item) => <li key={item}>• {item}</li>)}</ul></section>
                </div>
              </div>
              <aside className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <h3 className="text-xl font-bold text-white">Open next</h3>
                <div className="mt-4 flex flex-col gap-3">
                  <Link href="/defects" className="rounded-2xl border border-cyan-300/30 px-4 py-3 text-center font-bold text-cyan-100 transition hover:bg-cyan-300/10">Defect Library →</Link>
                  <Link href="/troubleshooting" className="rounded-2xl border border-emerald-300/30 px-4 py-3 text-center font-bold text-emerald-100 transition hover:bg-emerald-300/10">Troubleshooting Assistant →</Link>
                </div>
              </aside>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
