import Link from "next/link";

const navigationCards = [
  {
    title: "Defect Library",
    cta: "Open Defect Library",
    description:
      "Review common injection molding defects, likely causes, and corrective actions before changing the process.",
    href: "/defects",
    badge: "Reference",
    accent: "text-cyan-200",
  },
  {
    title: "Troubleshooting Assistant",
    cta: "Open Troubleshooting Assistant",
    description:
      "Collect evidence, isolate variables, and validate one process change at a time with a guided workflow.",
    href: "/troubleshooting",
    badge: "Guided help",
    accent: "text-emerald-200",
  },
];

const resourceCards = [
  {
    title: "Scientific Molding Training",
    status: "Training",
    description:
      "Build disciplined habits around fill studies, gate seal, process windows, cooling checks, and documentation.",
    accent: "text-violet-200",
  },
  {
    title: "Process Calculator",
    status: "Coming Soon",
    description:
      "Future calculators for shot size, clamp tonnage, residence time, cooling estimates, and process change records.",
    accent: "text-amber-100",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col justify-center">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Injection molding coach
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_20rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Molding Mentor AI
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Start from the latest home experience, then choose the right workspace for defect reference, guided troubleshooting, training, or upcoming process tools.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4 text-sm leading-6 text-slate-300">
              Mobile-first dashboard for fast decisions on the production floor, during setup review, or while documenting process changes.
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {navigationCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.14] focus:outline-none focus:ring-4 focus:ring-cyan-300/20 sm:p-6"
            >
              <div>
                <span className="inline-flex rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                  {card.badge}
                </span>
                <h2 className={`mt-5 text-2xl font-bold ${card.accent}`}>{card.title}</h2>
                <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">{card.description}</p>
              </div>
              <span className="mt-8 inline-flex items-center text-sm font-bold text-cyan-200 transition group-hover:translate-x-1">
                {card.cta} →
              </span>
            </Link>
          ))}

          {resourceCards.map((card) => (
            <article
              key={card.title}
              className="flex min-h-64 flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6"
            >
              <div>
                <span className="inline-flex rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                  {card.status}
                </span>
                <h2 className={`mt-5 text-2xl font-bold ${card.accent}`}>{card.title}</h2>
                <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">{card.description}</p>
              </div>
              <span className="mt-8 text-sm font-bold text-slate-400">
                {card.status === "Coming Soon" ? "In development" : "Training resource"}
              </span>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
