"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { LearnMoreAboutThis } from "../../components/LearnMoreAboutThis";
import { RecommendedNextStep } from "../../components/RecommendedNextStep";
import { defectGuides } from "../../lib/defect-data";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type MentorLink = {
  label: string;
  href: string;
};

type KnowledgeItem = {
  keywords: string[];
  defect: string;
  defectSlug: string;
  rootCauses: string[];
  correctiveActions: string[];
  lessons: MentorLink[];
};

const knowledgeBase: KnowledgeItem[] = defectGuides.map((defect) => ({
  keywords: [defect.name.toLowerCase(), defect.slug.replaceAll("-", " "), ...defect.name.toLowerCase().split(" ")],
  defect: defect.name,
  defectSlug: defect.slug,
  rootCauses: defect.causes,
  correctiveActions: defect.actions,
  lessons: [
    { label: "Troubleshooting Assistant", href: "/troubleshooting" },
    { label: "Defect Guide", href: "/defects" },
    { label: "Material Troubleshooter", href: "/materials/troubleshooter" },
  ],
}));

const defaultQuestions = [
  "What changed since the last good parts?",
  "Where is the defect on the part, runner, gate, or cavity layout?",
  "When did it start: startup, after break, after lot change, or during the run?",
  "Can you compare a good part and bad part by weight, dimensions, photos, and cavity number?",
];

const mentorLinks: MentorLink[] = [
  { label: "Defect Library", href: "/defects" },
  { label: "Troubleshooting Wizard", href: "/troubleshooting" },
  { label: "Related lesson", href: "/lessons/process-window" },
  { label: "Lessons Learned", href: "/knowledge-base" },
];

const checkFirstItems = [
  "Look at the part, gate area, runner, vents, and the cavity number before touching the press.",
  "Verify material handling: resin lot, drying, moisture, regrind, color, and contamination risk.",
  "Compare actual readings to the approved process sheet: fill time, cushion, transfer, peak pressure, pack, cooling, and mold water.",
];

const safeFirstActions = [
  "Make one small change at a time and write it down.",
  "Run enough parts to see the real result before making another move.",
  "If the change helps, confirm it with part weight, dimensions, photos, and repeat parts.",
];

function findMatch(problem: string) {
  const normalized = problem.toLowerCase();
  return (
    knowledgeBase.find((item) => item.keywords.some((keyword) => normalized.includes(keyword))) ??
    knowledgeBase[0]
  );
}

function buildCoachReply(problem: string) {
  const match = findMatch(problem);
  const questions = [
    "What changed since the last good parts: material, dryer, color, regrind, mold work, water, setup, or operator coverage?",
    `Where is the ${match.defect.toLowerCase()} showing up: gate, end of fill, parting line, ribs, boss, one cavity, or all cavities?`,
    "When did it start: at startup, after a break, after a lot change, after a process adjustment, or slowly over the run?",
  ];

  return `Simple Summary — What this sounds like
This sounds like ${match.defect.toLowerCase()}. Treat that as a starting point, not a final answer. Prove it with the part, the mold, the material, and the process readings.

Questions to Ask
${questions.map((question, index) => `${index + 1}. ${question}`).join("\n")}

Check First — before changing settings
${checkFirstItems.map((item) => `• ${item}`).join("\n")}

What Not To Change First
• Do not start by chasing random temperatures, speeds, or pressures.
• Do not make big setting changes before you know what changed.
• Do not hide the defect with extra pack, clamp, or heat until you inspect material, mold, and actual readings.

Why This Happens
${match.defect} usually shows up when the plastic, mold, machine, or setup is no longer behaving like the approved process. Common causes include ${match.rootCauses.slice(0, 3).join(", ").toLowerCase()}. Your job is to find the change that made the process unstable.

Safe First Actions
${safeFirstActions.map((action) => `• ${action}`).join("\n")}

Learn More
${mentorLinks.map((link) => `• ${link.label}: ${link.href}`).join("\n")}`;
}

const starterMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Describe the molding problem in plain language. Mentor Mode will answer like an experienced process technician: what it sounds like, what to ask, what to check first, what not to change first, why it happens, and safe first actions.",
  },
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const latestUserProblem = useMemo(
    () => [...messages].reverse().find((message) => message.role === "user")?.content ?? "",
    [messages],
  );
  const matchedGuide = latestUserProblem ? findMatch(latestUserProblem) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    setMessages((current) => [
      ...current,
      { role: "user", content: trimmed },
      { role: "assistant", content: buildCoachReply(trimmed) },
    ]);
    setInput("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            AI Troubleshooting Coach · Mentor Mode
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Learn how to troubleshoot like a process tech
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Enter the symptom you are seeing. The coach explains the next move in simple shop-floor language so newer technicians know what to ask, what to inspect, and what not to change too soon.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4 text-sm leading-6 text-slate-300">
              Mentor Mode is built for safe habits: inspect first, ask what changed, make one change at a time, and prove the result with parts and readings.
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="flex min-h-[34rem] flex-col rounded-3xl border border-white/10 bg-white/10 shadow-xl shadow-slate-950/20 backdrop-blur">
            <div className="border-b border-white/10 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-white">Coach chat</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Try: “We have splay near the gate on cavity 4 after a resin lot change.”
              </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6" aria-live="polite">
              {messages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className={`max-w-[92%] rounded-3xl p-4 text-sm leading-6 sm:text-base ${
                    message.role === "user"
                      ? "ml-auto bg-cyan-300 text-slate-950"
                      : "border border-white/10 bg-slate-900/80 text-slate-200"
                  }`}
                >
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-70">
                    {message.role === "user" ? "Technician" : "Coach"}
                  </p>
                  <div className="whitespace-pre-line">{message.content}</div>
                </article>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-white/10 p-4 sm:p-5">
              <label htmlFor="problem" className="sr-only">
                Describe the molding problem
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  id="problem"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Tell the coach the defect, where it is, when it started, and what changed..."
                  className="min-h-24 flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10 sm:min-h-14"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-cyan-300 px-6 py-3 text-base font-black text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30"
                >
                  Ask mentor
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-cyan-300/20 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
              <h2 className="text-2xl font-bold text-white">Mentor Mode questions</h2>
              <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                {defaultQuestions.map((question, index) => (
                  <li key={question} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>
                    <span>{question}</span>
                  </li>
                ))}
              </ol>
            </section>

            {matchedGuide ? (
              <LearnMoreAboutThis defectSlug={matchedGuide.defectSlug} defectName={matchedGuide.defect} />
            ) : null}

            <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
              <h2 className="text-2xl font-bold text-white">Relevant links</h2>
              <div className="mt-5 flex flex-col gap-3">
                {mentorLinks.map((lesson) => (
                  <Link
                    key={lesson.href}
                    href={lesson.href}
                    className="rounded-2xl border border-cyan-300/30 px-5 py-3 text-center text-base font-bold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10"
                  >
                    {lesson.label}
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <RecommendedNextStep
          label="Lesson Learned"
          href="/knowledge-base"
          reason="When the issue is solved, save what happened, what caused it, and what fixed it so the next technician can find it faster."
          related={[{ label: "Knowledge Search", href: "/knowledge-search" }, { label: "Troubleshooting Wizard", href: "/troubleshooting" }]}
        />
      </div>
    </main>
  );
}
