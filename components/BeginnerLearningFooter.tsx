import Link from "next/link";

export default function BeginnerLearningFooter() {
  return (
    <footer className="bg-slate-950 px-4 pb-6 text-slate-100 sm:px-6 lg:px-8 print:hidden">
      <div className="mx-auto max-w-6xl rounded-[1.5rem] border border-cyan-300/25 bg-slate-900/90 p-4 text-center shadow-xl shadow-cyan-950/20 sm:p-5">
        <p className="text-base font-black text-white">
          New to injection molding?{" "}
          <Link className="text-cyan-200 underline decoration-cyan-300/60 underline-offset-4 hover:text-cyan-100" href="/learning-paths">
            Start with Learning Paths.
          </Link>
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Learn the basics first, then come back to the troubleshooting, quality, and production tools.
        </p>
      </div>
    </footer>
  );
}
