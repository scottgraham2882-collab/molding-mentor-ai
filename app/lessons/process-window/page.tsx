import Link from "next/link";

const windowConcepts = [
  {
    title: "What a process window is",
    body: "A process window is the approved range of machine, mold, material, and part-quality conditions where the mold can repeatedly make acceptable parts. Instead of protecting one exact setpoint, the team documents the low limit, target, and high limit that still produce good parts.",
  },
  {
    title: "Why a wide window matters",
    body: "A wide process window gives production room to absorb normal variation in resin lots, room temperature, water flow, check-ring repeatability, and operator timing. When the acceptable range is narrow, small disturbances can push the process into shorts, flash, sinks, warp, or dimensional failures.",
  },
  {
    title: "Low side / high side testing",
    body: "Window testing brackets one parameter at a time. Run the low side, return to target, then run the high side while holding the other important settings constant. The low and high limits are only useful if parts are measured against the same quality requirements used for production release.",
  },
];

const studyCards = [
  {
    title: "Fill speed window",
    body: "Test slower and faster fill speeds while watching short-shot behavior, peak pressure, burn marks, splay, weld lines, and fill time. The best target usually sits in a stable area where viscosity response is predictable and the mold fills without cosmetic or pressure problems.",
  },
  {
    title: "Pack pressure window",
    body: "Bracket pack pressure to learn where part weight, sink, voids, flash, stress, and critical dimensions remain acceptable. A strong process has enough pressure to compensate for shrink without relying on a knife-edge setting that flashes or over-packs with minor variation.",
  },
  {
    title: "Mold temperature window",
    body: "Check low and high mold-temperature conditions after the water circuits and steel have stabilized. Mold temperature affects surface finish, gloss, shrinkage, warp, crystallinity for semi-crystalline resins, and how consistently the part releases from the tool.",
  },
  {
    title: "Cooling time window",
    body: "Reduce and increase cooling time while measuring ejection temperature, part stiffness, dimensions, warp, and cycle repeatability. The low limit is where parts still eject safely and meet quality; the high limit confirms extra cooling does not hide another issue or waste cycle time.",
  },
];

const exampleRows = [
  {
    parameter: "Fill speed",
    lowLimit: "2.8 in/s",
    target: "3.5 in/s",
    highLimit: "4.2 in/s",
    result: "Good parts across range; target has lowest pressure variation.",
  },
  {
    parameter: "Pack pressure",
    lowLimit: "7,800 psi plastic",
    target: "8,600 psi plastic",
    highLimit: "9,200 psi plastic",
    result: "Low side shows slight sink; target and high side pass dimensions.",
  },
  {
    parameter: "Mold temperature",
    lowLimit: "75°F",
    target: "85°F",
    highLimit: "95°F",
    result: "All pass; high side improves gloss but adds recovery time at startup.",
  },
  {
    parameter: "Cooling time",
    lowLimit: "10 sec",
    target: "12 sec",
    highLimit: "15 sec",
    result: "10 sec has ejection drag; 12 sec is approved production target.",
  },
];

const quiz = [
  {
    question: "What is a process window?",
    answer: "It is the documented range of settings and conditions that can repeatedly make acceptable parts, normally including low limit, target, and high limit.",
  },
  {
    question: "Why is a wide process window better than a narrow one?",
    answer: "A wide window tolerates normal variation, so the process is less likely to make scrap or require constant adjustment.",
  },
  {
    question: "How should low side / high side testing be performed?",
    answer: "Change one parameter at a time, test the low side and high side against production quality requirements, and keep other major settings constant.",
  },
  {
    question: "Name two parameters commonly bracketed during process-window work.",
    answer: "Examples include fill speed, pack pressure, mold temperature, cooling time, melt temperature, transfer position, and hold time.",
  },
  {
    question: "How does a documented window reduce downtime?",
    answer: "It gives technicians proven limits for troubleshooting and restart decisions, which reduces guesswork, unnecessary adjustments, and extended machine stops.",
  },
];

export default function ProcessWindowLesson() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/60 p-5 shadow-2xl shadow-emerald-950/30 sm:p-8 lg:p-10">
          <Link
            href="/lessons"
            className="inline-flex items-center rounded-full border border-emerald-300/30 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-100 hover:bg-emerald-300/10"
          >
            ← Back to training
          </Link>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-950">
              Beginner/Intermediate
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
              Process Window
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Prove the range, not just the recipe
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Process-window work shows how far a validated molding process can move before quality is at risk. The goal is a practical target with clear limits that helps every shift make the same good decision.
          </p>
        </header>

        <section className="mt-6 grid gap-4">
          {windowConcepts.map((concept, index) => (
            <article key={concept.title} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">Core idea {index + 1}</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{concept.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{concept.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-950/20 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Windows to verify</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {studyCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <h3 className="text-xl font-bold text-emerald-100">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Example process-window table</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Use a simple table to make the approved range visible. The result column should summarize measured part quality, not just whether the machine ran.
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase tracking-[0.18em] text-emerald-200">
                <tr>
                  <th className="px-4 py-3">Parameter</th>
                  <th className="px-4 py-3">Low Limit</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">High Limit</th>
                  <th className="px-4 py-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/50">
                {exampleRows.map((row) => (
                  <tr key={row.parameter}>
                    <td className="px-4 py-3 font-semibold text-white">{row.parameter}</td>
                    <td className="px-4 py-3">{row.lowLimit}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-100">{row.target}</td>
                    <td className="px-4 py-3">{row.highLimit}</td>
                    <td className="px-4 py-3">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">How this reduces scrap and downtime</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Documented windows turn tribal knowledge into a repeatable troubleshooting standard. If a defect appears, technicians can compare actual conditions to proven limits, correct the variable that moved, and avoid random knob-turning. That reduces scrap, keeps startups shorter, prevents good processes from being over-adjusted, and gives engineering data for continuous improvement.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Quick quiz</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Use these five questions to confirm the lesson before documenting production limits.</p>
          <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300 sm:text-base">
            {quiz.map((item, index) => (
              <li key={item.question} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="font-bold text-white">{index + 1}. {item.question}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer font-semibold text-emerald-200">Show answer</summary>
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
