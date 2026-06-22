"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  helper?: string;
  min?: string;
  step?: string;
  onChange: (value: string) => void;
};

function parseInput(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatNumber(value: number, digits = 1) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: value % 1 === 0 ? 0 : digits,
  });
}

function NumberField({
  id,
  label,
  value,
  helper,
  min = "0",
  step = "0.1",
  onChange,
}: NumberFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-bold text-slate-100">{label}</span>
      <div className="mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-inner shadow-black/20 focus-within:border-emerald-300/70 focus-within:ring-4 focus-within:ring-emerald-300/10">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-500"
        />
        <span className="flex items-center border-l border-white/10 px-3 text-sm font-bold text-emerald-100/80">
          sec
        </span>
      </div>
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-400">{helper}</span> : null}
    </label>
  );
}

export default function CycleTimeEstimatorPage() {
  const [fillTime, setFillTime] = useState("1.2");
  const [packHoldTime, setPackHoldTime] = useState("4");
  const [coolingTime, setCoolingTime] = useState("18");
  const [moldOpenTime, setMoldOpenTime] = useState("2");
  const [ejectionTime, setEjectionTime] = useState("1.5");
  const [moldCloseTime, setMoldCloseTime] = useState("1.5");

  const estimatedCycleTime = useMemo(
    () =>
      parseInput(fillTime) +
      parseInput(packHoldTime) +
      parseInput(coolingTime) +
      parseInput(moldOpenTime) +
      parseInput(ejectionTime) +
      parseInput(moldCloseTime),
    [fillTime, packHoldTime, coolingTime, moldOpenTime, ejectionTime, moldCloseTime],
  );

  const partsPerHour = estimatedCycleTime > 0 ? 3600 / estimatedCycleTime : 0;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-emerald-950/20 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.24),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.16),transparent_32%)]" />
          <div className="relative">
            <Link
              href="/calculators"
              className="inline-flex items-center rounded-full border border-emerald-300/30 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-300/10"
            >
              ← Back to calculators
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Process Calculator
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Cycle Time Estimator
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Add each phase of the molding sequence to estimate total cycle time and the resulting parts-per-hour output.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-5 shadow-xl shadow-black/25 backdrop-blur sm:p-6">
            <h2 className="text-2xl font-bold text-white">Inputs</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Enter all cycle segments in seconds. The estimator adds injection, hold, cooling, and mold movement time.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <NumberField id="fill-time" label="Fill time" value={fillTime} helper="Injection fill time to transfer." onChange={setFillTime} />
              <NumberField id="pack-hold-time" label="Pack/hold time" value={packHoldTime} helper="Pressure hold time through gate seal." onChange={setPackHoldTime} />
              <NumberField id="cooling-time" label="Cooling time" value={coolingTime} helper="Cooling time needed for stable ejection." onChange={setCoolingTime} />
              <NumberField id="mold-open-time" label="Mold open time" value={moldOpenTime} helper="Time for the mold to open safely." onChange={setMoldOpenTime} />
              <NumberField id="ejection-time" label="Ejection time" value={ejectionTime} helper="Part release, robot pick, or drop time." onChange={setEjectionTime} />
              <NumberField id="mold-close-time" label="Mold close time" value={moldCloseTime} helper="Time for mold close and clamp ready." onChange={setMoldCloseTime} />
            </div>
          </article>

          <aside className="grid gap-5">
            <div className="rounded-[1.75rem] border border-emerald-300/25 bg-emerald-300/10 p-5 shadow-xl shadow-emerald-950/20 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">Estimated total cycle time</p>
              <p className="mt-3 text-5xl font-black text-white">{formatNumber(estimatedCycleTime)} sec</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Sum of fill, pack/hold, cooling, mold open, ejection, and mold close time.</p>
            </div>

            <div className="rounded-[1.75rem] border border-cyan-300/25 bg-cyan-300/10 p-5 shadow-xl shadow-cyan-950/20 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Parts per hour</p>
              <p className="mt-3 text-5xl font-black text-white">{formatNumber(partsPerHour, 0)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Formula: 3,600 seconds ÷ estimated total cycle time.</p>
            </div>

            <div className="rounded-[1.75rem] border border-amber-300/20 bg-amber-300/10 p-5 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-200">Quality reminder</p>
              <p className="mt-3 text-base leading-7 text-slate-100">
                Reducing cycle time should never sacrifice part quality, gate seal, cooling stability, or safe machine operation.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
