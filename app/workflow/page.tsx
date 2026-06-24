import Link from "next/link";

type WorkflowStep = {
  number: number;
  title: string;
  explanation: string;
  href: string;
  linkLabel: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    number: 1,
    title: "Identify the Defect",
    explanation: "Start by naming what you see on the part so everyone uses the same language before any adjustments are made.",
    href: "/defects",
    linkLabel: "Open Defect Library",
  },
  {
    number: 2,
    title: "Run Quick Checks",
    explanation: "Use a checklist to verify obvious setup, material, mold, machine, and quality items before changing the process.",
    href: "/checklists",
    linkLabel: "Open Troubleshooting Checklists",
  },
  {
    number: 3,
    title: "Review Process Adjustments",
    explanation: "Compare the issue to the process guide so adjustments are made in a safe, controlled order.",
    href: "/process-guide",
    linkLabel: "Open Process Guide",
  },
  {
    number: 4,
    title: "Ask Why",
    explanation: "Work through root cause thinking to understand what changed and avoid treating only the symptom.",
    href: "/root-cause-coach",
    linkLabel: "Open Root Cause Coach",
  },
  {
    number: 5,
    title: "Compare Similar Problems",
    explanation: "Review past examples to learn what other teams checked, changed, and documented when they saw similar defects.",
    href: "/case-studies",
    linkLabel: "Open Case Studies",
  },
  {
    number: 6,
    title: "Save the Lesson",
    explanation: "Capture the defect, cause, correction, and prevention notes so the next person can learn from the fix.",
    href: "/knowledge-vault",
    linkLabel: "Open Knowledge Vault",
  },
  {
    number: 7,
    title: "Communicate to Next Shift",
    explanation: "Leave clear handoff notes about current status, open risks, and what the next shift should watch first.",
    href: "/shift-handoff",
    linkLabel: "Open Shift Handoff Log",
  },
];

const missionItems = [
  "Help People Learn",
  "Help People Troubleshoot",
  "Preserve Knowledge",
  "Support Collaboration",
  "Keep It Simple",
  "People First",
];

export default function WorkflowPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link
          href="/"
          className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
        >
          ← Back home
        </Link>

        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Troubleshooting Workflow Guide</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_0.9fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">Use the tools in the right order.</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                A simple shop-floor path for moving from defect identification to quick checks, root cause thinking, saved knowledge, and shift handoff communication.
              </p>
            </div>
            <div className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-bold leading-6 text-amber-50 sm:p-5">
              Start with what people can see. Verify first. Change carefully. Share what was learned.
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-slate-950/30 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Step-by-step workflow</p>
                <h2 className="mt-2 text-2xl font-black text-white">Follow this sequence when troubleshooting</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-300">
                Each card links to the existing page that supports that part of the workflow.
              </p>
            </div>

            <ol className="mt-6 grid gap-4">
              {workflowSteps.map((step) => (
                <li key={step.number} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-xl font-black text-slate-950 shadow-lg shadow-cyan-950/30">
                      {step.number}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-black text-white sm:text-2xl">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">{step.explanation}</p>
                      <Link
                        href={step.href}
                        className="mt-4 inline-flex w-full items-center justify-between rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/20 focus:outline-none focus:ring-4 focus:ring-cyan-300/20 sm:w-auto sm:gap-8"
                      >
                        <span>{step.linkLabel}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-slate-950/30 lg:sticky lg:top-6 lg:self-start">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Mission alignment</p>
            <h2 className="mt-2 text-2xl font-black text-white">Built for people first</h2>
            <p className="mt-3 text-sm leading-6 text-emerald-50/90">
              This guide keeps troubleshooting simple by helping the team learn, solve problems, preserve lessons, and support the next shift.
            </p>
            <ul className="mt-5 grid gap-2 text-sm font-bold text-emerald-50">
              {missionItems.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </section>
    </main>
  );
}
