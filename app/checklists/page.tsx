"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ChecklistStatus = "Draft" | "Active" | "Complete" | "Archived";

type ChecklistTask = {
  id: string;
  text: string;
  owner: string;
  completed: boolean;
};

type Checklist = {
  id: string;
  title: string;
  area: string;
  shift: string;
  dueDate: string;
  status: ChecklistStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  tasks: ChecklistTask[];
};

type ChecklistForm = Omit<Checklist, "id" | "createdAt" | "updatedAt" | "tasks"> & {
  taskText: string;
};

const STORAGE_KEY = "molding-mentor-checklists";
const statuses: ChecklistStatus[] = ["Draft", "Active", "Complete", "Archived"];

const starterTasks = [
  "Clamp tonnage verified",
  "Mold damage inspected",
  "Injection pressure reviewed",
  "Transfer position verified",
  "Parting line inspected",
  "Venting inspected",
];

const emptyForm: ChecklistForm = {
  title: "",
  area: "Production",
  shift: "",
  dueDate: "",
  status: "Draft",
  notes: "",
  taskText: starterTasks.join("\n"),
};

function formatDate(value: string) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

function parseTasks(taskText: string): ChecklistTask[] {
  return taskText
    .split("\n")
    .map((task) => task.trim())
    .filter(Boolean)
    .map((text) => ({ id: crypto.randomUUID(), text, owner: "", completed: false }));
}

function tasksToText(tasks: ChecklistTask[]) {
  return tasks.map((task) => task.text).join("\n");
}

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [form, setForm] = useState<ChecklistForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | ChecklistStatus>("All");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setChecklists(JSON.parse(saved) as Checklist[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checklists));
  }, [checklists, isLoaded]);

  const filteredChecklists = useMemo(
    () => checklists
      .filter((checklist) => filter === "All" || checklist.status === filter)
      .sort((a, b) => `${a.status === "Complete" ? 1 : 0}-${a.dueDate || "9999-12-31"}`.localeCompare(`${b.status === "Complete" ? 1 : 0}-${b.dueDate || "9999-12-31"}`)),
    [checklists, filter],
  );

  const totals = useMemo(() => {
    const taskCount = checklists.reduce((sum, checklist) => sum + checklist.tasks.length, 0);
    const completedTasks = checklists.reduce((sum, checklist) => sum + checklist.tasks.filter((task) => task.completed).length, 0);
    return { active: checklists.filter((checklist) => checklist.status === "Active").length, taskCount, completedTasks };
  }, [checklists]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function saveChecklist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const timestamp = new Date().toISOString();

    if (editingId) {
      setChecklists((current) => current.map((checklist) => checklist.id === editingId ? {
        ...checklist,
        ...form,
        updatedAt: timestamp,
        tasks: parseTasks(form.taskText).map((task) => {
          const existing = checklist.tasks.find((savedTask) => savedTask.text === task.text);
          return existing ? { ...task, id: existing.id, owner: existing.owner, completed: existing.completed } : task;
        }),
      } : checklist));
      resetForm();
      return;
    }

    const newChecklist: Checklist = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      tasks: parseTasks(form.taskText),
    };
    setChecklists((current) => [newChecklist, ...current]);
    resetForm();
  }

  function editChecklist(checklist: Checklist) {
    setForm({
      title: checklist.title,
      area: checklist.area,
      shift: checklist.shift,
      dueDate: checklist.dueDate,
      status: checklist.status,
      notes: checklist.notes,
      taskText: tasksToText(checklist.tasks),
    });
    setEditingId(checklist.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteChecklist(checklistId: string) {
    setChecklists((current) => current.filter((checklist) => checklist.id !== checklistId));
    if (editingId === checklistId) resetForm();
  }

  function toggleTask(checklistId: string, taskId: string) {
    setChecklists((current) => current.map((checklist) => checklist.id === checklistId ? {
      ...checklist,
      updatedAt: new Date().toISOString(),
      tasks: checklist.tasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task),
    } : checklist));
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 print:border-0 print:bg-white print:p-0 print:shadow-none">
          <Link href="/" className="text-sm font-bold text-cyan-300 print:hidden">← Dashboard</Link>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Shop floor systems</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white print:text-slate-950">Checklist Manager</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 print:text-slate-700">Create reusable production, quality, maintenance, safety, and training checklists with saved progress and a print-friendly review.</p>
            </div>
            <button type="button" onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 print:hidden">Print checklists</button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3 print:grid-cols-3">
          {[{ label: "Active", value: totals.active }, { label: "Tasks", value: totals.taskCount }, { label: "Done", value: totals.completedTasks }].map((stat) => (
            <article key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 print:border-slate-300 print:bg-white">
              <p className="text-4xl font-black text-white print:text-slate-950">{stat.value}</p>
              <h2 className="mt-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100 print:text-slate-700">{stat.label}</h2>
            </article>
          ))}
        </section>

        <form onSubmit={saveChecklist} className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 print:hidden sm:grid-cols-2">
          <h2 className="text-2xl font-black text-white sm:col-span-2">{editingId ? "Edit checklist" : "Create checklist"}</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Checklist title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Daily press startup checks" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Area<input required value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Production, Quality, Maintenance" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Shift<input value={form.shift} onChange={(event) => setForm({ ...form, shift: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="1st shift" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Due date<input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ChecklistStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Checklist tasks<textarea required value={form.taskText} onChange={(event) => setForm({ ...form, taskText: event.target.value })} className="min-h-48 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Enter one task per line" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">Notes<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="min-h-24 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Special instructions, acceptance criteria, or handoff notes" /></label>
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row"><button className="rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Create checklist"}</button>{editingId ? <button type="button" onClick={resetForm} className="rounded-2xl border border-white/15 px-5 py-3 font-black text-white">Cancel edit</button> : null}</div>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 print:border-0 print:bg-white print:p-0">
          <div className="mb-5 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-black text-white">Saved checklists</h2>
            <select value={filter} onChange={(event) => setFilter(event.target.value as "All" | ChecklistStatus)} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
          </div>
          <div className="grid gap-4">
            {filteredChecklists.length === 0 ? <p className="rounded-3xl border border-dashed border-white/15 p-6 text-slate-300 print:text-slate-700">No checklists match the current filter.</p> : null}
            {filteredChecklists.map((checklist) => {
              const completedTasks = checklist.tasks.filter((task) => task.completed).length;
              const percentComplete = checklist.tasks.length ? Math.round((completedTasks / checklist.tasks.length) * 100) : 0;
              return (
                <article key={checklist.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 print:break-inside-avoid print:border-slate-300 print:bg-white">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200 print:text-slate-600">{checklist.area} · {checklist.shift || "Any shift"}</p><h3 className="mt-2 text-2xl font-black text-white print:text-slate-950">{checklist.title}</h3></div>
                    <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-200 print:border-slate-300 print:text-slate-700">{checklist.status}</span>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><p><strong className="text-slate-400">Due:</strong> {formatDate(checklist.dueDate)}</p><p><strong className="text-slate-400">Progress:</strong> {completedTasks} of {checklist.tasks.length}</p><p><strong className="text-slate-400">Updated:</strong> {new Date(checklist.updatedAt).toLocaleString()}</p></div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-900 print:border print:border-slate-300 print:bg-white"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" style={{ width: `${percentComplete}%` }} /></div>
                  <div className="mt-5 space-y-3">
                    {checklist.tasks.map((task) => (
                      <label key={task.id} className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 print:border-slate-300 print:bg-white">
                        <input type="checkbox" checked={task.completed} onChange={() => toggleTask(checklist.id, task.id)} className="mt-1 h-5 w-5 rounded border-slate-500 bg-slate-900 text-cyan-300 focus:ring-cyan-300 print:accent-slate-950" />
                        <span className="text-sm font-semibold leading-6 text-slate-100 print:text-slate-900">{task.text}</span>
                      </label>
                    ))}
                  </div>
                  {checklist.notes ? <p className="mt-4 rounded-2xl bg-white/[0.06] p-4 text-sm text-slate-300 print:border print:border-slate-200 print:bg-white print:text-slate-700"><strong>Notes:</strong> {checklist.notes}</p> : null}
                  <div className="mt-5 flex gap-3 print:hidden"><button onClick={() => editChecklist(checklist)} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">Edit</button><button onClick={() => deleteChecklist(checklist.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 text-sm font-black text-rose-100">Delete</button></div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
