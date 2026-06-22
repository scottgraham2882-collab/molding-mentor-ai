"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type KnowledgeItem = {
  keywords: string[];
  defect: string;
  rootCauses: string[];
  correctiveActions: string[];
  lessons: { label: string; href: string }[];
};

const knowledgeBase: KnowledgeItem[] = [
  {
    keywords: ["short", "not filling", "incomplete", "underfill"],
    defect: "Short shot / incomplete fill",
    rootCauses: [
      "Melt is freezing before end of fill because temperature, speed, or pressure is too low.",
      "Material feed, check ring recovery, gates, runners, or vents are restricting flow.",
      "The shot size, transfer position, or cushion does not leave enough plastic to pack the cavity.",
    ],
    correctiveActions: [
      "Confirm material feed and cushion repeatability, then increase shot size or transfer later in small steps.",
      "Raise injection speed or pressure limit only after verifying the process is pressure-limited.",
      "Inspect blocked gates, cold runners, check ring wear, and end-of-fill vents before chasing settings.",
    ],
    lessons: [
      { label: "Process Window Lesson", href: "/lessons/process-window" },
      { label: "Defect Guide", href: "/defects" },
      { label: "Shot Size Calculator", href: "/calculators/shot-size" },
    ],
  },
  {
    keywords: ["flash", "burr", "parting", "overflow"],
    defect: "Flash",
    rootCauses: [
      "Clamp force or shutoff condition is not holding back cavity pressure.",
      "Pack pressure, transfer position, or injection speed is driving peak cavity pressure too high.",
      "Parting line, vent lands, inserts, or ejector pin areas are worn, dirty, damaged, or misaligned.",
    ],
    correctiveActions: [
      "Inspect and clean parting-line shutoffs, vents, inserts, and ejector areas before reducing pack.",
      "Verify clamp tonnage and mold alignment, then reduce pack pressure or transfer earlier in measured steps.",
      "Use fill-only parts to separate fill pressure from pack pressure and avoid creating short shots.",
    ],
    lessons: [
      { label: "Clamp Tonnage Calculator", href: "/calculators/clamp-tonnage" },
      { label: "Decoupled Molding Lesson", href: "/lessons/decoupled-molding-1" },
      { label: "Defect Guide", href: "/defects" },
    ],
  },
  {
    keywords: ["sink", "void", "depression", "shrink"],
    defect: "Sink marks / void risk",
    rootCauses: [
      "The gate may be freezing before adequate pack pressure reaches thick sections.",
      "Ribs, bosses, or wall transitions are cooling slower than nearby nominal walls.",
      "Pack pressure, pack time, melt temperature, mold temperature, or cooling time is not balanced.",
    ],
    correctiveActions: [
      "Run or review a gate-seal study, then increase pack time only until the gate is sealed.",
      "Increase pack pressure in controlled increments while watching part weight, flash, and dimensions.",
      "Check cooling flow around thick sections and review rib, boss, and wall-thickness design rules.",
    ],
    lessons: [
      { label: "Gate Seal Study", href: "/lessons/gate-seal-study" },
      { label: "Cycle Time Calculator", href: "/calculators/cycle-time" },
      { label: "Defect Guide", href: "/defects" },
    ],
  },
  {
    keywords: ["splay", "streak", "silver", "moisture", "bubbles"],
    defect: "Splay / streaking / bubbles",
    rootCauses: [
      "Resin moisture, volatile contamination, colorant, or regrind variation is entering the melt stream.",
      "Excess decompression, poor feed-throat control, or turbulent flow is entraining air.",
      "Screw speed, back pressure, residence time, or melt temperature is degrading the material.",
    ],
    correctiveActions: [
      "Verify dryer temperature, dew point, drying time, material path, and moisture readings before changing the mold process.",
      "Reduce suck-back, stabilize feed, and check for contamination or mixed resin at the hopper and loader.",
      "Lower shear sources such as screw speed, back pressure, or aggressive fill speed if drying checks pass.",
    ],
    lessons: [
      { label: "Resin Drying Guide", href: "/materials/resin-drying" },
      { label: "Material Troubleshooter", href: "/materials/troubleshooter" },
      { label: "Defect Guide", href: "/defects" },
    ],
  },
  {
    keywords: ["warp", "warpage", "bow", "twist", "dimension"],
    defect: "Warpage / dimensional movement",
    rootCauses: [
      "Cooling is unbalanced across the mold, cavities, or part wall sections.",
      "Pack profile, gate location, fiber orientation, or wall thickness is creating uneven shrinkage.",
      "Parts are being ejected too hot or stressed by ejection, handling, or fixture conditions.",
    ],
    correctiveActions: [
      "Compare coolant temperature, flow, and circuit cleanliness before changing pack or cooling time.",
      "Adjust pack profile and cooling time while tracking dimensions at a consistent time after molding.",
      "Review wall thickness, ribs, gate location, and fiber direction if process changes cannot stabilize the part.",
    ],
    lessons: [
      { label: "Process Window Lesson", href: "/lessons/process-window" },
      { label: "Cycle Time Calculator", href: "/calculators/cycle-time" },
      { label: "Defect Guide", href: "/defects" },
    ],
  },
  {
    keywords: ["burn", "char", "black", "diesel", "speck"],
    defect: "Burn marks / black specks",
    rootCauses: [
      "Trapped air or gas is compressing at end of fill because venting is poor or blocked.",
      "Shear heat from high injection speed, screw speed, back pressure, or restrictive gates is degrading resin.",
      "Residence time, barrel temperature, dead spots, or contamination is producing degraded material.",
    ],
    correctiveActions: [
      "Clean and inspect vents at end-of-fill locations, then confirm they are not blocked by flash or residue.",
      "Reduce shear contributors in one-variable steps and check whether burn location follows flow-end gas traps.",
      "Purge, verify barrel temperature profile, reduce residence time, and inspect hot runner or screw dead spots.",
    ],
    lessons: [
      { label: "Material Troubleshooter", href: "/materials/troubleshooter" },
      { label: "Decoupled Molding Lesson", href: "/lessons/decoupled-molding-1" },
      { label: "Defect Guide", href: "/defects" },
    ],
  },
];

const defaultQuestions = [
  "Which defect is visible, and where does it appear on the part or cavity layout?",
  "Did the issue start after a resin lot, colorant, regrind, dryer, tool, or setup change?",
  "What changed in fill time, transfer position, cushion, peak pressure, pack, cooling, or clamp readings?",
  "Can you compare a good part and bad part by weight, dimensions, photos, and cavity number?",
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
    `For ${match.defect.toLowerCase()}, what cavity, location, and frequency are you seeing?`,
    "What are the current fill time, transfer position, cushion, peak pressure, pack pressure/time, and cooling time readings?",
    "Did the symptom appear after a material, dryer, mold maintenance, water, machine, or setup change?",
  ];

  return `Likely defect: ${match.defect}\n\nTroubleshooting questions:\n${questions
    .map((question, index) => `${index + 1}. ${question}`)
    .join("\n")}\n\nPossible root causes:\n${match.rootCauses
    .map((cause) => `• ${cause}`)
    .join("\n")}\n\nRecommended corrective actions:\n${match.correctiveActions
    .map((action) => `• ${action}`)
    .join("\n")}\n\nNext step: change one variable at a time, document the result, and use the linked lessons below to validate the cause before locking in a new setup.`;
}

const starterMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Describe the molding problem in plain language. I will ask troubleshooting questions, suggest likely root causes, recommend corrective actions, and point you to relevant lessons and guides.",
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
            AI Troubleshooting Coach
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Chat through a molding problem
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Enter the symptom you are seeing. The coach will ask targeted questions, rank likely root causes, recommend corrective actions, and connect you to relevant training and defect guides.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4 text-sm leading-6 text-slate-300">
              Use the response as a troubleshooting checklist. Validate every change with part data, process readings, and one-variable-at-a-time discipline.
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
                  placeholder="Describe defect, location, timing, material, and process readings..."
                  className="min-h-24 flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10 sm:min-h-14"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-cyan-300 px-6 py-3 text-base font-black text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30"
                >
                  Ask coach
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-cyan-300/20 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
              <h2 className="text-2xl font-bold text-white">Start with these questions</h2>
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

            <section className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
              <h2 className="text-2xl font-bold text-white">Relevant links</h2>
              <div className="mt-5 flex flex-col gap-3">
                {(matchedGuide?.lessons ?? [
                  { label: "Defect Guide", href: "/defects" },
                  { label: "Troubleshooting Assistant", href: "/troubleshooting" },
                  { label: "Lessons", href: "/lessons" },
                ]).map((lesson) => (
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
      </div>
    </main>
  );
}
