import Link from "next/link";

type DashboardCard = {
  title: string;
  description: string;
  href?: string;
  status?: "Coming Soon";
  accent: string;
};

const dashboardCards: DashboardCard[] = [
  {
    title: "Defect Library",
    description:
      "Review common injection molding defects, likely root causes, and corrective actions before changing the process.",
    href: "/defects",
    accent: "from-cyan-300 to-sky-400",
  },
  {
    title: "Troubleshooting Assistant",
    description:
      "Use a guided workflow to collect evidence, isolate process variables, and validate the next corrective step.",
    href: "/troubleshooting",
    accent: "from-emerald-300 to-teal-400",
  },
  {
    title: "Scientific Molding Training",
    description:
      "Build a structured learning path for process windows, gate seal studies, viscosity curves, and setup discipline.",
    href: "/lessons",
    status: "Coming Soon",
    accent: "from-violet-300 to-fuchsia-400",
  },
  {
    title: "Process Calculator",
    description:
      "Estimate molding fundamentals like residence time, shot utilization, clamp tonnage, and cooling considerations.",
    status: "Coming Soon",
    accent: "from-amber-300 to-orange-400",
  },
];

function CardContent({ card }: { card: DashboardCard }) {
  return (
    <>
      <div
        className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${card.accent}`}
        aria-hidden="true"
      />
      <div className="mt-6 flex items-start justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">{card.title}</h2>
        {card.status ? (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
            {card.status}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">{card.description}</p>
      <div className="mt-7 flex items-center justify-between text-sm font-bold text-cyan-100">
        <span>{card.href ? "Open tool" : "Planned module"}</span>
        <span aria-hidden="true">→</span>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_32%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Mobile-first molding support
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              Molding Mentor AI
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A focused dashboard for injection molding teams to diagnose defects, follow disciplined troubleshooting, and prepare for future scientific molding tools.
            </p>
          </div>
        </header>

        <section
          aria-label="Molding Mentor AI tools"
          className="grid gap-4 sm:grid-cols-2 lg:gap-6"
        >
          {dashboardCards.map((card) => {
            const className =
              "group min-h-64 rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-slate-950/30 backdrop-blur transition sm:p-7";

            if (card.href) {
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`${className} hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.1] focus:outline-none focus:ring-4 focus:ring-cyan-300/20`}
                >
                  <CardContent card={card} />
                </Link>
              );
            }

            return (
              <article
                key={card.title}
                className={`${className} opacity-80`}
              >
                <CardContent card={card} />
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
