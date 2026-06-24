export type LearningEventType =
  | "troubleshooting_case"
  | "user_feedback"
  | "defect_selection"
  | "photo_analysis_result"
  | "ai_coach_question"
  | "lesson_learned";

export type LearningEvent = {
  id: string;
  type: LearningEventType;
  tool: string;
  title: string;
  summary?: string;
  defect?: string;
  feedbackResponse?: "yes" | "no";
  metadata?: Record<string, string | number | boolean | null | string[]>;
  createdAt: string;
};

export const LEARNING_DATA_STORAGE_KEY = "moldingMentorLearningEvents";

function isLearningEventType(value: unknown): value is LearningEventType {
  return (
    value === "troubleshooting_case" ||
    value === "user_feedback" ||
    value === "defect_selection" ||
    value === "photo_analysis_result" ||
    value === "ai_coach_question" ||
    value === "lesson_learned"
  );
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isLearningEvent(item: unknown): item is LearningEvent {
  if (!item || typeof item !== "object") return false;

  const event = item as Partial<LearningEvent>;
  return (
    typeof event.id === "string" &&
    isLearningEventType(event.type) &&
    typeof event.tool === "string" &&
    typeof event.title === "string" &&
    typeof event.createdAt === "string" &&
    (event.summary === undefined || typeof event.summary === "string") &&
    (event.defect === undefined || typeof event.defect === "string") &&
    (event.feedbackResponse === undefined || event.feedbackResponse === "yes" || event.feedbackResponse === "no")
  );
}

export function getLearningEvents(): LearningEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(LEARNING_DATA_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter(isLearningEvent) : [];
  } catch {
    return [];
  }
}

export function saveLearningEvent(event: Omit<LearningEvent, "id" | "createdAt"> & Partial<Pick<LearningEvent, "id" | "createdAt">>) {
  if (typeof window === "undefined") return null;

  const nextEvent: LearningEvent = {
    ...event,
    id: event.id ?? createId(),
    createdAt: event.createdAt ?? new Date().toISOString(),
  };

  const current = getLearningEvents();
  window.localStorage.setItem(LEARNING_DATA_STORAGE_KEY, JSON.stringify([nextEvent, ...current].slice(0, 250)));
  return nextEvent;
}

export function clearLearningEvents() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LEARNING_DATA_STORAGE_KEY);
}

export function filterLearningEventsByType(type: LearningEventType) {
  return getLearningEvents().filter((event) => event.type === type);
}
