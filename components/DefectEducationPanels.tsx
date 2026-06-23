import { type DefectGuide } from "../lib/defect-data";

type DefectEducationPanelsProps = {
  defect: DefectGuide;
  compact?: boolean;
};

export function DefectEducationPanels({ defect, compact = false }: DefectEducationPanelsProps) {
  if (!defect.whyThisHappens && !defect.teachNewTechnician) {
    return null;
  }

  const headingClass = compact
    ? "cursor-pointer list-none text-sm font-black text-amber-100"
    : "cursor-pointer list-none text-sm font-black uppercase tracking-[0.18em] text-amber-200";
  const teachHeadingClass = compact
    ? "cursor-pointer list-none text-sm font-black text-emerald-100"
    : "cursor-pointer list-none text-sm font-black uppercase tracking-[0.18em] text-emerald-200";

  return (
    <section className={compact ? "mt-4 space-y-3" : "space-y-3"} aria-label={`${defect.name} education panels`}>
      {defect.whyThisHappens ? (
        <details className="group rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
          <summary className={headingClass}>
            Why This Happens <PanelToggle />
          </summary>
          <div className={compact ? "mt-4 space-y-3 text-sm leading-6 text-slate-200" : "mt-4 space-y-4 text-sm leading-6 text-slate-200"}>
            <p><strong className="text-white">Simple:</strong> {defect.whyThisHappens.simple}</p>
            <p><strong className="text-white">Scientific molding:</strong> {defect.whyThisHappens.scientific}</p>
            <EducationList title="Common misconceptions" items={defect.whyThisHappens.misconceptions} compact={compact} />
            <EducationList title="Operators often try first" items={defect.whyThisHappens.unhelpfulFirstMoves} compact={compact} />
            <EducationList title="Experienced techs look at first" items={defect.whyThisHappens.experiencedTechChecks} compact={compact} />
          </div>
        </details>
      ) : null}

      {defect.teachNewTechnician ? (
        <details className="group rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
          <summary className={teachHeadingClass}>
            Teach a New Technician <PanelToggle />
          </summary>
          <EducationList title={compact ? "Key lessons" : "Shop-floor lessons"} items={defect.teachNewTechnician} className="mt-4" compact={compact} />
        </details>
      ) : null}
    </section>
  );
}

function PanelToggle() {
  return (
    <>
      <span className="float-right text-current opacity-80 group-open:hidden">+</span>
      <span className="float-right hidden text-current opacity-80 group-open:inline">−</span>
    </>
  );
}

function EducationList({ title, items, className = "", compact = false }: { title: string; items: string[]; className?: string; compact?: boolean }) {
  return (
    <div className={className}>
      <h4 className={compact ? "text-xs font-black uppercase tracking-[0.14em] text-slate-100" : "text-xs font-black uppercase tracking-[0.16em] text-slate-100"}>{title}</h4>
      <ul className={compact ? "mt-2 space-y-2 text-slate-300" : "mt-2 space-y-2 text-sm leading-6 text-slate-300"}>
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
