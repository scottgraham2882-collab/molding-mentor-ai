"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Choice = {
  id: string;
  label: string;
  correct: boolean;
  explanation: string;
};

type Step = {
  id: string;
  question: string;
  coachNote: string;
  choices: Choice[];
};

const totalSteps = 4;

const steps: Step[] = [
  {
    id: "contain",
    question: "Flash appears right after a mold change on a 250 Ton Press running ABS. What is your first decision?",
    coachNote: "Start by protecting the customer and gathering evidence before changing the process.",
    choices: [
      {
        id: "contain-and-compare",
        label: "Hold suspect parts, save samples, and compare the setup to the approved process sheet.",
        correct: true,
        explanation:
          "Correct. Flash after a mold change may come from setup, clamp, mold shutoff, or process differences. Containment protects the customer, and comparing against the approved process gives you facts before adjustments.",
      },
      {
        id: "lower-pack-now",
        label: "Immediately lower pack pressure until the flash disappears.",
        correct: false,
        explanation:
          "Incorrect. Lowering pack may hide the symptom, but it can also create shorts, sinks, or dimensional problems. First verify whether the mold is closing correctly and whether the setup matches the standard.",
      },
      {
        id: "raise-clamp-all",
        label: "Raise clamp tonnage to maximum and restart production.",
        correct: false,
        explanation:
          "Incorrect. More clamp force is not always safer. Excess force can damage the mold or machine. Verify clamp setup, parting line condition, and the process before making a large change.",
      },
      {
        id: "keep-running",
        label: "Keep running because flash can be trimmed later.",
        correct: false,
        explanation:
          "Incorrect. Running known flash creates scrap, rework, and customer risk. Stop, contain, and understand the cause before continuing production.",
      },
    ],
  },
  {
    id: "mold-change-check",
    question: "The setup sheet looks close, but the flash is mainly on the parting line. What should you check next?",
    coachNote: "Because the defect started after a mold change, check mold fit and setup details before chasing melt settings.",
    choices: [
      {
        id: "parting-line-check",
        label: "Inspect parting line, leader pins, mold mounting, mold protection, and any debris on shutoffs.",
        correct: true,
        explanation:
          "Correct. Parting-line flash after a mold change often points to the mold not closing cleanly, debris, damaged shutoffs, or setup alignment. These checks address why plastic can escape.",
      },
      {
        id: "increase-melt-temp",
        label: "Increase melt temperature to help ABS flow better.",
        correct: false,
        explanation:
          "Incorrect. Hotter ABS usually flows easier and may make flash worse. The location and timing suggest a closing, shutoff, clamp, or setup issue should be checked first.",
      },
      {
        id: "speed-fill",
        label: "Increase injection speed so the cavity fills before pressure builds.",
        correct: false,
        explanation:
          "Incorrect. Faster fill can increase peak pressure and worsen flash. It does not explain why the issue began right after the mold change.",
      },
      {
        id: "change-material",
        label: "Switch to a different ABS lot before checking the mold.",
        correct: false,
        explanation:
          "Incorrect. Material can matter, but the problem started after a mold change and is on the parting line. Check the changed condition first.",
      },
    ],
  },
  {
    id: "clamp-process",
    question: "The mold faces are clean and mounted correctly. Flash remains. What evidence should guide the next action?",
    coachNote: "Use process evidence to decide whether the clamp is being overcome or whether pressure is higher than normal.",
    choices: [
      {
        id: "compare-pressure-cushion",
        label: "Compare cushion, transfer position, fill time, peak pressure, pack pressure, and clamp tonnage to the last good run.",
        correct: true,
        explanation:
          "Correct. These values show whether the process changed, whether the machine is overpacking, or whether clamp force is not enough for the current pressure. Evidence prevents guessing.",
      },
      {
        id: "random-low-temp",
        label: "Drop all barrel temperatures by 50°F and see what happens.",
        correct: false,
        explanation:
          "Incorrect. Large random temperature changes can create poor melt quality, short shots, or new defects. Make small, evidence-based changes only after checking actual process data.",
      },
      {
        id: "adjust-many",
        label: "Change fill speed, pack pressure, hold time, and cooling together to save time.",
        correct: false,
        explanation:
          "Incorrect. Multiple changes hide cause and effect. Troubleshooting builds knowledge by changing one controlled item at a time after verifying the basics.",
      },
      {
        id: "ignore-last-good",
        label: "Ignore the last good run because every startup is different.",
        correct: false,
        explanation:
          "Incorrect. Last-good-run data is one of the best references for preserving knowledge. It helps the team separate normal variation from a real change.",
      },
    ],
  },
  {
    id: "safe-correction",
    question: "Data shows pack pressure is higher than the approved sheet and cushion is larger than normal. What is the best correction plan?",
    coachNote: "Now that there is evidence, choose a controlled correction that protects quality and teaches the next person what changed.",
    choices: [
      {
        id: "restore-verify-document",
        label: "Return pack and shot size toward the approved values, verify parts, and document the lesson for the team.",
        correct: true,
        explanation:
          "Correct. The evidence points to overpacking or too much shot volume increasing cavity pressure. Restoring the approved process, verifying quality, and documenting the finding builds confidence and preserves knowledge.",
      },
      {
        id: "trim-approve",
        label: "Approve the run if the operator can trim the flash cleanly.",
        correct: false,
        explanation:
          "Incorrect. Trimming does not fix the cause and can hide a process or mold issue. The goal is stable production, not dependence on rework.",
      },
      {
        id: "max-clamp-anyway",
        label: "Keep the high pack pressure and compensate with maximum clamp tonnage.",
        correct: false,
        explanation:
          "Incorrect. Compensating with clamp force can stress equipment and does not address the confirmed process drift. Correct the process back toward the standard first.",
      },
      {
        id: "tell-next-shift",
        label: "Tell the next shift verbally and skip documentation because the issue is fixed.",
        correct: false,
        explanation:
          "Incorrect. Verbal handoff is easy to lose. A short written note preserves the lesson and supports collaboration across shifts.",
      },
    ],
  },
];

export default function SimulatorPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([]);

  const isSummaryVisible = currentStepIndex === totalSteps;
  const currentStep = steps[Math.min(currentStepIndex, totalSteps - 1)];
  const selectedChoiceId = selectedChoiceIds[currentStepIndex];
  const selectedChoice = currentStep.choices.find((choice) => choice.id === selectedChoiceId);
  const previousChoice = currentStepIndex > 0
    ? steps[currentStepIndex - 1].choices.find((choice) => choice.id === selectedChoiceIds[currentStepIndex - 1])
    : undefined;
  const branchingCoachNote = previousChoice && !previousChoice.correct
    ? `Branch correction: ${currentStep.coachNote}`
    : currentStep.coachNote;

  const correctCount = useMemo(
    () =>
      selectedChoiceIds.reduce((count, choiceId, index) => {
        const choice = steps[index].choices.find((stepChoice) => stepChoice.id === choiceId);
        return count + (choice?.correct ? 1 : 0);
      }, 0),
    [selectedChoiceIds],
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

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-200 transition hover:bg-cyan-300/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/20">
            ← Back home
          </Link>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Interactive Troubleshooting Simulator</p>
          <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Flash after mold change</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Practice a simple, people-first troubleshooting flow for a 250 Ton Press running ABS. One decision at a time, with the why explained after every answer.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
              <p><span className="font-black">Machine:</span> 250 Ton Press</p>
              <p><span className="font-black">Material:</span> ABS</p>
              <p><span className="font-black">Defect:</span> Flash after mold change</p>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/30 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Step {Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps}</p>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 sm:max-w-xs" aria-label={`Progress: step ${Math.min(currentStepIndex + 1, totalSteps)} of ${totalSteps}`}>
              <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${(Math.min(currentStepIndex + 1, totalSteps) / totalSteps) * 100}%` }} />
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
              <section className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-5">
                <h2 className="text-xl font-black text-emerald-100">What You Did Well</h2>
                <p className="mt-3 text-sm leading-6 text-emerald-50/90">You completed the troubleshooting flow and made {correctCount} of {totalSteps} preferred decisions. You practiced containment, evidence gathering, mold-change checks, and controlled correction.</p>
              </section>
              <section className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5">
                <h2 className="text-xl font-black text-amber-100">What You Can Improve</h2>
                <p className="mt-3 text-sm leading-6 text-amber-50/90">Keep avoiding guesswork. Do not change several settings together, do not use rework as the solution, and do not skip documentation after the issue is fixed.</p>
              </section>
              <section className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-5">
                <h2 className="text-xl font-black text-cyan-100">Lesson Learned</h2>
                <p className="mt-3 text-sm leading-6 text-cyan-50/90">Flash after a mold change is solved by asking what changed, checking the mold and setup first, then using process data to make one safe correction at a time.</p>
              </section>
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
