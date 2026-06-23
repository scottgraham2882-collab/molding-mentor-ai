import Link from "next/link";

import { getSmartRecommendations } from "../lib/smart-recommendations";

type RecommendedNextStepsProps = {
  defectSlug: string;
  contextLabel?: string;
};

export function RecommendedNextSteps({ defectSlug, contextLabel = "this result" }: RecommendedNextStepsProps) {
  const recommendations = getSmartRecommendations(defectSlug);

  return (
    <section className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 shadow-xl shadow-slate-950/20 sm:p-5">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Recommended Next Steps</p>
      <h3 className="mt-2 text-xl font-bold text-white">Simple next moves for {contextLabel}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Start with one of these related tools. Each link opens an existing page and keeps the workflow focused.
      </p>
      <div className="mt-4 grid gap-3">
        {recommendations.map((recommendation) => (
          <Link
            key={`${recommendation.href}-${recommendation.label}`}
            href={recommendation.href}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-emerald-300/40 hover:bg-emerald-300/10 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
          >
            <span className="block text-base font-black text-emerald-100">{recommendation.label} →</span>
            <span className="mt-1 block text-sm leading-5 text-slate-300">{recommendation.helper}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
