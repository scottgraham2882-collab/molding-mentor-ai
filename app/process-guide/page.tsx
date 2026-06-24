import Link from "next/link";

const defectGuides = [
  {
    defect: "Short Shot",
    description: "The part is not completely filled or has missing detail.",
    first: "Confirm the basics: material feed, cushion, shot size, transfer position, and whether the mold is venting normally.",
    next: "If the setup matches the approved sheet, review fill speed, melt temperature, mold temperature, and any blocked gates or runners.",
    avoid: "Do not raise hold pressure first. A short shot is usually a fill, feed, transfer, venting, or restriction issue.",
    note: "Start by proving the press can deliver a full, repeatable first-stage fill before tuning pack and hold.",
  },
  {
    defect: "Flash",
    description: "Thin extra plastic appears at the parting line, vents, inserts, or shutoffs.",
    first: "Check that the mold is fully closing, clamp force is correct, parting line is clean, and no debris is holding the tool open.",
    next: "Review transfer position, hold pressure, fill speed, melt temperature, and signs of mold wear or damaged shutoffs.",
    avoid: "Do not immediately lower clamp safety, over-tighten the process window, or mask a mold problem with random pressure changes.",
    note: "Flash can be a process symptom or a tooling warning. Protect the mold and involve tooling when evidence points to wear or damage.",
  },
  {
    defect: "Sink Marks",
    description: "Depressions or dull spots form where the part shrinks after packing or cooling.",
    first: "Check gate seal, hold pressure, hold time, cushion consistency, and whether the part weight is stable.",
    next: "Review cooling time, mold temperature, melt temperature, wall thickness, ribs, bosses, and packing balance across cavities.",
    avoid: "Do not raise fill speed first. Sink is usually controlled by packing, gate seal, cooling, and part design conditions.",
    note: "Use part weight and gate seal thinking to separate a packing problem from a cooling or design limitation.",
  },
  {
    defect: "Burn Marks",
    description: "Dark streaks, brown spots, or charred areas appear on the molded part.",
    first: "Look for trapped air: check vents, fill pattern, end-of-fill areas, injection speed, and whether material is degrading.",
    next: "Review barrel temperatures, residence time, screw speed, back pressure, decompression, contamination, and blocked vents.",
    avoid: "Do not simply add more pressure first. More pressure can make trapped air and shear heat worse.",
    note: "Burns often tell you gas cannot escape or material is getting too hot for too long. Find the source before chasing settings.",
  },
  {
    defect: "Warpage",
    description: "The part twists, bows, cups, or changes shape after ejection.",
    first: "Check cooling balance, water flow, mold temperature, cooling time, ejection, and how parts are handled after molding.",
    next: "Review pack balance, fill pattern, material shrink behavior, wall thickness, fixture needs, and cavity-to-cavity differences.",
    avoid: "Do not change melt temperature first unless there is clear evidence it is outside the approved process window.",
    note: "Warpage is usually about uneven shrink. Compare hot and cold areas, then make one controlled change at a time.",
  },
];

export default function ProcessGuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-slate-950/40 sm:p-8">
          <Link href="/" className="text-sm font-bold text-cyan-300">
            ← Dashboard
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Feature #9 MVP
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Process Adjustment Guide
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            A simple, people-first guide for deciding what to check before changing an injection molding process. Use it to learn, troubleshoot,
            preserve shop knowledge, and support clear team conversations.
          </p>
          <div className="mt-5 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4 text-sm font-semibold leading-6 text-cyan-100">
            Keep it simple: verify the approved setup, change one thing at a time, let the process stabilize, and write down what you learned.
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {defectGuides.map((guide) => (
            <article key={guide.defect} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 sm:p-6">
              <div className="flex flex-col gap-2 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white">{guide.defect}</h2>
                <p className="text-sm leading-6 text-slate-300">{guide.description}</p>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-6">
                <div>
                  <h3 className="font-black uppercase tracking-wide text-emerald-300">1. What to check first</h3>
                  <p className="mt-1 text-slate-200">{guide.first}</p>
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-wide text-cyan-300">2. What to check next</h3>
                  <p className="mt-1 text-slate-200">{guide.next}</p>
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-wide text-amber-300">3. What not to change first</h3>
                  <p className="mt-1 text-slate-200">{guide.avoid}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <h3 className="font-black uppercase tracking-wide text-violet-300">4. Simple reminder note</h3>
                  <p className="mt-1 text-slate-200">{guide.note}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
