import Link from "next/link";

const defects = [
  {
    name: "Short Shot",
    description:
      "A part is only partially filled because the melt front freezes or loses pressure before the cavity is completely packed out.",
    causes: [
      "Insufficient shot size, injection pressure, or injection speed.",
      "Melt or mold temperature is too low for the material and flow length.",
      "Blocked gates, runners, vents, or restricted material flow paths.",
    ],
    actions: [
      "Increase shot size, transfer position, injection speed, or peak injection pressure in controlled steps.",
      "Raise melt and mold temperatures within the material supplier's recommended range.",
      "Inspect gates, runners, check rings, vents, and material feed for restrictions or wear.",
    ],
  },
  {
    name: "Flash",
    description:
      "Thin excess plastic escapes at the parting line, vents, ejector pins, or inserts where the mold should remain sealed.",
    causes: [
      "Clamp force is too low or cavity pressure is too high.",
      "Worn, damaged, dirty, or misaligned mold shutoffs and parting-line surfaces.",
      "Excessive melt temperature, injection speed, pack pressure, or pack time.",
    ],
    actions: [
      "Verify clamp tonnage, mold alignment, and parting-line cleanliness before changing process settings.",
      "Reduce peak cavity pressure by adjusting injection speed, pack pressure, or transfer position.",
      "Repair worn shutoffs, vent lands, inserts, or parting-line damage that allows leakage.",
    ],
  },
  {
    name: "Sink Marks",
    description:
      "Localized depressions appear on the surface when thick sections shrink after the outer skin has already solidified.",
    causes: [
      "Insufficient packing pressure, packing time, or gate freeze control.",
      "Thick ribs, bosses, or wall sections that cool slower than surrounding areas.",
      "Mold temperature, melt temperature, or cooling time is not balanced for the geometry.",
    ],
    actions: [
      "Increase pack pressure and pack time until gate freeze is confirmed with a gate-seal study.",
      "Improve cooling around thick sections and verify consistent water flow through the tool.",
      "Review part design for wall uniformity, rib thickness, and coring opportunities.",
    ],
  },
  {
    name: "Burn Marks",
    description:
      "Dark or charred areas form where trapped gas overheats, material degrades, or the melt is exposed to excessive shear.",
    causes: [
      "Poor venting traps air or gas near end-of-fill locations.",
      "Injection speed, screw speed, or back pressure creates excessive shear heat.",
      "Material residence time, barrel temperature, or contamination causes degradation.",
    ],
    actions: [
      "Clean, inspect, and add venting at end-of-fill areas or around trapped gas locations.",
      "Reduce injection speed, screw speed, back pressure, or melt temperature where shear is excessive.",
      "Purge degraded material and verify residence time, drying, and material handling practices.",
    ],
  },
  {
    name: "Splay",
    description:
      "Silver or streaky surface marks appear as moisture, volatiles, trapped air, or shear-degraded material reaches the part surface.",
    causes: [
      "Material moisture is too high or drying conditions are incorrect.",
      "Air is entrained from poor feed, excessive decompression, or turbulent flow.",
      "Melt temperature, screw recovery, or injection speed causes material degradation or shear.",
    ],
    actions: [
      "Verify dryer temperature, dew point, drying time, and material moisture content.",
      "Reduce suck-back, improve feed consistency, and check for air leaks or contamination.",
      "Lower melt temperature, screw speed, back pressure, or injection speed as needed.",
    ],
  },
  {
    name: "Warpage",
    description:
      "A molded part bends, twists, or bows when uneven shrinkage and residual stress pull the geometry out of shape.",
    causes: [
      "Uneven wall thickness, gate location, fiber orientation, or flow-induced stress.",
      "Unbalanced mold cooling or inconsistent coolant temperature and flow.",
      "Pack, hold, cooling, or ejection settings create nonuniform shrinkage.",
    ],
    actions: [
      "Balance mold temperatures and confirm cooling flow, circuit cleanliness, and coolant stability.",
      "Optimize pack pressure, pack time, cooling time, and ejection timing to reduce residual stress.",
      "Review gate location, wall thickness, ribs, and material orientation with tooling or design teams.",
    ],
  },
];

export default function DefectsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <nav className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
            >
              ← Back to coach
            </Link>
            <Link
              href="/troubleshooting"
              className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Open Troubleshooting Assistant
            </Link>
          </nav>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Defect Library
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Injection molding defect guide
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Quickly review common symptoms, likely root causes, and corrective actions before changing the process.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4 text-sm leading-6 text-slate-300">
              Use this page as a starting checklist, then validate every adjustment with measured part quality and stable process data.
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-2 xl:grid-cols-3">
          {defects.map((defect) => (
            <article
              key={defect.name}
              className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/40 sm:p-6"
            >
              <h2 className="text-2xl font-bold text-white">{defect.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{defect.description}</p>

              <div className="mt-5 space-y-5">
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Common Causes
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                    {defect.causes.map((cause) => (
                      <li key={cause} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Corrective Actions
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                    {defect.actions.map((action) => (
                      <li key={action} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
