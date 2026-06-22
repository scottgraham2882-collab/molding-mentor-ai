export type QuizScore = {
  lesson: string;
  score: number;
  takenOn: string;
};

export type Certification = {
  title: string;
  earnedOn?: string;
  progress: number;
};

export type CalculatorHistoryItem = {
  calculator: string;
  input: string;
  result: string;
  usedOn: string;
};

export type CoachConversation = {
  topic: string;
  summary: string;
  updatedOn: string;
};

export type UserProgress = {
  completedLessons: string[];
  totalLessons: number;
  quizScores: QuizScore[];
  certifications: Certification[];
  calculatorHistory: CalculatorHistoryItem[];
  coachConversations: CoachConversation[];
};

export const demoProgress: UserProgress = {
  completedLessons: [
    "Operator Safety & Startup",
    "Process Window",
    "Gate Seal Study",
    "Decoupled Molding I",
  ],
  totalLessons: 7,
  quizScores: [
    { lesson: "Operator Safety & Startup", score: 96, takenOn: "Jun 12" },
    { lesson: "Process Window", score: 88, takenOn: "Jun 18" },
    { lesson: "Gate Seal Study", score: 91, takenOn: "Jun 20" },
  ],
  certifications: [
    { title: "Injection Molding Operator Level 1", earnedOn: "Jun 21", progress: 100 },
    { title: "Defect Recognition Specialist", progress: 78 },
    { title: "Setup Technician Level 1", progress: 64 },
  ],
  calculatorHistory: [
    { calculator: "Clamp tonnage", input: "Projected area: 42 in²", result: "126 tons", usedOn: "Today" },
    { calculator: "Shot size", input: "Part + runner: 3.4 oz", result: "68% barrel use", usedOn: "Jun 20" },
    { calculator: "Cycle time", input: "Wall: 0.110 in", result: "31 sec estimate", usedOn: "Jun 19" },
  ],
  coachConversations: [
    { topic: "Splay near gate", summary: "Checked drying, suck-back, and lot change evidence.", updatedOn: "Today" },
    { topic: "Flash at parting line", summary: "Reviewed clamp force, transfer, and vent cleanliness.", updatedOn: "Jun 19" },
  ],
};

export function getProgressSummary(progress: UserProgress = demoProgress) {
  const completedLessons = progress.completedLessons.length;
  const lessonsRemaining = Math.max(progress.totalLessons - completedLessons, 0);
  const trainingProgress = Math.round((completedLessons / progress.totalLessons) * 100);
  const certificationsEarned = progress.certifications.filter((certification) => certification.earnedOn).length;

  return {
    completedLessons,
    lessonsRemaining,
    trainingProgress,
    certificationsEarned,
  };
}
