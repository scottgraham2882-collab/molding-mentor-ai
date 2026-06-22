"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type DocumentType = "Work Instruction" | "Process Sheet" | "Quality Form" | "Training Material" | "Safety Document" | "Other";
type DocumentStatus = "Draft" | "Active" | "Under Review" | "Obsolete";

type DocumentRecord = {
  id: string;
  title: string;
  type: DocumentType;
  number: string;
  revision: string;
  owner: string;
  effectiveDate: string;
  reviewDueDate: string;
  status: DocumentStatus;
  notes: string;
  updatedAt: string;
};

type Filters = {
  type: "All" | DocumentType;
  status: "All" | DocumentStatus;
  owner: string;
  reviewWindow: "All" | "Due now" | "Due in 30 days" | "Overdue";
};

const storageKey = "molding-mentor-document-control-records";
const documentTypes: DocumentType[] = ["Work Instruction", "Process Sheet", "Quality Form", "Training Material", "Safety Document", "Other"];
const statuses: DocumentStatus[] = ["Draft", "Active", "Under Review", "Obsolete"];

const emptyDocument = (): Omit<DocumentRecord, "id" | "updatedAt"> => ({
  title: "",
  type: "Work Instruction",
  number: "",
  revision: "A",
  owner: "",
  effectiveDate: new Date().toISOString().slice(0, 10),
  reviewDueDate: "",
  status: "Draft",
  notes: "",
});

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function daysUntilReview(value: string) {
  if (!value) return Number.POSITIVE_INFINITY;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(`${value}T00:00:00`);
  return Math.ceil((dueDate.getTime() - today.getTime()) / 86_400_000);
}

function reviewBadge(document: DocumentRecord) {
  const days = daysUntilReview(document.reviewDueDate);
  if (!Number.isFinite(days)) return "No review date";
  if (days < 0) return "Review overdue";
  if (days === 0) return "Review due today";
  if (days <= 30) return `Review due in ${days} day${days === 1 ? "" : "s"}`;
  return "Review current";
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [form, setForm] = useState(emptyDocument);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ type: "All", status: "All", owner: "", reviewWindow: "All" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedDocuments = window.localStorage.getItem(storageKey);
    if (storedDocuments) setDocuments(JSON.parse(storedDocuments) as DocumentRecord[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(documents));
  }, [documents, isLoaded]);

  const owners = useMemo(
    () => Array.from(new Set(documents.map((document) => document.owner.trim()).filter(Boolean))).sort(),
    [documents],
  );

  const dueForReview = useMemo(
    () => documents.filter((document) => document.status !== "Obsolete" && daysUntilReview(document.reviewDueDate) <= 30),
    [documents],
  );

  const stats = useMemo(() => ({
    total: documents.length,
    active: documents.filter((document) => document.status === "Active").length,
    due: dueForReview.length,
  }), [documents, dueForReview.length]);

  const filteredDocuments = useMemo(() => documents
    .filter((document) => filters.type === "All" || document.type === filters.type)
    .filter((document) => filters.status === "All" || document.status === filters.status)
    .filter((document) => !filters.owner || document.owner === filters.owner)
    .filter((document) => {
      const days = daysUntilReview(document.reviewDueDate);
      if (filters.reviewWindow === "Overdue") return days < 0;
      if (filters.reviewWindow === "Due now") return days <= 0;
      if (filters.reviewWindow === "Due in 30 days") return days <= 30;
      return true;
    })
    .sort((a, b) => `${daysUntilReview(a.reviewDueDate)}-${a.title}`.localeCompare(`${daysUntilReview(b.reviewDueDate)}-${b.title}`)),
  [documents, filters]);

  function resetForm() {
    setForm(emptyDocument());
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();
    if (editingId) {
      setDocuments((current) => current.map((document) => document.id === editingId ? { ...form, id: editingId, updatedAt } : document));
      resetForm();
      return;
    }
    setDocuments((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editDocument(document: DocumentRecord) {
    setForm({
      title: document.title,
      type: document.type,
      number: document.number,
      revision: document.revision,
      owner: document.owner,
      effectiveDate: document.effectiveDate,
      reviewDueDate: document.reviewDueDate,
      status: document.status,
      notes: document.notes,
    });
    setEditingId(document.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteDocument(id: string) {
    setDocuments((current) => current.filter((document) => document.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 print:border-0 print:bg-white print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Management Tools</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white print:text-slate-950">Document Control System</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 print:text-slate-700">Create, revise, filter, and print a controlled document list for molding work instructions, process sheets, quality forms, training material, and safety documents.</p>
            </div>
            <button onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 print:hidden">Print control list</button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3 print:grid-cols-3">
          {[{ label: "Total documents", value: stats.total }, { label: "Active", value: stats.active }, { label: "Due for review", value: stats.due }].map((stat) => (
            <article key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 print:border-slate-300 print:bg-white">
              <p className="text-4xl font-black text-white print:text-slate-950">{stat.value}</p>
              <h2 className="mt-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100 print:text-slate-700">{stat.label}</h2>
            </article>
          ))}
        </section>

        {dueForReview.length ? <section className="rounded-[2rem] border border-amber-300/30 bg-amber-300/10 p-5 print:hidden"><h2 className="text-xl font-black text-amber-100">Documents due for review</h2><div className="mt-3 grid gap-2">{dueForReview.map((document) => <button key={document.id} onClick={() => editDocument(document)} className="rounded-2xl border border-amber-200/20 bg-slate-950/50 p-4 text-left text-sm text-slate-100"><strong>{document.number || "No number"} Rev {document.revision}</strong> · {document.title} · {reviewBadge(document)}</button>)}</div></section> : null}

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 print:hidden sm:grid-cols-2">
          <h2 className="text-2xl font-black text-white sm:col-span-2">{editingId ? "Edit document record" : "Create document record"}</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Document title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Press startup work instruction" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Document type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DocumentType })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">{documentTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Document number<input required value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="WI-001" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Revision level<input required value={form.revision} onChange={(e) => setForm({ ...form, revision: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="A" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Owner<input required value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Quality manager" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as DocumentStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Effective date<input type="date" value={form.effectiveDate} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Review due date<input type="date" value={form.reviewDueDate} onChange={(e) => setForm({ ...form, reviewDueDate: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Notes<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="min-h-24 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Change summary, approval notes, related processes, storage location" /></label>
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row"><button className="rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Create document record"}</button>{editingId ? <button type="button" onClick={resetForm} className="rounded-2xl border border-white/15 px-5 py-3 font-black text-white">Cancel edit</button> : null}</div>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 print:border-0 print:bg-white print:p-0">
          <div className="mb-5 grid gap-3 print:hidden sm:grid-cols-4">
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value as Filters["type"] })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option>All</option>{documentTypes.map((type) => <option key={type}>{type}</option>)}</select>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as Filters["status"] })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
            <select value={filters.owner} onChange={(e) => setFilters({ ...filters, owner: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option value="">All owners</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</select>
            <select value={filters.reviewWindow} onChange={(e) => setFilters({ ...filters, reviewWindow: e.target.value as Filters["reviewWindow"] })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option>All</option><option>Due now</option><option>Due in 30 days</option><option>Overdue</option></select>
          </div>
          <div className="hidden print:mb-4 print:block"><h2 className="text-2xl font-black">Document Control List</h2><p className="text-sm text-slate-700">Printed {formatDate(new Date().toISOString().slice(0, 10))}</p></div>
          <div className="grid gap-4">
            {filteredDocuments.length === 0 ? <p className="rounded-3xl border border-dashed border-white/15 p-6 text-slate-300 print:text-slate-700">No document records match the current filters.</p> : null}
            {filteredDocuments.map((document) => (
              <article key={document.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 print:break-inside-avoid print:border-slate-300 print:bg-white">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200 print:text-slate-600">{document.type} · {document.number || "No number"}</p><h3 className="mt-2 text-2xl font-black text-white print:text-slate-950">{document.title}</h3></div>
                  <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-200 print:border-slate-300 print:text-slate-700">{document.status}</span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4"><div><dt className="font-bold text-slate-400">Revision</dt><dd>{document.revision}</dd></div><div><dt className="font-bold text-slate-400">Owner</dt><dd>{document.owner}</dd></div><div><dt className="font-bold text-slate-400">Effective</dt><dd>{formatDate(document.effectiveDate)}</dd></div><div><dt className="font-bold text-slate-400">Review due</dt><dd>{formatDate(document.reviewDueDate)}<br /><span className="text-cyan-200 print:text-slate-600">{reviewBadge(document)}</span></dd></div></dl>
                {document.notes ? <p className="mt-4 rounded-2xl bg-white/[0.06] p-4 text-sm text-slate-300 print:border print:border-slate-200 print:bg-white print:text-slate-700"><strong>Notes:</strong> {document.notes}</p> : null}
                <div className="mt-5 flex gap-3 print:hidden"><button onClick={() => editDocument(document)} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">Edit</button><button onClick={() => deleteDocument(document.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 text-sm font-black text-rose-100">Delete</button></div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
