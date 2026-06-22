import Link from "next/link";

type ResinDryingMaterial = {
  name: string;
  dryingRequired: "Yes" | "No";
  temperature: string;
  time: string;
  defects: string[];
};

const materials: ResinDryingMaterial[] = [
  {
    name: "ABS",
    dryingRequired: "Yes",
    temperature: "175–185°F (80–85°C)",
    time: "2–4 hours",
    defects: ["Splay", "silver streaks", "bubbles", "surface haze"],
  },
  {
    name: "Nylon",
    dryingRequired: "Yes",
    temperature: "160–180°F (70–82°C)",
    time: "4–8 hours",
    defects: ["Splay", "brittleness", "voids", "reduced mechanical strength"],
  },
  {
    name: "Polycarbonate",
    dryingRequired: "Yes",
    temperature: "240–260°F (115–127°C)",
    time: "3–4 hours",
    defects: ["Splay", "bubbles", "silver streaks", "loss of impact strength"],
  },
  {
    name: "PET",
    dryingRequired: "Yes",
    temperature: "300–350°F (150–175°C)",
    time: "4–6 hours",
    defects: ["Splay", "brittleness", "haze", "hydrolytic degradation"],
  },
  {
    name: "PBT",
    dryingRequired: "Yes",
    temperature: "240–260°F (115–127°C)",
    time: "3–4 hours",
    defects: ["Splay", "bubbles", "brittleness", "reduced surface finish"],
  },
  {
    name: "Acetal",
    dryingRequired: "No",
    temperature: "Usually not required; if wet, 180–200°F (82–93°C)",
    time: "2–4 hours if drying is needed",
    defects: ["Splay", "surface streaks", "bubbles", "odor from overheating"],
  },
  {
    name: "Polypropylene",
    dryingRequired: "No",
    temperature: "Usually not required; if wet, 150–180°F (65–82°C)",
    time: "1–2 hours if drying is needed",
    defects: ["Splay", "bubbles", "surface streaks", "poor appearance"],
  },
  {
    name: "Polyethylene",
    dryingRequired: "No",
    temperature: "Usually not required; if wet, 150–180°F (65–82°C)",
    time: "1–2 hours if drying is needed",
    defects: ["Splay", "bubbles", "surface streaks", "voids"],
  },
];

export default function ResinDryingGuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.16),transparent_34%)]" />
          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
            >
              ← Back to coach
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-teal-300">
              Material Guides
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Resin drying guide
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Compare typical drying requirements for common injection molding resins and the defects that can show up when moisture is not controlled.
            </p>
          </div>
        </header>

        <aside className="mt-6 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5 text-sm font-semibold leading-6 text-amber-100 shadow-xl shadow-amber-950/20 sm:p-6">
          Always verify drying requirements with the resin supplier technical data sheet.
        </aside>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resin drying requirements">
          {materials.map((material) => (
            <article
              key={material.name}
              className="flex min-h-full flex-col rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold text-white">{material.name}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${
                    material.dryingRequired === "Yes"
                      ? "border border-rose-300/30 bg-rose-300/10 text-rose-100"
                      : "border border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                  }`}
                >
                  {material.dryingRequired}
                </span>
              </div>

              <dl className="mt-5 space-y-4 text-sm leading-6">
                <div>
                  <dt className="font-bold uppercase tracking-[0.18em] text-slate-400">Drying required</dt>
                  <dd className="mt-1 text-base font-semibold text-slate-100">{material.dryingRequired}</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-[0.18em] text-slate-400">Typical temperature</dt>
                  <dd className="mt-1 text-slate-200">{material.temperature}</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-[0.18em] text-slate-400">Typical time</dt>
                  <dd className="mt-1 text-slate-200">{material.time}</dd>
                </div>
              </dl>

              <div className="mt-5 flex-1 rounded-2xl border border-cyan-300/15 bg-slate-950/50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                  Moisture-related defects
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  {material.defects.map((defect) => (
                    <li key={defect} className="flex gap-2">
                      <span className="text-cyan-300" aria-hidden="true">•</span>
                      <span>{defect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
