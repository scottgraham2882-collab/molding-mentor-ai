"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AssignmentStatus = "Not Started" | "In Progress" | "Completed" | "Overdue";

type TrainingAssignment = {
  id: string;
  employeeName: string;
  role: string;
  assignedModule: string;
  dueDate: string;
  status: AssignmentStatus;
  quizScore: string;
  supervisorNotes: string;
  updatedAt: string;
};

type AssignmentForm = Omit<TrainingAssignment, "id" | "updatedAt">;

const storageKey = "moldingMentor.trainingAssignments";
const statuses: AssignmentStatus[] = ["Not Started", "In Progress", "Completed", "Overdue"];

const emptyForm: AssignmentForm = {
  employeeName: "",
  role: "",
  assignedModule: "",
  dueDate: "",
  status: "Not Started",
  quizScore: "",
  supervisorNotes: "",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function TrainingAssignmentsPage() {
  const [assignments, setAssignments] = useState<TrainingAssignment[]>([]);
  const [form, setForm] = useState<AssignmentForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoadedAssignments, setHasLoadedAssignments] = useState(false);
  const [filters, setFilters] = useState({ employee: "", role: "", status: "All", dueDate: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setAssignments(JSON.parse(saved) as TrainingAssignment[]);
      } catch {
        setAssignments([]);
      }
    }
    setHasLoadedAssignments(true);
  }, []);

  useEffect(() => {
    if (hasLoadedAssignments) {
      window.localStorage.setItem(storageKey, JSON.stringify(assignments));
    }
  }, [assignments, hasLoadedAssignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const employeeMatch = normalize(assignment.employeeName).includes(normalize(filters.employee));
      const roleMatch = normalize(assignment.role).includes(normalize(filters.role));
      const statusMatch = filters.status === "All" || assignment.status === filters.status;
      const dueDateMatch = !filters.dueDate || assignment.dueDate === filters.dueDate;
      return employeeMatch && roleMatch && statusMatch && dueDateMatch;
    });
  }, [assignments, filters]);

  const completionPercentage = useMemo(() => {
    if (assignments.length === 0) return 0;
    const completed = assignments.filter((assignment) => assignment.status === "Completed").length;
    return Math.round((completed / assignments.length) * 100);
  }, [assignments]);

  function saveAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextAssignment = {
      ...form,
      employeeName: form.employeeName.trim(),
      role: form.role.trim(),
      assignedModule: form.assignedModule.trim(),
      quizScore: form.quizScore.trim(),
      supervisorNotes: form.supervisorNotes.trim(),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === editingId ? { ...nextAssignment, id: editingId } : assignment,
        ),
      );
    } else {
      setAssignments((current) => [{ ...nextAssignment, id: crypto.randomUUID() }, ...current]);
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function editAssignment(assignment: TrainingAssignment) {
    setForm({
      employeeName: assignment.employeeName,
      role: assignment.role,
      assignedModule: assignment.assignedModule,
      dueDate: assignment.dueDate,
      status: assignment.status,
      quizScore: assignment.quizScore,
      supervisorNotes: assignment.supervisorNotes,
    });
    setEditingId(assignment.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteAssignment(id: string) {
    setAssignments((current) => current.filter((assignment) => assignment.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Training Tools</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-slate-950">Training Assignment Manager</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Create, track, filter, and print employee training assignments with local browser storage for supervisor follow-up.
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-300/30 bg-emerald-300/10 p-5 text-center print:border-slate-300 print:bg-white">
              <p className="text-5xl font-black text-white print:text-slate-950">{completionPercentage}%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100 print:text-slate-600">Complete</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] print:block">
          <form onSubmit={saveAssignment} className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:hidden">
            <h2 className="text-2xl font-black text-white">{editingId ? "Edit assignment" : "Create assignment"}</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-200">Employee name<input required value={form.employeeName} onChange={(event) => setForm({ ...form, employeeName: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Role<input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Assigned module<input required value={form.assignedModule} onChange={(event) => setForm({ ...form, assignedModule: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Due date<input required type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AssignmentStatus })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Quiz score<input inputMode="numeric" placeholder="Example: 92%" value={form.quizScore} onChange={(event) => setForm({ ...form, quizScore: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">Supervisor notes<textarea rows={4} value={form.supervisorNotes} onChange={(event) => setForm({ ...form, supervisorNotes: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-cyan-300 px-5 py-3 font-black text-slate-950">{editingId ? "Save changes" : "Create training assignment"}</button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-slate-200">Cancel</button> : null}
            </div>
          </form>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-slate-950/30 sm:p-6 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-2xl font-black text-white print:text-slate-950">Saved assignments</h2><p className="mt-1 text-sm text-slate-300 print:text-slate-700">{filteredAssignments.length} of {assignments.length} assignments shown</p></div>
              <button onClick={() => window.print()} className="rounded-2xl border border-cyan-300/40 px-5 py-3 text-sm font-black text-cyan-100 print:hidden">Print report</button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
              <input placeholder="Filter employee" value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              <input placeholder="Filter role" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
              <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
              <input type="date" value={filters.dueDate} onChange={(event) => setFilters({ ...filters, dueDate: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
            </div>

            <div className="mt-5 grid gap-4">
              {filteredAssignments.length === 0 ? <p className="rounded-2xl border border-dashed border-white/20 p-5 text-slate-300 print:text-slate-700">No assignments match the current filters.</p> : null}
              {filteredAssignments.map((assignment) => (
                <article key={assignment.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 print:break-inside-avoid print:border-slate-300 print:bg-white">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white print:text-slate-950">{assignment.employeeName}</h3>
                      <p className="text-sm text-slate-300 print:text-slate-700">{assignment.role} • {assignment.assignedModule}</p>
                    </div>
                    <span className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 print:border-slate-300 print:bg-white print:text-slate-700">{assignment.status}</span>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div><dt className="font-bold text-slate-400 print:text-slate-600">Due date</dt><dd className="text-white print:text-slate-950">{assignment.dueDate}</dd></div>
                    <div><dt className="font-bold text-slate-400 print:text-slate-600">Quiz score</dt><dd className="text-white print:text-slate-950">{assignment.quizScore || "Not recorded"}</dd></div>
                    <div><dt className="font-bold text-slate-400 print:text-slate-600">Updated</dt><dd className="text-white print:text-slate-950">{new Date(assignment.updatedAt).toLocaleDateString()}</dd></div>
                  </dl>
                  {assignment.supervisorNotes ? <p className="mt-4 rounded-2xl bg-white/5 p-3 text-sm leading-6 text-slate-200 print:border print:border-slate-300 print:bg-white print:text-slate-800">{assignment.supervisorNotes}</p> : null}
                  <div className="mt-4 flex gap-3 print:hidden">
                    <button onClick={() => editAssignment(assignment)} className="rounded-xl border border-emerald-300/40 px-4 py-2 text-sm font-bold text-emerald-100">Edit</button>
                    <button onClick={() => deleteAssignment(assignment.id)} className="rounded-xl border border-rose-300/40 px-4 py-2 text-sm font-bold text-rose-100">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
