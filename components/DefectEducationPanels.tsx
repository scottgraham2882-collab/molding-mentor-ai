import type { DefectGuide } from "../lib/defect-data";

type DefectEducationPanelsProps = {
  defect: DefectGuide;
  compact?: boolean;
};

export function DefectEducationPanels({ defect, compact = false }: DefectEducationPanelsProps) {
  if (!defect.whyThisHappens && !defect.teachNewTechnician?.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {defect.whyThisHappens ? (
        <details className="group rounded-2xl border border-sky-300/25 bg-sky-300/10 p-4 open:border-sky-200/50">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left font-black text-sky-100">
            <span>Why This Happens</span>
            <span className="rounded-full border border-sky-200/30 px-2 py-1 text-xs text-sky-100 group-open:hidden">Open</span>
            <span className="hidden rounded-full border border-sky-200/30 px-2 py-1 text-xs text-sky-100 group-open:inline">Close</span>
          </summary>
          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-200">
            <EducationText title="Simple explanation" body={defect.whyThisHappens.simple} />
            <EducationText title="Scientific molding explanation" body={defect.whyThisHappens.scientific} />
            <EducationList title="Common misconceptions" items={defect.whyThisHappens.misconceptions} />
            <EducationList title="What operators often try first that doesn't work" items={defect.whyThisHappens.ineffectiveFirstTries} />
            <EducationList title="What experienced process technicians look at first" items={defect.whyThisHappens.technicianFirstLooks} />
          </div>
        </details>
      ) : null}

      {defect.teachNewTechnician?.length ? (
        <details className="group rounded-2xl border border-lime-300/25 bg-lime-300/10 p-4 open:border-lime-200/50" open={!compact}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left font-black text-lime-100">
            <span>Teach a New Technician</span>
            <span className="rounded-full border border-lime-200/30 px-2 py-1 text-xs text-lime-100 group-open:hidden">Open</span>
            <span className="hidden rounded-full border border-lime-200/30 px-2 py-1 text-xs text-lime-100 group-open:inline">Close</span>
          </summary>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-200">
            {defect.teachNewTechnician.map((lesson) => (
              <li key={lesson} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-lime-300" />
                <span>{lesson}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

function EducationText({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">{title}</h4>
      <p className="mt-1 text-slate-100">{body}</p>
    </section>
  );
}

function EducationList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">{title}</h4>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
