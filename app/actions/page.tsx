"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Category = "Safety" | "Quality" | "Production" | "Maintenance" | "Training" | "Customer" | "Other";
type Priority = "Low" | "Medium" | "High" | "Critical";
type Status = "Open" | "In Progress" | "Waiting" | "Completed" | "Overdue";

type ActionItem = {
  id: string;
  dateCreated: string;
  title: string;
  description: string;
  category: Category;
  assignedTo: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  notes: string;
  updatedAt: string;
};

type Filters = {
  status: "All" | Status;
  priority: "All" | Priority;
  category: "All" | Category;
  assignee: string;
};

const storageKey = "molding-mentor-action-items";
const categories: Category[] = ["Safety", "Quality", "Production", "Maintenance", "Training", "Customer", "Other"];
const priorities: Priority[] = ["Low", "Medium", "High", "Critical"];
const statuses: Status[] = ["Open", "In Progress", "Waiting", "Completed", "Overdue"];

const createEmptyAction = (): Omit<ActionItem, "id" | "updatedAt"> => ({
  dateCreated: new Date().toISOString().slice(0, 10),
  title: "",
  description: "",
  category: "Production",
  assignedTo: "",
  dueDate: "",
  priority: "Medium",
  status: "Open",
  notes: "",
});

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function isPastDue(item: ActionItem) {
  if (!item.dueDate || item.status === "Completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${item.dueDate}T00:00:00`) < today;
}

export default function ActionsPage() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [form, setForm] = useState(createEmptyAction);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ status: "All", priority: "All", category: "All", assignee: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedItems = window.localStorage.getItem(storageKey);
    if (storedItems) setItems(JSON.parse(storedItems) as ActionItem[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, isLoaded]);

  const counts = useMemo(() => ({
    open: items.filter((item) => item.status !== "Completed").length,
    overdue: items.filter(isPastDue).length,
    completed: items.filter((item) => item.status === "Completed").length,
  }), [items]);

  const assignees = useMemo(
    () => Array.from(new Set(items.map((item) => item.assignedTo.trim()).filter(Boolean))).sort(),
    [items],
  );

  const filteredItems = useMemo(() => items
    .filter((item) => filters.status === "All" || item.status === filters.status)
    .filter((item) => filters.priority === "All" || item.priority === filters.priority)
    .filter((item) => filters.category === "All" || item.category === filters.category)
    .filter((item) => !filters.assignee || item.assignedTo === filters.assignee)
    .sort((a, b) => `${a.status === "Completed" ? 1 : 0}-${a.dueDate || "9999-12-31"}`.localeCompare(`${b.status === "Completed" ? 1 : 0}-${b.dueDate || "9999-12-31"}`)),
  [items, filters]);

  function resetForm() {
    setForm(createEmptyAction());
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();
    if (editingId) {
      setItems((current) => current.map((item) => item.id === editingId ? { ...form, id: editingId, updatedAt } : item));
      resetForm();
      return;
    }
    setItems((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editItem(item: ActionItem) {
    setForm({
      dateCreated: item.dateCreated,
      title: item.title,
      description: item.description,
      category: item.category,
      assignedTo: item.assignedTo,
      dueDate: item.dueDate,
      priority: item.priority,
      status: item.status,
      notes: item.notes,
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 print:border-0 print:bg-white print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Management Tools</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white print:text-slate-950">Action Item Tracker</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700">Create, assign, filter, update, and print action items for molding production follow-up.</p>
            </div>
            <button onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 print:hidden">Print report</button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3 print:grid-cols-3">
          {[{ label: "Open", value: counts.open }, { label: "Overdue", value: counts.overdue }, { label: "Completed", value: counts.completed }].map((stat) => (
            <article key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 print:border-slate-300 print:bg-white">
              <p className="text-4xl font-black text-white print:text-slate-950">{stat.value}</p>
              <h2 className="mt-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100 print:text-slate-700">{stat.label}</h2>
            </article>
          ))}
        </section>

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 print:hidden sm:grid-cols-2">
          <h2 className="text-2xl font-black text-white sm:col-span-2">{editingId ? "Edit action item" : "Create action item"}</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Date created<input required type="date" value={form.dateCreated} onChange={(e) => setForm({ ...form, dateCreated: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Action item title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Follow up on press 12 guard issue" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Description<textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="What needs to be done and why?" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Assigned to<input required value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Owner name" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Due date<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Priority<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Notes<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="min-h-24 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Updates, blockers, completion notes" /></label>
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row"><button className="rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Create action item"}</button>{editingId ? <button type="button" onClick={resetForm} className="rounded-2xl border border-white/15 px-5 py-3 font-black text-white">Cancel edit</button> : null}</div>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 print:border-0 print:bg-white print:p-0">
          <div className="mb-5 grid gap-3 print:hidden sm:grid-cols-4">
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as Filters["status"] })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
            <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value as Filters["priority"] })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option>All</option>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value as Filters["category"] })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option>All</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
            <select value={filters.assignee} onChange={(e) => setFilters({ ...filters, assignee: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option value="">All assignees</option>{assignees.map((assignee) => <option key={assignee}>{assignee}</option>)}</select>
          </div>
          <div className="grid gap-4">
            {filteredItems.length === 0 ? <p className="rounded-3xl border border-dashed border-white/15 p-6 text-slate-300 print:text-slate-700">No action items match the current filters.</p> : null}
            {filteredItems.map((item) => (
              <article key={item.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 print:break-inside-avoid print:border-slate-300 print:bg-white">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200 print:text-slate-600">{item.category} · {item.priority}</p><h3 className="mt-2 text-2xl font-black text-white print:text-slate-950">{item.title}</h3></div>
                  <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-200 print:border-slate-300 print:text-slate-700">{isPastDue(item) ? "Overdue" : item.status}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300 print:text-slate-700">{item.description}</p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="font-bold text-slate-400">Assigned to</dt><dd>{item.assignedTo}</dd></div><div><dt className="font-bold text-slate-400">Date created</dt><dd>{formatDate(item.dateCreated)}</dd></div><div><dt className="font-bold text-slate-400">Due date</dt><dd>{formatDate(item.dueDate)}</dd></div></dl>
                {item.notes ? <p className="mt-4 rounded-2xl bg-white/[0.06] p-4 text-sm text-slate-300 print:border print:border-slate-200 print:bg-white print:text-slate-700"><strong>Notes:</strong> {item.notes}</p> : null}
                <div className="mt-5 flex gap-3 print:hidden"><button onClick={() => editItem(item)} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">Edit</button><button onClick={() => deleteItem(item.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 text-sm font-black text-rose-100">Delete</button></div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
