"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Question = {
  prompt: string;
  topic: string;
  choices: string[];
  correctIndex: number;
  feedback: string;
};

const questions: Question[] = [
  {
    topic: "Short shots",
    prompt: "A part is not filling at the end of flow. What should the team check first?",
    choices: ["Whether the cavity is filling before pack and hold are adjusted", "Whether the finished parts can be trimmed after molding", "Whether the label on the box needs to be updated", "Whether the operator should increase hold time only"],
    correctIndex: 0,
    feedback: "A short shot is usually a fill problem first. Confirm shot size, transfer, pressure limit, material feed, and restrictions before trying to pack an incomplete part.",
  },
  {
    topic: "Flash",
    prompt: "Thin plastic is appearing on the parting line. Which question supports root-cause thinking?",
    choices: ["Where is the plastic escaping, and what changed near that shutoff?", "How fast can the flash be trimmed from every part?", "Can the defect be ignored until the next shift?", "Should every temperature zone be lowered at once?"],
    correctIndex: 0,
    feedback: "Flash is escaped plastic. Locate the escape path and compare clamp, shutoff, vent, and pressure conditions to the approved setup.",
  },
  {
    topic: "Sink marks",
    prompt: "A visible sink mark forms over a thick rib. Which process area is most directly related?",
    choices: ["Effective hold pressure while the gate is still open", "The color of the material container", "The number of people assigned to packaging", "The brightness of the inspection table"],
    correctIndex: 0,
    feedback: "Sink marks come from shrinkage in thicker sections. Hold pressure and hold time can help only while the gate is open and cushion remains stable.",
  },
  {
    topic: "Transfer position",
    prompt: "What does transfer position separate in a decoupled molding process?",
    choices: ["Fill from pack/hold", "Drying from conveying", "Inspection from shipping", "Startup from shutdown paperwork"],
    correctIndex: 0,
    feedback: "Transfer position is where the machine changes from filling the part to packing it. A repeatable transfer helps keep fill and pack decisions separate.",
  },
  {
    topic: "Cushion",
    prompt: "Why is cushion important at the end of the shot?",
    choices: ["It shows there is material left for the screw to maintain pressure", "It proves the part will always pass visual inspection", "It replaces the need for a process sheet", "It tells the team the mold needs no maintenance"],
    correctIndex: 0,
    feedback: "A stable cushion helps the press maintain pack and hold pressure. A cushion that bottoms out or swings widely is a clue to investigate feed, shot size, check ring, or material consistency.",
  },
  {
    topic: "Hold pressure",
    prompt: "When should hold pressure changes be made?",
    choices: ["After confirming the part is full and the change is within the approved process window", "Before checking whether the cavity fills", "Every time an operator sees any cosmetic defect", "Only after the shift ends so nobody sees the adjustment"],
    correctIndex: 0,
    feedback: "Hold pressure controls packing after fill. Make measured changes inside the approved window, document them, and avoid using hold pressure to solve problems that happen during fill.",
  },
  {
    topic: "Venting",
    prompt: "Burn marks repeat at the last area to fill. What should be checked early?",
    choices: ["Vents, trapped air paths, and whether the faster fill is compressing gas", "Only the finished goods count", "Whether the part can be packed in a different box", "Only the machine paint color"],
    correctIndex: 0,
    feedback: "Repeating end-of-fill burns often point to trapped gas. Clean and inspect vents and review fill speed before blaming the resin or changing many settings.",
  },
  {
    topic: "Shift handoff",
    prompt: "What makes a shift handoff useful for troubleshooting?",
    choices: ["Clear notes about what changed, what was checked, and what still needs follow-up", "A note that simply says everything is fine", "A private conversation nobody else can read", "Waiting until the next day to mention defects"],
    correctIndex: 0,
    feedback: "Good handoff notes support collaboration. They preserve what the last shift learned so the next shift does not repeat the same checks or miss an open risk.",
  },
  {
    topic: "Knowledge preservation",
    prompt: "A technician solved a recurring defect. What is the best people-first next step?",
    choices: ["Document the symptom, root cause, correction, and evidence for the team", "Keep the fix informal so only one person knows it", "Delete old setup notes because the issue is fixed", "Create a leaderboard for who solved it fastest"],
    correctIndex: 0,
    feedback: "Preserving practical knowledge helps people learn and protects future shifts. Capture the problem, proof, action taken, and any setup or handoff notes that should change.",
  },
  {
    topic: "Root cause thinking",
    prompt: "Which habit best supports beginner troubleshooting?",
    choices: ["Change one variable at a time and compare results to the baseline", "Change several settings quickly and hope the defect disappears", "Skip measurements when production is busy", "Assume the last person caused the problem"],
    correctIndex: 0,
    feedback: "One measured change at a time protects the process and the people working on it. It makes learning visible and keeps troubleshooting fair.",
  },
];

export default function KnowledgeChecksPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const answered = selectedIndex !== null;
  const isCorrect = selectedIndex === currentQuestion.correctIndex;
  const progressLabel = `${Math.min(currentIndex + 1, questions.length)} of ${questions.length}`;
  const scoreMessage = useMemo(() => {
    const percent = Math.round((score / questions.length) * 100);

    if (percent >= 80) return "Strong foundation. Keep sharing what you learn with the team.";
    if (percent >= 60) return "Good progress. Review the feedback and try again to reinforce the basics.";
    return "Keep practicing. These checks are meant to help you learn, not catch you out.";
  }, [score]);

  const answerQuestion = (choiceIndex: number) => {
    if (answered) return;
    setSelectedIndex(choiceIndex);
    if (choiceIndex === currentQuestion.correctIndex) setScore((currentScore) => currentScore + 1);
  };

  const goToNextQuestion = () => {
    if (currentIndex === questions.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentIndex((index) => index + 1);
    setSelectedIndex(null);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link href="/" className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10">
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Knowledge Checks MVP</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Check your molding basics</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Practice beginner-friendly questions about defects, process controls, handoff habits, and preserving shop-floor knowledge. Answer one question at a time and get immediate feedback.
          </p>
        </header>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
          {finished ? (
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-300">Quiz complete</p>
              <h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">{score} / {questions.length}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">{scoreMessage}</p>
              <button type="button" onClick={restartQuiz} className="mt-6 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200 sm:w-auto">
                Restart quiz
              </button>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Question {progressLabel}</p>
                  <p className="mt-2 text-sm font-bold text-slate-400">Topic: {currentQuestion.topic}</p>
                </div>
                <span className="w-fit rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-100">Score: {score}</span>
              </div>

              <h2 className="mt-6 text-2xl font-black leading-tight text-white sm:text-3xl">{currentQuestion.prompt}</h2>

              <div className="mt-6 grid gap-3">
                {currentQuestion.choices.map((choice, choiceIndex) => {
                  const isSelected = selectedIndex === choiceIndex;
                  const isCorrectChoice = currentQuestion.correctIndex === choiceIndex;
                  const feedbackClass = answered && isCorrectChoice ? "border-emerald-300 bg-emerald-300/15 text-emerald-50" : answered && isSelected ? "border-rose-300 bg-rose-300/15 text-rose-50" : "border-white/10 bg-slate-900/70 text-slate-100 hover:border-cyan-300/50";

                  return (
                    <button key={choice} type="button" onClick={() => answerQuestion(choiceIndex)} className={`rounded-2xl border p-4 text-left text-sm font-bold leading-6 transition sm:text-base ${feedbackClass}`}>
                      {choice}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`mt-6 rounded-2xl border p-4 ${isCorrect ? "border-emerald-300/30 bg-emerald-300/10" : "border-amber-300/30 bg-amber-300/10"}`}>
                  <p className={`text-sm font-black uppercase tracking-[0.22em] ${isCorrect ? "text-emerald-300" : "text-amber-300"}`}>{isCorrect ? "Correct" : "Review this"}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{currentQuestion.feedback}</p>
                  <button type="button" onClick={goToNextQuestion} className="mt-4 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200 sm:w-auto">
                    {currentIndex === questions.length - 1 ? "See score" : "Next question"}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
