"use client";

export default function PrintButton() {
  return (
    <button
      className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 transition hover:bg-cyan-200"
      type="button"
      onClick={() => window.print()}
    >
      Print certificate
    </button>
  );
}
