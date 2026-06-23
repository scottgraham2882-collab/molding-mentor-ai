import Link from "next/link";

import { getLearningPathways } from "../lib/connected-learning";

type LearnMoreAboutThisProps = {
  defectSlug: string;
  defectName?: string;
  className?: string;
};

export function LearnMoreAboutThis({ defectSlug, defectName = "this defect", className = "" }: LearnMoreAboutThisProps) {
  const pathways = getLearningPathways(defectSlug);

  return (
    <section className={`rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4 shadow-xl shadow-slate-950/20 sm:p-5 ${className}`}>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Learn More About This</p>
      <h3 className="mt-2 text-xl font-black text-white">Next best learning step for {defectName}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Pick one link. Start with why it happens, then move to troubleshooting only if you need action.
      </p>
      <div className="mt-4 grid gap-2">
        {pathways.map((pathway) => (
          <Link
            key={`${pathway.href}-${pathway.label}`}
            href={pathway.href}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
          >
            <span className="block text-sm font-black text-cyan-100 sm:text-base">{pathway.label} →</span>
            <span className="mt-1 block text-xs leading-5 text-slate-300 sm:text-sm">{pathway.helper}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
