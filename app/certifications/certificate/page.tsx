import PrintButton from "./PrintButton";
import Link from "next/link";

export default function CertificatePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 print:bg-white print:p-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 print:max-w-none">
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Link href="/certifications" className="text-sm font-bold text-cyan-200 hover:text-cyan-100">
            ← Certification Center
          </Link>
          <PrintButton />
        </div>

        <article className="relative overflow-hidden rounded-[2rem] border border-cyan-200/40 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 print:min-h-screen print:rounded-none print:border-8 print:border-slate-900 print:bg-white print:p-12 print:shadow-none sm:p-10">
          <div className="absolute inset-4 rounded-[1.5rem] border border-white/10 print:border-slate-300" />
          <div className="relative flex min-h-[680px] flex-col items-center justify-between text-center print:min-h-[8.5in]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-cyan-300 print:text-slate-600">AI Molding Coach</p>
              <h1 className="mt-8 text-4xl font-black tracking-tight text-white print:text-5xl print:text-slate-950 sm:text-6xl">
                Certificate of Completion
              </h1>
              <p className="mt-8 text-sm uppercase tracking-[0.28em] text-slate-400 print:text-slate-600">Presented to</p>
              <p className="mt-4 border-b border-cyan-200/40 px-10 pb-3 text-3xl font-black text-white print:border-slate-400 print:text-slate-950 sm:text-5xl">
                Molding Mentor Learner
              </p>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-300 print:text-slate-700">
                For successfully completing the Injection Molding Operator Level 1 certification path, including required training modules, quiz assessments, and competency checkpoints.
              </p>
            </div>

            <div className="grid w-full gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 print:border-slate-300 print:bg-white">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quiz score</p>
                <p className="mt-2 text-3xl font-black text-white print:text-slate-950">94%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 print:border-slate-300 print:bg-white">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Modules</p>
                <p className="mt-2 text-3xl font-black text-white print:text-slate-950">6/6</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 print:border-slate-300 print:bg-white">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
                <p className="mt-2 text-3xl font-black text-white print:text-slate-950">Certified</p>
              </div>
            </div>

            <footer className="grid w-full gap-8 pt-10 sm:grid-cols-2">
              <div className="border-t border-cyan-200/40 pt-3 print:border-slate-400">
                <p className="font-bold text-white print:text-slate-950">Training Supervisor</p>
                <p className="text-sm text-slate-400">Authorized signature</p>
              </div>
              <div className="border-t border-cyan-200/40 pt-3 print:border-slate-400">
                <p className="font-bold text-white print:text-slate-950">June 22, 2026</p>
                <p className="text-sm text-slate-400">Issue date</p>
              </div>
            </footer>
          </div>
        </article>
      </section>
    </main>
  );
}
