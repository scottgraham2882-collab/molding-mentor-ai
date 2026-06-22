"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  min?: string;
  step?: string;
  onChange: (value: string) => void;
};

function parseInput(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
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
  suffix,
  min = "0",
  step = "0.1",
  onChange,
}: NumberFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <div className="mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 focus-within:border-cyan-300/60 focus-within:ring-4 focus-within:ring-cyan-300/10">
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
        {suffix ? (
          <span className="flex items-center border-l border-white/10 px-3 text-sm font-semibold text-slate-400">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

function ResultCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{note}</p>
    </div>
  );
}

export default function CalculatorsPage() {
  const [projectedArea, setProjectedArea] = useState("24");
  const [cavityPressure, setCavityPressure] = useState("4");
  const [safetyFactor, setSafetyFactor] = useState("10");

  const [shotWeight, setShotWeight] = useState("3.2");
  const [barrelCapacity, setBarrelCapacity] = useState("8");

  const [fillTime, setFillTime] = useState("1.2");
  const [packTime, setPackTime] = useState("4");
  const [coolingTime, setCoolingTime] = useState("18");
  const [moldOpenTime, setMoldOpenTime] = useState("5");

  const [targetCushion, setTargetCushion] = useState("0.20");
  const [lowCushion, setLowCushion] = useState("0.16");
  const [highCushion, setHighCushion] = useState("0.24");

  const clampTonnage = useMemo(() => {
    const baseTons = parseInput(projectedArea) * parseInput(cavityPressure);
    return baseTons * (1 + parseInput(safetyFactor) / 100);
  }, [projectedArea, cavityPressure, safetyFactor]);

  const shotUsage = useMemo(() => {
    const capacity = parseInput(barrelCapacity);
    return capacity > 0 ? (parseInput(shotWeight) / capacity) * 100 : 0;
  }, [shotWeight, barrelCapacity]);

  const cycleTime = useMemo(
    () =>
      parseInput(fillTime) +
      parseInput(packTime) +
      parseInput(coolingTime) +
      parseInput(moldOpenTime),
    [fillTime, packTime, coolingTime, moldOpenTime],
  );

  const cushionSpread = useMemo(
    () => Math.max(0, parseInput(highCushion) - parseInput(lowCushion)),
    [highCushion, lowCushion],
  );
  const cushionWindow = parseInput(targetCushion) * 0.2;
  const cushionStatus = cushionSpread <= cushionWindow ? "Stable" : "Review variation";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.18),transparent_34%)]" />
          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
            >
              ← Back to coach
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Process Calculator
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Quick molding process estimates
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Use these simple calculators for first-pass setup conversations, then confirm with actual machine data, material behavior, and part quality.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-2 lg:gap-6">
          <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-2xl font-bold text-white">Clamp tonnage estimate</h2>
              <Link
                href="/calculators/clamp-tonnage"
                className="inline-flex w-fit items-center rounded-full border border-amber-300/30 px-3 py-1.5 text-sm font-bold text-amber-100 transition hover:border-amber-200 hover:bg-amber-300/10"
              >
                Open full calculator →
              </Link>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Estimate clamp force from projected area and expected plastic pressure.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <NumberField id="projected-area" label="Projected area" value={projectedArea} suffix="in²" onChange={setProjectedArea} />
              <NumberField id="cavity-pressure" label="Pressure factor" value={cavityPressure} suffix="tons/in²" onChange={setCavityPressure} />
              <NumberField id="safety-factor" label="Safety factor" value={safetyFactor} suffix="%" onChange={setSafetyFactor} />
            </div>
            <div className="mt-5">
              <ResultCard label="Estimated clamp" value={`${formatNumber(clampTonnage)} tons`} note="Formula: projected area × pressure factor × safety factor." />
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <h2 className="text-2xl font-bold text-white">Shot size usage percentage</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Compare total shot weight to machine barrel capacity.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <NumberField id="shot-weight" label="Part + runner shot" value={shotWeight} suffix="oz" onChange={setShotWeight} />
              <NumberField id="barrel-capacity" label="Barrel capacity" value={barrelCapacity} suffix="oz" onChange={setBarrelCapacity} />
            </div>
            <div className="mt-5">
              <ResultCard label="Barrel usage" value={`${formatNumber(shotUsage)}%`} note="Many processes target a comfortable mid-range shot usage instead of extremes." />
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <h2 className="text-2xl font-bold text-white">Cycle time estimator</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Add core phases together to estimate total cycle time.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <NumberField id="fill-time" label="Fill time" value={fillTime} suffix="sec" onChange={setFillTime} />
              <NumberField id="pack-time" label="Pack / hold time" value={packTime} suffix="sec" onChange={setPackTime} />
              <NumberField id="cooling-time" label="Cooling time" value={coolingTime} suffix="sec" onChange={setCoolingTime} />
              <NumberField id="mold-open-time" label="Mold open / eject" value={moldOpenTime} suffix="sec" onChange={setMoldOpenTime} />
            </div>
            <div className="mt-5">
              <ResultCard label="Estimated cycle" value={`${formatNumber(cycleTime)} sec`} note="Use as a planning number before confirming recovery, cooling, and robot timing." />
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
            <h2 className="text-2xl font-bold text-white">Cushion consistency checklist</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Check whether observed cushion readings stay within a simple ±20% target window.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <NumberField id="target-cushion" label="Target cushion" value={targetCushion} suffix="in" step="0.01" onChange={setTargetCushion} />
              <NumberField id="low-cushion" label="Lowest reading" value={lowCushion} suffix="in" step="0.01" onChange={setLowCushion} />
              <NumberField id="high-cushion" label="Highest reading" value={highCushion} suffix="in" step="0.01" onChange={setHighCushion} />
            </div>
            <div className="mt-5">
              <ResultCard label="Checklist result" value={cushionStatus} note={`Observed spread is ${formatNumber(cushionSpread, 2)} in. Verify non-return valve, transfer stability, and material feed if variation grows.`} />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
