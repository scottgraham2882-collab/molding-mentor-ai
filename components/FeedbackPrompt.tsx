"use client";

import { useState } from "react";

export type FeedbackResponse = "yes" | "no";

export type StoredFeedback = {
  id: string;
  page: string;
  response: FeedbackResponse;
  comment: string;
  createdAt: string;
};

export const FEEDBACK_STORAGE_KEY = "moldingMentorFeedback";

export function readStoredFeedback(): StoredFeedback[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is StoredFeedback =>
            typeof item?.id === "string" &&
            typeof item?.page === "string" &&
            (item?.response === "yes" || item?.response === "no") &&
            typeof item?.comment === "string" &&
            typeof item?.createdAt === "string",
        )
      : [];
  } catch {
    return [];
  }
}

function saveStoredFeedback(entry: StoredFeedback) {
  const current = readStoredFeedback();
  window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify([entry, ...current]));
}

export function FeedbackPrompt({ page }: { page: string }) {
  const [response, setResponse] = useState<FeedbackResponse | null>(null);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);

  function chooseResponse(nextResponse: FeedbackResponse) {
    setResponse(nextResponse);
    setSaved(false);
    setComment("");
  }

  function handleSave() {
    if (!response) return;

    saveStoredFeedback({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      page,
      response,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
  }

  return (
    <section className="mt-6 rounded-3xl border border-cyan-300/20 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/20 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Quick feedback</p>
          <h2 className="mt-2 text-2xl font-black text-white">Did this help?</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-auto">
          <button
            type="button"
            onClick={() => chooseResponse("yes")}
            className={`rounded-2xl px-5 py-3 text-base font-black transition ${
              response === "yes" ? "bg-emerald-300 text-slate-950" : "border border-emerald-300/30 text-emerald-100 hover:bg-emerald-300/10"
            }`}
          >
            👍 Yes
          </button>
          <button
            type="button"
            onClick={() => chooseResponse("no")}
            className={`rounded-2xl px-5 py-3 text-base font-black transition ${
              response === "no" ? "bg-rose-300 text-slate-950" : "border border-rose-300/30 text-rose-100 hover:bg-rose-300/10"
            }`}
          >
            👎 No
          </button>
        </div>
      </div>

      {response ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <label htmlFor={`feedback-${page}`} className="text-sm font-bold text-slate-100">
            {response === "yes" ? "What was helpful?" : "What were you looking for?"}
          </label>
          <textarea
            id={`feedback-${page}`}
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
              setSaved(false);
            }}
            placeholder="Optional — a few words is enough."
            className="mt-3 min-h-24 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
          />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
            >
              Save feedback
            </button>
            {saved ? <p className="text-sm font-bold text-emerald-300">Thanks — saved on this device.</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
