"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getTool } from "../../lib/tool-registry";

type ShopRole = "Operator" | "Process Technician" | "Supervisor" | "Manager";
type HelpNeed =
  | "Troubleshoot a part defect"
  | "Learn molding basics"
  | "Run production"
  | "Check quality"
  | "Manage training"
  | "View reports";

type RecommendedTool = {
  title: string;
  href: string;
  plainText: string;
};

const recommendation = (href: string, plainText?: string): RecommendedTool => {
  const tool = getTool(href);

  return {
    title: tool.title,
    href: tool.href,
    plainText: plainText ?? tool.description,
  };
};

const roleStorageKey = "moldingMentorSelectedRole";

const roles: ShopRole[] = ["Operator", "Process Technician", "Supervisor", "Manager"];
const needs: HelpNeed[] = [
  "Troubleshoot a part defect",
  "Learn molding basics",
  "Run production",
  "Check quality",
  "Manage training",
  "View reports",
];

const toolMap: Record<HelpNeed, RecommendedTool[]> = {
  "Troubleshoot a part defect": [
    recommendation("/troubleshooting", "Answer simple questions and get likely causes."),
    recommendation("/defects", "Match the part problem to common fixes."),
    recommendation("/photo-analysis"),
  ],
  "Learn molding basics": [
    recommendation("/training/operator-safety-startup"),
    recommendation("/lessons", "Learn the molding ideas in short lessons."),
    recommendation("/lessons/process-window"),
  ],
  "Run production": [
    recommendation("/production/live-board", "See what is running and what needs attention."),
    recommendation("/startup-approval", "Check the job before full production."),
    recommendation("/shift-handoff", "Pass clear notes to the next shift."),
  ],
  "Check quality": [
    recommendation("/quality/first-piece-approval", "Confirm the first good parts before running."),
    recommendation("/quality/containment", "Control suspect parts and keep them separated."),
    recommendation("/quality/corrective-action", "Track the fix so the issue does not repeat."),
  ],
  "Manage training": [
    recommendation("/training/assignments", "Give people the right training work."),
    recommendation("/training/skills-matrix", "See who is trained and where gaps exist."),
    recommendation("/training/plan-builder", "Build a simple plan for each employee."),
  ],
  "View reports": [
    recommendation("/reports/kpi-dashboard", "Review the main plant numbers."),
    recommendation("/reports/daily", "Check today’s production, scrap, downtime, and notes."),
    recommendation("/reports/weekly", "Review trends for the week."),
  ],
};

const roleStarterNeed: Record<ShopRole, HelpNeed> = {
  Operator: "Troubleshoot a part defect",
  "Process Technician": "Troubleshoot a part defect",
  Supervisor: "Run production",
  Manager: "View reports",
};

export default function StartHerePage() {
  const [selectedRole, setSelectedRole] = useState<ShopRole>("Operator");
  const [selectedNeed, setSelectedNeed] = useState<HelpNeed>("Troubleshoot a part defect");

  useEffect(() => {
    const savedRole = window.localStorage.getItem(roleStorageKey);

    if (savedRole && roles.includes(savedRole as ShopRole)) {
      const role = savedRole as ShopRole;
      setSelectedRole(role);
      setSelectedNeed(roleStarterNeed[role]);
    }
  }, []);

  const recommendedTools = useMemo(() => toolMap[selectedNeed], [selectedNeed]);

  const chooseRole = (role: ShopRole) => {
    setSelectedRole(role);
    setSelectedNeed(roleStarterNeed[role]);
    window.localStorage.setItem(roleStorageKey, role);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <Link href="/" className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-cyan-100">
          ← Back home
        </Link>

        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Start Here</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Let’s find your first tools.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Pick your job and the problem in front of you. We will point you to three safe tools to open first, with no molding experience required.
          </p>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-4 sm:p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Step 1</p>
          <h2 className="mt-2 text-2xl font-black text-white">What is your role?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300"><strong className="text-slate-100">What is this?</strong> Choose the job closest to what you do today. This only changes the recommendations on this page.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                aria-pressed={selectedRole === role}
                onClick={() => chooseRole(role)}
                className={`rounded-2xl border p-4 text-left text-lg font-black transition focus:outline-none focus:ring-4 focus:ring-emerald-300/20 ${
                  selectedRole === role
                    ? "border-emerald-200 bg-emerald-300 text-slate-950"
                    : "border-white/10 bg-slate-950/70 text-white hover:border-emerald-300/60"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm font-bold text-slate-300">Saved on this device: {selectedRole}</p>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-4 sm:p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Step 2</p>
          <h2 className="mt-2 text-2xl font-black text-white">What do you need help with?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300"><strong className="text-slate-100">Example:</strong> choose “Troubleshoot a part defect” for flash, short shots, splay, burns, sinks, or warped parts.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {needs.map((need) => (
              <button
                key={need}
                type="button"
                aria-pressed={selectedNeed === need}
                onClick={() => setSelectedNeed(need)}
                className={`rounded-2xl border p-4 text-left text-base font-black transition focus:outline-none focus:ring-4 focus:ring-cyan-300/20 ${
                  selectedNeed === need
                    ? "border-cyan-200 bg-cyan-300 text-slate-950"
                    : "border-white/10 bg-slate-950/70 text-white hover:border-cyan-300/60"
                }`}
              >
                {need}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-amber-300/30 bg-gradient-to-br from-amber-300/15 via-slate-900 to-cyan-300/10 p-4 shadow-2xl shadow-amber-950/20 sm:p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">Step 3</p>
          <h2 className="mt-2 text-2xl font-black text-white">Open these 3 first</h2>
          <p className="mt-2 text-sm leading-6 text-amber-50/90"><strong>What is this?</strong> Start with Tool 1, then use Tool 2 or 3 if you still need help. Do not change machine settings until you understand what changed.</p>
          <p className="mt-2 text-sm leading-6 text-amber-50/90">Based on: {selectedRole} · {selectedNeed}</p>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {recommendedTools.map((tool, index) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex min-h-44 flex-col justify-between rounded-3xl border border-white/10 bg-slate-950/75 p-5 shadow-xl shadow-slate-950/30 transition hover:-translate-y-0.5 hover:border-amber-200/70 focus:outline-none focus:ring-4 focus:ring-amber-300/20"
              >
                <div>
                  <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">Tool {index + 1}</span>
                  <h3 className="mt-4 text-xl font-black text-white">{tool.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{tool.plainText}</p>
                </div>
                <p className="mt-5 flex items-center justify-between text-sm font-black text-cyan-100">
                  <span>Open this tool</span>
                  <span aria-hidden="true">→</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
