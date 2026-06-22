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

type CalculatorCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  children: React.ReactNode;
  result: React.ReactNode;
};

function parseInput(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value: number, digits = 2) {
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

function CalculatorCard({
  eyebrow,
  title,
  description,
  accent,
  children,
  result,
}: CalculatorCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-slate-950/20 backdrop-blur sm:p-6">
      <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${accent}`} aria-hidden="true" />
      <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
      <div className="mt-5 grid gap-4">{children}</div>
      <div className="mt-5 flex-1 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
        {result}
      </div>
    </article>
  );
}

function Result({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">{label}</p>
      <p className="mt-2 text-3xl font-black text-white sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{note}</p>
    </>
  );
}

export default function CalculatorsPage() {
  const [projectedArea, setProjectedArea] = useState("24");
  const [cavityPressure, setCavityPressure] = useState("4000");

  const [partWeight, setPartWeight] = useState("0.35");
  const [runnerWeight, setRunnerWeight] = useState("0.2");
  const [numberOfCavities, setNumberOfCavities] = useState("4");

  const [screwRpm, setScrewRpm] = useState("120");
  const [shotSize, setShotSize] = useState("1.6");
  const [screwCapacity, setScrewCapacity] = useState("0.08");

  const clampTonnage = useMemo(
    () => (parseInput(projectedArea) * parseInput(cavityPressure)) / 2000,
    [projectedArea, cavityPressure],
  );

  const totalShotWeight = useMemo(
    () => parseInput(partWeight) * parseInput(numberOfCavities) + parseInput(runnerWeight),
    [partWeight, numberOfCavities, runnerWeight],
  );

  const recoveryTime = useMemo(() => {
    const capacityPerSecond = (parseInput(screwRpm) * parseInput(screwCapacity)) / 60;
    return capacityPerSecond > 0 ? parseInput(shotSize) / capacityPerSecond : 0;
  }, [screwCapacity, screwRpm, shotSize]);

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
              ← Back to dashboard
            </Link>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Scientific Molding Calculator
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Shop-floor molding calculations
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Estimate clamp force, total shot weight, and screw recovery time from the core values molding teams review during setup and process validation.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6" aria-label="Scientific molding calculators">
          <CalculatorCard
            eyebrow="Clamp force"
            title="Clamp Tonnage Calculator"
            description="Calculate the minimum clamp force needed to hold the mold closed during injection."
            accent="from-amber-300 to-orange-400"
            result={
              <Result
                label="Required Clamp Tonnage"
                value={`${formatNumber(clampTonnage, 1)} tons`}
                note="Formula: projected area × cavity pressure ÷ 2,000. Add your plant's preferred safety margin before selecting a press."
              />
            }
          >
            <NumberField id="projected-area" label="Projected Area" value={projectedArea} suffix="sq in" onChange={setProjectedArea} />
            <NumberField id="cavity-pressure" label="Cavity Pressure" value={cavityPressure} suffix="psi" step="50" onChange={setCavityPressure} />
          </CalculatorCard>

          <CalculatorCard
            eyebrow="Shot planning"
            title="Shot Size Calculator"
            description="Estimate the total material weight required for one complete shot."
            accent="from-cyan-300 to-blue-400"
            result={
              <Result
                label="Total Shot Weight"
                value={`${formatNumber(totalShotWeight, 2)} oz`}
                note="Formula: part weight × number of cavities + runner weight. Keep units consistent for all weight inputs."
              />
            }
          >
            <NumberField id="part-weight" label="Part Weight" value={partWeight} suffix="oz" step="0.01" onChange={setPartWeight} />
            <NumberField id="runner-weight" label="Runner Weight" value={runnerWeight} suffix="oz" step="0.01" onChange={setRunnerWeight} />
            <NumberField id="number-of-cavities" label="Number of Cavities" value={numberOfCavities} step="1" onChange={setNumberOfCavities} />
          </CalculatorCard>

          <CalculatorCard
            eyebrow="Plasticating"
            title="Recovery Time Calculator"
            description="Approximate screw recovery time based on screw speed and measured output capacity."
            accent="from-emerald-300 to-lime-400"
            result={
              <Result
                label="Estimated Recovery Time"
                value={`${formatNumber(recoveryTime, 1)} sec`}
                note="Formula: shot size ÷ ((screw RPM × screw capacity) ÷ 60). Confirm against actual recovery before locking cycle time."
              />
            }
          >
            <NumberField id="screw-rpm" label="Screw RPM" value={screwRpm} suffix="rpm" step="1" onChange={setScrewRpm} />
            <NumberField id="shot-size" label="Shot Size" value={shotSize} suffix="oz" step="0.01" onChange={setShotSize} />
            <NumberField id="screw-capacity" label="Screw Capacity" value={screwCapacity} suffix="oz/rev" step="0.01" onChange={setScrewCapacity} />
          </CalculatorCard>
        </section>
      </div>
    </main>
  );
}
