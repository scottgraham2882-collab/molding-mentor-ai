import Link from "next/link";

import { DefectEducationPanels } from "../../components/DefectEducationPanels";
import { RecommendedNextSteps } from "../../components/RecommendedNextSteps";
import { defectGuides } from "../../lib/defect-data";

const intakeQuestions = [
  "What defect are you seeing, and where does it appear on the part?",
  "When did the issue start: material lot change, tool maintenance, setup change, or gradual drift?",
  "Which resin, colorant, regrind level, dryer settings, and moisture checks are in use?",
  "What are the current fill, transfer, pack, cooling, clamp, and cushion readings?",
];

const troubleshootingSteps = [
  {
    title: "Define the symptom",
    detail:
      "Capture photos, part locations, cavity numbers, frequency, and a pass/fail boundary before changing settings.",
  },
  {
    title: "Stabilize the baseline",
    detail:
      "Confirm the setup sheet, material preparation, water circuits, clamp condition, and machine alarms match the approved process.",
  },
  {
    title: "Isolate the process window",
    detail:
      "Check fill-only parts, transfer position, cushion, peak pressure, gate seal, and cooling balance to separate fill, pack, and cooling causes.",
  },
  {
    title: "Change one variable",
    detail:
      "Make one controlled adjustment at a time, document the result, and return to baseline if the change does not improve the measured defect.",
  },
];

const quickPaths = defectGuides.map((defect) => ({
  symptom: defect.name,
  slug: defect.slug,
  action: `Check first: ${defect.checkFirst[0]} Corrective action: ${defect.actions[0]}`,
  defect,
}));

export default function TroubleshootingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Troubleshooting Assistant
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Guided molding problem solver
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Work through a structured troubleshooting flow that keeps the current Defect Library intact while helping technicians collect the right evidence, prioritize likely causes, and validate changes.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4 text-sm leading-6 text-slate-300">
              Start with observations and process data, then use the Defect Library to compare symptom-specific causes and corrective actions.
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_22rem]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <h2 className="text-2xl font-bold text-white">Assistant intake checklist</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
              Gather these inputs before deciding whether the next move belongs in material handling, machine setup, tooling, or part design.
            </p>
            <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300 sm:text-base">
              {intakeQuestions.map((question, index) => (
                <li key={question} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ol>
          </div>

          <aside className="rounded-3xl border border-cyan-300/20 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
            <h2 className="text-2xl font-bold text-white">Helpful links</h2>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/defects"
                className="rounded-2xl border border-cyan-300/30 px-5 py-3 text-center text-base font-bold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10"
              >
                Open Defect Library
              </Link>
              <Link
                href="/"
                className="rounded-2xl border border-white/10 px-5 py-3 text-center text-base font-bold text-slate-100 transition hover:border-white/30 hover:bg-white/10"
              >
                Return to Home
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {troubleshootingSteps.map((step) => (
            <article
              key={step.title}
              className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6"
            >
              <h2 className="text-xl font-bold text-white">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{step.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
          <h2 className="text-2xl font-bold text-white">Quick symptom paths</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {quickPaths.map((path) => (
              <article key={path.symptom} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <h3 className="text-lg font-bold text-cyan-200">{path.symptom}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{path.action}</p>
                <DefectEducationPanels defect={path.defect} compact />
                <div className="mt-4">
                  <RecommendedNextSteps defectSlug={path.slug} contextLabel={`${path.symptom} troubleshooting`} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
