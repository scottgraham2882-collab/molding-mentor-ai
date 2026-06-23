"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ChangeKey = "material" | "color" | "mold" | "machine" | "settings" | "shift" | "maintenance";
type StartSpeed = "suddenly" | "slowly" | "not-sure";

type ChangeQuestion = {
  key: ChangeKey;
  question: string;
  shopWords: string;
  area: string;
  checkFirst: string[];
  doNotChangeFirst: string;
  relatedTool: { label: string; href: string };
};

const changeQuestions: ChangeQuestion[] = [
  {
    key: "material",
    question: "Did material change?",
    shopWords: "New resin lot, different supplier, more regrind, dryer change, or resin sat too long.",
    area: "Material handling",
    checkFirst: ["Verify resin name, grade, supplier lot, and regrind percent.", "Check dryer temperature, drying time, dew point, and hopper level.", "Look for wet material signs like splay, bubbles, silver streaks, or brittle parts."],
    doNotChangeFirst: "Do not start by raising barrel heats or adding pack until the resin and dryer are proven good.",
    relatedTool: { label: "Material Troubleshooter", href: "/materials/troubleshooter" },
  },
  {
    key: "color",
    question: "Did color change?",
    shopWords: "New colorant, purge, masterbatch letdown, color feeder, or leftover old color.",
    area: "Color and contamination",
    checkFirst: ["Confirm colorant type, letdown ratio, feeder setting, and purge method.", "Check for unmixed color, black specks, streaks, or material left in the barrel.", "Compare first-good time and scrap to the normal color-change record."],
    doNotChangeFirst: "Do not chase cosmetic defects with random speed or heat changes before checking purge, color feed, and contamination.",
    relatedTool: { label: "Color Change Log", href: "/materials/color-change" },
  },
  {
    key: "mold",
    question: "Did mold change?",
    shopWords: "Different tool, cavity blocked, insert swapped, hot runner touched, vents cleaned, or water lines moved.",
    area: "Mold condition",
    checkFirst: ["Confirm mold number, cavity status, inserts, slides, lifters, and hot-runner zones.", "Check vents, parting line, gate area, water hookup, and actual water flow.", "Compare the defect by cavity so you know if it is one cavity or the whole mold."],
    doNotChangeFirst: "Do not cover up a mold issue with extra clamp, pack, or heat before checking vents, gates, water, and cavity details.",
    relatedTool: { label: "Mold History", href: "/molds" },
  },
  {
    key: "machine",
    question: "Did machine change?",
    shopWords: "Moved to another press, barrel/nozzle issue, clamp issue, hydraulic/electric behavior, or auxiliary equipment changed.",
    area: "Machine and auxiliaries",
    checkFirst: ["Compare actual fill time, cushion, recovery, peak pressure, and cycle to the last good run.", "Check nozzle tip, screw recovery, alarms, hydraulics, robot, dryer, loader, and temperature control units.", "Ask if this mold has run good on this machine before."],
    doNotChangeFirst: "Do not keep adjusting the process if the machine cannot repeat fill time, cushion, recovery, or temperature.",
    relatedTool: { label: "Machine History", href: "/machines" },
  },
  {
    key: "settings",
    question: "Did process settings change?",
    shopWords: "Setup sheet edit, transfer, cushion, pack, hold, cooling, fill speed, heats, back pressure, or water temp changed.",
    area: "Process settings",
    checkFirst: ["Compare every current setting and actual reading to the approved process sheet.", "Look for one changed number around the time the defect started.", "Record part weight, fill time, cushion, transfer pressure, peak pressure, and cycle time before adjusting."],
    doNotChangeFirst: "Do not change several knobs at once. Put the process back to the approved baseline if it was changed without approval.",
    relatedTool: { label: "Process Change Log", href: "/process-change-log" },
  },
  {
    key: "shift",
    question: "Did operator/shift change?",
    shopWords: "New operator, break coverage, different inspector, trim method, packing method, or shift handoff missed something.",
    area: "People and method",
    checkFirst: ["Watch the handling, trimming, inspection, packing, and restart method at the machine.", "Ask what the previous shift saw and whether parts were being sorted or held.", "Check if the defect is actually damage after molding, not a molding defect."],
    doNotChangeFirst: "Do not adjust the press until you know the defect is not coming from handling, trimming, inspection, or packaging.",
    relatedTool: { label: "Shift Handoff", href: "/shift-handoff" },
  },
  {
    key: "maintenance",
    question: "Did maintenance happen?",
    shopWords: "Mold PM, machine repair, water work, heater band, thermocouple, screw/nozzle, robot, or dryer maintenance.",
    area: "Recent maintenance",
    checkFirst: ["Find exactly what was worked on, who did it, and when parts went bad.", "Inspect anything touched: water lines, heater bands, thermocouples, nozzles, vents, sensors, and robot/end-of-arm tooling.", "Run the machine long enough to confirm it repeats after maintenance."],
    doNotChangeFirst: "Do not assume the old process is wrong until the repaired area is inspected and verified.",
    relatedTool: { label: "Maintenance Tracker", href: "/maintenance" },
  },
];

const startOptions: { value: StartSpeed; label: string; helper: string }[] = [
  { value: "suddenly", label: "Suddenly", helper: "Good parts, then bad parts fast. Look hard at the last change." },
  { value: "slowly", label: "Slowly", helper: "The issue drifted in. Look for wear, heat soak, moisture, buildup, or cooling changes." },
  { value: "not-sure", label: "Not sure", helper: "Start by building a timeline from last good part to first bad part." },
];

const relatedLinks = [
  { label: "Ask AI Coach", href: "/coach", helper: "Describe the defect and what changed." },
  { label: "Defect Library", href: "/defects", helper: "Compare common defect causes." },
  { label: "Lessons Learned", href: "/knowledge-base", helper: "Search saved fixes and shop notes." },
];

export default function WhatChangedRootCausePage() {
  const [answers, setAnswers] = useState<Record<ChangeKey, boolean>>({ material: false, color: false, mold: false, machine: false, settings: false, shift: false, maintenance: false });
  const [startSpeed, setStartSpeed] = useState<StartSpeed>("suddenly");

  const selectedChanges = useMemo(() => changeQuestions.filter((item) => answers[item.key]), [answers]);
  const likelyAreas = selectedChanges.length > 0 ? selectedChanges : changeQuestions.slice(0, 3);
  const selectedStart = startOptions.find((option) => option.value === startSpeed) ?? startOptions[0];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link href="/" className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10">← Back home</Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Root Cause Helper</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">What changed before the defect started?</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Most molding problems have a trigger. Use this simple shop-floor checklist to find the last thing that changed before you start turning knobs.</p>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Ask first</p>
            <h2 className="mt-2 text-2xl font-black text-white">Check the boxes that changed</h2>
            <div className="mt-5 grid gap-3">
              {changeQuestions.map((item) => (
                <label key={item.key} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 has-[:checked]:border-cyan-300/70 has-[:checked]:bg-cyan-300/10">
                  <input type="checkbox" checked={answers[item.key]} onChange={(event) => setAnswers((current) => ({ ...current, [item.key]: event.target.checked }))} className="mt-1 h-5 w-5 shrink-0 accent-cyan-300" />
                  <span><span className="block text-base font-black text-white">{item.question}</span><span className="mt-1 block text-sm leading-6 text-slate-300">{item.shopWords}</span></span>
                </label>
              ))}
            </div>

            <fieldset className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
              <legend className="px-1 text-lg font-black text-white">Did the problem start suddenly or slowly?</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {startOptions.map((option) => (
                  <label key={option.value} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 has-[:checked]:border-amber-300/70 has-[:checked]:bg-amber-300/10">
                    <input type="radio" name="startSpeed" value={option.value} checked={startSpeed === option.value} onChange={() => setStartSpeed(option.value)} className="sr-only" />
                    <span className="block text-sm font-black text-white">{option.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-300">{option.helper}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-slate-950/20 sm:p-6 lg:sticky lg:top-6 lg:self-start">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">What to do next</p>
            <h2 className="mt-2 text-2xl font-black text-white">Likely areas to investigate</h2>
            <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm leading-6 text-emerald-50">Start pattern: <strong>{selectedStart.label}</strong>. {selectedStart.helper}</p>
            <div className="mt-4 space-y-4">
              {likelyAreas.map((item) => (
                <section key={item.key} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <h3 className="text-lg font-black text-white">{item.area}</h3>
                  <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">What to check first</p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">{item.checkFirst.map((check) => <li key={check}>• {check}</li>)}</ul>
                  <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-amber-300">What not to change first</p>
                  <p className="mt-2 text-sm leading-6 text-amber-50/90">{item.doNotChangeFirst}</p>
                  <Link href={item.relatedTool.href} className="mt-4 inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10">Open {item.relatedTool.label} →</Link>
                </section>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Suggested related tools</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {relatedLinks.map((link) => <Link key={link.href} href={link.href} className="rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:-translate-y-1 hover:border-cyan-300/50"><span className="block text-lg font-black text-white">{link.label}</span><span className="mt-2 block text-sm leading-6 text-slate-300">{link.helper}</span></Link>)}
          </div>
        </section>
      </div>
    </main>
  );
}
