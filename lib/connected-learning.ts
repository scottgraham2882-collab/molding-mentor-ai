export type LearningPathwayLink = {
  label: string;
  href: string;
  helper: string;
};

const defaultPathway: LearningPathwayLink[] = [
  {
    label: "Why This Happens explanation",
    href: "/defects",
    helper: "Review the plain-language cause before changing settings.",
  },
  {
    label: "Open related troubleshooting steps",
    href: "/troubleshooting",
    helper: "Answer guided questions and pick the safest first check.",
  },
  {
    label: "Open Scientific Molding Studies",
    href: "/scientific-molding/studies",
    helper: "Connect the defect to fill, pack, cooling, and process data.",
  },
  {
    label: "Open Lessons Learned / Knowledge Base",
    href: "/knowledge-base",
    helper: "Look for previous fixes, repeat issues, and plant knowledge.",
  },
  {
    label: "Ask Molding Coach",
    href: "/coach",
    helper: "Ask a focused follow-up question about this defect.",
  },
];

const pathwaysByDefectSlug: Record<string, LearningPathwayLink[]> = {
  flash: [
    {
      label: "Learn about cavity pressure and clamp force",
      href: "/calculators/clamp-tonnage",
      helper: "See how pressure and clamp force relate to flash risk.",
    },
    {
      label: "Open Flash troubleshooting",
      href: "/troubleshooting",
      helper: "Use guided checks for shutoffs, clamp, transfer, and pack.",
    },
    {
      label: "Open Process Change Log",
      href: "/process-change-log",
      helper: "Check recent process changes before making another adjustment.",
    },
    {
      label: "Open Lessons Learned / Knowledge Base",
      href: "/knowledge-base",
      helper: "Find past flash fixes by mold, machine, or part.",
    },
    {
      label: "Ask Molding Coach about flash",
      href: "/coach",
      helper: "Get a plain-language follow-up checklist.",
    },
  ],
  splay: [
    {
      label: "Learn about resin drying",
      href: "/materials/resin-drying",
      helper: "Review drying time, temperature, airflow, and dew point.",
    },
    {
      label: "Open Resin Drying Guide",
      href: "/materials/resin-drying",
      helper: "Verify moisture-sensitive material handling basics.",
    },
    {
      label: "Open Material Drying Log",
      href: "/materials/drying-log",
      helper: "Confirm dryer setup and recent drying records.",
    },
    {
      label: "Open Lessons Learned / Knowledge Base",
      href: "/knowledge-base",
      helper: "Search for repeat splay, dryer, lot, or colorant issues.",
    },
    {
      label: "Ask Molding Coach about splay",
      href: "/coach",
      helper: "Ask what to check before changing barrel heats.",
    },
  ],
  "short-shot": [
    {
      label: "Learn about fill phase",
      href: "/lessons/decoupled-molding-1",
      helper: "Understand fill before changing pack or hold.",
    },
    {
      label: "Open Short Shot troubleshooting",
      href: "/troubleshooting",
      helper: "Check shot size, transfer, pressure limit, and restrictions.",
    },
    {
      label: "Open Fill Study lesson",
      href: "/scientific-molding/studies",
      helper: "Connect fill-only checks to process data.",
    },
    {
      label: "Open Lessons Learned / Knowledge Base",
      href: "/knowledge-base",
      helper: "Find prior short-shot fixes and blocked-flow notes.",
    },
    {
      label: "Ask Molding Coach about short shots",
      href: "/coach",
      helper: "Ask for a beginner-friendly first-check plan.",
    },
  ],
};

export function getLearningPathways(defectSlug: string): LearningPathwayLink[] {
  return pathwaysByDefectSlug[defectSlug] ?? defaultPathway;
}
