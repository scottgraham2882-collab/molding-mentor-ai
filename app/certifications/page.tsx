import Link from "next/link";

const completedModules = [
  { title: "Machine Safety & Startup", completedOn: "Jun 12", badge: "Safety Ready" },
  { title: "Defect Recognition Basics", completedOn: "Jun 15", badge: "Visual Inspector" },
  { title: "Process Window Introduction", completedOn: "Jun 18", badge: "Window Builder" },
];

const certifications = [
  {
    title: "Injection Molding Operator Level 1",
    progress: 92,
    score: 94,
    completed: true,
    modules: "6/6 modules",
    accent: "from-cyan-300 to-emerald-300",
  },
  {
    title: "Defect Recognition Specialist",
    progress: 78,
    score: 88,
    completed: false,
    modules: "5/6 modules",
    accent: "from-sky-300 to-cyan-300",
  },
  {
    title: "Setup Technician Level 1",
    progress: 64,
    score: 82,
    completed: false,
    modules: "4/7 modules",
    accent: "from-amber-300 to-orange-300",
  },
  {
    title: "Process Technician Level 1",
    progress: 46,
    score: 76,
    completed: false,
    modules: "3/8 modules",
    accent: "from-violet-300 to-fuchsia-300",
  },
  {
    title: "Scientific Molding Fundamentals",
    progress: 58,
    score: 84,
    completed: false,
    modules: "4/7 modules",
    accent: "from-teal-300 to-cyan-300",
  },
];

function ProgressBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800" aria-label={`${value}% complete`}>
      <div className={`h-full rounded-full bg-gradient-to-r ${accent}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function CertificationsPage() {
  const completedCount = certifications.filter((certification) => certification.completed).length;
  const averageProgress = Math.round(
    certifications.reduce((total, certification) => total + certification.progress, 0) / certifications.length,
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link href="/" className="w-fit text-sm font-bold text-cyan-200 hover:text-cyan-100">
          ← Dashboard
        </Link>

        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300">Certification Center</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Track molding credentials from training to certificate.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Review completed training modules, quiz performance, and certification progress before generating a printable certificate.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <p className="text-3xl font-black text-white">{completedCount}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Completed certifications</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <p className="text-3xl font-black text-white">{averageProgress}%</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Overall progress</p>
              </div>
              <Link
                href="/certifications/certificate"
                className="rounded-2xl border border-cyan-300/30 bg-cyan-300 px-4 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200"
              >
                Generate certificate
              </Link>
            </div>
          </div>
        </header>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
          <h2 className="text-xl font-black text-white">Completed training modules</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {completedModules.map((module) => (
              <article key={module.title} className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-300 px-2.5 py-1 text-xs font-black text-slate-950">✓</span>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">{module.completedOn}</span>
                </div>
                <h3 className="mt-3 font-bold text-white">{module.title}</h3>
                <p className="mt-2 text-sm text-emerald-100">Badge earned: {module.badge}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2" aria-label="Certification progress">
          {certifications.map((certification) => (
            <article key={certification.title} className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">{certification.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{certification.modules} complete</p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${certification.completed ? "bg-emerald-300 text-slate-950" : "bg-white/10 text-slate-300"}`}>
                  {certification.completed ? "Badge earned" : "In progress"}
                </span>
              </div>
              <ProgressBar value={certification.progress} accent={certification.accent} />
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/[0.06] p-3">
                  <p className="text-slate-400">Certification progress</p>
                  <p className="mt-1 text-2xl font-black text-white">{certification.progress}%</p>
                </div>
                <div className="rounded-2xl bg-white/[0.06] p-3">
                  <p className="text-slate-400">Quiz score</p>
                  <p className="mt-1 text-2xl font-black text-white">{certification.score}%</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
