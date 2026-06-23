"use client";

import Link from "next/link";

import { RecommendedNextStep } from "../../components/RecommendedNextStep";
import { useEffect, useMemo, useState } from "react";

import { defectGuides, troubleshootingHref } from "../../lib/defect-data";

type Category = "Defects" | "Troubleshooting" | "Lessons" | "Lessons Learned" | "Materials" | "Scientific Molding";

type Lesson = {
  id: string;
  title: string;
  machineNumber: string;
  moldNumber: string;
  partNumber: string;
  material: string;
  defect: string;
  problemEncountered: string;
  rootCauseDiscovered: string;
  solutionImplemented: string;
  keyLessonLearned: string;
  tags: string;
};

type SearchResult = {
  category: Category;
  title: string;
  description: string;
  why: string;
  href: string;
  keywords: string[];
};

const storageKey = "moldingMentorLessonsLearned";
const suggestedSearches = ["Flash", "Short shot", "Splay", "Warpage", "Burn marks", "Gate seal", "Material drying"];

const appResults: SearchResult[] = [
  {
    category: "Troubleshooting",
    title: "Troubleshooting Assistant",
    description: "Work from the symptom to safe first checks, likely causes, and next actions.",
    why: "Use this when you have a defect, machine issue, process symptom, mold number, machine number, part number, or plain-English problem statement.",
    href: troubleshootingHref,
    keywords: ["troubleshooting", "problem", "issue", "root cause", "fix", "machine number", "mold number", "part number", "flash", "short shot", "splay", "burn marks", "warpage"],
  },
  {
    category: "Lessons",
    title: "Training Lessons",
    description: "Open beginner-friendly molding lessons and guided learning topics.",
    why: "Good when you want to learn the concept behind the answer before changing settings.",
    href: "/lessons",
    keywords: ["lesson", "training", "learn", "beginner", "decoupled molding", "process window", "gate seal", "scientific molding"],
  },
  {
    category: "Lessons Learned",
    title: "Lessons Learned Knowledge Base",
    description: "Search saved shop-floor lessons by defect, material, machine, mold, part, root cause, solution, or tags.",
    why: "Use this to find what your team already learned from similar jobs, molds, machines, materials, and part numbers.",
    href: "/knowledge-base",
    keywords: ["lessons learned", "knowledge base", "machine number", "mold number", "part number", "material", "root cause", "solution", "history"],
  },
  {
    category: "Materials",
    title: "Material Troubleshooter",
    description: "Check resin, drying, contamination, color, regrind, lot, and handling problems.",
    why: "Helpful for splay, brittleness, color streaks, moisture, drying, material names, and lot changes.",
    href: "/materials/troubleshooter",
    keywords: ["material", "resin", "drying", "moisture", "splay", "nylon", "abs", "polycarbonate", "pp", "pe", "acetal", "lot", "regrind", "contamination"],
  },
  {
    category: "Materials",
    title: "Resin Drying Guide",
    description: "Review drying basics and material handling checks before running resin.",
    why: "Start here for material drying, moisture, splay, bubbles, brittleness, and dryer setup questions.",
    href: "/materials/resin-drying",
    keywords: ["material drying", "drying", "dryer", "dew point", "moisture", "splay", "bubbles", "resin", "hopper"],
  },
  {
    category: "Scientific Molding",
    title: "Scientific Molding Studies",
    description: "Use studies to prove process windows, gate seal, fill balance, cooling, and pack/hold behavior.",
    why: "Helpful when a quick fix is not enough and you need data-backed process proof.",
    href: "/scientific-molding/studies",
    keywords: ["scientific molding", "gate seal", "process window", "fill study", "viscosity", "pack", "hold", "cooling", "study", "doe"],
  },
  {
    category: "Scientific Molding",
    title: "Gate Seal Study Lesson",
    description: "Learn how gate seal affects sink, voids, part weight, pack time, and dimensional stability.",
    why: "Use this for gate seal, sink marks, voids, underpacking, overpacking, or part-weight questions.",
    href: "/lessons/gate-seal-study",
    keywords: ["gate seal", "sink", "voids", "pack time", "hold time", "part weight", "underpacking", "overpacking"],
  },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[-_/]/g, " ").trim();
}

function scoreResult(result: SearchResult, query: string) {
  if (!query) return 1;
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const haystack = normalize([result.category, result.title, result.description, result.why, ...result.keywords].join(" "));
  return words.reduce((score, word) => score + (haystack.includes(word) ? 1 : 0), 0) + (haystack.includes(normalize(query)) ? 3 : 0);
}

function lessonToResult(lesson: Lesson): SearchResult {
  const labelParts = [lesson.machineNumber && `Machine ${lesson.machineNumber}`, lesson.moldNumber && `Mold ${lesson.moldNumber}`, lesson.partNumber && `Part ${lesson.partNumber}`, lesson.material].filter(Boolean);
  return {
    category: "Lessons Learned",
    title: lesson.title || "Untitled lesson learned",
    description: lesson.problemEncountered || lesson.keyLessonLearned || "Saved shop-floor lesson learned record.",
    why: `May help because it matches a saved lesson${labelParts.length ? ` for ${labelParts.join(", ")}` : " with similar symptoms, causes, or fixes"}.`,
    href: "/knowledge-base",
    keywords: Object.values(lesson).filter(Boolean),
  };
}

export default function KnowledgeSearchPage() {
  const [query, setQuery] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setLessons(JSON.parse(saved));
    } catch {
      setLessons([]);
    }
  }, []);

  const results = useMemo(() => {
    const defectResults: SearchResult[] = defectGuides.map((defect) => ({
      category: "Defects",
      title: defect.name,
      description: defect.description,
      why: `May help because it covers ${defect.name.toLowerCase()} symptoms, first checks, likely causes, and corrective actions in plain language.`,
      href: "/defects",
      keywords: [defect.name, defect.slug, defect.description, ...defect.causes, ...defect.checkFirst, ...defect.actions, ...defect.processAreas, ...defect.materialChecks],
    }));

    return [...defectResults, ...appResults, ...lessons.map(lessonToResult)]
      .map((result) => ({ result, score: scoreResult(result, query) }))
      .filter((match) => !query.trim() || match.score > 0)
      .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
      .map((match) => match.result);
  }, [lessons, query]);

  const groupedResults = useMemo(() => {
    return results.reduce<Record<Category, SearchResult[]>>((groups, result) => {
      groups[result.category] = [...(groups[result.category] ?? []), result];
      return groups;
    }, {} as Record<Category, SearchResult[]>);
  }, [results]);

  const categories: Category[] = ["Defects", "Troubleshooting", "Lessons", "Lessons Learned", "Materials", "Scientific Molding"];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-cyan-300/20 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10">← Back home</Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Knowledge Search</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Find the right molding answer fast.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Search defects, plain English symptoms, materials, mold numbers, machine numbers, part numbers, troubleshooting keywords, lessons, and scientific molding tools. The goal is learning, not just finding answers.</p>
          <label className="mt-6 block">
            <span className="text-sm font-bold text-slate-200">What are you looking for?</span>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Example: flash on mold 24, splay in nylon, gate seal, short shot"
              className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 py-4 text-base text-white outline-none ring-cyan-300/30 placeholder:text-slate-500 focus:ring-4"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedSearches.map((suggestion) => <button key={suggestion} onClick={() => setQuery(suggestion)} className="rounded-full bg-cyan-300 px-3 py-2 text-sm font-black text-slate-950 hover:bg-cyan-200" type="button">{suggestion}</button>)}
          </div>
        </header>

        <section className="mt-6 space-y-5">
          {results.length === 0 ? <p className="rounded-3xl border border-white/10 bg-white/10 p-5 text-slate-200">Try searching what you see on the part, like flash, splay, burn marks, or short shot.</p> : null}
          {categories.map((category) => groupedResults[category]?.length ? (
            <section key={category} className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white">{category}</h2>
                <span className="rounded-full bg-slate-950/70 px-3 py-1 text-sm font-bold text-cyan-100">{groupedResults[category].length}</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {groupedResults[category].map((result) => (
                  <article key={`${result.category}-${result.title}`} className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                    <h3 className="text-xl font-black text-cyan-100">{result.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{result.description}</p>
                    <p className="mt-3 rounded-2xl bg-slate-950/70 p-3 text-sm leading-6 text-emerald-100"><span className="font-black">Why this may help: </span>{result.why}</p>
                    <Link href={result.href} className="mt-4 rounded-2xl border border-cyan-300/30 px-4 py-3 text-center text-sm font-black text-cyan-100 hover:bg-cyan-300/10">Open tool/page →</Link>
                  </article>
                ))}
              </div>
            </section>
          ) : null)}
        </section>

        <RecommendedNextStep
          label="Troubleshooting Wizard"
          href={troubleshootingHref}
          reason="When search points to a likely defect or topic, use the wizard to turn that information into safe first checks and next actions."
          related={[{ label: "AI Coach", href: "/coach" }, { label: "Save lesson learned", href: "/knowledge-base" }]}
        />
      </div>
    </main>
  );
}
