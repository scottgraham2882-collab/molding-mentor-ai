"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  suffix: string;
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
  suffix,
  helper,
  min = "0",
  step = "0.1",
  onChange,
}: NumberFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-bold text-slate-100">{label}</span>
      <div className="mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-inner shadow-black/20 focus-within:border-cyan-300/70 focus-within:ring-4 focus-within:ring-cyan-300/10">
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
        <span className="flex items-center border-l border-white/10 px-3 text-sm font-bold text-cyan-100/80">
          {suffix}
        </span>
      </div>
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-400">{helper}</span> : null}
    </label>
  );
}

function getUsageMessage(usage: number) {
  if (usage <= 0) {
    return "Enter both values to calculate shot size usage.";
  }

  if (usage < 20) {
    return "Usage is low. Verify residence time, recovery control, and whether a smaller barrel is more appropriate.";
  }

  if (usage > 80) {
    return "Usage is high. Confirm recovery capacity, cushion control, and whether the machine can consistently deliver the shot.";
  }

  return "Usage is in a common working range for many molding applications. Confirm against your validated process window.";
}

export default function ShotSizeUsageCalculatorPage() {
  const [machineShotCapacity, setMachineShotCapacity] = useState("8");
  const [actualShotWeight, setActualShotWeight] = useState("3.2");

  const shotSizeUsage = useMemo(() => {
    const capacity = parseInput(machineShotCapacity);
    return capacity > 0 ? (parseInput(actualShotWeight) / capacity) * 100 : 0;
  }, [machineShotCapacity, actualShotWeight]);

  const usageMessage = getUsageMessage(shotSizeUsage);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/20 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.24),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.16),transparent_32%)]" />
          <div className="relative">
            <Link
              href="/calculators"
              className="inline-flex items-center rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10"
            >
              ← Back to calculators
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Process Calculator
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Shot Size Usage Calculator
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Compare actual shot weight against machine shot capacity to understand how much of the available barrel shot is being used.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-5 shadow-xl shadow-black/25 backdrop-blur sm:p-6">
            <h2 className="text-2xl font-bold text-white">Inputs</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Enter both values in ounces. The calculator applies: actual shot weight ÷ machine shot capacity × 100.
            </p>

            <div className="mt-6 grid gap-5">
              <NumberField
                id="machine-shot-capacity"
                label="Machine shot capacity"
                value={machineShotCapacity}
                suffix="oz"
                helper="Maximum shot capacity of the injection unit, using the same ounce basis as the actual shot weight."
                onChange={setMachineShotCapacity}
              />
              <NumberField
                id="actual-shot-weight"
                label="Actual shot weight"
                value={actualShotWeight}
                suffix="oz"
                helper="Total molded shot weight, including parts, runners, sprues, and other molded material."
                onChange={setActualShotWeight}
              />
            </div>
          </article>

          <aside className="grid gap-5">
            <div className="rounded-[1.75rem] border border-cyan-300/25 bg-cyan-300/10 p-5 shadow-xl shadow-cyan-950/20 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Shot size usage</p>
              <p className="mt-3 text-5xl font-black text-white">{formatNumber(shotSizeUsage)}%</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{usageMessage}</p>
            </div>

            <div className="rounded-[1.75rem] border border-amber-300/20 bg-amber-300/10 p-5 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-200">Formula</p>
              <p className="mt-3 text-base leading-7 text-slate-100">
                Shot size usage percentage = actual shot weight ÷ machine shot capacity × 100.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-red-300/20 bg-red-400/10 p-5 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-200">Validation warning</p>
              <p className="mt-3 text-base leading-7 text-slate-100">
                Use this as a quick screening tool. Always verify shot capacity, material density assumptions, cushion stability, and machine recovery with actual process data.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
