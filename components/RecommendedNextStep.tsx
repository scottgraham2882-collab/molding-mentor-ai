import Link from "next/link";

type RelatedLink = {
  label: string;
  href: string;
};

type RecommendedNextStepProps = {
  label: string;
  href: string;
  reason: string;
  related?: RelatedLink[];
};

const buttonBase =
  "inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-center text-sm font-black transition focus:outline-none focus:ring-4 sm:text-base";

export function RecommendedNextStep({ label, href, reason, related = [] }: RecommendedNextStepProps) {
  return (
    <section className="mt-6 rounded-3xl border border-emerald-300/25 bg-emerald-300/10 p-5 shadow-xl shadow-slate-950/20 sm:p-6 print:hidden">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Recommended Next Step</p>
      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-2xl font-black text-white">{label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/90 sm:text-base">{reason}</p>
        </div>
        <Link href={href} className={`${buttonBase} bg-emerald-300 text-slate-950 hover:bg-emerald-200 focus:ring-emerald-300/30`}>
          Continue →
        </Link>
      </div>
      {related.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Related tools">
          {related.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={`${buttonBase} border border-white/10 bg-slate-950/60 text-cyan-100 hover:border-cyan-300/50 hover:bg-cyan-300/10 focus:ring-cyan-300/20`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
