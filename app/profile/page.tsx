"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { demoUser, getStoredUser, StoredUser } from "../../lib/account-storage";
import { demoProgress, getProgressSummary } from "../../lib/progress-data";

const summary = getProgressSummary(demoProgress);

export default function ProfilePage() {
  const [user, setUser] = useState<StoredUser>(demoUser);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link href="/" className="w-fit text-sm font-bold text-cyan-200 hover:text-cyan-100">← Dashboard</Link>
        <header className="rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300">User profile</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{user.name}</h1>
              <p className="mt-3 text-slate-300">{user.role} · {user.company}</p>
              <p className="mt-1 text-sm text-slate-400">{user.email} · Joined {user.joinedOn}</p>
            </div>
            <div className="grid gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-4xl font-black text-white">{summary.trainingProgress}%</p>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-100">Training progress</p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-5"><p className="text-3xl font-black text-white">{summary.completedLessons}</p><p className="text-sm text-slate-300">Completed lessons</p></article>
          <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-5"><p className="text-3xl font-black text-white">{summary.certificationsEarned}</p><p className="text-sm text-slate-300">Certifications earned</p></article>
          <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-5"><p className="text-3xl font-black text-white">{summary.lessonsRemaining}</p><p className="text-sm text-slate-300">Lessons remaining</p></article>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Panel title="Completed lessons" items={demoProgress.completedLessons} />
          <Panel title="Quiz scores" items={demoProgress.quizScores.map((quiz) => `${quiz.lesson}: ${quiz.score}% (${quiz.takenOn})`)} />
          <Panel title="Certifications" items={demoProgress.certifications.map((certification) => certification.earnedOn ? `${certification.title}: earned ${certification.earnedOn}` : `${certification.title}: ${certification.progress}% complete`)} />
          <Panel title="Calculator history" items={demoProgress.calculatorHistory.map((item) => `${item.calculator}: ${item.result} — ${item.input} (${item.usedOn})`)} />
          <Panel title="AI Coach conversations" items={demoProgress.coachConversations.map((conversation) => `${conversation.topic}: ${conversation.summary} (${conversation.updatedOn})`)} />
        </section>
      </section>
    </main>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item) => <li key={item} className="rounded-2xl bg-white/[0.06] p-3">{item}</li>)}
      </ul>
    </article>
  );
}
