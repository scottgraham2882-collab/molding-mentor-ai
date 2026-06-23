export type NextStepContext =
  | "defect-flash"
  | "defect-short-shot"
  | "defect-default"
  | "troubleshooting-short-shot"
  | "troubleshooting-default"
  | "photo-analysis"
  | "case-study"
  | "learning-path-lesson";

export type NextStepRecommendation = {
  label: string;
  href: string;
  helper: string;
};

const nextStepRecommendations: Record<NextStepContext, NextStepRecommendation[]> = {
  "defect-flash": [
    { label: "Open Flash Troubleshooting", href: "/troubleshooting", helper: "Walk through safe checks for parting line, clamp, pack, and mold condition." },
    { label: "Learn Why Flash Happens", href: "/defects#flash", helper: "Review the common causes before changing press settings." },
    { label: "Ask Molding Coach", href: "/coach", helper: "Ask a plain-language follow-up when the next check is unclear." },
  ],
  "defect-short-shot": [
    { label: "View Short Shot Defect Guide", href: "/defects#short-shots", helper: "Review symptoms, likely causes, and safe first checks." },
    { label: "Learn Fill Studies", href: "/scientific-molding/studies", helper: "See how fill studies reveal the true fill pattern." },
    { label: "Search Similar Cases", href: "/case-studies", helper: "Look for saved problems with similar material, mold, or symptoms." },
  ],
  "defect-default": [
    { label: "Open Troubleshooting", href: "/troubleshooting", helper: "Use guided questions to choose the first safe check." },
    { label: "Ask Molding Coach", href: "/coach", helper: "Get beginner-friendly help for the defect you are seeing." },
    { label: "Search Similar Cases", href: "/case-studies", helper: "Compare this issue with lessons already captured by the team." },
  ],
  "troubleshooting-short-shot": [
    { label: "View Short Shot Defect Guide", href: "/defects#short-shots", helper: "Confirm the symptom and review common first checks." },
    { label: "Learn Fill Studies", href: "/scientific-molding/studies", helper: "Use a fill pattern to see where the part stops filling." },
    { label: "Search Similar Cases", href: "/case-studies", helper: "Find past short-shot examples and what fixed them." },
  ],
  "troubleshooting-default": [
    { label: "Open Defect Library", href: "/defects", helper: "Compare the likely defect against other common symptoms." },
    { label: "Ask Molding Coach", href: "/coach", helper: "Talk through the result before making process changes." },
    { label: "View Related Case Studies", href: "/case-studies", helper: "Look for similar troubleshooting stories from the floor." },
  ],
  "photo-analysis": [
    { label: "Open Defect Library", href: "/defects", helper: "Match the photo result to a simple defect guide." },
    { label: "Ask Molding Coach", href: "/coach", helper: "Ask what to check next based on what you see." },
    { label: "View Related Case Studies", href: "/case-studies", helper: "Compare the photo review with saved shop-floor examples." },
  ],
  "case-study": [
    { label: "View Related Lessons Learned", href: "/knowledge-base", helper: "Turn the case into reusable coaching notes." },
    { label: "Search Similar Problems", href: "/knowledge-search", helper: "Find matching defects, materials, molds, or process notes." },
  ],
  "learning-path-lesson": [
    { label: "Continue Learning Path", href: "/learning-paths", helper: "Move to the next lesson when this one is clear." },
    { label: "Take Knowledge Check", href: "/scenarios", helper: "Practice with shop-floor scenarios to test understanding." },
  ],
};

export function getRecommendedNextSteps(context: NextStepContext): NextStepRecommendation[] {
  return nextStepRecommendations[context].slice(0, 3);
}

export function getDefectNextStepContext(defectSlug?: string): NextStepContext {
  if (defectSlug === "flash") return "defect-flash";
  if (defectSlug === "short-shots" || defectSlug === "short-shot") return "defect-short-shot";
  return "defect-default";
}

export function getTroubleshootingNextStepContext(defectSlug?: string): NextStepContext {
  return defectSlug === "short-shots" || defectSlug === "short-shot" ? "troubleshooting-short-shot" : "troubleshooting-default";
}
