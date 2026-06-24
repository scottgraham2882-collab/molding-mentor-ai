"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DictionaryTerm = {
  term: string;
  definition: string;
  whyItMatters: string;
};

const glossaryTerms: DictionaryTerm[] = [
  {
    term: "Cushion",
    definition: "The small amount of melted plastic left in front of the screw after injection ends.",
    whyItMatters: "A steady cushion helps prove the machine had enough material to pack the part the same way every shot.",
  },
  {
    term: "Transfer Position",
    definition: "The screw position where the press switches from filling the part to packing and holding it.",
    whyItMatters: "A consistent transfer point helps prevent short shots, flash, sinks, and part weight swings.",
  },
  {
    term: "Pack Pressure",
    definition: "The pressure applied after fill to push extra plastic into the cavity as the part starts to shrink.",
    whyItMatters: "Good pack pressure can reduce sinks, voids, weak dimensions, and part weight variation.",
  },
  {
    term: "Hold Pressure",
    definition: "The pressure used after filling to keep material packed in the cavity until the gate seals.",
    whyItMatters: "Hold pressure helps maintain part size and appearance while the plastic cools and shrinks.",
  },
  {
    term: "Fill Time",
    definition: "The time it takes to fill the mold cavity from the start of injection to transfer.",
    whyItMatters: "Fill time is a key process fingerprint. Changes can point to material, machine, temperature, or restriction problems.",
  },
  {
    term: "Gate Freeze",
    definition: "The point when plastic at the gate has cooled enough that no more material can enter the part.",
    whyItMatters: "Knowing gate freeze helps set hold time without wasting cycle time or losing part consistency.",
  },
  {
    term: "Clamp Tonnage",
    definition: "The clamping force that keeps the mold closed during injection and packing.",
    whyItMatters: "Enough tonnage prevents flash, but too much can stress the mold, vents, machine, and tooling surfaces.",
  },
  {
    term: "Recovery Time",
    definition: "The time the screw takes to rotate, melt, and prepare the next shot after injection.",
    whyItMatters: "Recovery must finish before cooling ends so the cycle stays stable and the next shot is ready on time.",
  },
  {
    term: "Shot Size",
    definition: "The amount of plastic prepared and injected for one molding cycle.",
    whyItMatters: "Correct shot size supports a stable cushion and repeatable part weight without starving or overloading the process.",
  },
  {
    term: "Back Pressure",
    definition: "Pressure applied against the screw while it recovers and mixes the next shot of material.",
    whyItMatters: "Back pressure improves melt mixing and consistency, but too much can overheat material and add cycle time.",
  },
  {
    term: "Screw Recovery",
    definition: "The screw rotation step that melts, mixes, and meters plastic for the next cycle.",
    whyItMatters: "Stable screw recovery supports consistent melt quality, shot size, cushion, and cycle rhythm.",
  },
  {
    term: "Melt Temperature",
    definition: "The actual temperature of the melted plastic as it is processed and injected.",
    whyItMatters: "Melt temperature affects flow, appearance, strength, degradation risk, and how consistently the mold fills.",
  },
  {
    term: "Mold Temperature",
    definition: "The temperature of the mold surfaces that cool and shape the plastic part.",
    whyItMatters: "Mold temperature affects shrink, gloss, dimensions, cycle time, warpage, and part quality.",
  },
  {
    term: "Venting",
    definition: "Small escape paths that let trapped air and gases leave the cavity during filling.",
    whyItMatters: "Good venting helps prevent burns, shorts, poor weld lines, trapped gas, and inconsistent filling.",
  },
  {
    term: "Decoupled Molding",
    definition: "A molding method that separates fill, pack, and hold so each stage can be controlled more clearly.",
    whyItMatters: "Separating the stages makes troubleshooting easier and helps teams build repeatable, teachable processes.",
  },
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTerms = useMemo(() => {
    const query = normalize(searchTerm);

    if (!query) return glossaryTerms;

    return glossaryTerms.filter((item) =>
      [item.term, item.definition, item.whyItMatters]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [searchTerm]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
          >
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Molding Dictionary
          </p>
          <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Common molding terms in plain language.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                A simple glossary for new injection molding employees, setup techs, operators, and team leads who need shared words for learning and troubleshooting.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/70 p-4 text-sm leading-6 text-slate-300">
              Keep this page open during training, shift handoff, or problem solving so the team can use the same language.
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/20 sm:p-6">
          <label htmlFor="dictionary-search" className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Search glossary
          </label>
          <input
            id="dictionary-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Try cushion, pressure, gate, temperature..."
            className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
          />
          <p className="mt-3 text-sm text-slate-400">
            Showing {filteredTerms.length} of {glossaryTerms.length} terms.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTerms.map((item) => (
            <article
              key={item.term}
              className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-300/40 sm:p-6"
            >
              <h2 className="text-2xl font-bold text-white">{item.term}</h2>
              <div className="mt-5 space-y-5">
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Simple definition</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.definition}</p>
                </section>
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Why it matters</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.whyItMatters}</p>
                </section>
              </div>
            </article>
          ))}
        </section>

        {filteredTerms.length === 0 ? (
          <section className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100 sm:p-6">
            No terms match that search yet. Try a shorter word like “pressure,” “time,” or “temperature.”
          </section>
        ) : null}
      </div>
    </main>
  );
}
