"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  getSimulationCorrectCount,
  getSimulationProgressPercent,
  getSimulationStepLabel,
  type SimulationScenario,
} from "../lib/simulation-framework";

type SimulationRunnerProps = {
  scenario: SimulationScenario;
};

export function SimulationRunner({ scenario }: SimulationRunnerProps) {
  const totalSteps = scenario.steps.length;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([]);

  const isSummaryVisible = currentStepIndex === totalSteps;
  const currentStep = scenario.steps[Math.min(currentStepIndex, totalSteps - 1)];
  const selectedChoiceId = selectedChoiceIds[currentStepIndex];
  const selectedChoice = currentStep.choices.find((choice) => choice.id === selectedChoiceId);
  const previousChoice = currentStepIndex > 0
    ? scenario.steps[currentStepIndex - 1].choices.find((choice) => choice.id === selectedChoiceIds[currentStepIndex - 1])
    : undefined;
  const branchingCoachNote = previousChoice && !previousChoice.correct
    ? `Branch correction: ${currentStep.coachNote}`
    : currentStep.coachNote;
  const currentStepLabel = getSimulationStepLabel(currentStepIndex, totalSteps);
  const progressPercent = getSimulationProgressPercent(currentStepIndex, totalSteps);

  const correctCount = useMemo(
    () => getSimulationCorrectCount(scenario, selectedChoiceIds),
    [scenario, selectedChoiceIds],
  );

  function chooseAnswer(choiceId: string) {
    if (selectedChoiceId) {
      return;
    }

    setSelectedChoiceIds((answers) => [...answers, choiceId]);
  }

  function goNext() {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((step) => step + 1);
      return;
    }

    setCurrentStepIndex(totalSteps);
  }

  function resetSimulator() {
    setCurrentStepIndex(0);
    setSelectedChoiceIds([]);
  }

  function renderSummaryText(template: string) {
    return template
      .replace("{correctCount}", String(correctCount))
      .replace("{totalSteps}", String(totalSteps));
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-200 transition hover:bg-cyan-300/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/20">
            ← Back home
          </Link>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">{scenario.eyebrow}</p>
          <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{scenario.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{scenario.description}</p>
            </div>
            <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
              {scenario.introDetails.map((detail) => (
                <p key={detail.label}><span className="font-black">{detail.label}:</span> {detail.value}</p>
              ))}
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/30 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Step {currentStepLabel} of {totalSteps}</p>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 sm:max-w-xs" aria-label={`Progress: step ${currentStepLabel} of ${totalSteps}`}>
              <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {!isSummaryVisible ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
              <div>
                <p className="text-sm font-bold leading-6 text-amber-100">{branchingCoachNote}</p>
                <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">{currentStep.question}</h2>
                <div className="mt-5 grid gap-3">
                  {currentStep.choices.map((choice) => {
                    const isSelected = selectedChoiceId === choice.id;
                    const answerStyle = !selectedChoiceId
                      ? "border-white/10 bg-slate-900/80 hover:border-cyan-300/60 hover:bg-cyan-300/10"
                      : isSelected && choice.correct
                        ? "border-emerald-300 bg-emerald-300/15"
                        : isSelected
                          ? "border-rose-300 bg-rose-300/15"
                          : "border-white/10 bg-slate-900/40 opacity-70";

                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => chooseAnswer(choice.id)}
                        className={`rounded-2xl border p-4 text-left text-base font-bold leading-6 text-white transition focus:outline-none focus:ring-4 focus:ring-cyan-300/20 ${answerStyle}`}
                      >
                        {choice.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <h3 className="text-lg font-black text-white">Why this matters</h3>
                {selectedChoice ? (
                  <div className="mt-3">
                    <p className={`text-sm font-black ${selectedChoice.correct ? "text-emerald-300" : "text-rose-300"}`}>
                      {selectedChoice.correct ? "Good decision" : "Try the reasoning"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{selectedChoice.explanation}</p>
                    <button type="button" onClick={goNext} className="mt-4 w-full rounded-full bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-300/30">
                      {currentStepIndex < totalSteps - 1 ? "Continue →" : "Finish simulator →"}
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-slate-300">Choose one decision. You will get immediate feedback explaining why it helps or hurts the troubleshooting flow.</p>
                )}
              </aside>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <SummaryCard title="What You Did Well" tone="emerald" body={renderSummaryText(scenario.summary.didWell)} />
              <SummaryCard title="What You Can Improve" tone="amber" body={renderSummaryText(scenario.summary.canImprove)} />
              <SummaryCard title="Lesson Learned" tone="cyan" body={renderSummaryText(scenario.summary.lessonLearned)} />
              <div className="lg:col-span-3">
                <button type="button" onClick={resetSimulator} className="w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-300/30 sm:w-auto">
                  Practice again
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const summaryToneClasses = {
  emerald: {
    card: "border-emerald-300/30 bg-emerald-300/10",
    title: "text-emerald-100",
    body: "text-emerald-50/90",
  },
  amber: {
    card: "border-amber-300/30 bg-amber-300/10",
    title: "text-amber-100",
    body: "text-amber-50/90",
  },
  cyan: {
    card: "border-cyan-300/30 bg-cyan-300/10",
    title: "text-cyan-100",
    body: "text-cyan-50/90",
  },
};

function SummaryCard({ title, tone, body }: { title: string; tone: keyof typeof summaryToneClasses; body: string }) {
  const toneClasses = summaryToneClasses[tone];

  return (
    <section className={`rounded-2xl border ${toneClasses.card} p-5`}>
      <h2 className={`text-xl font-black ${toneClasses.title}`}>{title}</h2>
      <p className={`mt-3 text-sm leading-6 ${toneClasses.body}`}>{body}</p>
    </section>
  );
}
