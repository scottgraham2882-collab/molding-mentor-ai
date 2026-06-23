"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const walkthroughStorageKey = "molding-mentor-first-time-walkthrough-complete";
const restartWalkthroughEventName = "moldingmentor:restart-walkthrough";

const walkthroughSteps = [
  {
    eyebrow: "Step 1",
    title: "Welcome to Molding Mentor AI",
    mission: "Learn, Troubleshoot, Preserve Knowledge",
    bullets: ["A shop-floor helper for operators, technicians, and supervisors."],
  },
  {
    eyebrow: "Step 2",
    title: "Troubleshoot a Problem",
    bullets: ["Find root causes", "Get guided recommendations"],
  },
  {
    eyebrow: "Step 3",
    title: "Learn Injection Molding",
    bullets: ["Defects", "Scientific molding", "Best practices"],
  },
  {
    eyebrow: "Step 4",
    title: "Ask the Molding Coach",
    bullets: ["Describe a problem in plain English", "Get guided troubleshooting"],
  },
  {
    eyebrow: "Step 5",
    title: "Search Knowledge",
    bullets: ["Find lessons learned", "Find mentor notes", "Find case studies"],
  },
];

const finalActions = [
  { label: "Troubleshoot a Defect", href: "/problem" },
  { label: "Analyze a Photo", href: "/photo-analysis" },
  { label: "Learn Injection Molding", href: "/lessons" },
  { label: "Ask the Coach", href: "/coach" },
];

export function restartFirstTimeWalkthrough() {
  window.localStorage.removeItem(walkthroughStorageKey);
  window.dispatchEvent(new Event(restartWalkthroughEventName));
}

export default function FirstTimeWalkthrough() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const isFinalStep = currentStep === walkthroughSteps.length;
  const totalSteps = walkthroughSteps.length + 1;

  useEffect(() => {
    const openIfNeeded = () => {
      if (window.localStorage.getItem(walkthroughStorageKey) !== "true") {
        setCurrentStep(0);
        setIsOpen(true);
      }
    };

    openIfNeeded();
    window.addEventListener(restartWalkthroughEventName, openIfNeeded);

    return () => window.removeEventListener(restartWalkthroughEventName, openIfNeeded);
  }, []);

  const finishWalkthrough = () => {
    window.localStorage.setItem(walkthroughStorageKey, "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = walkthroughSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/85 p-3 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="walkthrough-title">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-slate-900 text-white shadow-2xl shadow-cyan-950/40">
        <div className="bg-gradient-to-br from-cyan-300/20 via-slate-900 to-emerald-300/15 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">First-time walkthrough</p>
            <button className="rounded-full border border-white/15 px-3 py-2 text-xs font-black text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/20" type="button" onClick={finishWalkthrough}>
              Skip
            </button>
          </div>

          <div className="mt-4 flex gap-1.5" aria-label={`Step ${currentStep + 1} of ${totalSteps}`}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <span key={index} className={`h-2 flex-1 rounded-full ${index <= currentStep ? "bg-cyan-300" : "bg-white/15"}`} />
            ))}
          </div>

          {isFinalStep ? (
            <div className="mt-6">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-200">Final step</p>
              <h2 id="walkthrough-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">What would you like help with today?</h2>
              <div className="mt-5 grid gap-3">
                {finalActions.map((action) => (
                  <Link key={action.href} href={action.href} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-base font-black text-white transition hover:border-cyan-300/60 hover:bg-cyan-300/15 focus:outline-none focus:ring-4 focus:ring-cyan-300/20" onClick={finishWalkthrough}>
                    {action.label} <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 min-h-64">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-200">{step.eyebrow}</p>
              <h2 id="walkthrough-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{step.title}</h2>
              {step.mission ? <p className="mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-4 text-lg font-black text-emerald-50">Mission: {step.mission}</p> : null}
              <ul className="mt-5 grid gap-3">
                {step.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-base font-bold leading-6 text-slate-100">✓ {bullet}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-white/10 bg-slate-950/75 p-4">
          <button className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-black text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-cyan-300/20" type="button" disabled={currentStep === 0} onClick={() => setCurrentStep((stepIndex) => Math.max(0, stepIndex - 1))}>
            Back
          </button>
          {isFinalStep ? (
            <button className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30" type="button" onClick={finishWalkthrough}>
              Finish
            </button>
          ) : (
            <button className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30" type="button" onClick={() => setCurrentStep((stepIndex) => Math.min(totalSteps - 1, stepIndex + 1))}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
