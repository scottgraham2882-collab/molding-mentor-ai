"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { clearLearningEvents, getLearningEvents, LearningEvent } from "../../lib/learning-data";

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return "Unknown date";
  }
}

function countBy(events: LearningEvent[], key: "defect" | "tool") {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    const value = event[key]?.trim();
    if (!value) return;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 6);
}

export default function LearningDataPage() {
  const [events, setEvents] = useState<LearningEvent[]>([]);

  useEffect(() => {
    setEvents(getLearningEvents());
  }, []);

  const recentEvents = events.slice(0, 12);
  const commonDefects = useMemo(() => countBy(events, "defect"), [events]);
  const usedTools = useMemo(() => countBy(events, "tool"), [events]);
  const feedbackEvents = events.filter((event) => event.type === "user_feedback");
  const helpfulCount = feedbackEvents.filter((event) => event.feedbackResponse === "yes").length;
  const needsHelpCount = feedbackEvents.filter((event) => event.feedbackResponse === "no").length;

  function handleClear() {
    clearLearningEvents();
    setEvents([]);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
          <Link href="/" className="inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10">← Back home</Link>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Learning data foundation</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Local learning activity</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Beginner-friendly view of what the app can learn from later: troubleshooting cases, feedback, defect selections, photo review results, AI Coach questions, and lessons learned entries.
          </p>
          <p className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-bold leading-6 text-amber-50">
            This data stays on this device for now. Future versions can use a secure database.
          </p>
        </header>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Learning events" value={events.length} helper="Saved on this device" />
          <SummaryCard label="Defects searched" value={commonDefects.reduce((total, item) => total + item.count, 0)} helper="Selections with a defect" />
          <SummaryCard label="Tools used" value={usedTools.length} helper="Unique learning sources" />
          <SummaryCard label="Feedback notes" value={feedbackEvents.length} helper={`${helpfulCount} helpful · ${needsHelpCount} need work`} />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/25 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Recent learning events</p>
                <h2 className="mt-2 text-2xl font-black text-white">Latest local activity</h2>
              </div>
              <button type="button" onClick={handleClear} className="rounded-2xl border border-rose-300/30 px-4 py-3 text-sm font-black text-rose-100 hover:bg-rose-300/10">Clear local data</button>
            </div>

            <div className="mt-5 space-y-3">
              {recentEvents.length ? recentEvents.map((event) => (
                <article key={event.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="w-fit rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">{event.type.replaceAll("_", " ")}</span>
                    <span className="text-xs font-semibold text-slate-400">{event.tool} · {formatDate(event.createdAt)}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-black text-white">{event.title}</h3>
                  {event.summary ? <p className="mt-2 text-sm leading-6 text-slate-300">{event.summary}</p> : null}
                </article>
              )) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-8 text-center text-sm leading-6 text-slate-400">
                  No learning events yet. Try the Problem Helper, Photo Analysis, or a feedback prompt to save activity locally.
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <RankedList title="Most common defects searched" items={commonDefects} empty="No defect searches yet." />
            <RankedList title="Most used tools" items={usedTools} empty="No tool activity yet." />
            <section className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/25">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">Feedback summary</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-emerald-300/10 p-4 text-center"><p className="text-3xl font-black text-emerald-200">{helpfulCount}</p><p className="text-xs font-bold text-slate-300">Helpful</p></div>
                <div className="rounded-2xl bg-rose-300/10 p-4 text-center"><p className="text-3xl font-black text-rose-200">{needsHelpCount}</p><p className="text-xs font-bold text-slate-300">Need work</p></div>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, helper }: { label: string; value: number; helper: string }) {
  return <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20"><p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{label}</p><p className="mt-3 text-4xl font-black text-white">{value}</p><p className="mt-1 text-sm font-semibold text-slate-400">{helper}</p></article>;
}

function RankedList({ title, items, empty }: { title: string; items: { label: string; count: number }[]; empty: string }) {
  return <section className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/25"><p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">{title}</p><div className="mt-4 space-y-2">{items.length ? items.map((item) => <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-950/70 px-4 py-3 text-sm"><span className="font-bold text-white">{item.label}</span><span className="font-black text-cyan-200">{item.count}</span></div>) : <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">{empty}</p>}</div></section>;
}
