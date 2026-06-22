import Link from "next/link";

const studySteps = [
  "Start from a stable fill-only setup with transfer by position, a consistent cushion, and the same material, dryer, mold temperature, and cooling time you plan to use in production.",
  "Set the chosen pack/hold pressure, then begin with a short hold time such as 0.5 or 1.0 second so the gate is not sealed yet.",
  "Mold several shots at each hold-time setting, allow the process to stabilize, and weigh representative good parts on a scale with enough resolution for the part size.",
  "Increase hold time in equal steps while keeping fill speed, transfer, pack pressure, screw recovery, cooling time, and material conditions unchanged.",
  "Plot or review average part weight against hold time, then choose a production hold time slightly beyond the point where extra hold time no longer adds meaningful weight.",
];

const exampleRows = [
  { holdTime: "1.0 sec", partWeight: "24.82 g", result: "Weight still increasing; gate is open." },
  { holdTime: "2.0 sec", partWeight: "25.14 g", result: "More packing is entering the cavity." },
  { holdTime: "3.0 sec", partWeight: "25.31 g", result: "Approaching gate seal." },
  { holdTime: "4.0 sec", partWeight: "25.34 g", result: "Plateau begins; gate is likely sealed." },
  { holdTime: "5.0 sec", partWeight: "25.35 g", result: "No meaningful gain; extra hold time is wasted." },
];

const mistakes = [
  "Changing pack pressure while changing hold time, which hides the true gate-seal response.",
  "Weighing parts before they cool consistently or mixing hot samples with room-temperature samples.",
  "Using only one shot per setting instead of averaging several stable cycles.",
  "Ignoring runner, sprue, or regrind handling differences that change the measured weight.",
  "Calling the first small weight change a plateau without checking the next hold-time step.",
  "Setting hold time exactly at the first plateau point with no safety margin for normal process variation.",
];

const quiz = [
  {
    question: "What does gate seal mean?",
    answer: "Gate seal means the gate has frozen enough that additional hold pressure can no longer push meaningful material into the cavity.",
  },
  {
    question: "Why does gate seal matter for a molding process?",
    answer: "It helps set hold time long enough to control shrink, sink, weight, and dimensions without wasting cycle time after the gate has sealed.",
  },
  {
    question: "What variable is normally changed during a gate seal study?",
    answer: "Hold time is changed in steps while the other major process settings are kept constant.",
  },
  {
    question: "How is part weight used in the study?",
    answer: "Average part weight is compared at each hold time; increasing weight shows more material is still being packed through the gate.",
  },
  {
    question: "What does a weight plateau indicate?",
    answer: "A plateau indicates the gate is sealed or effectively sealed because additional hold time is not adding meaningful part weight.",
  },
];

export default function GateSealStudyLesson() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <Link
            href="/lessons"
            className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100 hover:bg-cyan-300/10"
          >
            ← Back to training
          </Link>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-950">
              Beginner/Intermediate
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
              Gate Seal Study
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find when packing stops working
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            A gate seal study uses controlled hold-time changes and part weight to identify when the gate freezes. The result is a hold time that supports quality without adding unnecessary cycle time.
          </p>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
            <h2 className="text-2xl font-bold text-white">What gate seal means</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
              Gate seal is the point in the cycle where the gate has frozen enough that hold pressure can no longer force a meaningful amount of plastic into the cavity. Before seal, pack pressure can add material and raise part weight. After seal, the cavity is isolated from the runner system.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
            <h2 className="text-2xl font-bold text-white">Why gate seal matters</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
              Hold time must be long enough to pack the part while the gate is open. Too little hold time can cause low weight, sink, voids, or dimensional drift. Too much hold time adds cycle time, can increase molded-in stress, and does not improve the part once the gate is sealed.
            </p>
          </article>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">How to run a gate seal study</h2>
          <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300 sm:text-base">
            {studySteps.map((step, index) => (
              <li key={step} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300 text-sm font-black text-slate-950">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-950/20 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Using part weight and the plateau</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Part weight is a simple indicator of how much material entered the cavity during pack and hold. When weight rises as hold time increases, the gate is still open and more material is being packed. A weight plateau means added hold time produces little or no weight gain, so the gate is sealed or effectively sealed for that process.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase tracking-[0.18em] text-cyan-200">
                <tr>
                  <th className="px-4 py-3">Hold Time</th>
                  <th className="px-4 py-3">Part Weight</th>
                  <th className="px-4 py-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/50">
                {exampleRows.map((row) => (
                  <tr key={row.holdTime}>
                    <td className="px-4 py-3 font-semibold text-white">{row.holdTime}</td>
                    <td className="px-4 py-3">{row.partWeight}</td>
                    <td className="px-4 py-3">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-rose-300/20 bg-rose-950/20 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Common mistakes</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-300 sm:text-base md:grid-cols-2">
            {mistakes.map((mistake) => (
              <li key={mistake} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">{mistake}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Quick quiz</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Use these five questions to confirm the lesson before setting production hold time.</p>
          <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300 sm:text-base">
            {quiz.map((item, index) => (
              <li key={item.question} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="font-bold text-white">{index + 1}. {item.question}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer font-semibold text-cyan-200">Show answer</summary>
                  <p className="mt-2 text-slate-300">{item.answer}</p>
                </details>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
