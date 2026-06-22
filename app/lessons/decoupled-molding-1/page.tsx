import Link from "next/link";

const keyIdeas = [
  {
    title: "Decoupled Molding I meaning",
    body: "Decoupled Molding I separates the first stage of the process from the rest of the cycle. The goal is to fill most of the cavity using injection speed control, then transfer before pressure-controlled pack begins. At this level, you are learning to make fill repeatable before trying to fix size, sink, or weight with pack pressure.",
  },
  {
    title: "Fill-only process",
    body: "A fill-only shot is made with pack and hold pressure removed or reduced to the machine minimum, then the transfer position is adjusted until the part is intentionally short. This proves what the screw is doing during fill without hiding problems behind packing pressure.",
  },
  {
    title: "Why transfer position matters",
    body: "Transfer position is the handoff point between velocity-controlled fill and pressure-controlled pack. If transfer is too late, the screw may overfill or bottom out before pack can control the part. If transfer is too early, pack must finish too much filling and part weight becomes sensitive to pressure variation.",
  },
];

const comparisons = [
  {
    label: "Fill",
    points: [
      "Moves molten plastic through the runner, gate, and cavity at a controlled speed.",
      "Builds the flow pattern and weld-line location before the part is full.",
      "Is evaluated with short shots, fill time, peak pressure, and part appearance.",
    ],
  },
  {
    label: "Pack",
    points: [
      "Adds pressure after transfer to compensate for material shrinkage as the part cools.",
      "Controls weight, dimensions, sink, and voids after the cavity is volumetrically full.",
      "Is evaluated with part weight, dimensions, pressure curves, and gate-seal behavior.",
    ],
  },
];

const mistakes = [
  "Using pack pressure to finish a process that was never properly filled.",
  "Transferring by hydraulic pressure when the goal is a repeatable position-based handoff.",
  "Calling a fully packed part a fill-only sample.",
  "Ignoring cushion variation and assuming the same transfer setting is still valid.",
  "Changing fill speed, transfer, pack pressure, and hold time at the same time.",
  "Judging the study from one shot instead of watching several consecutive cycles.",
];

const quiz = [
  {
    question: "What is the main purpose of Decoupled Molding I?",
    answer: "To establish a repeatable velocity-controlled fill before optimizing pack and hold.",
  },
  {
    question: "What should a fill-only part usually look like during setup?",
    answer: "Intentionally short, because pack and hold are not being used to finish the cavity.",
  },
  {
    question: "What does transfer position separate?",
    answer: "Velocity-controlled fill from pressure-controlled pack.",
  },
  {
    question: "Why is cushion consistency important?",
    answer: "A stable cushion shows the screw has reserve material and is ending each shot in a repeatable position.",
  },
  {
    question: "Name one common mistake in a fill-only study.",
    answer: "Examples include leaving pack pressure active, transferring too late, changing multiple variables, or ignoring cushion variation.",
  },
];

export default function DecoupledMoldingOneLesson() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-violet-950/30 sm:p-8 lg:p-10">
          <Link
            href="/lessons"
            className="inline-flex items-center rounded-full border border-violet-300/30 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:border-violet-200 hover:bg-violet-300/10"
          >
            ← Back to training
          </Link>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full bg-violet-300 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-950">
              Beginner/Intermediate
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
              Decoupled Molding I
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build a stable fill before you pack
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            This lesson introduces the first practical step in decoupled molding: prove that the cavity fills consistently under speed control, then transfer to pack from a known and repeatable screw position.
          </p>
        </header>

        <section className="mt-6 grid gap-4">
          {keyIdeas.map((idea, index) => (
            <article key={idea.title} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">Lesson {index + 1}</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{idea.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{idea.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Fill is not pack</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Treating fill and pack as separate jobs makes troubleshooting easier. A short shot problem is usually a fill question; a sink, weight, or dimensional problem after a complete fill is usually a pack question.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {comparisons.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <h3 className="text-xl font-bold text-violet-100">{item.label}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/20 sm:p-6">
          <h2 className="text-2xl font-bold text-white">Why cushion must be consistent</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Cushion is the small amount of material left in front of the screw after injection. A consistent cushion means the screw is not bottoming out and the machine has material available to transmit pack pressure. If cushion drifts, the same transfer position may not represent the same amount of plastic in the cavity, and part weight can move even when the setpoints did not change.
          </p>
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
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Answer these five questions before moving on to pack-and-hold studies.</p>
          <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300 sm:text-base">
            {quiz.map((item, index) => (
              <li key={item.question} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="font-bold text-white">{index + 1}. {item.question}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer font-semibold text-violet-200">Show answer</summary>
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
