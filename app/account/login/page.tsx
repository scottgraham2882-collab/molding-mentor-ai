"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoggedIn(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-cyan-950/30 sm:p-8">
        <Link href="/" className="text-sm font-bold text-cyan-200 hover:text-cyan-100">← Dashboard</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-cyan-300">User login</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Log in to continue training.</h1>
        {loggedIn ? (
          <div className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-5">
            <p className="font-bold text-emerald-100">Login successful for this demo session.</p>
            <Link href="/profile" className="mt-4 inline-flex rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950">Open profile</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-slate-200">Email<input type="email" required className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            <label className="grid gap-2 text-sm font-bold text-slate-200">Password<input type="password" required className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            <button type="submit" className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-950">Log in</button>
            <Link href="/account/register" className="text-center text-sm font-bold text-cyan-100">Need an account? Register</Link>
          </form>
        )}
      </section>
    </main>
  );
}
