"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { saveStoredUser } from "../../../lib/account-storage";

export default function RegisterPage() {
  const [created, setCreated] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    saveStoredUser({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? ""),
      company: String(formData.get("company") ?? ""),
      joinedOn: "Jun 2026",
    });
    setCreated(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-cyan-950/30 sm:p-8">
        <Link href="/" className="text-sm font-bold text-cyan-200 hover:text-cyan-100">← Dashboard</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-cyan-300">User registration</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Create your training account.</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
          Save a profile for lesson progress, quiz scores, certifications, calculator history, and AI Coach conversations.
        </p>

        {created ? (
          <div className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-5">
            <h2 className="text-xl font-black text-white">Account created</h2>
            <p className="mt-2 text-sm text-emerald-100">Your demo account is saved in this browser.</p>
            <Link href="/profile" className="mt-4 inline-flex rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950">View profile</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            {[{ id: "name", label: "Full name", type: "text" }, { id: "email", label: "Email", type: "email" }, { id: "role", label: "Job role", type: "text" }, { id: "company", label: "Company / team", type: "text" }].map((field) => (
              <label key={field.id} className="grid gap-2 text-sm font-bold text-slate-200">
                {field.label}
                <input name={field.id} type={field.type} required className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-bold text-slate-200">
              Password
              <input name="password" type="password" required minLength={8} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300" />
            </label>
            <button type="submit" className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-950">Create account</button>
            <Link href="/account/login" className="text-center text-sm font-bold text-cyan-100">Already have an account? Log in</Link>
          </form>
        )}
      </section>
    </main>
  );
}
