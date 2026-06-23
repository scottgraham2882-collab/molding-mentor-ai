"use client";

import Link from "next/link";

import { FeedbackPrompt } from "../../components/FeedbackPrompt";
import { ChangeEvent, useMemo, useState } from "react";

import { defectGuides } from "../../lib/defect-data";

type ObservationKey = "flash" | "short-shot" | "silver-streaks" | "burn-marks" | "voids" | "sink" | "warp" | "color" | "sticking";
type LocationKey = "near-gate" | "end-of-fill" | "parting-line" | "ejector-pins" | "thick-section" | "random";

type GuidedAnalysisResult = {
  likelyDefect: string;
  defectSlug: string;
  checkFirst: string[];
  doNotChangeFirst: string[];
  whyThisHappens: string;
  safeFirstActions: string[];
  visionReadinessNote: string;
};

type ObservationOption = {
  key: ObservationKey;
  label: string;
  beginnerHint: string;
  defectSlug: string;
};

type LocationOption = {
  key: LocationKey;
  label: string;
  beginnerHint: string;
};

const observationOptions: ObservationOption[] = [
  { key: "flash", label: "Extra plastic / flash", beginnerHint: "Thin unwanted plastic sticking out from an edge or seam.", defectSlug: "flash" },
  { key: "short-shot", label: "Part not full", beginnerHint: "The part is missing material, usually at the far end of flow.", defectSlug: "short-shots" },
  { key: "silver-streaks", label: "Silver streaks", beginnerHint: "Shiny lines or splay marks that follow the flow direction.", defectSlug: "splay" },
  { key: "burn-marks", label: "Burn marks", beginnerHint: "Brown, black, or scorched areas on the part surface.", defectSlug: "burn-marks" },
  { key: "voids", label: "Bubbles or voids", beginnerHint: "Air pockets, bubbles, or hollow-looking spots in the part.", defectSlug: "voids" },
  { key: "sink", label: "Sink mark", beginnerHint: "A dip or shallow crater over a thick area, rib, or boss.", defectSlug: "sink-marks" },
  { key: "warp", label: "Warped part", beginnerHint: "The part twists, bows, rocks, or will not sit flat.", defectSlug: "warpage" },
  { key: "color", label: "Color issue", beginnerHint: "Wrong shade, streaked color, contamination, or uneven mix.", defectSlug: "color-streaks" },
  { key: "sticking", label: "Part sticking", beginnerHint: "The part drags, scuffs, cracks, or stays on the mold during ejection.", defectSlug: "sticking" },
];

const locationOptions: LocationOption[] = [
  { key: "near-gate", label: "Near gate", beginnerHint: "Close to where plastic enters the part." },
  { key: "end-of-fill", label: "End of fill", beginnerHint: "The last place the plastic reaches." },
  { key: "parting-line", label: "Parting line", beginnerHint: "Along the seam where mold halves meet." },
  { key: "ejector-pins", label: "Around ejector pins", beginnerHint: "Near round ejector pin marks or push points." },
  { key: "thick-section", label: "Thick section", beginnerHint: "Bosses, ribs, corners, or heavy walls." },
  { key: "random", label: "Random locations", beginnerHint: "No clear pattern across the part." },
];

const locationGuidance: Record<LocationKey, { check: string; avoid: string; why: string; action: string }> = {
  "near-gate": {
    check: "Gate area, sprue, runner, and the first inch of flow for shear, blush, or damage.",
    avoid: "Do not raise injection speed first if the mark is already strongest at the gate.",
    why: "Near-gate defects often point to shear heat, gate restriction, or material entering the cavity too aggressively.",
    action: "Compare the gate area to the rest of the part and note if the mark fades with distance from the gate.",
  },
  "end-of-fill": {
    check: "Fill pattern, venting, transfer position, and whether the defect is at the last place to fill.",
    avoid: "Do not add clamp pressure first; it rarely fixes an end-of-fill condition by itself.",
    why: "End-of-fill defects often happen when trapped gas, low pressure, or cooling plastic stops a clean finish.",
    action: "Run a short-shot study or review the last-fill area with a process technician before changing many settings.",
  },
  "parting-line": {
    check: "Parting line, vents, mold shutoffs, clamp tonnage, and mold cleanliness.",
    avoid: "Do not increase pack pressure first until the mold shutoff and clamp condition are checked.",
    why: "Parting-line defects usually involve the mold halves, vent land, shutoff wear, or excessive cavity pressure.",
    action: "Clean the parting line safely and ask tooling or setup to inspect for damage or mismatch.",
  },
  "ejector-pins": {
    check: "Ejector pin locations, ejection timing, mold release, cooling, and whether the part is hanging up.",
    avoid: "Do not increase ejection force first if the part may be undercooled or mechanically stuck.",
    why: "Marks around pins can come from pushing a hot, tight, or poorly released part out of the mold.",
    action: "Check for balanced ejection, adequate cooling, and obvious undercuts before making process changes.",
  },
  "thick-section": {
    check: "Wall thickness, ribs, bosses, cooling time, cushion, hold pressure, and hold time.",
    avoid: "Do not raise melt temperature first; more heat can make thick-section shrinkage worse.",
    why: "Thick areas cool slower and shrink more, so the surface can pull inward or trap a bubble inside.",
    action: "Verify cushion and hold time, then make small documented packing or cooling adjustments if approved.",
  },
  random: {
    check: "Material handling, moisture, contamination, color mix, regrind, and whether defects move shot to shot.",
    avoid: "Do not chase random defects with large pressure or speed changes first.",
    why: "Random defects often start outside the cavity, such as wet material, contamination, or unstable feeding.",
    action: "Inspect material, hopper, dryer, and purge quality before changing the molding process window.",
  },
};

const defectGuidance: Record<ObservationKey, { check: string[]; avoid: string[]; why: string; actions: string[] }> = {
  flash: {
    check: ["Confirm the flash is truly extra material on an edge, shutoff, vent, or parting line.", "Check clamp tonnage, mold damage, vent depth, and whether pack pressure is higher than the approved setup."],
    avoid: ["Do not immediately lower melt temperature; it can hide the symptom while making fill less stable.", "Do not keep adding clamp force without checking mold condition and process pressure."],
    why: "Flash happens when plastic escapes where the mold should be closed or sealed.",
    actions: ["Save a sample and mark the exact flash location.", "Clean and inspect the parting line if your role allows it.", "Compare current pressures to the approved process sheet."],
  },
  "short-shot": {
    check: ["Confirm the part is missing material rather than broken after molding.", "Check shot size, cushion, transfer position, vents, material feed, and end-of-fill pressure."],
    avoid: ["Do not raise pack pressure first if the cavity is not filling before transfer.", "Do not ignore a blocked feed throat, bridge, or empty hopper."],
    why: "A short shot means the cavity did not receive enough usable molten plastic before the flow stopped.",
    actions: ["Verify the hopper has material and the screw is recovering consistently.", "Ask for a short-shot review to see the true fill pattern.", "Make only small, approved fill adjustments after basic checks."],
  },
  "silver-streaks": {
    check: ["Check resin drying, moisture level, contamination, melt temperature, and shear near the gate.", "Look for streaks that follow flow direction from the gate."],
    avoid: ["Do not raise melt temperature first; wet material and shear can look worse with more heat.", "Do not assume every silver line is cosmetic only."],
    why: "Silver streaks often come from moisture, trapped gas, contamination, or overheated material smearing through the flow.",
    actions: ["Confirm dryer settings and drying time.", "Check for mixed material or excessive regrind.", "Purge safely if contamination is suspected."],
  },
  "burn-marks": {
    check: ["Check vents, end-of-fill areas, trapped gas, injection speed, and melt temperature.", "Look for dark marks where air may be compressed."],
    avoid: ["Do not increase injection speed first; faster fill can trap and heat gas more.", "Do not keep running severe burns without escalation."],
    why: "Burn marks usually happen when trapped air or gas gets compressed and overheats the plastic surface.",
    actions: ["Show the sample to a technician or supervisor.", "Check whether vents need cleaning.", "Document if the burn appears at the same location every shot."],
  },
  voids: {
    check: ["Check thick sections, cooling, hold pressure, hold time, cushion, and material dryness.", "Cut open a safe sample only if your plant procedure allows it."],
    avoid: ["Do not raise melt temperature first; more heat can increase shrinkage and trapped bubbles.", "Do not confuse a surface blister with an internal void without checking location and pattern."],
    why: "Voids form when the inside of a thick area shrinks away or when gas is trapped during molding.",
    actions: ["Inspect thick bosses and ribs first.", "Verify hold time reaches gate seal when required.", "Confirm the dryer and material handling are stable."],
  },
  sink: {
    check: ["Check ribs, bosses, thick walls, cooling time, hold pressure, hold time, cushion, and gate seal.", "Look for a shallow depression directly over a heavy feature."],
    avoid: ["Do not raise melt temperature first; hotter plastic shrinks more.", "Do not overpack without checking flash, stress, and approved limits."],
    why: "Sink marks appear when a thick area keeps shrinking after the outer skin has started to freeze.",
    actions: ["Identify the heavy feature under the sink.", "Verify cushion and hold time before changing pressure.", "Escalate recurring sinks for design, tooling, or cooling review."],
  },
  warp: {
    check: ["Check cooling balance, mold temperature, ejection, packing balance, and whether the part is removed too hot.", "Place the part on a flat surface to confirm direction of bow or twist."],
    avoid: ["Do not change one mold temperature zone randomly without understanding the warp direction.", "Do not shorten cooling to gain cycle time when warp is active."],
    why: "Warp happens when different areas shrink by different amounts or the part is ejected before it is stable.",
    actions: ["Compare cavity-to-cavity shape if this is a multi-cavity mold.", "Check cooling water flow and temperatures.", "Let samples cool the same way before judging the change."],
  },
  color: {
    check: ["Check color concentrate feed, mixing, purge quality, contamination, regrind level, and material lot.", "Compare the part to the approved color standard under proper light."],
    avoid: ["Do not adjust molding pressure first for a color issue.", "Do not approve color from memory; use the standard."],
    why: "Color defects usually come from material mix, contamination, purge leftovers, heat history, or inconsistent color dosing.",
    actions: ["Verify the correct material and colorant are loaded.", "Purge using the approved procedure.", "Label suspect parts and separate them from good product."],
  },
  sticking: {
    check: ["Check ejector pins, mold release surfaces, draft, undercuts, cooling, and whether the part is too hot or overpacked.", "Look for drag marks in the direction the part leaves the mold."],
    avoid: ["Do not simply add mold release spray as the first permanent fix.", "Do not increase ejector force before checking why the part is stuck."],
    why: "Parts stick when shrinkage, heat, surface condition, undercuts, or packing make the part grip the mold too tightly.",
    actions: ["Stop and escalate if sticking risks mold damage.", "Check for obvious scuffs, drag lines, or broken features.", "Verify cooling time and ejection sequence against the setup."],
  },
};

function findDefectName(slug: string) {
  return defectGuides.find((defect) => defect.slug === slug)?.name ?? observationOptions.find((option) => option.defectSlug === slug)?.label ?? "Unknown defect";
}

function buildGuidedAnalysis(observation: ObservationKey, location: LocationKey, hasPhoto: boolean): GuidedAnalysisResult {
  const observationOption = observationOptions.find((option) => option.key === observation) ?? observationOptions[0];
  const defectRule = defectGuidance[observation];
  const locationRule = locationGuidance[location];

  return {
    likelyDefect: findDefectName(observationOption.defectSlug),
    defectSlug: observationOption.defectSlug,
    checkFirst: [locationRule.check, ...defectRule.check],
    doNotChangeFirst: [locationRule.avoid, ...defectRule.avoid],
    whyThisHappens: `${defectRule.why} ${locationRule.why}`,
    safeFirstActions: [locationRule.action, ...defectRule.actions],
    visionReadinessNote: hasPhoto
      ? "Photo captured for preview. The rule engine uses your selections today and can later pass the image, selected symptom, and selected location into an AI vision service."
      : "Upload a photo to capture image context now; the same review structure is ready for AI vision later.",
  };
}

export default function PhotoAnalysisPage() {
  const [observation, setObservation] = useState<ObservationKey>("flash");
  const [location, setLocation] = useState<LocationKey>("parting-line");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const result = useMemo(() => buildGuidedAnalysis(observation, location, Boolean(photoUrl)), [location, observation, photoUrl]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setPhotoUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return URL.createObjectURL(file);
    });
    setFileName(file.name);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link href="/" className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10">
            ← Back home
          </Link>
          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Defect Photo Analysis</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Guided photo review for bad molded parts</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Upload a photo, pick what you see, and choose where it appears. The result explains the likely defect in beginner-friendly language using rule-based logic today, with the data structure ready for real AI vision later.
          </p>
        </header>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-5">
            <section className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Step 1</p>
                  <h2 className="text-2xl font-black text-white">Photo preview</h2>
                </div>
                {fileName ? <p className="text-sm text-slate-300">Uploaded: {fileName}</p> : null}
              </div>

              <label className="mt-4 block rounded-3xl border border-dashed border-cyan-300/40 bg-slate-900/70 p-5 text-center transition hover:border-cyan-200 hover:bg-cyan-300/10">
                <span className="text-lg font-bold text-cyan-100">Upload molded part photo</span>
                <span className="mt-2 block text-sm leading-6 text-slate-300">Tip: fill the frame with the defect, keep it well lit, and include the gate or edge if possible.</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
              </label>

              {photoUrl ? (
                <figure className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="Uploaded molded part preview" className="max-h-[32rem] w-full object-contain" />
                  <figcaption className="border-t border-white/10 px-4 py-3 text-sm text-slate-300">Clear preview of the uploaded part photo.</figcaption>
                </figure>
              ) : (
                <div className="mt-4 rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center text-sm leading-6 text-slate-400">
                  No photo uploaded yet. You can still try the guided questions, but the preview will appear here after upload.
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Step 2</p>
              <h2 className="text-2xl font-black text-white">What do you see?</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {observationOptions.map((option) => (
                  <label key={option.key} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 transition has-[:checked]:border-cyan-300/70 has-[:checked]:bg-cyan-300/10">
                    <span className="flex items-start gap-3">
                      <input type="radio" name="observation" value={option.key} checked={observation === option.key} onChange={() => setObservation(option.key)} className="mt-1" />
                      <span>
                        <span className="block font-bold text-white">{option.label}</span>
                        <span className="mt-1 block text-sm leading-5 text-slate-400">{option.beginnerHint}</span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Step 3</p>
              <h2 className="text-2xl font-black text-white">Where is it?</h2>
              <div className="mt-4 grid gap-3">
                {locationOptions.map((option) => (
                  <label key={option.key} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 transition has-[:checked]:border-cyan-300/70 has-[:checked]:bg-cyan-300/10">
                    <span className="flex items-start gap-3">
                      <input type="radio" name="location" value={option.key} checked={location === option.key} onChange={() => setLocation(option.key)} className="mt-1" />
                      <span>
                        <span className="block font-bold text-white">{option.label}</span>
                        <span className="mt-1 block text-sm leading-5 text-slate-400">{option.beginnerHint}</span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="mt-5 rounded-[2rem] border border-cyan-300/20 bg-slate-900/85 p-4 shadow-xl shadow-cyan-950/20 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Step 4 · Result card</p>
              <h2 className="mt-2 text-3xl font-black text-white">Likely defect: {result.likelyDefect}</h2>
            </div>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100">Rule-based review</span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <h3 className="text-xl font-bold text-white">What to check first</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.checkFirst.map((item) => <li key={item}>• {item}</li>)}</ul>
            </section>
            <section className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5">
              <h3 className="text-xl font-bold text-amber-100">What not to change first</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-50/90">{result.doNotChangeFirst.map((item) => <li key={item}>• {item}</li>)}</ul>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <h3 className="text-xl font-bold text-white">Why this happens</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{result.whyThisHappens}</p>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <h3 className="text-xl font-bold text-white">Safe first actions</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.safeFirstActions.map((item) => <li key={item}>• {item}</li>)}</ul>
            </section>
          </div>

          <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
            <h3 className="text-xl font-bold text-cyan-50">Ready for AI vision later</h3>
            <p className="mt-2 text-sm leading-6 text-cyan-50/90">{result.visionReadinessNote}</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link href="/troubleshooting" className="rounded-2xl border border-cyan-300/30 px-4 py-3 text-center font-bold text-cyan-100 transition hover:bg-cyan-300/10">Troubleshooting Wizard →</Link>
            <Link href={`/defects#${result.defectSlug}`} className="rounded-2xl border border-cyan-300/30 px-4 py-3 text-center font-bold text-cyan-100 transition hover:bg-cyan-300/10">Defect Library →</Link>
            <Link href="/coach" className="rounded-2xl border border-cyan-300/30 px-4 py-3 text-center font-bold text-cyan-100 transition hover:bg-cyan-300/10">AI Coach →</Link>
          </div>
        </section>

        <FeedbackPrompt page="Photo Analysis" />
      </div>
    </main>
  );
}
