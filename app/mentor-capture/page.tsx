"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type MentorCaptureEntry = {
  id: string;
  problem: string;
  defect: string;
  equipment: string;
  changedBefore: string;
  checkedFirst: string;
  didNotFix: string;
  actualFix: string;
  teachNewTech: string;
  warning: string;
  tags: string;
  createdAt: string;
};

type MentorCaptureForm = Omit<MentorCaptureEntry, "id" | "createdAt">;

const storageKey = "moldingMentorKnowledgeCapture";

const emptyForm: MentorCaptureForm = {
  problem: "",
  defect: "",
  equipment: "",
  changedBefore: "",
  checkedFirst: "",
  didNotFix: "",
  actualFix: "",
  teachNewTech: "",
  warning: "",
  tags: "",
};

const prompts: Array<{ key: keyof MentorCaptureForm; label: string; helper: string; placeholder: string }> = [
  {
    key: "problem",
    label: "1. What problem did you see?",
    helper: "Describe what the part, press, or process was doing in plain language.",
    placeholder: "Example: Parts started showing silver streaks near the gate after lunch.",
  },
  {
    key: "defect",
    label: "2. What defect was it?",
    helper: "Use the shop name for the defect if that is what people recognize.",
    placeholder: "Example: Splay / silver streaks",
  },
  {
    key: "equipment",
    label: "3. What machine, mold, or material was involved?",
    helper: "Capture the identifiers a technician would search for later.",
    placeholder: "Example: Press 12, Mold 44A, clear PC lot 26-104",
  },
  {
    key: "changedBefore",
    label: "4. What changed before the problem started?",
    helper: "Think about material lots, color, dryer, mold work, settings, shift change, or maintenance.",
    placeholder: "Example: New gaylord was connected and dryer hose was moved.",
  },
  {
    key: "checkedFirst",
    label: "5. What did you check first?",
    helper: "Teach the first safe checks before changing process settings.",
    placeholder: "Example: Checked dryer temperature, hose connection, and hopper lid.",
  },
  {
    key: "didNotFix",
    label: "6. What did NOT fix it?",
    helper: "This prevents the next person from repeating the same dead end.",
    placeholder: "Example: Raising back pressure and slowing screw recovery did not remove it.",
  },
  {
    key: "actualFix",
    label: "7. What actually fixed it?",
    helper: "Be specific about the action that made good parts return.",
    placeholder: "Example: Replaced cracked dryer hose, dried fresh material for 4 hours, purged barrel.",
  },
  {
    key: "teachNewTech",
    label: "8. What would you teach a new technician?",
    helper: "Turn the experience into a simple lesson.",
    placeholder: "Example: Always prove material condition before chasing splay with barrel settings.",
  },
  {
    key: "warning",
    label: "9. What warning would you give someone?",
    helper: "Call out the mistake, safety risk, or quality risk to avoid.",
    placeholder: "Example: Do not keep increasing heat; wet material can look like a processing issue.",
  },
  {
    key: "tags",
    label: "10. What tags apply?",
    helper: "Separate tags with commas so they are easy to search later.",
    placeholder: "Example: splay, drying, material change, Press 12, PC",
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function buildVersions(entry: MentorCaptureEntry) {
  const tagList = entry.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .join(", ");

  return {
    mentorNote: `When you see ${entry.defect || "this defect"}, slow down and ask what changed first. In this case, ${entry.problem || "the problem was observed on the floor"}. The equipment/material involved was ${entry.equipment || "not recorded"}. The first useful checks were: ${entry.checkedFirst || "not recorded"}. Teach a new technician: ${entry.teachNewTech || "capture the lesson before it is forgotten"}. Warning: ${entry.warning || "do not skip the basic checks"}.`,
    caseStudy: `Problem: ${entry.problem || "Not recorded"}\nDefect: ${entry.defect || "Not recorded"}\nMachine/Mold/Material: ${entry.equipment || "Not recorded"}\nWhat changed: ${entry.changedBefore || "Not recorded"}\nFirst checks: ${entry.checkedFirst || "Not recorded"}\nWhat did not fix it: ${entry.didNotFix || "Not recorded"}\nActual fix: ${entry.actualFix || "Not recorded"}\nLesson for new technicians: ${entry.teachNewTech || "Not recorded"}\nWarning: ${entry.warning || "Not recorded"}\nTags: ${tagList || "None"}`,
    troubleshootingTip: `If ${entry.defect || "a defect"} appears, check what changed before adjusting the process. Start with: ${entry.checkedFirst || "basic machine, mold, and material checks"}. Avoid repeating: ${entry.didNotFix || "unproven adjustments"}. Proven fix: ${entry.actualFix || "not recorded"}.`,
  };
}

export default function MentorCapturePage() {
  const [entries, setEntries] = useState<MentorCaptureEntry[]>([]);
  const [form, setForm] = useState<MentorCaptureForm>(emptyForm);
  const [savedEntry, setSavedEntry] = useState<MentorCaptureEntry | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setEntries(JSON.parse(saved));
    } catch {
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries]);

  const versions = useMemo(() => (savedEntry ? buildVersions(savedEntry) : null), [savedEntry]);

  function updateField(key: keyof MentorCaptureForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entry: MentorCaptureEntry = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setEntries((current) => [entry, ...current]);
    setSavedEntry(entry);
    setForm(emptyForm);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link href="/" className="text-sm font-bold text-cyan-200 hover:text-white">← Back to dashboard</Link>

        <section className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Capture Knowledge</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Scott&apos;s Mentor Knowledge Capture</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Save real-world injection molding experience while it is fresh. Answer simple shop-floor questions once, then turn the story into a mentor note, case study, and troubleshooting tip.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 sm:p-6">
          <div className="mb-5 rounded-2xl bg-cyan-300/10 p-4 text-sm text-cyan-50">
            Beginner tip: do not worry about perfect wording. Write what happened, what you tried, and what fixed it. You can polish it later.
          </div>

          <div className="grid gap-4">
            {prompts.map((prompt) => (
              <label key={prompt.key} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <span className="block text-base font-black text-white">{prompt.label}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-400">{prompt.helper}</span>
                <textarea
                  value={form[prompt.key]}
                  onChange={(event) => updateField(prompt.key, event.target.value)}
                  placeholder={prompt.placeholder}
                  rows={prompt.key === "tags" || prompt.key === "defect" ? 2 : 3}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
                />
              </label>
            ))}
          </div>

          <button type="submit" className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 transition hover:bg-white sm:w-auto">
            Save and create teaching versions
          </button>
        </form>

        {versions && savedEntry ? (
          <section className="grid gap-4 md:grid-cols-3">
            {[
              ["Mentor Note version", versions.mentorNote],
              ["Case Study version", versions.caseStudy],
              ["Troubleshooting Tip version", versions.troubleshootingTip],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Saved {formatDate(savedEntry.createdAt)}</p>
                <h2 className="mt-2 text-xl font-black text-white">{title}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-200">{text}</p>
              </article>
            ))}
          </section>
        ) : null}

        <section className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Local storage</p>
              <h2 className="text-2xl font-black text-white">Saved captures</h2>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-slate-300">{entries.length} entries</span>
          </div>
          <div className="mt-4 grid gap-3">
            {entries.length === 0 ? <p className="text-sm text-slate-400">No mentor captures saved yet.</p> : entries.map((entry) => (
              <button key={entry.id} type="button" onClick={() => setSavedEntry(entry)} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-left transition hover:border-cyan-300/50">
                <p className="text-sm font-black text-white">{entry.defect || "Untitled defect"} — {entry.equipment || "No equipment listed"}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">{entry.problem || "No problem description recorded."}</p>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
