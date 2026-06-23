"use client";

import Link from "next/link";
import { useState } from "react";

import { defectGuides } from "../../lib/defect-data";

type Scenario = {
  title: string;
  defectSlug: string;
  situation: string;
  whatChanged: string;
  clues: string[];
  checkFirst: string;
  wrongAnswers: string[];
  path: string[];
  whyWorked: string;
  lesson: string;
};

const scenarios: Scenario[] = [
  {
    title: "Flash appeared after startup",
    defectSlug: "flash",
    situation: "The press was approved on first piece, then thin flash started showing on the parting line within the first hour of production.",
    whatChanged: "The mold was just started, clamps were reset, and the tool warmed up from room temperature.",
    clues: ["Flash is on the same shutoff area every shot.", "Cushion and fill time look close to the setup sheet.", "The mold face still has startup grease and small flakes of plastic near the vent land."],
    checkFirst: "Stop and inspect the flashing location on the steel before raising or lowering pack pressure.",
    wrongAnswers: ["Add more clamp tonnage without checking the shutoff.", "Lower all barrel temperatures because the plastic looks too runny.", "Keep trimming flash and wait for the run to settle in."],
    path: ["Save a flashed sample and mark cavity, time, and exact flash location.", "Compare current clamp, transfer, pack pressure, and peak pressure to the approved process sheet.", "Open the mold and clean the parting line, vents, inserts, and shutoff area where flash starts.", "Run fill-only or reduced-pack samples if needed to prove whether flash starts during fill or pack.", "Make one measured pack/transfer adjustment only after tooling and setup checks are complete."],
    whyWorked: "The flash path was created by a dirty or slightly open shutoff. Cleaning and verifying the startup setup removed the leak instead of masking it with random process changes.",
    lesson: "Flash is escaped plastic. Find the escape path first, then decide whether the process is making too much cavity pressure.",
  },
  {
    title: "Short shot after material change",
    defectSlug: "short-shot",
    situation: "Parts were full on the previous resin lot. After the hopper was changed, one rib and the end of fill stopped filling completely.",
    whatChanged: "A new material lot and Gaylord were loaded, and the dryer hopper level dropped during the changeover.",
    clues: ["The defect started right after the material change.", "Peak pressure is higher and the press is close to pressure limit.", "The short area is at the longest flow length, not near the gate."],
    checkFirst: "Verify the material, dryer, feed, cushion, pressure limit, and shot size before changing pack pressure.",
    wrongAnswers: ["Add hold pressure to fill an area that never fills.", "Raise every heat zone at once.", "Blame the operator before checking the lot and feed system."],
    path: ["Confirm the correct resin grade, lot, regrind percentage, and dryer conditions.", "Check hopper feed, throat temperature, cushion, transfer position, fill time, and peak pressure.", "Inspect nozzle, sprue, runner, gates, and vents for restriction from purge or cold material.", "If pressure limited, restore pressure capability or adjust fill speed/temperature within the approved window.", "Document the material lot and compare part weight after the correction."],
    whyWorked: "The new lot or feed condition changed the flow resistance. Restoring material control and fill capability let the cavity fill before the melt froze off.",
    lesson: "A short shot is a fill problem first. Do not try to pack plastic into a cavity that is not full.",
  },
  {
    title: "Splay after color change",
    defectSlug: "splay",
    situation: "Silver streaks appeared on cosmetic faces after switching from natural resin to a dark color concentrate.",
    whatChanged: "Color concentrate, purge material, and material handling paths changed during the color change.",
    clues: ["Streaks follow flow from the gate.", "The dryer was left running, but the color concentrate sat open near the press.", "More suck-back was added during purge to stop drool."],
    checkFirst: "Check dryer performance, color concentrate condition, contamination, screw recovery, and decompression settings.",
    wrongAnswers: ["Turn up barrel heat to dry the resin in the screw.", "Add more suck-back because the streaks look like air.", "Ignore the purge because the color eventually looks correct."],
    path: ["Verify dryer temperature, dew point, airflow, drying time, and hopper lid condition.", "Confirm colorant is dry, compatible, and mixed at the correct letdown ratio.", "Purge until old material and incompatible purge are removed.", "Return screw speed, back pressure, and decompression toward the approved settings.", "Run fresh dry material and compare streak location and frequency."],
    whyWorked: "The streaks came from moisture, trapped air, or contamination introduced during the color change. Cleaning the material stream and reducing air pull removed the source.",
    lesson: "Splay usually rides in with the melt. Check material handling before chasing cosmetic streaks with heat.",
  },
  {
    title: "Warpage after cycle time reduction",
    defectSlug: "warpage",
    situation: "A flat cover passed inspection all morning. After cycle time was reduced to gain output, parts started bowing after they cooled on the table.",
    whatChanged: "Cooling time was shortened and parts were ejected hotter.",
    clues: ["Dimensions look different 30 minutes after molding than they do at the press.", "Parts are stacked while still warm.", "Water temperatures were not rechecked after the faster cycle."],
    checkFirst: "Check actual part temperature, cooling water flow, mold temperature, and how parts are handled after ejection.",
    wrongAnswers: ["Add pack pressure until the part looks flatter at the press.", "Judge warp immediately while parts are still hot.", "Change only one water temperature without checking flow."],
    path: ["Measure parts at the same time after molding, such as at 30 minutes.", "Compare current cooling time, mold temperature, and water flow to the approved process.", "Check whether parts are being stacked, bent, or constrained while hot.", "Restore enough cooling or improve water flow so the part ejects at a stable temperature.", "Then tune pack/hold only if shrink balance still needs work."],
    whyWorked: "The shorter cycle left uneven heat and stress in the part. Restoring cooling control reduced uneven shrinkage after ejection.",
    lesson: "Warp is a shrinkage balance problem. Hot parts can look good at the press and move later.",
  },
  {
    title: "Burn marks at end of fill",
    defectSlug: "burn-marks",
    situation: "Black marks appeared at the last area to fill on two cavities during a high-speed run.",
    whatChanged: "Fill speed was increased to improve appearance on another area of the part.",
    clues: ["Burns are at end of fill, not randomly through the shot.", "The same cavities repeat the problem.", "Vent lands have not been cleaned since the last long run."],
    checkFirst: "Map the burn to end-of-fill vents and check vent condition before only lowering barrel temperatures.",
    wrongAnswers: ["Lower all barrel zones and keep blocked vents in service.", "Slow the entire cycle without finding trapped gas.", "Assume black marks always mean contaminated resin."],
    path: ["Mark the burn location and match it to cavity number and end-of-fill position.", "Inspect and clean vents, parting line, inserts, and trapped-gas areas.", "Review fill speed profile, peak pressure, and whether the faster fill is compressing air.", "Reduce the high-speed section or add venting support if gas cannot escape.", "Purge and check residence time if burns remain away from end-of-fill."],
    whyWorked: "The faster fill trapped and compressed air at the end of fill. Cleaning vents and controlling speed gave the gas a way out before it scorched the plastic.",
    lesson: "End-of-fill burns are often venting clues. Let the air out before blaming the resin.",
  },
  {
    title: "Voids in thick section",
    defectSlug: "voids",
    situation: "Clear parts show bubbles inside a thick boss even though the outside surface looks acceptable.",
    whatChanged: "The job moved from a small gate mold to a part with a thick boss and longer hold-pressure demand.",
    clues: ["Voids are inside the heavy section, not on thin walls.", "Part weight stops increasing before the hold timer ends.", "Moisture checks were not recorded for the current material."],
    checkFirst: "Cut or weigh parts and verify gate seal, cushion, pack pressure, hold time, and drying records.",
    wrongAnswers: ["Add cooling time only and hope the bubble disappears.", "Assume every void is trapped air from the mold.", "Raise pack pressure without knowing whether the gate is already frozen."],
    path: ["Section the part or use weight trends to confirm where the void forms.", "Run a gate seal study or compare part weight by hold time.", "Confirm cushion remains stable and pack pressure reaches the part before gate freeze.", "Verify drying time, temperature, dew point, and moisture risk for the resin.", "Increase effective hold only while the gate is open, or escalate thick-section design/cooling issues."],
    whyWorked: "The thick section kept shrinking after the outside froze. Effective packing before gate seal replaced lost volume, while drying checks ruled out gas bubbles.",
    lesson: "Voids need proof. Cut the part, check weight, and separate shrink voids from gas voids.",
  },
];

function defectName(slug: string) {
  return defectGuides.find((defect) => defect.slug === slug)?.name ?? "Defect";
}

export default function ScenariosPage() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [explained, setExplained] = useState<Record<string, boolean>>({});

  const toggle = (title: string, setter: typeof setRevealed) => {
    setter((current) => ({ ...current, [title]: !current[title] }));
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link href="/" className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10">
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Real Shop-Floor Scenarios</p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_20rem] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Practice troubleshooting like you are standing at the press</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Read the situation, look for what changed, choose your first check, then reveal the practical troubleshooting path. Each card uses beginner-friendly shop-floor language.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-bold leading-6 text-amber-100">
              Rule of thumb: do not make several process changes at once. Find the clue, make one safe check, and document the result.
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {scenarios.map((scenario) => {
            const answerOpen = Boolean(revealed[scenario.title]);
            const explanationOpen = Boolean(explained[scenario.title]);
            const defect = defectName(scenario.defectSlug);

            return (
              <article key={scenario.title} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">{defect} practice</p>
                    <h2 className="mt-2 text-2xl font-black text-white">{scenario.title}</h2>
                  </div>
                  <span className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">Beginner friendly</span>
                </div>

                <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                  <InfoBlock title="1. Situation" body={scenario.situation} />
                  <InfoBlock title="2. What changed?" body={scenario.whatChanged} />
                  <ListBlock title="3. What clues are available?" items={scenario.clues} accent="bg-cyan-300" />
                  <InfoBlock title="4. What would you check first?" body={scenario.checkFirst} strong />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => toggle(scenario.title, setRevealed)} className="rounded-2xl border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-300/20">
                    {answerOpen ? "Hide answer" : "Reveal answer"}
                  </button>
                  <button type="button" onClick={() => toggle(scenario.title, setExplained)} className="rounded-2xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm font-black text-amber-100 transition hover:border-amber-200 hover:bg-amber-300/20">
                    {explanationOpen ? "Hide explanation" : "View explanation"}
                  </button>
                </div>

                {answerOpen && (
                  <section className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                    <ListBlock title="5. Common wrong answers" items={scenario.wrongAnswers} accent="bg-rose-300" />
                    <div className="mt-4">
                      <ListBlock title="6. Correct troubleshooting path" items={scenario.path} accent="bg-emerald-300" ordered />
                    </div>
                  </section>
                )}

                {explanationOpen && (
                  <section className="mt-5 space-y-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
                    <InfoBlock title="7. Why the solution worked" body={scenario.whyWorked} />
                    <InfoBlock title="8. Key lesson learned" body={scenario.lesson} strong />
                  </section>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Link href={`/defects?search=${encodeURIComponent(defect)}`} className="rounded-2xl border border-cyan-300/30 px-4 py-3 text-center text-sm font-black text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10">
                    Open Defect Library
                  </Link>
                  <Link href={`/coach?topic=${encodeURIComponent(scenario.title)}`} className="rounded-2xl border border-violet-300/30 px-4 py-3 text-center text-sm font-black text-violet-100 transition hover:border-violet-200 hover:bg-violet-300/10">
                    Open AI Coach
                  </Link>
                  <Link href={`/troubleshooting?defect=${scenario.defectSlug}`} className="rounded-2xl border border-emerald-300/30 px-4 py-3 text-center text-sm font-black text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-300/10">
                    Open Wizard
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

function InfoBlock({ title, body, strong = false }: { title: string; body: string; strong?: boolean }) {
  return (
    <section>
      <h3 className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{title}</h3>
      <p className={`mt-2 ${strong ? "font-bold text-white" : "text-slate-300"}`}>{body}</p>
    </section>
  );
}

function ListBlock({ title, items, accent, ordered = false }: { title: string; items: string[]; accent: string; ordered?: boolean }) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <section>
      <h3 className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{title}</h3>
      <ListTag className="mt-2 space-y-2 text-sm leading-6 text-slate-300">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3">
            <span className={`mt-2 flex h-2 w-2 shrink-0 items-center justify-center rounded-full ${accent}`}>
              {ordered && <span className="sr-only">{index + 1}</span>}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ListTag>
    </section>
  );
}
