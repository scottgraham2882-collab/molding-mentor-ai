import Link from "next/link";

import type { DefectGuide } from "../lib/defect-data";

type DefectEducationPanelsProps = {
  defect: DefectGuide;
  compact?: boolean;
};

const majorDefectSlugs = new Set([
  "flash",
  "short-shot",
  "splay",
  "burn-marks",
  "warpage",
  "sink-marks",
  "voids",
  "weld-lines",
  "jetting",
  "gate-blush",
]);

const coreToolLinks = [
  { label: "Troubleshooting Wizard", href: "/troubleshooting" },
  { label: "Photo Analysis", href: "/photo-analysis" },
  { label: "AI Coach", href: "/coach" },
  { label: "Knowledge Search", href: "/knowledge-search" },
];

const lessonLinksByDefect: Record<string, { label: string; href: string }[]> = {
  flash: [{ label: "Clamp Tonnage Calculator", href: "/calculators/clamp-tonnage" }, { label: "Scientific Molding Studies", href: "/scientific-molding/studies" }],
  "short-shot": [{ label: "Decoupled Molding Lesson", href: "/lessons/decoupled-molding-1" }, { label: "Scientific Molding Studies", href: "/scientific-molding/studies" }],
  splay: [{ label: "Resin Drying Guide", href: "/materials/resin-drying" }, { label: "Material Troubleshooter", href: "/materials/troubleshooter" }],
  "burn-marks": [{ label: "Scientific Molding Studies", href: "/scientific-molding/studies" }],
  warpage: [{ label: "Process Window Lesson", href: "/lessons/process-window" }, { label: "Scientific Molding Studies", href: "/scientific-molding/studies" }],
  "sink-marks": [{ label: "Gate Seal Lesson", href: "/lessons/gate-seal-study" }, { label: "Scientific Molding Studies", href: "/scientific-molding/studies" }],
  voids: [{ label: "Gate Seal Lesson", href: "/lessons/gate-seal-study" }, { label: "Resin Drying Guide", href: "/materials/resin-drying" }],
  "weld-lines": [{ label: "Scientific Molding Studies", href: "/scientific-molding/studies" }],
  jetting: [{ label: "Decoupled Molding Lesson", href: "/lessons/decoupled-molding-1" }],
  "gate-blush": [{ label: "Decoupled Molding Lesson", href: "/lessons/decoupled-molding-1" }, { label: "Scientific Molding Studies", href: "/scientific-molding/studies" }],
};

export function DefectEducationPanels({ defect, compact = false }: DefectEducationPanelsProps) {
  if (!majorDefectSlugs.has(defect.slug) && !defect.whyThisHappens && !defect.teachNewTechnician?.length) {
    return null;
  }

  const why = defect.whyThisHappens;
  const wrongFixes = why ? [...why.misconceptions, ...why.ineffectiveFirstTries] : defect.actions.slice(0, 2).map((action) => `Changing settings before proving: ${action.toLowerCase()}`);
  const technicianTips = defect.teachNewTechnician?.length ? defect.teachNewTechnician : why?.technicianFirstLooks ?? defect.checkFirst;
  const relatedTools = [...coreToolLinks, ...(lessonLinksByDefect[defect.slug] ?? [{ label: "Scientific Molding Lessons", href: "/lessons" }])];

  return (
    <details className="group rounded-2xl border border-lime-300/25 bg-lime-300/10 p-4 open:border-lime-200/50" open={!compact}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left font-black text-lime-100">
        <span>Root Cause Learning</span>
        <span className="rounded-full border border-lime-200/30 px-2 py-1 text-xs text-lime-100 group-open:hidden">Open</span>
        <span className="hidden rounded-full border border-lime-200/30 px-2 py-1 text-xs text-lime-100 group-open:inline">Close</span>
      </summary>

      <div className="mt-4 space-y-4 text-sm leading-6 text-slate-200">
        <EducationText title="1. What it looks like" body={defect.description} />
        <EducationText title="2. Why it happens" body={why?.simple ?? defect.causes[0]} />
        {why?.scientific ? <EducationText title="Scientific molding view" body={why.scientific} /> : null}
        <EducationList title="3. What to check first" items={defect.checkFirst} accent="bg-amber-300" />
        <EducationList title="4. What not to change first" items={why?.ineffectiveFirstTries ?? ["Do not make a big setting change until you know where the defect starts.", "Do not change several knobs at once."]} accent="bg-rose-300" />
        <EducationList title="5. Common wrong fixes" items={wrongFixes} accent="bg-orange-300" />
        <EducationList title="6. Experienced tech tip" items={technicianTips} accent="bg-lime-300" />
        <RelatedTools links={relatedTools} />
      </div>
    </details>
  );
}

function EducationText({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">{title}</h4>
      <p className="mt-1 text-slate-100">{body}</p>
    </section>
  );
}

function EducationList({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <section>
      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">{title}</h4>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accent}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RelatedTools({ links }: { links: { label: string; href: string }[] }) {
  return (
    <section>
      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-lime-200">7. Related tools</h4>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <Link key={`${link.href}-${link.label}`} href={link.href} className="rounded-2xl border border-lime-200/20 bg-slate-950/50 px-3 py-2 text-center text-xs font-black text-lime-50 transition hover:border-lime-100 hover:bg-lime-300/10">
            {link.label} →
          </Link>
        ))}
      </div>
    </section>
  );
}
