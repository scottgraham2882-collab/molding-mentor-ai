"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { readStoredFeedback, StoredFeedback } from "../../components/FeedbackPrompt";

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return "Unknown date";
  }
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<StoredFeedback[]>([]);

  useEffect(() => {
    setFeedback(readStoredFeedback());
  }, []);

  const yesTotal = feedback.filter((item) => item.response === "yes").length;
  const noTotal = feedback.filter((item) => item.response === "no").length;
  const comments = useMemo(() => feedback.filter((item) => item.comment.trim()).slice(0, 12), [feedback]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <Link href="/" className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10">
            ← Back home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Feedback admin</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Simple feedback dashboard</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Local-only view of whether users say the app helped and what they typed into the optional feedback boxes.
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Total Yes responses</p>
            <p className="mt-3 text-5xl font-black text-white">{yesTotal}</p>
          </article>
          <article className="rounded-3xl border border-rose-300/20 bg-rose-300/10 p-5 shadow-xl shadow-slate-950/20 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-300">Total No responses</p>
            <p className="mt-3 text-5xl font-black text-white">{noTotal}</p>
          </article>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Common feedback comments</p>
              <h2 className="mt-2 text-2xl font-black text-white">Recent comments saved on this device</h2>
            </div>
            <p className="text-sm text-slate-300">{comments.length} comment{comments.length === 1 ? "" : "s"}</p>
          </div>

          <div className="mt-5 space-y-3">
            {comments.length ? (
              comments.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${item.response === "yes" ? "bg-emerald-300 text-slate-950" : "bg-rose-300 text-slate-950"}`}>
                      {item.response === "yes" ? "👍 Yes" : "👎 No"}
                    </span>
                    <span className="text-xs text-slate-400">{item.page} · {formatDate(item.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-200">“{item.comment}”</p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-6 text-center text-sm leading-6 text-slate-400">
                No written comments yet. Ask a user to tap Yes or No and optionally add a note.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
