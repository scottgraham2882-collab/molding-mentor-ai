export type SmartRecommendation = {
  label: string;
  href: string;
  helper: string;
};

const recommendationCatalog = {
  materialDryingLog: {
    label: "Open Material Drying Log",
    href: "/materials/drying-log",
    helper: "Confirm dryer time, temperature, and moisture checks.",
  },
  materialLotTraceability: {
    label: "Open Material Lot Traceability",
    href: "/materials/lot-traceability",
    helper: "Check lot changes, labels, and resin history.",
  },
  materialTroubleshooter: {
    label: "Open Material Troubleshooter",
    href: "/materials/troubleshooter",
    helper: "Walk through resin, drying, color, and regrind checks.",
  },
  processChangeLog: {
    label: "Open Process Change Log",
    href: "/process-change-log",
    helper: "Review the latest controlled process adjustments.",
  },
  moldHistory: {
    label: "Open Mold History",
    href: "/molds",
    helper: "Look for tooling repairs, shutoff wear, or recent PM notes.",
  },
  troubleshootingAssistant: {
    label: "Open Troubleshooting Assistant",
    href: "/troubleshooting",
    helper: "Use the guided checklist before changing settings.",
  },
  scientificMoldingStudies: {
    label: "Open Scientific Molding Studies",
    href: "/scientific-molding/studies",
    helper: "Compare study data for gate seal, cooling, and process windows.",
  },
  processSheet: {
    label: "Open Process Sheet",
    href: "/process-sheet-builder",
    helper: "Verify the approved baseline settings before adjusting.",
  },
  troubleshootingWizard: {
    label: "Open Troubleshooting Wizard",
    href: "/troubleshooting",
    helper: "Start a simple step-by-step symptom review.",
  },
  machineHistory: {
    label: "Open Machine History",
    href: "/machines",
    helper: "Check machine alarms, repairs, and repeat issues.",
  },
} satisfies Record<string, SmartRecommendation>;

const recommendationsByDefectSlug: Record<string, SmartRecommendation[]> = {
  splay: [
    recommendationCatalog.materialDryingLog,
    recommendationCatalog.materialLotTraceability,
    recommendationCatalog.materialTroubleshooter,
  ],
  flash: [
    recommendationCatalog.processChangeLog,
    recommendationCatalog.moldHistory,
    recommendationCatalog.troubleshootingAssistant,
  ],
  warpage: [
    recommendationCatalog.scientificMoldingStudies,
    recommendationCatalog.processSheet,
    recommendationCatalog.moldHistory,
  ],
  "short-shot": [
    recommendationCatalog.troubleshootingWizard,
    recommendationCatalog.machineHistory,
    recommendationCatalog.processChangeLog,
  ],
};

export function getSmartRecommendations(defectSlug: string): SmartRecommendation[] {
  return recommendationsByDefectSlug[defectSlug] ?? [
    recommendationCatalog.troubleshootingAssistant,
    recommendationCatalog.processSheet,
    recommendationCatalog.processChangeLog,
  ];
}
