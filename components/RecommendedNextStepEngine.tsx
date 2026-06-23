import Link from "next/link";

import { getRecommendedNextSteps, type NextStepContext, type NextStepRecommendation } from "../lib/next-step-engine";

type RecommendedNextStepEngineProps = {
  context: NextStepContext;
  intro?: string;
  steps?: NextStepRecommendation[];
};

export function RecommendedNextStepEngine({ context, intro, steps }: RecommendedNextStepEngineProps) {
  const recommendations = (steps ?? getRecommendedNextSteps(context)).slice(0, 3);

  return (
    <section className="mt-6 rounded-[2rem] border border-emerald-300/25 bg-emerald-300/10 p-4 shadow-xl shadow-slate-950/20 sm:p-6 print:hidden" aria-labelledby="recommended-next-step-heading">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Recommended Next Step</p>
      <div className="mt-2 max-w-3xl">
        <h2 id="recommended-next-step-heading" className="text-2xl font-black text-white">Keep going without getting overwhelmed</h2>
        <p className="mt-2 text-sm leading-6 text-emerald-50/90 sm:text-base">
          {intro ?? "Choose one helpful next move. These links use existing pages and keep the workflow focused."}
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((step) => (
          <Link
            key={`${step.href}-${step.label}`}
            href={step.href}
            className="group rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-emerald-300/50 hover:bg-emerald-300/10 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
          >
            <span className="block text-base font-black text-emerald-100">{step.label} <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span></span>
            <span className="mt-2 block text-sm leading-5 text-slate-300">{step.helper}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
