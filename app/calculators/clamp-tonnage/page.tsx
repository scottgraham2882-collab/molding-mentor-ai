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

const pressureExamples = [
  { label: "Easy flow material", value: 3000 },
  { label: "Average material", value: 5000 },
  { label: "Stiff/high viscosity material", value: 7000 },
];

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
      <div className="mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-inner shadow-black/20 focus-within:border-amber-300/70 focus-within:ring-4 focus-within:ring-amber-300/10">
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
        <span className="flex items-center border-l border-white/10 px-3 text-sm font-bold text-amber-100/80">
          {suffix}
        </span>
      </div>
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-400">{helper}</span> : null}
    </label>
  );
}

export default function ClampTonnageCalculatorPage() {
  const [projectedPartArea, setProjectedPartArea] = useState("24");
  const [cavities, setCavities] = useState("1");
  const [pressureFactor, setPressureFactor] = useState("5000");

  const totalProjectedArea = useMemo(
    () => parseInput(projectedPartArea) * parseInput(cavities),
    [projectedPartArea, cavities],
  );

  const estimatedClampTonnage = useMemo(
    () => (parseInput(projectedPartArea) * parseInput(cavities) * parseInput(pressureFactor)) / 2000,
    [projectedPartArea, cavities, pressureFactor],
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-amber-950/20 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.24),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.16),transparent_32%)]" />
          <div className="relative">
            <Link
              href="/calculators"
              className="inline-flex items-center rounded-full border border-amber-300/30 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-200 hover:bg-amber-300/10"
            >
              ← Back to calculators
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Process Calculator
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Clamp Tonnage Calculator
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Estimate the machine clamp force needed to hold the mold closed from projected part area, cavity count, and a material pressure factor.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-5 shadow-xl shadow-black/25 backdrop-blur sm:p-6">
            <h2 className="text-2xl font-bold text-white">Inputs</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Use square inches for projected part area and psi for the pressure factor. The calculator applies: projected area × cavities × pressure factor / 2000.
            </p>

            <div className="mt-6 grid gap-5">
              <NumberField
                id="projected-part-area"
                label="Projected part area"
                value={projectedPartArea}
                suffix="in²"
                helper="Area of one part as viewed in the clamp direction."
                onChange={setProjectedPartArea}
              />
              <NumberField
                id="cavities"
                label="Number of cavities"
                value={cavities}
                suffix="cavities"
                min="1"
                step="1"
                helper="Total production cavities sharing the same clamp force."
                onChange={setCavities}
              />
              <NumberField
                id="pressure-factor"
                label="Material pressure factor"
                value={pressureFactor}
                suffix="psi"
                step="100"
                helper="Select an example below or enter your validated material/process factor."
                onChange={setPressureFactor}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-amber-200">
                Common pressure factor examples
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {pressureExamples.map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => setPressureFactor(String(example.value))}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left transition hover:border-amber-200/50 hover:bg-amber-300/10 focus:outline-none focus:ring-4 focus:ring-amber-300/20"
                  >
                    <span className="block text-sm font-bold text-white">{example.label}</span>
                    <span className="mt-2 block text-lg font-black text-amber-200">
                      {formatNumber(example.value, 0)} psi
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </article>

          <aside className="grid gap-5">
            <div className="rounded-[1.75rem] border border-cyan-300/20 bg-cyan-300/10 p-5 shadow-xl shadow-cyan-950/20 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Total projected area</p>
              <p className="mt-3 text-4xl font-black text-white">{formatNumber(totalProjectedArea)} in²</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Projected part area multiplied by the number of cavities.</p>
            </div>

            <div className="rounded-[1.75rem] border border-amber-300/25 bg-amber-300/10 p-5 shadow-xl shadow-amber-950/20 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">Estimated clamp tonnage</p>
              <p className="mt-3 text-5xl font-black text-white">{formatNumber(estimatedClampTonnage)} tons</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Formula: projected area × cavities × pressure factor / 2000.</p>
            </div>

            <div className="rounded-[1.75rem] border border-red-300/20 bg-red-400/10 p-5 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-200">Validation warning</p>
              <p className="mt-3 text-base leading-7 text-slate-100">
                This is an estimate. Always verify with machine data, mold condition, and process validation.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
