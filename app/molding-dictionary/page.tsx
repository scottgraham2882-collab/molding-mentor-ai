"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type DictionaryTerm = {
  id: string;
  term: string;
  category: string;
  plainMeaning: string;
  shopFloorExample: string;
  whyItMatters: string;
  relatedTerms: string[];
};

type CustomTermForm = Omit<DictionaryTerm, "id" | "relatedTerms"> & { relatedTerms: string };

const storageKey = "moldingMentorDictionaryCustomTerms";

const starterTerms: DictionaryTerm[] = [
  {
    id: "cushion",
    term: "Cushion",
    category: "Process Settings",
    plainMeaning: "The small amount of material left in front of the screw after injection finishes.",
    shopFloorExample: "If cushion suddenly drops to zero, the screw may be bottoming out and the part may not be packed consistently.",
    whyItMatters: "Stable cushion helps prove the shot size and transfer are repeatable before changing pack or hold settings.",
    relatedTerms: ["Shot size", "Transfer position", "Pack pressure"],
  },
  {
    id: "transfer-position",
    term: "Transfer Position",
    category: "Process Settings",
    plainMeaning: "The screw position where the machine switches from filling the part to packing the part.",
    shopFloorExample: "A late transfer can overfill the cavity and create flash before hold pressure even starts.",
    whyItMatters: "Transfer is one of the first settings to verify when fill balance, short shots, flash, or cushion changes appear.",
    relatedTerms: ["Fill", "Pack", "Cushion"],
  },
  {
    id: "gate-seal",
    term: "Gate Seal",
    category: "Scientific Molding",
    plainMeaning: "The point when the gate freezes and no more plastic can be packed into the part.",
    shopFloorExample: "If part weight no longer increases after adding hold time, the gate is probably sealed.",
    whyItMatters: "Knowing gate seal prevents wasted hold time and helps control sink, voids, dimensions, and cycle time.",
    relatedTerms: ["Hold time", "Pack pressure", "Part weight"],
  },
  {
    id: "splay",
    term: "Splay",
    category: "Defects",
    plainMeaning: "Silver, splash-like streaks on the part surface, often linked to moisture, gas, or shear.",
    shopFloorExample: "Splay after a material change should trigger drying and contamination checks before chasing random temperatures.",
    whyItMatters: "It can point to material handling, drying, barrel temperature, screw recovery, or venting problems.",
    relatedTerms: ["Moisture", "Drying", "Venting"],
  },
  {
    id: "short-shot",
    term: "Short Shot",
    category: "Defects",
    plainMeaning: "A part that did not completely fill out before the plastic stopped flowing.",
    shopFloorExample: "A short shot at startup may come from low shot size, cold material, blocked gate, poor venting, or feed problems.",
    whyItMatters: "The safe first checks are material feed, cushion, transfer, fill speed, melt temperature, and vents.",
    relatedTerms: ["Fill", "Venting", "Shot size"],
  },
  {
    id: "flash",
    term: "Flash",
    category: "Defects",
    plainMeaning: "Thin unwanted plastic that escapes around the parting line, vents, ejectors, or shutoffs.",
    shopFloorExample: "Flash after a mold change may mean the mold is not clamped, seated, or protected correctly.",
    whyItMatters: "Flash can indicate mold damage, clamp issues, overpacking, high fill pressure, or worn shutoffs.",
    relatedTerms: ["Clamp tonnage", "Pack pressure", "Parting line"],
  },
  {
    id: "residence-time",
    term: "Residence Time",
    category: "Materials",
    plainMeaning: "How long plastic stays heated inside the barrel before it is molded into a part.",
    shopFloorExample: "A small shot in a large barrel can sit too long and degrade, causing black specks or burn-like defects.",
    whyItMatters: "Too much residence time can damage material; too little can cause poor melting or inconsistent parts.",
    relatedTerms: ["Shot size", "Barrel capacity", "Degradation"],
  },
  {
    id: "venting",
    term: "Venting",
    category: "Mold Basics",
    plainMeaning: "Small paths that let trapped air and gas escape from the mold as plastic fills the cavity.",
    shopFloorExample: "Burn marks at the end of fill often mean trapped air could not escape fast enough.",
    whyItMatters: "Poor venting can cause burns, shorts, weak weld lines, and pressure spikes.",
    relatedTerms: ["Burn marks", "Short shot", "Weld line"],
  },
];

const emptyForm: CustomTermForm = {
  term: "",
  category: "Shop Notes",
  plainMeaning: "",
  shopFloorExample: "",
  whyItMatters: "",
  relatedTerms: "",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function parseRelatedTerms(value: string) {
  return value.split(",").map((term) => term.trim()).filter(Boolean);
}

export default function MoldingDictionaryPage() {
  const [customTerms, setCustomTerms] = useState<DictionaryTerm[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(starterTerms[0].id);
  const [form, setForm] = useState<CustomTermForm>(emptyForm);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as DictionaryTerm[];
      if (Array.isArray(parsed)) setCustomTerms(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(customTerms));
  }, [customTerms]);

  const allTerms = useMemo(() => [...starterTerms, ...customTerms].sort((a, b) => a.term.localeCompare(b.term)), [customTerms]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(allTerms.map((term) => term.category))).sort()], [allTerms]);

  const filteredTerms = useMemo(() => {
    const query = normalize(search);
    return allTerms.filter((entry) => {
      const searchable = [entry.term, entry.category, entry.plainMeaning, entry.shopFloorExample, entry.whyItMatters, ...entry.relatedTerms].join(" ").toLowerCase();
      return (!query || searchable.includes(query)) && (category === "All" || entry.category === category);
    });
  }, [allTerms, category, search]);

  const selectedTerm = allTerms.find((term) => term.id === selectedId) ?? filteredTerms[0] ?? allTerms[0];
  const relatedMatches = selectedTerm.relatedTerms
    .map((related) => allTerms.find((term) => normalize(term.term) === normalize(related)))
    .filter((term): term is DictionaryTerm => Boolean(term));

  function saveCustomTerm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newTerm: DictionaryTerm = { ...form, id: crypto.randomUUID(), relatedTerms: parseRelatedTerms(form.relatedTerms) };
    setCustomTerms((current) => [newTerm, ...current]);
    setSelectedId(newTerm.id);
    setForm(emptyForm);
  }

  function deleteCustomTerm(id: string) {
    setCustomTerms((current) => current.filter((term) => term.id !== id));
    if (selectedId === id) setSelectedId(starterTerms[0].id);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-cyan-300/20 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10">← Back home</Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Molding Dictionary MVP</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Plain-language molding terms for the shop floor.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">Search common injection molding words, see why each term matters, and add your plant’s own definitions so new team members learn the same language.</p>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-5">
              <h2 className="text-xl font-black text-white">Find a term</h2>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search cushion, splay, gate seal..." className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white">
                {categories.map((categoryName) => <option key={categoryName}>{categoryName}</option>)}
              </select>
              <p className="mt-3 text-sm font-semibold text-slate-300">Showing {filteredTerms.length} of {allTerms.length} terms.</p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-5">
              <h2 className="text-xl font-black text-white">Dictionary</h2>
              <div className="mt-4 max-h-[34rem] space-y-3 overflow-auto pr-1">
                {filteredTerms.map((entry) => (
                  <button key={entry.id} type="button" onClick={() => setSelectedId(entry.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selectedTerm.id === entry.id ? "border-cyan-300/70 bg-cyan-300/15" : "border-white/10 bg-slate-900/70 hover:border-cyan-300/40"}`}>
                    <span className="text-lg font-black text-cyan-100">{entry.term}</span>
                    <span className="mt-1 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">{entry.category}</span>
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-xl shadow-slate-950/30 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">{selectedTerm.category}</p>
                  <h2 className="mt-2 text-3xl font-black sm:text-4xl">{selectedTerm.term}</h2>
                </div>
                {customTerms.some((term) => term.id === selectedTerm.id) ? <button onClick={() => deleteCustomTerm(selectedTerm.id)} className="rounded-full bg-rose-200 px-4 py-2 text-sm font-black text-rose-950" type="button">Delete custom term</button> : null}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl border border-slate-200 p-4"><h3 className="font-black text-slate-900">Plain meaning</h3><p className="mt-2 text-sm leading-6 text-slate-700">{selectedTerm.plainMeaning}</p></article>
                <article className="rounded-2xl border border-slate-200 p-4"><h3 className="font-black text-slate-900">Shop-floor example</h3><p className="mt-2 text-sm leading-6 text-slate-700">{selectedTerm.shopFloorExample}</p></article>
                <article className="rounded-2xl border border-slate-200 p-4"><h3 className="font-black text-slate-900">Why it matters</h3><p className="mt-2 text-sm leading-6 text-slate-700">{selectedTerm.whyItMatters}</p></article>
              </div>
              <div className="mt-6 rounded-2xl bg-slate-100 p-4">
                <h3 className="font-black text-slate-900">Related terms</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTerm.relatedTerms.map((related) => <button key={related} onClick={() => setSearch(related)} className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-cyan-800 shadow-sm" type="button">{related}</button>)}
                </div>
                {relatedMatches.length > 0 ? <p className="mt-3 text-sm text-slate-600">Tip: {relatedMatches.map((term) => term.term).join(", ")} also exist in this dictionary.</p> : null}
              </div>
            </section>

            <form onSubmit={saveCustomTerm} className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-slate-950/30 sm:p-6">
              <div><p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">Plant language</p><h2 className="text-2xl font-black text-white">Add a custom term</h2></div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label><span className="text-sm font-bold text-slate-200">Term</span><input required value={form.term} onChange={(event) => setForm((current) => ({ ...current, term: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
                <label><span className="text-sm font-bold text-slate-200">Category</span><input required value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
                <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-200">Plain meaning</span><textarea required value={form.plainMeaning} onChange={(event) => setForm((current) => ({ ...current, plainMeaning: event.target.value }))} rows={2} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
                <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-200">Shop-floor example</span><textarea required value={form.shopFloorExample} onChange={(event) => setForm((current) => ({ ...current, shopFloorExample: event.target.value }))} rows={2} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
                <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-200">Why it matters</span><textarea required value={form.whyItMatters} onChange={(event) => setForm((current) => ({ ...current, whyItMatters: event.target.value }))} rows={2} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
                <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-200">Related terms (comma separated)</span><input value={form.relatedTerms} onChange={(event) => setForm((current) => ({ ...current, relatedTerms: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" /></label>
              </div>
              <button className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-3 text-base font-black text-slate-950 hover:bg-cyan-200" type="submit">Save custom dictionary term</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
