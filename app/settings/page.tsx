"use client";

import Link from "next/link";
import { restartFirstTimeWalkthrough } from "../../components/FirstTimeWalkthrough";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl">
        <Link href="/" className="text-sm font-bold text-cyan-200 hover:text-cyan-100">← Back to home</Link>
        <div className="mt-5 rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/25 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Settings</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">App settings</h1>
          <p className="mt-3 text-base leading-7 text-slate-300">
            Restart the beginner walkthrough any time a new operator, technician, or supervisor needs a quick orientation.
          </p>

          <section className="mt-6 rounded-[1.5rem] border border-cyan-300/20 bg-slate-950/60 p-4 sm:p-5" aria-labelledby="walkthrough-settings-heading">
            <h2 id="walkthrough-settings-heading" className="text-xl font-black text-white">First-Time User Walkthrough</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Opens the mobile-first guide covering troubleshooting, learning, the Molding Coach, and knowledge search.
            </p>
            <button className="mt-4 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-base font-black text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300/30 sm:w-auto" type="button" onClick={restartFirstTimeWalkthrough}>
              Restart walkthrough
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}
