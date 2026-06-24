import type { ReactNode } from "react";
import Link from "next/link";

type CaseStudy = {
  title: string;
  problem: string;
  situation: string;
  likelyCause: string;
  whatToCheck: string[];
  lessonLearned: string;
};

const caseStudies: CaseStudy[] = [
  {
    title: "Flash after mold change",
    problem: "Thin plastic is showing up on the parting line shortly after a mold was changed into the press.",
    situation:
      "The previous job ran clean. After the new mold was set, the first parts looked acceptable, but flash started appearing as the mold warmed up and production continued.",
    likelyCause:
      "The mold may not be fully closed at the flashing area because of dirt, trapped plastic, clamp setup, worn shutoffs, or too much cavity pressure during pack and hold.",
    whatToCheck: [
      "Cleanliness of the parting line, vents, slides, lifters, and shutoff faces.",
      "Clamp tonnage, mold protection, tie-bar balance, and whether the mold is seating evenly.",
      "Actual fill, transfer, pack, and hold settings compared with the approved setup sheet.",
      "Whether flash begins during fill or only after pack pressure is applied.",
    ],
    lessonLearned:
      "Do not chase flash with random pressure changes first. Find the escape path, confirm the setup, then make one controlled process adjustment if needed.",
  },
  {
    title: "Short shot after material change",
    problem: "The part no longer fills completely after changing to a new material lot or color blend.",
    situation:
      "Production was making full parts before the hopper change. Soon after the new material was loaded, the end of fill and a thin rib started coming up short.",
    likelyCause:
      "The new material condition may have changed flow. Possible causes include the wrong resin, moisture, cold material, feed interruption, blocked gate, pressure limit, or a shot size that is no longer enough.",
    whatToCheck: [
      "Correct resin grade, lot number, regrind level, colorant, and dryer settings.",
      "Hopper feed, throat condition, cushion, shot size, fill time, and peak pressure.",
      "Nozzle, sprue, runner, gate, and vents for cold slugs or restrictions.",
      "Whether the machine is pressure limited before the cavity fills.",
    ],
    lessonLearned:
      "A short shot is a fill problem first. Prove the cavity is filling before using hold pressure to solve a problem that happens during injection.",
  },
  {
    title: "Sink marks on thick section",
    problem: "A visible sink mark appears over a boss, rib, or other thick section of the molded part.",
    situation:
      "The part looks mostly full, but a dull depression appears as the part cools. The sink is always in the same heavy-wall area.",
    likelyCause:
      "The thick section is shrinking more than the surrounding wall. The gate may be freezing before enough plastic is packed into the area, or the part design may create a heavy section that is difficult to pack.",
    whatToCheck: [
      "Part wall thickness around the sink area and whether ribs or bosses are too thick.",
      "Gate seal time using part weight or another approved gate seal study method.",
      "Pack pressure, hold time, cushion stability, and transfer position.",
      "Mold cooling near the thick section and whether cooling lines are blocked or uneven.",
    ],
    lessonLearned:
      "Sink is usually about shrinkage balance. Pack the part while the gate is open, verify cooling, and escalate design concerns when the section is too thick.",
  },
  {
    title: "Burn marks near end of fill",
    problem: "Dark burn marks appear near the last area of the cavity to fill.",
    situation:
      "The defect repeats in the same location. The team recently increased fill speed to improve the surface finish in another area of the part.",
    likelyCause:
      "Air or gas is trapped at the end of fill and compressed by fast-moving plastic. Dirty or blocked vents can make the trapped gas burn the material.",
    whatToCheck: [
      "Exact burn location by cavity and whether it matches the end-of-fill area.",
      "Vent lands, inserts, parting line, and any trapped-gas locations for contamination.",
      "Fill speed profile, peak pressure, and whether the speed increase made the burn worse.",
      "Material residence time and purge condition if burns appear away from the end of fill.",
    ],
    lessonLearned:
      "End-of-fill burns often point to venting. Give the gas a way out before blaming the resin or lowering every barrel temperature.",
  },
  {
    title: "Warpage after cooling change",
    problem: "Parts begin bending or twisting after a cooling-time or water-temperature change.",
    situation:
      "The part passed inspection earlier in the shift. After cooling was shortened to improve cycle time, parts looked acceptable at the press but warped later on the table.",
    likelyCause:
      "The part is being ejected too hot or cooling unevenly. Uneven shrinkage, poor water flow, hot spots, or stacking warm parts can let the part move after ejection.",
    whatToCheck: [
      "Actual cooling time, mold temperature, water temperature, and water flow against the approved process.",
      "Part temperature at ejection and part dimensions after a consistent cooling period.",
      "Whether parts are stacked, bent, clipped, or constrained while still warm.",
      "Pack and hold settings only after cooling and handling checks are stable.",
    ],
    lessonLearned:
      "Warp can show up after the part leaves the mold. Judge parts at a consistent time, protect cooling control, and avoid stacking hot parts in a way that trains in distortion.",
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Saved Examples</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Case studies for practical molding troubleshooting
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Learn from realistic shop-floor examples that help teams troubleshoot, preserve knowledge, and coach newer molders with simple language.
          </p>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {caseStudies.map((study, index) => (
            <article
              key={study.title}
              className="flex h-full flex-col rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">Case {index + 1}</p>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">{study.title}</h2>

              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
                <CaseSection title="Problem">{study.problem}</CaseSection>
                <CaseSection title="Situation">{study.situation}</CaseSection>
                <CaseSection title="Likely Cause">{study.likelyCause}</CaseSection>
                <section>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">What To Check</h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    {study.whatToCheck.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <CaseSection title="Lesson Learned">{study.lessonLearned}</CaseSection>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-white">How to use these examples</h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300 sm:text-base">
            Review one case during a shift meeting, ask the team what they would check first, then compare answers with the checklist. Keep the focus on learning and collaboration instead of blame.
          </p>
        </section>
      </div>
    </main>
  );
}

function CaseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">{title}</h3>
      <p className="mt-1">{children}</p>
    </section>
  );
}
