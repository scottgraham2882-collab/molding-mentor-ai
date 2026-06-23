"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type LearningPath = {
  title: string;
  helper: string;
  lessons: string[];
  accent: string;
};

const STORAGE_KEY = "moldingMentorLearningPathProgress";

const learningPaths: LearningPath[] = [
  {
    title: "Operator Path",
    helper: "Start here if you run presses, check parts, or report problems.",
    accent: "from-cyan-300 to-emerald-400",
    lessons: ["Injection Molding Basics", "Safety", "Defect Recognition", "Basic Troubleshooting", "Quality Checks"],
  },
  {
    title: "Setup Technician Path",
    helper: "Use this path to learn safe mold changes and clean startups.",
    accent: "from-emerald-300 to-cyan-400",
    lessons: ["Mold Components", "Mold Change Process", "Startup Procedures", "First Piece Approval", "Process Documentation"],
  },
  {
    title: "Process Technician Path",
    helper: "Build process knowledge one study at a time.",
    accent: "from-violet-300 to-cyan-400",
    lessons: [
      "Scientific Molding Fundamentals",
      "Fill Studies",
      "Pack/Hold Studies",
      "Gate Seal Studies",
      "Defect Root Cause Analysis",
      "Process Optimization",
    ],
  },
  {
    title: "Supervisor Path",
    helper: "Learn how to support people, reduce waste, and pass knowledge forward.",
    accent: "from-amber-300 to-cyan-400",
    lessons: ["Production Fundamentals", "Downtime Reduction", "Scrap Reduction", "Coaching Employees", "Knowledge Transfer"],
  },
];

function lessonId(pathTitle: string, lesson: string) {
  return `${pathTitle}:${lesson}`;
}

function getStoredProgress() {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function LearningPathsPage() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    setCompletedLessons(getStoredProgress());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLessons));
  }, [completedLessons]);

  const completedSet = useMemo(() => new Set(completedLessons), [completedLessons]);
  const totalLessons = learningPaths.reduce((total, path) => total + path.lessons.length, 0);
  const completedTotal = learningPaths.reduce(
    (total, path) => total + path.lessons.filter((lesson) => completedSet.has(lessonId(path.title, lesson))).length,
    0,
  );
  const nextRecommendation = learningPaths
    .flatMap((path) => path.lessons.map((lesson) => ({ path: path.title, lesson, id: lessonId(path.title, lesson) })))
    .find((item) => !completedSet.has(item.id));

  function toggleLesson(id: string) {
    setCompletedLessons((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function resetProgress() {
    setCompletedLessons([]);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Guided Learning Paths</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Learn injection molding in the right order
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Pick the role closest to your job. Finish one lesson at a time, mark it complete, and come back later. Your progress is saved on this device.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4">
              <p className="text-sm font-bold text-cyan-100">Overall progress</p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-300 transition-all"
                  style={{ width: `${Math.round((completedTotal / totalLessons) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {completedTotal} of {totalLessons} lessons complete
              </p>
            </div>
            <button
              type="button"
              onClick={resetProgress}
              className="rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              Reset progress
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
            <span className="font-black">Recommended next lesson: </span>
            {nextRecommendation ? `${nextRecommendation.lesson} (${nextRecommendation.path})` : "All paths are complete. Great work!"}
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {learningPaths.map((path) => {
            const completedCount = path.lessons.filter((lesson) => completedSet.has(lessonId(path.title, lesson))).length;
            const percentComplete = Math.round((completedCount / path.lessons.length) * 100);
            const nextLesson = path.lessons.find((lesson) => !completedSet.has(lessonId(path.title, lesson)));

            return (
              <article key={path.title} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
                <div className={`h-2 rounded-full bg-gradient-to-r ${path.accent}`} />
                <h2 className="mt-5 text-2xl font-black text-white">{path.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{path.helper}</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-slate-100">Path progress</span>
                    <span className="text-slate-300">{percentComplete}%</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full bg-gradient-to-r ${path.accent}`} style={{ width: `${percentComplete}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-slate-300">Next: {nextLesson ?? "Path complete"}</p>
                </div>
                <ol className="mt-5 space-y-3">
                  {path.lessons.map((lesson, index) => {
                    const id = lessonId(path.title, lesson);
                    const isComplete = completedSet.has(id);
                    return (
                      <li key={lesson}>
                        <button
                          type="button"
                          onClick={() => toggleLesson(id)}
                          className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                            isComplete
                              ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-50"
                              : "border-white/10 bg-slate-900/70 text-slate-200 hover:border-cyan-300/40"
                          }`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-black">
                            {isComplete ? "✓" : index + 1}
                          </span>
                          <span>
                            <span className="block font-bold">{lesson}</span>
                            <span className="mt-1 block text-xs text-slate-400">Tap to mark {isComplete ? "not complete" : "complete"}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
