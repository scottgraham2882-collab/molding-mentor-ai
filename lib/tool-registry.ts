export type ToolAudience = "operator" | "technician" | "supervisor" | "all";

export type ToolMetadata = {
  title: string;
  href: string;
  category: string;
  description: string;
  audience: ToolAudience;
  tags: string[];
};

export const toolRegistry = [
  { title: "Start Here", href: "/start-here", category: "Start Here", description: "Pick your role and need to get three clear tools to open first.", audience: "all", tags: ["navigation", "recommendations", "onboarding"] },
  { title: "Mission", href: "/mission", category: "Start Here", description: "Review the people-first principles behind Molding Mentor AI.", audience: "all", tags: ["mission", "principles", "people-first"] },
  { title: "Main Dashboard", href: "/", category: "Start Here", description: "Return to the simple homepage with the most common starting points.", audience: "all", tags: ["navigation", "dashboard", "home"] },
  { title: "Molding Dictionary", href: "/molding-dictionary", category: "Learning", description: "Look up molding terms in simple language with shop-floor examples.", audience: "all", tags: ["terms", "reference", "basics"] },
  { title: "Lessons", href: "/lessons", category: "Learning", description: "Study practical scientific molding concepts in short learning modules.", audience: "all", tags: ["scientific molding", "learning", "lessons"] },
  { title: "Learning Roadmaps", href: "/roadmaps", category: "Learning", description: "Follow role-based learning paths for operators, technicians, and supervisors.", audience: "all", tags: ["roadmaps", "roles", "learning paths"] },
  { title: "Learning Plans", href: "/learning-plans", category: "Learning", description: "Track role-based training plans and recommended next steps for molding team development.", audience: "supervisor", tags: ["training", "planning", "development"] },
  { title: "Case Studies", href: "/case-studies", category: "Learning", description: "Learn from realistic molding situations, decisions, and outcomes.", audience: "all", tags: ["examples", "learning", "decisions"] },
  { title: "Knowledge Checks", href: "/knowledge-checks", category: "Learning", description: "Check understanding after lessons and training conversations.", audience: "all", tags: ["quiz", "understanding", "training"] },
  { title: "Operator Safety & Startup", href: "/training/operator-safety-startup", category: "Training", description: "Start with safe machine and startup basics.", audience: "operator", tags: ["safety", "startup", "operator"] },
  { title: "Process Window Lesson", href: "/lessons/process-window", category: "Learning", description: "See why stable settings matter.", audience: "technician", tags: ["process window", "stability", "lesson"] },
  { title: "Ask Coach", href: "/coach", category: "Troubleshooting", description: "Ask a molding question in plain words and review suggested next checks.", audience: "all", tags: ["coach", "questions", "troubleshooting"] },
  { title: "Troubleshooting Wizard", href: "/troubleshooting", category: "Troubleshooting", description: "Answer guided questions to narrow likely causes and corrective actions.", audience: "all", tags: ["defects", "guided", "root cause"] },
  { title: "Troubleshooting Simulator", href: "/simulator", category: "Troubleshooting", description: "Practice flash troubleshooting decisions one step at a time with immediate explanations.", audience: "all", tags: ["simulator", "training", "flash"] },
  { title: "Defect Guide", href: "/defects", category: "Troubleshooting", description: "Match common part defects to likely molding, material, mold, and machine causes.", audience: "all", tags: ["defects", "quality", "troubleshooting"] },
  { title: "Photo Analysis", href: "/photo-analysis", category: "Troubleshooting", description: "Use a part photo when you are not sure what to call the defect.", audience: "all", tags: ["photo", "defects", "identification"] },
  { title: "Checklists", href: "/checklists", category: "Troubleshooting", description: "Use simple checklists for repeatable production, quality, and training work.", audience: "all", tags: ["checklists", "standard work", "repeatable"] },
  { title: "Process Guide", href: "/process-adjustment-guide", category: "Troubleshooting", description: "Follow a structured sequence for verifying and adjusting the molding process.", audience: "technician", tags: ["process", "adjustment", "verification"] },
  { title: "Process Adjustment Guide", href: "/process-adjustment-guide", category: "Troubleshooting", description: "Use a structured approach when process adjustment is truly needed.", audience: "technician", tags: ["process", "adjustment", "structured"] },
  { title: "Root Cause Coach", href: "/root-cause-coach", category: "Troubleshooting", description: "Work through root cause thinking before jumping to process changes.", audience: "all", tags: ["root cause", "problem solving", "coach"] },
  { title: "What Changed?", href: "/root-cause/what-changed", category: "Troubleshooting", description: "Review recent changes that may explain a new molding problem.", audience: "technician", tags: ["changes", "root cause", "history"] },
  { title: "Knowledge Vault", href: "/knowledge-vault", category: "Knowledge & Collaboration", description: "Save problems, causes, fixes, and prevention notes for future teams.", audience: "all", tags: ["knowledge", "lessons learned", "preserve"] },
  { title: "Knowledge Search", href: "/knowledge-search", category: "Knowledge & Collaboration", description: "Find saved notes, lessons, and shop-floor knowledge quickly.", audience: "all", tags: ["search", "knowledge", "reference"] },
  { title: "Shift Handoff", href: "/shift-handoff", category: "Knowledge & Collaboration", description: "Capture machine status, open issues, and instructions for the next shift.", audience: "all", tags: ["handoff", "shift", "communication"] },
  { title: "Work Instructions", href: "/work-instructions", category: "Knowledge & Collaboration", description: "Create and share clear steps for repeatable work.", audience: "all", tags: ["instructions", "standard work", "collaboration"] },
  { title: "Meetings", href: "/meetings", category: "Knowledge & Collaboration", description: "Keep action items and team discussion points in one place.", audience: "supervisor", tags: ["meetings", "actions", "collaboration"] },
  { title: "Training Assignments", href: "/training/assignments", category: "Training", description: "Give employees the right training work and keep next steps visible.", audience: "supervisor", tags: ["assignments", "training", "development"] },
  { title: "Training Plan Builder", href: "/training/plan-builder", category: "Training", description: "Build simple development plans around roles and skill gaps.", audience: "supervisor", tags: ["plans", "training", "skills"] },
  { title: "Skills Matrix", href: "/training/skills-matrix", category: "Training", description: "See who is trained, where coverage is strong, and where support is needed.", audience: "supervisor", tags: ["skills", "coverage", "training"] },
  { title: "Role Paths", href: "/training/role-paths", category: "Training", description: "Open training paths for operators, process technicians, and supervisors.", audience: "all", tags: ["roles", "training", "paths"] },
  { title: "Certifications", href: "/certifications", category: "Training", description: "Track certification progress, renewals, and printable records.", audience: "supervisor", tags: ["certifications", "records", "renewals"] },
  { title: "First Piece Approval", href: "/quality/first-piece-approval", category: "Quality", description: "Confirm quality requirements before production continues.", audience: "all", tags: ["quality", "approval", "startup"] },
  { title: "Quality Hold / Containment", href: "/quality/containment", category: "Quality", description: "Control suspect product and document containment steps.", audience: "all", tags: ["containment", "quality", "hold"] },
  { title: "Corrective Action", href: "/quality/corrective-action", category: "Quality", description: "Track fixes and prevention steps so quality issues do not repeat.", audience: "supervisor", tags: ["corrective action", "prevention", "quality"] },
  { title: "8D Report", href: "/quality/8d-report", category: "Quality", description: "Organize team-based problem solving for serious quality events.", audience: "supervisor", tags: ["8d", "quality", "problem solving"] },
  { title: "Quality Audits", href: "/quality/audits", category: "Quality", description: "Review audit findings and follow-up actions in a simple format.", audience: "supervisor", tags: ["audits", "quality", "follow-up"] },
  { title: "Resin Drying", href: "/materials/resin-drying", category: "Materials", description: "Review drying guidance before moisture-sensitive material is processed.", audience: "technician", tags: ["resin", "drying", "materials"] },
  { title: "Drying Log", href: "/materials/drying-log", category: "Materials", description: "Record drying activity so material history is easy to understand.", audience: "all", tags: ["drying", "log", "materials"] },
  { title: "Lot Traceability", href: "/materials/lot-traceability", category: "Materials", description: "Connect material lots to jobs, parts, and production records.", audience: "all", tags: ["traceability", "lots", "materials"] },
  { title: "Color Change", href: "/materials/color-change", category: "Materials", description: "Plan and document color changes to reduce confusion and waste.", audience: "technician", tags: ["color change", "materials", "planning"] },
  { title: "Materials Troubleshooter", href: "/materials/troubleshooter", category: "Materials", description: "Check material-related causes when defects or processing problems appear.", audience: "technician", tags: ["materials", "troubleshooting", "defects"] },
  { title: "Live Production Board", href: "/production/live-board", category: "Production", description: "See what is running, what needs attention, and current production status.", audience: "all", tags: ["production", "status", "live"] },
  { title: "Run Log", href: "/production/run-log", category: "Production", description: "Record production events, notes, and issues during the run.", audience: "all", tags: ["run log", "production", "notes"] },
  { title: "Production Schedule", href: "/production/schedule", category: "Production", description: "Review planned jobs and upcoming production work.", audience: "all", tags: ["schedule", "production", "jobs"] },
  { title: "Job Traveler", href: "/production/job-traveler", category: "Production", description: "Keep job instructions, routing, and requirements easy to follow.", audience: "all", tags: ["traveler", "jobs", "instructions"] },
  { title: "Startup Approval", href: "/startup-approval", category: "Production", description: "Verify startup conditions before committing to full production.", audience: "all", tags: ["startup", "approval", "production"] },
  { title: "Maintenance", href: "/maintenance", category: "Maintenance", description: "Review maintenance needs, notes, and follow-up work.", audience: "technician", tags: ["maintenance", "follow-up", "equipment"] },
  { title: "Molds", href: "/molds", category: "Maintenance", description: "Keep mold information, status, and related records easy to find.", audience: "technician", tags: ["molds", "records", "status"] },
  { title: "Mold PM Scheduler", href: "/molds/pm-scheduler", category: "Maintenance", description: "Plan preventive maintenance for molds before problems interrupt production.", audience: "technician", tags: ["pm", "molds", "maintenance"] },
  { title: "Machines", href: "/machines", category: "Maintenance", description: "Review machine information and shop-floor equipment details.", audience: "technician", tags: ["machines", "equipment", "records"] },
  { title: "Mold Change", href: "/mold-change", category: "Maintenance", description: "Follow mold change steps and reduce missed handoff details.", audience: "technician", tags: ["mold change", "handoff", "setup"] },
  { title: "Plant Management", href: "/plant-management", category: "Management", description: "Review core plant management areas without crowding operator tools.", audience: "supervisor", tags: ["management", "plant", "overview"] },
  { title: "KPI Dashboard", href: "/reports/kpi-dashboard", category: "Management", description: "Review key performance indicators for production, quality, and downtime.", audience: "supervisor", tags: ["kpi", "reports", "dashboard"] },
  { title: "Daily Report", href: "/reports/daily", category: "Management", description: "Check daily production, scrap, downtime, and team notes.", audience: "supervisor", tags: ["daily", "reports", "production"] },
  { title: "Weekly Report", href: "/reports/weekly", category: "Management", description: "Review trends and follow-up priorities across the week.", audience: "supervisor", tags: ["weekly", "reports", "trends"] },
  { title: "Actions", href: "/actions", category: "Management", description: "Track practical follow-up items from meetings, problems, and improvement work.", audience: "supervisor", tags: ["actions", "follow-up", "improvement"] },
] as const satisfies readonly ToolMetadata[];

export type ToolHref = (typeof toolRegistry)[number]["href"];

export const toolsByHref = toolRegistry.reduce<Record<string, ToolMetadata>>((tools, tool) => {
  tools[tool.href] = tool;
  return tools;
}, {});

export function getTool(href: string): ToolMetadata {
  const tool = toolsByHref[href];

  if (!tool) {
    throw new Error(`Tool registry entry not found for href: ${href}`);
  }

  return tool;
}

export function getTools(hrefs: readonly string[]): ToolMetadata[] {
  return hrefs.map((href) => getTool(href));
}
