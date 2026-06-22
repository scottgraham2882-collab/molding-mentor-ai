"use client";

import { useEffect, useMemo, useState } from "react";

type ChecklistItem = {
  id: string;
  text: string;
};

type ChecklistSection = {
  title: string;
  description: string;
  items: ChecklistItem[];
};

const storageKey = "molding-mentor-mold-change-checklist";

const checklistSections: ChecklistSection[] = [
  {
    title: "Pre-change safety",
    description: "Confirm the team, machine, and work area are ready before the mold move begins.",
    items: [
      { id: "safety-team-brief", text: "Review change plan, assigned roles, lift path, and communication signals." },
      { id: "safety-ppe", text: "Verify required PPE is worn and the work area is clear of slip or trip hazards." },
      { id: "safety-tooling", text: "Inspect crane, straps, eyebolts, bars, and hand tools before use." },
    ],
  },
  {
    title: "Lockout/tagout awareness",
    description: "Use this as an awareness prompt and follow your site-specific authorized LOTO procedure.",
    items: [
      { id: "loto-procedure", text: "Identify all energy sources and confirm the correct written LOTO procedure is available." },
      { id: "loto-authorized", text: "Authorized employees apply locks, tags, and verification steps per plant policy." },
      { id: "loto-zero-energy", text: "Verify zero-energy state before hands enter the mold area or guards are bypassed." },
    ],
  },
  {
    title: "Mold removal",
    description: "Remove the outgoing mold with controlled, documented steps.",
    items: [
      { id: "removal-last-shot", text: "Capture last-shot status, part count, quality holds, and open process concerns." },
      { id: "removal-disconnect", text: "Drain and disconnect water, hydraulics, air, hot runner, sensors, and auxiliary lines." },
      { id: "removal-lift", text: "Attach approved lifting hardware and remove clamp hardware before controlled extraction." },
      { id: "removal-storage", text: "Protect mold faces, label connections, and move the mold to its assigned storage or service area." },
    ],
  },
  {
    title: "Mold installation",
    description: "Set the incoming mold square, secure, and ready for connection.",
    items: [
      { id: "install-inspect", text: "Inspect mold condition, locating ring, sprue bushing, leader pins, and mounting surfaces." },
      { id: "install-align", text: "Align the mold to platen, nozzle, clamp stroke, ejector pattern, and tie-bar clearance." },
      { id: "install-clamp", text: "Install and torque clamps or bolts according to shop standards before releasing the lift." },
      { id: "install-protection", text: "Set mold protection, low-pressure close, daylight, and ejector limits conservatively." },
    ],
  },
  {
    title: "Water line setup",
    description: "Restore cooling safely and verify flow before startup.",
    items: [
      { id: "water-map", text: "Connect supply and return lines to the approved water diagram or labeled routing." },
      { id: "water-flow", text: "Open valves gradually and confirm flow, temperature direction, and no restricted circuits." },
      { id: "water-leaks", text: "Check manifolds, fittings, hoses, and mold parting line area for leaks." },
    ],
  },
  {
    title: "Hydraulic/air connections",
    description: "Connect action circuits with labels, pressure limits, and leak checks.",
    items: [
      { id: "hydraulic-labels", text: "Match core, valve gate, air blow, and cylinder lines to labels or the setup sheet." },
      { id: "hydraulic-pressure", text: "Verify pressure regulators and sequence settings before enabling movement." },
      { id: "hydraulic-dry-cycle", text: "Dry-cycle actions at low speed and confirm full travel, sensors, and leak-free fittings." },
    ],
  },
  {
    title: "Material setup",
    description: "Prepare resin, dryer, barrel, and purge conditions for the incoming job.",
    items: [
      { id: "material-verify", text: "Confirm resin, color, regrind allowance, lot number, and material handling instructions." },
      { id: "material-drying", text: "Verify dryer temperature, dew point or airflow, and required drying time are in range." },
      { id: "material-purge", text: "Purge previous material and bring barrel/nozzle temperatures to the approved setup." },
    ],
  },
  {
    title: "Robot/conveyor setup",
    description: "Validate automation before producing parts at rate.",
    items: [
      { id: "automation-program", text: "Load the correct robot, sprue picker, conveyor, or containment program." },
      { id: "automation-clearance", text: "Check end-of-arm tooling, guarding, mold clearance, drop zones, and conveyor direction." },
      { id: "automation-interlocks", text: "Test permissives, interlocks, reject separation, and safe recovery positions." },
    ],
  },
  {
    title: "First shot verification",
    description: "Use early shots to confirm the process is stable before releasing production.",
    items: [
      { id: "firstshot-settings", text: "Load approved process sheet and confirm temps, speeds, pressures, cushion, and cycle settings." },
      { id: "firstshot-inspect", text: "Inspect first shots for short shots, flash, burns, splay, dimensions, and obvious cosmetic defects." },
      { id: "firstshot-document", text: "Record startup shots, adjustments, and any holds or deviations from standard settings." },
    ],
  },
  {
    title: "First article approval",
    description: "Document approval before normal production release.",
    items: [
      { id: "article-sample", text: "Submit labeled samples with cavity identification, material lot, date, press, and operator." },
      { id: "article-quality", text: "Quality or authorized approver verifies critical dimensions, appearance, and customer requirements." },
      { id: "article-release", text: "Confirm first article signoff, containment status, and production release instructions are documented." },
    ],
  },
];

const allItemIds = checklistSections.flatMap((section) => section.items.map((item) => item.id));

export default function MoldChangePage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedChecklist = window.localStorage.getItem(storageKey);
    if (storedChecklist) {
      setCheckedItems(JSON.parse(storedChecklist) as Record<string, boolean>);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(checkedItems));
    }
  }, [checkedItems, isLoaded]);

  const completedCount = useMemo(
    () => allItemIds.filter((itemId) => checkedItems[itemId]).length,
    [checkedItems],
  );
  const progressPercentage = Math.round((completedCount / allItemIds.length) * 100);

  function toggleItem(itemId: string) {
    setCheckedItems((current) => ({ ...current, [itemId]: !current[itemId] }));
  }

  function resetChecklist() {
    setCheckedItems({});
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-5xl space-y-6 print:max-w-none print:space-y-4">
        <header className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-0 print:bg-white print:p-0 print:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_32%)] print:hidden" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Setup discipline</p>
            <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Mold Change Checklist</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                  Follow a mobile-first mold-change workflow from pre-change safety through first article approval. Progress is saved in this browser.
                </p>
              </div>
              <button type="button" onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 print:hidden">
                Print checklist
              </button>
            </div>
          </div>
        </header>

        <section className="sticky top-3 z-10 rounded-[1.75rem] border border-emerald-300/20 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/40 backdrop-blur print:static print:border print:border-slate-300 print:bg-white print:shadow-none" aria-label="Checklist progress">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-4xl font-black text-white print:text-slate-950">{progressPercentage}%</p>
              <h2 className="mt-1 text-sm font-black uppercase tracking-[0.2em] text-emerald-100 print:text-slate-700">Checklist complete</h2>
              <p className="mt-2 text-sm text-slate-300 print:text-slate-700">{completedCount} of {allItemIds.length} steps checked</p>
            </div>
            <button type="button" onClick={resetChecklist} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-cyan-100 transition hover:border-cyan-300/40 hover:bg-white/10 print:hidden">
              Reset checklist
            </button>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-950 print:border print:border-slate-300 print:bg-white">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all" style={{ width: `${progressPercentage}%` }} />
          </div>
        </section>

        <section className="space-y-4" aria-label="Mold change checklist sections">
          {checklistSections.map((section, sectionIndex) => (
            <article key={section.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:break-inside-avoid print:border-slate-300 print:bg-white print:shadow-none">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-sm font-black text-slate-950 print:border print:border-slate-400 print:bg-white print:text-slate-950">{sectionIndex + 1}</span>
                <div>
                  <h2 className="text-xl font-black text-white print:text-slate-950">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300 print:text-slate-700">{section.description}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <label key={item.id} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-cyan-300/40 print:border-slate-300 print:bg-white">
                    <input type="checkbox" checked={Boolean(checkedItems[item.id])} onChange={() => toggleItem(item.id)} className="mt-1 h-5 w-5 rounded border-slate-500 bg-slate-900 text-cyan-300 focus:ring-cyan-300 print:accent-slate-950" />
                    <span className="text-sm font-semibold leading-6 text-slate-100 print:text-slate-900">{item.text}</span>
                  </label>
                ))}
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
