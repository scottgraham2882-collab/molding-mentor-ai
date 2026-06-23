import Link from "next/link";

import { DefectEducationPanels } from "../../components/DefectEducationPanels";
import { RecommendedNextSteps } from "../../components/RecommendedNextSteps";
import { defectGuides, troubleshootingHref } from "../../lib/defect-data";

export default function DefectsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
          >
            ← Back to coach
          </Link>
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
          {defectGuides.map((defect) => (
            <article
              key={defect.name}
              className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/40 sm:p-6"
            >
              <h2 className="text-2xl font-bold text-white">{defect.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{defect.description}</p>

              <div className="mt-5 flex flex-1 flex-col justify-between gap-5">
                <div className="space-y-5">
                  <Checklist title="Common causes" items={defect.causes} accent="bg-cyan-300" titleColor="text-cyan-300" />
                  <Checklist title="What to check first" items={defect.checkFirst} accent="bg-amber-300" titleColor="text-amber-300" />
                  <Checklist title="Corrective actions" items={defect.actions} accent="bg-emerald-300" titleColor="text-emerald-300" />
                  <TagList title="Related process areas" items={defect.processAreas} />
                  <TagList title="Related material checks" items={defect.materialChecks} />
                  <DefectEducationPanels defect={defect} />
                  <RecommendedNextSteps defectSlug={defect.slug} contextLabel={defect.name} />
                </div>
                <Link href={troubleshootingHref} className="rounded-2xl border border-cyan-300/30 px-4 py-3 text-center text-sm font-black text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10">
                  Open Troubleshooting Assistant →
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function Checklist({ title, items, accent, titleColor }: { title: string; items: string[]; accent: string; titleColor: string }) {
  return (
    <section>
      <h3 className={`text-sm font-semibold uppercase tracking-[0.2em] ${titleColor}`}>{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${accent}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TagList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-bold text-slate-200">{item}</span>
        ))}
      </div>
    </section>
  );
}
