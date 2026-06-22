"use client";

import { useState } from "react";
import Link from "next/link";

type Defect = {
  name: string;
  summary: string;
  materialCauses: string[];
  processChecks: string[];
  handlingChecks: string[];
  correctiveActions: string[];
};

const defects: Defect[] = [
  {
    name: "Splay",
    summary: "Surface streaking or splash marks often tied to moisture, volatiles, shear, or trapped air.",
    materialCauses: [
      "Moisture above the resin supplier limit, especially in hygroscopic resins.",
      "Contaminated regrind, dusty pellets, or mixed resin families.",
      "Additives, color concentrate, or purging compound not compatible with the base resin.",
    ],
    processChecks: [
      "Confirm melt temperature is not high enough to degrade the resin or volatize additives.",
      "Check screw speed, back pressure, and injection speed for excessive shear.",
      "Inspect decompression, cushion stability, and venting for air entrainment.",
    ],
    handlingChecks: [
      "Verify dryer temperature, dew point, airflow, and residence time records.",
      "Check hopper covers, gaylords, and vacuum lines for moisture exposure.",
      "Review recent lot, regrind percentage, color, or supplier changes.",
    ],
    correctiveActions: [
      "Dry resin to the supplier technical data sheet and document dryer performance.",
      "Reduce shear by adjusting screw speed, back pressure, melt temperature, or fill speed.",
      "Purge contaminated material and isolate suspect regrind or color concentrate.",
    ],
  },
  {
    name: "Bubbles",
    summary: "Internal or surface bubbles can come from moisture vapor, trapped gas, low packing, or material degradation.",
    materialCauses: [
      "Wet resin flashing moisture into steam during plasticizing or injection.",
      "Volatile contamination from mixed materials, oils, cleaners, or excess color carrier.",
      "Material degradation creating gas from too much heat history.",
    ],
    processChecks: [
      "Review shot size, cushion, hold pressure, and hold time for under-packing.",
      "Check melt temperature, residence time, and barrel zone overshoot.",
      "Inspect vents, gates, and injection speed profile for trapped gas.",
    ],
    handlingChecks: [
      "Confirm resin was dried long enough at the correct temperature and dew point.",
      "Inspect material containers for condensation, open lids, or water leaks.",
      "Check that regrind is clean, dry, and not exceeding the validated percentage.",
    ],
    correctiveActions: [
      "Redry or replace suspect resin and validate with moisture testing when available.",
      "Increase effective packing after confirming gate seal and safe pressure limits.",
      "Reduce residence time or melt temperature if degradation is suspected.",
    ],
  },
  {
    name: "Silver Streaks",
    summary: "Bright silver lines usually indicate moisture, gas, shear overheating, or additive separation at the flow front.",
    materialCauses: [
      "Insufficient drying of hygroscopic resin or moisture pickup after drying.",
      "Incompatible colorant, lubricant, flame retardant, or regrind blend.",
      "Pellets or regrind containing fines that melt unevenly or burn.",
    ],
    processChecks: [
      "Check screw recovery settings for high shear and inconsistent melt quality.",
      "Verify nozzle, barrel, and hot runner temperatures against the process sheet.",
      "Review fill speed and gate design for jetting or excessive shear at the gate.",
    ],
    handlingChecks: [
      "Audit dryer discharge temperature, hopper throat temperature, and material transfer path.",
      "Look for open material containers or long staging time at the press.",
      "Compare current lot and color package with the last acceptable run.",
    ],
    correctiveActions: [
      "Restore validated drying conditions and minimize time between drying and molding.",
      "Lower shear contributors such as screw speed, back pressure, or aggressive fill speed.",
      "Quarantine suspect additives, regrind, or lots until a controlled trial is completed.",
    ],
  },
  {
    name: "Black Specks",
    summary: "Dark particles point to degraded polymer, contamination, burned material hang-up, or foreign debris.",
    materialCauses: [
      "Contaminated virgin resin, regrind, colorant, or material handling equipment.",
      "Thermally degraded resin from excessive drying temperature or repeated heat history.",
      "Incompatible resin mixed into the stream and burning at the current melt temperature.",
    ],
    processChecks: [
      "Check barrel, nozzle, check ring, hot runner, and dead spots for material hang-up.",
      "Review melt temperature, residence time, screw RPM, and back pressure for degradation risk.",
      "Inspect startup, shutdown, and purge procedures for burned residue carryover.",
    ],
    handlingChecks: [
      "Clean grinders, hoses, loaders, magnets, and gaylords before returning material to production.",
      "Check for cardboard, dust, metal, oil, or floor sweep contamination.",
      "Review regrind age, storage labels, and material segregation practices.",
    ],
    correctiveActions: [
      "Purge thoroughly, clean the feed system, and remove suspect regrind or colorant.",
      "Reduce residence time and temperatures to the validated processing window.",
      "If specks persist, inspect tooling and plasticizing components for hang-up areas.",
    ],
  },
  {
    name: "Delamination",
    summary: "Layers or peeling surfaces usually indicate incompatible materials, contamination, or weak knit between flow layers.",
    materialCauses: [
      "Incompatible resin, regrind, color concentrate, or purge compound blended into the shot.",
      "Moisture or surface contamination interfering with layer bonding.",
      "Excess lubricant, mold release, or additive blooming at the melt surface.",
    ],
    processChecks: [
      "Review melt temperature and fill speed for poor layer fusion or cold flow fronts.",
      "Check hold pressure and cooling balance for stress that can initiate peeling.",
      "Inspect mold surface, vents, and gate location for flow hesitation or contamination.",
    ],
    handlingChecks: [
      "Verify material labels and confirm no partial bags or regrind from another resin were introduced.",
      "Audit dryer and hopper cleaning before the run started.",
      "Check use of mold release, cleaning sprays, or lubricants near the material stream.",
    ],
    correctiveActions: [
      "Remove incompatible material sources and run virgin resin as a controlled baseline.",
      "Purge and clean the machine, hopper, loader, and grinder before restarting.",
      "Adjust melt temperature, fill speed, and packing only after material contamination is ruled out.",
    ],
  },
  {
    name: "Brittleness",
    summary: "Cracking, low impact strength, or fragile parts can result from degradation, moisture history, contamination, or poor packing.",
    materialCauses: [
      "Hydrolytic degradation from molding wet polyester, nylon, polycarbonate, or other sensitive resins.",
      "Too much regrind, excessive prior heat history, or mixed resin contamination.",
      "Wrong material grade, missing impact modifier, or unapproved color/additive change.",
    ],
    processChecks: [
      "Check melt temperature, residence time, and screw recovery for polymer degradation.",
      "Review packing, gate seal, and cooling for voids, molded-in stress, or weak weld lines.",
      "Compare actual process settings to the qualified process window.",
    ],
    handlingChecks: [
      "Verify drying records, moisture readings, and maximum allowable drying time.",
      "Review lot changes, resin age, regrind percentage, and storage conditions.",
      "Confirm the material certificate and supplier technical data sheet match the job requirements.",
    ],
    correctiveActions: [
      "Replace suspect material with properly dried virgin resin and test impact performance.",
      "Reduce degradation risks by lowering temperature, residence time, and regrind exposure.",
      "Restore the validated packing/cooling process and escalate for material testing if brittleness remains.",
    ],
  },
];

export default function MaterialDefectTroubleshooterPage() {
  const [selectedDefect, setSelectedDefect] = useState(defects[0]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.18),transparent_34%)]" />
          <div className="relative">
            <Link
              href="/materials/resin-drying"
              className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
            >
              ← Material guides
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Material troubleshooting
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Material Defect Troubleshooter
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Select a visible defect to review likely material contributors, process checks, handling checks, and practical corrective actions before changing the process.
            </p>
          </div>
        </header>

        <aside className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5 text-sm font-semibold leading-6 text-amber-100 shadow-xl shadow-amber-950/20 sm:p-6">
          Always verify resin condition, drying data, lot changes, and supplier technical data sheets.
        </aside>

        <section className="grid gap-5 lg:grid-cols-[18rem_1fr]" aria-label="Material defect troubleshooting selector">
          <nav className="rounded-3xl border border-white/10 bg-white/10 p-3 shadow-xl shadow-slate-950/20 backdrop-blur" aria-label="Defect options">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {defects.map((defect) => {
                const isSelected = defect.name === selectedDefect.name;

                return (
                  <button
                    key={defect.name}
                    type="button"
                    onClick={() => setSelectedDefect(defect)}
                    className={`rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus:ring-4 focus:ring-cyan-300/20 ${
                      isSelected
                        ? "border-cyan-300/50 bg-cyan-300/15 text-white shadow-lg shadow-cyan-950/30"
                        : "border-white/10 bg-slate-950/40 text-slate-300 hover:border-cyan-300/30 hover:bg-white/10"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className="block text-base font-bold">{defect.name}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">Tap to view checks</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-300">Selected defect</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">{selectedDefect.name}</h2>
              </div>
              <span className="w-fit rounded-full border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-teal-100">
                Material focus
              </span>
            </div>
            <p className="mt-5 text-base leading-7 text-slate-300">{selectedDefect.summary}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Checklist title="Possible material causes" items={selectedDefect.materialCauses} accent="text-cyan-300" />
              <Checklist title="Machine/process checks" items={selectedDefect.processChecks} accent="text-emerald-300" />
              <Checklist title="Material handling checks" items={selectedDefect.handlingChecks} accent="text-amber-300" />
              <Checklist title="Corrective actions" items={selectedDefect.correctiveActions} accent="text-violet-300" />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

function Checklist({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
      <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${accent}`}>{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={accent} aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
