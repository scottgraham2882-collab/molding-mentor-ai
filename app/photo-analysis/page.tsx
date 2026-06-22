"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

type DefectCategory = "surface" | "fill" | "dimensional" | "contamination";

type AnalysisResult = {
  likelyDefect: string;
  confidence: string;
  evidence: string[];
  nextChecks: string[];
  guideHref: string;
  lessons: { label: string; href: string }[];
};

const materials = ["ABS", "PP", "PE", "PC", "Nylon", "PBT", "Acetal", "TPE"];

const defectCategories: { label: string; value: DefectCategory; helper: string }[] = [
  { label: "Surface mark", value: "surface", helper: "Splay, burns, blush, sink, gloss change" },
  { label: "Fill problem", value: "fill", helper: "Short shot, hesitation, flow lines, weld lines" },
  { label: "Dimensional issue", value: "dimensional", helper: "Warp, bow, shrink, sink, flash" },
  { label: "Contamination", value: "contamination", helper: "Black specks, color streaks, delamination" },
];

const categoryAnalysis: Record<DefectCategory, Omit<AnalysisResult, "confidence">> = {
  surface: {
    likelyDefect: "Splay / surface streaking",
    evidence: [
      "Surface-mark reports commonly map to moisture, volatiles, air entrapment, or shear-related streaking.",
      "The selected material should be checked against dryer temperature, dew point, and drying-time requirements before changing press settings.",
      "Compare the uploaded photo against good-part photos by gate area, flow direction, and end-of-fill location.",
    ],
    nextChecks: [
      "Verify dryer dew point, hopper residence time, material lot, colorant, and regrind percentage.",
      "Reduce decompression and review screw recovery, back pressure, and injection speed if moisture checks pass.",
      "Tag the photo with cavity number and defect location so the tooling team can check vents and polish condition.",
    ],
    guideHref: "/defects",
    lessons: [
      { label: "Resin Drying Guide", href: "/materials/resin-drying" },
      { label: "Material Troubleshooter", href: "/materials/troubleshooter" },
      { label: "Defect Library", href: "/defects" },
    ],
  },
  fill: {
    likelyDefect: "Short shot / incomplete fill",
    evidence: [
      "Fill-problem photos should be checked for missing features, thin flow-front edges, weld lines, or hesitation near ribs and long flow paths.",
      "Likely causes include low melt temperature, low injection speed, pressure limit, undersized shot, blocked gates, or poor venting.",
      "The most useful comparison is a fill-only progression photo set from the same cavity and material.",
    ],
    nextChecks: [
      "Confirm cushion, transfer position, shot size, fill time, and peak pressure are repeatable and not pressure-limited.",
      "Inspect gate, runner, nozzle tip, check ring, feed throat, and end-of-fill vents before large process changes.",
      "Increase speed or temperature only in documented steps and watch for flash or burns.",
    ],
    guideHref: "/troubleshooting",
    lessons: [
      { label: "Decoupled Molding I", href: "/lessons/decoupled-molding-1" },
      { label: "Process Window Lesson", href: "/lessons/process-window" },
      { label: "Shot Size Calculator", href: "/calculators/shot-size" },
    ],
  },
  dimensional: {
    likelyDefect: "Warpage / shrink imbalance",
    evidence: [
      "Dimensional symptoms often come from unbalanced cooling, uneven wall thickness, gate location, fiber orientation, or pack variation.",
      "If depressions are visible near ribs or bosses, sink marks may be the primary defect instead of global warp.",
      "Photo evidence is strongest when paired with dimensions taken at a consistent time after molding.",
    ],
    nextChecks: [
      "Compare coolant temperature, flow, and blocked circuits across mold halves and cavities.",
      "Review pack pressure, pack time, gate seal, cooling time, and ejection temperature before changing clamp or fill settings.",
      "Fixture or measure the part the same way every time so the result is not handling-related.",
    ],
    guideHref: "/defects",
    lessons: [
      { label: "Gate Seal Study", href: "/lessons/gate-seal-study" },
      { label: "Cycle Time Calculator", href: "/calculators/cycle-time" },
      { label: "Process Window Lesson", href: "/lessons/process-window" },
    ],
  },
  contamination: {
    likelyDefect: "Black specks / contamination",
    evidence: [
      "Contamination reports commonly trace to degraded resin, mixed material, dirty loaders, colorant issues, or dead spots in the barrel or hot runner.",
      "Dark specks or color streaks should be compared to purge patties and parts from adjacent cavities.",
      "If the marks follow end-of-fill locations, trapped-gas burn marks should also be considered.",
    ],
    nextChecks: [
      "Purge and inspect hopper, loader, grinder, regrind containers, barrel, screw, nozzle, and hot runner drops.",
      "Confirm residence time, rear-zone temperature, screw speed, and back pressure are not degrading the material.",
      "Quarantine suspect resin or colorant lots until the source is verified.",
    ],
    guideHref: "/materials/troubleshooter",
    lessons: [
      { label: "Material Troubleshooter", href: "/materials/troubleshooter" },
      { label: "Defect Library", href: "/defects" },
      { label: "Troubleshooting Assistant", href: "/troubleshooting" },
    ],
  },
};

function buildAnalysis(material: string, category: DefectCategory, hasPhoto: boolean): AnalysisResult {
  const base = categoryAnalysis[category];
  return {
    ...base,
    confidence: hasPhoto ? `Moderate — image uploaded, ${material} selected, and category context supplied.` : "Low — upload a photo to improve the review context.",
  };
}

export default function PhotoAnalysisPage() {
  const [material, setMaterial] = useState(materials[0]);
  const [category, setCategory] = useState<DefectCategory>("surface");
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
            Add a part image, material, and defect category. The assistant summarizes the likely defect, evidence to verify on the floor, and the best troubleshooting guides and lessons to open next.
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
                <legend className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Defect category</legend>
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
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">AI analysis result</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Likely defect: {result.likelyDefect}</h2>
                <p className="mt-2 text-sm font-semibold text-cyan-200">Confidence: {result.confidence}</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <section><h3 className="font-bold text-white">Evidence to verify</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.evidence.map((item) => <li key={item}>• {item}</li>)}</ul></section>
                  <section><h3 className="font-bold text-white">Recommended next checks</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.nextChecks.map((item) => <li key={item}>• {item}</li>)}</ul></section>
                </div>
              </div>
              <aside className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <h3 className="text-xl font-bold text-white">Open next</h3>
                <div className="mt-4 flex flex-col gap-3">
                  <Link href={result.guideHref} className="rounded-2xl border border-cyan-300/30 px-4 py-3 text-center font-bold text-cyan-100 transition hover:bg-cyan-300/10">Troubleshooting guide →</Link>
                  {result.lessons.map((lesson) => <Link key={lesson.href} href={lesson.href} className="rounded-2xl border border-white/10 px-4 py-3 text-center font-bold text-slate-100 transition hover:bg-white/10">{lesson.label} →</Link>)}
                </div>
              </aside>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
