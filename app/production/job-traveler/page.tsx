"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type TravelerStatus = "Pending" | "In Setup" | "Running" | "Quality Hold" | "Complete";

type TravelerSectionKey =
  | "materialVerification"
  | "moldVerification"
  | "startupApproval"
  | "firstArticleApproval"
  | "productionRunNotes"
  | "qualityChecks"
  | "packagingVerification"
  | "finalApproval";

type TravelerForm = {
  jobNumber: string;
  customer: string;
  partNumber: string;
  moldNumber: string;
  machineNumber: string;
  material: string;
  lotNumber: string;
  plannedQuantity: string;
  startDate: string;
  dueDate: string;
  status: TravelerStatus;
  sections: Record<TravelerSectionKey, string>;
};

type JobTraveler = TravelerForm & {
  id: string;
  updatedAt: string;
};

type Field = {
  key: keyof Omit<TravelerForm, "sections" | "status">;
  label: string;
  type?: "text" | "date" | "number";
  placeholder?: string;
  required?: boolean;
};

type TravelerSection = {
  key: TravelerSectionKey;
  title: string;
  helper: string;
};

const storageKey = "molding-mentor-production-job-travelers";

const statusOptions: TravelerStatus[] = ["Pending", "In Setup", "Running", "Quality Hold", "Complete"];

const emptySections: Record<TravelerSectionKey, string> = {
  materialVerification: "",
  moldVerification: "",
  startupApproval: "",
  firstArticleApproval: "",
  productionRunNotes: "",
  qualityChecks: "",
  packagingVerification: "",
  finalApproval: "",
};

const emptyTraveler: TravelerForm = {
  jobNumber: "",
  customer: "",
  partNumber: "",
  moldNumber: "",
  machineNumber: "",
  material: "",
  lotNumber: "",
  plannedQuantity: "",
  startDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  status: "Pending",
  sections: emptySections,
};

const fields: Field[] = [
  { key: "jobNumber", label: "Job number", placeholder: "JOB-24018", required: true },
  { key: "customer", label: "Customer", placeholder: "Customer name", required: true },
  { key: "partNumber", label: "Part number", placeholder: "PN-77821", required: true },
  { key: "moldNumber", label: "Mold number", placeholder: "M-1042", required: true },
  { key: "machineNumber", label: "Machine number", placeholder: "Press 12", required: true },
  { key: "material", label: "Material", placeholder: "ABS natural", required: true },
  { key: "lotNumber", label: "Lot number", placeholder: "LOT-88510" },
  { key: "plannedQuantity", label: "Planned quantity", type: "number", placeholder: "25000", required: true },
  { key: "startDate", label: "Start date", type: "date", required: true },
  { key: "dueDate", label: "Due date", type: "date", required: true },
];

const travelerSections: TravelerSection[] = [
  { key: "materialVerification", title: "Material Verification", helper: "Resin, colorant, dryer, lot traceability, and release checks." },
  { key: "moldVerification", title: "Mold Verification", helper: "Tool number, setup condition, water, hydraulics, safeties, and maintenance notes." },
  { key: "startupApproval", title: "Startup Approval", helper: "Process sheet match, safety checks, startup samples, and approval signature." },
  { key: "firstArticleApproval", title: "First Article Approval", helper: "Dimensional, visual, functional, and quality release notes." },
  { key: "productionRunNotes", title: "Production Run Notes", helper: "Shift notes, process changes, downtime, scrap, and handoff instructions." },
  { key: "qualityChecks", title: "Quality Checks", helper: "Inspection frequency, critical dimensions, defects, holds, and dispositions." },
  { key: "packagingVerification", title: "Packaging Verification", helper: "Labels, containers, counts, customer requirements, and pallet pattern." },
  { key: "finalApproval", title: "Final Approval", helper: "Final quantity, completion status, reviewer, date, and release notes." },
];

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function statusClass(status: TravelerStatus) {
  switch (status) {
    case "Complete":
      return "border-emerald-300/40 bg-emerald-300/15 text-emerald-100";
    case "Running":
      return "border-cyan-300/40 bg-cyan-300/15 text-cyan-100";
    case "In Setup":
      return "border-blue-300/40 bg-blue-300/15 text-blue-100";
    case "Quality Hold":
      return "border-amber-300/50 bg-amber-300/15 text-amber-100";
    default:
      return "border-slate-300/30 bg-white/10 text-slate-100";
  }
}

export default function ProductionJobTravelerPage() {
  const [travelers, setTravelers] = useState<JobTraveler[]>([]);
  const [form, setForm] = useState<TravelerForm>({ ...emptyTraveler, sections: { ...emptySections } });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedTravelers = window.localStorage.getItem(storageKey);
    if (storedTravelers) setTravelers(JSON.parse(storedTravelers) as JobTraveler[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(travelers));
  }, [isLoaded, travelers]);

  const sortedTravelers = useMemo(
    () => [...travelers].sort((a, b) => `${b.startDate}-${b.updatedAt}`.localeCompare(`${a.startDate}-${a.updatedAt}`)),
    [travelers],
  );

  function resetForm() {
    setForm({ ...emptyTraveler, startDate: new Date().toISOString().slice(0, 10), sections: { ...emptySections } });
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();

    if (editingId) {
      setTravelers((current) => current.map((traveler) => (traveler.id === editingId ? { ...form, id: editingId, updatedAt } : traveler)));
      resetForm();
      return;
    }

    setTravelers((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editTraveler(traveler: JobTraveler) {
    const { id, updatedAt, ...editableTraveler } = traveler;
    void id;
    void updatedAt;
    setForm({ ...editableTraveler, sections: { ...editableTraveler.sections } });
    setEditingId(traveler.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteTraveler(id: string) {
    setTravelers((current) => current.filter((traveler) => traveler.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6 print:max-w-none print:space-y-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-0 print:bg-white print:p-0 print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Production tools</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Production Job Traveler</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">Create, save, edit, and print job travelers that follow each production order from material verification through final approval.</p>
            </div>
            <button type="button" onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 print:hidden">Print travelers</button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6 print:hidden">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-white">{editingId ? "Edit job traveler" : "Create job traveler"}</h2>
            {editingId ? <button type="button" onClick={resetForm} className="text-sm font-bold text-cyan-200">Cancel edit</button> : null}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <label key={field.key}>
                <span className="text-sm font-bold text-slate-200">{field.label}</span>
                <input type={field.type ?? "text"} min={field.type === "number" ? "0" : undefined} value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} required={field.required} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
              </label>
            ))}
            <label>
              <span className="text-sm font-bold text-slate-200">Status</span>
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TravelerStatus }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300">
                {statusOptions.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {travelerSections.map((section) => (
              <label key={section.key} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                <span className="text-sm font-black text-white">{section.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-400">{section.helper}</span>
                <textarea value={form.sections[section.key]} onChange={(event) => setForm((current) => ({ ...current, sections: { ...current.sections, [section.key]: event.target.value } }))} rows={4} placeholder="Record verification details, initials, timestamps, open actions, and approval notes..." className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">{editingId ? "Save changes" : "Create traveler"}</button>
            <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-black text-slate-100 transition hover:border-cyan-300/50">Clear form</button>
          </div>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6 print:border-0 print:bg-white print:p-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between print:hidden">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Saved travelers</p>
              <h2 className="mt-2 text-2xl font-black text-white">{sortedTravelers.length} traveler{sortedTravelers.length === 1 ? "" : "s"}</h2>
            </div>
            <p className="text-sm text-slate-400">Saved in this browser with local storage.</p>
          </div>

          <div className="mt-5 grid gap-4 print:mt-0">
            {sortedTravelers.length ? sortedTravelers.map((traveler) => (
              <article key={traveler.id} className="break-inside-avoid rounded-3xl border border-white/10 bg-slate-900/90 p-5 shadow-lg shadow-slate-950/30 print:mb-4 print:border-slate-300 print:bg-white print:p-4 print:shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300 print:text-slate-600">Job {traveler.jobNumber || "Unnumbered"}</p>
                    <h3 className="mt-2 text-2xl font-black text-white print:text-slate-950">{traveler.customer || "No customer"}</h3>
                    <p className="mt-1 text-sm text-slate-300 print:text-slate-700">Part {traveler.partNumber || "—"} · Mold {traveler.moldNumber || "—"} · Machine {traveler.machineNumber || "—"}</p>
                  </div>
                  <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] print:border-slate-400 print:bg-white print:text-slate-950 ${statusClass(traveler.status)}`}>{traveler.status}</span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div><dt className="font-bold text-slate-400 print:text-slate-600">Material</dt><dd className="text-white print:text-slate-950">{traveler.material || "—"}</dd></div>
                  <div><dt className="font-bold text-slate-400 print:text-slate-600">Lot number</dt><dd className="text-white print:text-slate-950">{traveler.lotNumber || "—"}</dd></div>
                  <div><dt className="font-bold text-slate-400 print:text-slate-600">Planned quantity</dt><dd className="text-white print:text-slate-950">{traveler.plannedQuantity || "—"}</dd></div>
                  <div><dt className="font-bold text-slate-400 print:text-slate-600">Dates</dt><dd className="text-white print:text-slate-950">{formatDate(traveler.startDate)} → {formatDate(traveler.dueDate)}</dd></div>
                </dl>

                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                  {travelerSections.map((section) => (
                    <section key={section.key} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 print:border-slate-300 print:bg-white">
                      <h4 className="text-sm font-black text-white print:text-slate-950">{section.title}</h4>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300 print:text-slate-700">{traveler.sections[section.key] || "No notes recorded."}</p>
                    </section>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 print:hidden">
                  <button type="button" onClick={() => editTraveler(traveler)} className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-white/15">Edit</button>
                  <button type="button" onClick={() => deleteTraveler(traveler.id)} className="rounded-xl bg-rose-400/15 px-4 py-2 text-sm font-bold text-rose-100 transition hover:bg-rose-400/25">Delete</button>
                </div>
              </article>
            )) : (
              <div className="rounded-3xl border border-dashed border-white/15 p-8 text-center text-slate-400 print:hidden">No saved travelers yet. Create the first production job traveler above.</div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
