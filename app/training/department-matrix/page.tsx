"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Department = "Production" | "Quality" | "Maintenance" | "Tooling" | "Materials" | "Shipping";
type CompletionStatus = "Not Started" | "In Progress" | "Completed" | "Overdue";
type CertificationStatus = "Not Required" | "Pending" | "Certified" | "Expired";

type MatrixRecord = {
  id: string;
  department: Department;
  employeeName: string;
  role: string;
  requiredTraining: string;
  completionStatus: CompletionStatus;
  certificationStatus: CertificationStatus;
  expirationDate: string;
  supervisorSignOff: string;
  updatedAt: string;
};

type MatrixForm = Omit<MatrixRecord, "id" | "updatedAt">;

const storageKey = "moldingMentor.departmentTrainingMatrix";
const departments: Department[] = ["Production", "Quality", "Maintenance", "Tooling", "Materials", "Shipping"];
const completionStatuses: CompletionStatus[] = ["Not Started", "In Progress", "Completed", "Overdue"];
const certificationStatuses: CertificationStatus[] = ["Not Required", "Pending", "Certified", "Expired"];

const emptyForm: MatrixForm = {
  department: "Production",
  employeeName: "",
  role: "",
  requiredTraining: "",
  completionStatus: "Not Started",
  certificationStatus: "Pending",
  expirationDate: "",
  supervisorSignOff: "",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function formatDate(value: string) {
  if (!value) return "Not recorded";
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

function statusBadge(status: CompletionStatus) {
  if (status === "Completed") return "border-emerald-300/30 bg-emerald-300/15 text-emerald-100";
  if (status === "In Progress") return "border-cyan-300/30 bg-cyan-300/15 text-cyan-100";
  if (status === "Overdue") return "border-rose-300/30 bg-rose-300/15 text-rose-100";
  return "border-slate-300/20 bg-slate-300/10 text-slate-200";
}

export default function DepartmentTrainingMatrixPage() {
  const [records, setRecords] = useState<MatrixRecord[]>([]);
  const [form, setForm] = useState<MatrixForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasLoadedRecords, setHasLoadedRecords] = useState(false);
  const [filters, setFilters] = useState({ department: "All", employee: "", role: "", status: "All" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setRecords(JSON.parse(saved) as MatrixRecord[]);
      } catch {
        setRecords([]);
      }
    }
    setHasLoadedRecords(true);
  }, []);

  useEffect(() => {
    if (hasLoadedRecords) {
      window.localStorage.setItem(storageKey, JSON.stringify(records));
    }
  }, [records, hasLoadedRecords]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const departmentMatch = filters.department === "All" || record.department === filters.department;
      const employeeMatch = normalize(record.employeeName).includes(normalize(filters.employee));
      const roleMatch = normalize(record.role).includes(normalize(filters.role));
      const statusMatch = filters.status === "All" || record.completionStatus === filters.status || record.certificationStatus === filters.status;
      return departmentMatch && employeeMatch && roleMatch && statusMatch;
    });
  }, [records, filters]);

  const departmentSummary = useMemo(() => {
    return departments.map((department) => {
      const departmentRecords = records.filter((record) => record.department === department);
      const completed = departmentRecords.filter((record) => record.completionStatus === "Completed").length;
      const percentage = departmentRecords.length === 0 ? 0 : Math.round((completed / departmentRecords.length) * 100);
      return { department, completed, total: departmentRecords.length, percentage };
    });
  }, [records]);

  const overallCompletion = records.length === 0 ? 0 : Math.round((records.filter((record) => record.completionStatus === "Completed").length / records.length) * 100);

  function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextRecord = {
      ...form,
      employeeName: form.employeeName.trim(),
      role: form.role.trim(),
      requiredTraining: form.requiredTraining.trim(),
      supervisorSignOff: form.supervisorSignOff.trim(),
      updatedAt: new Date().toISOString(),
    };

    if (!nextRecord.employeeName || !nextRecord.role || !nextRecord.requiredTraining) return;

    if (editingId) {
      setRecords((current) => current.map((record) => (record.id === editingId ? { ...nextRecord, id: editingId } : record)));
      setEditingId(null);
    } else {
      setRecords((current) => [{ ...nextRecord, id: crypto.randomUUID() }, ...current]);
    }
    setForm(emptyForm);
  }

  function editRecord(record: MatrixRecord) {
    setForm({
      department: record.department,
      employeeName: record.employeeName,
      role: record.role,
      requiredTraining: record.requiredTraining,
      completionStatus: record.completionStatus,
      certificationStatus: record.certificationStatus,
      expirationDate: record.expirationDate,
      supervisorSignOff: record.supervisorSignOff,
    });
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:p-4 print:shadow-none">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300 print:text-slate-700">Training Tools</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Department Training Matrix</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
                Add, save, filter, edit, delete, and print department training records with completion and certification visibility.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-center print:border-slate-300 print:bg-white">
              <p className="text-4xl font-black text-white print:text-slate-950">{overallCompletion}%</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100 print:text-slate-700">Overall complete</p>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6 print:grid-cols-6">
          {departmentSummary.map((item) => (
            <article key={item.department} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 print:border-slate-300 print:bg-white">
              <h2 className="font-black text-white print:text-slate-950">{item.department}</h2>
              <p className="mt-2 text-3xl font-black text-cyan-100 print:text-slate-950">{item.percentage}%</p>
              <p className="text-xs text-slate-300 print:text-slate-700">{item.completed} of {item.total} complete</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800 print:border print:border-slate-300 print:bg-white">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${item.percentage}%` }} />
              </div>
            </article>
          ))}
        </section>

        <form onSubmit={saveRecord} className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
          <label className="text-sm font-bold text-slate-200">Department
            <select value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value as Department })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white">
              {departments.map((department) => <option key={department}>{department}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold text-slate-200">Employee name
            <input required value={form.employeeName} onChange={(event) => setForm({ ...form, employeeName: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
          </label>
          <label className="text-sm font-bold text-slate-200">Role
            <input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
          </label>
          <label className="text-sm font-bold text-slate-200">Required training
            <input required value={form.requiredTraining} onChange={(event) => setForm({ ...form, requiredTraining: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
          </label>
          <label className="text-sm font-bold text-slate-200">Completion status
            <select value={form.completionStatus} onChange={(event) => setForm({ ...form, completionStatus: event.target.value as CompletionStatus })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white">
              {completionStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold text-slate-200">Certification status
            <select value={form.certificationStatus} onChange={(event) => setForm({ ...form, certificationStatus: event.target.value as CertificationStatus })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white">
              {certificationStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold text-slate-200">Expiration date
            <input type="date" value={form.expirationDate} onChange={(event) => setForm({ ...form, expirationDate: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
          </label>
          <label className="text-sm font-bold text-slate-200">Supervisor sign-off
            <input value={form.supervisorSignOff} onChange={(event) => setForm({ ...form, supervisorSignOff: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
          </label>
          <div className="flex gap-3 sm:col-span-2 lg:col-span-4">
            <button className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200" type="submit">{editingId ? "Update record" : "Add record"}</button>
            {editingId ? <button className="rounded-xl border border-white/10 px-5 py-3 text-sm font-black text-white" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel edit</button> : null}
          </div>
        </form>

        <section className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4 sm:grid-cols-4 print:hidden">
          <select value={filters.department} onChange={(event) => setFilters({ ...filters, department: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3 text-white">
            <option>All</option>{departments.map((department) => <option key={department}>{department}</option>)}
          </select>
          <input placeholder="Filter employee" value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
          <input placeholder="Filter role" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3 text-white" />
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="rounded-xl border border-white/10 bg-slate-950 p-3 text-white">
            <option>All</option>{[...completionStatuses, ...certificationStatuses].map((status) => <option key={status}>{status}</option>)}
          </select>
        </section>

        <section className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.07] print:border-slate-300 print:bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4 print:border-slate-300">
            <h2 className="text-xl font-black text-white print:text-slate-950">Saved Records ({filteredRecords.length})</h2>
            <button type="button" onClick={() => window.print()} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-black text-cyan-100 print:hidden">Print matrix</button>
          </div>
          <div className="grid gap-3 p-4 lg:hidden print:hidden">
            {filteredRecords.map((record) => (
              <article key={record.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-start justify-between gap-3"><div><p className="font-black text-white">{record.employeeName}</p><p className="text-sm text-slate-300">{record.department} • {record.role}</p></div><span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusBadge(record.completionStatus)}`}>{record.completionStatus}</span></div>
                <p className="mt-3 text-sm text-slate-200"><span className="font-bold">Training:</span> {record.requiredTraining}</p>
                <p className="mt-1 text-sm text-slate-300">Certification: {record.certificationStatus} • Expires: {formatDate(record.expirationDate)}</p>
                <p className="mt-1 text-sm text-slate-300">Supervisor: {record.supervisorSignOff || "Not signed"}</p>
                <div className="mt-4 flex gap-2"><button onClick={() => editRecord(record)} className="rounded-lg bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950">Edit</button><button onClick={() => deleteRecord(record.id)} className="rounded-lg border border-rose-300/30 px-3 py-2 text-xs font-black text-rose-100">Delete</button></div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto lg:block print:block">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm print:min-w-0">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-[0.18em] text-slate-300 print:bg-slate-100 print:text-slate-700">
                <tr>{["Department", "Employee", "Role", "Required training", "Completion", "Certification", "Expiration", "Supervisor", "Actions"].map((heading) => <th key={heading} className="p-3 font-black print:p-2">{heading}</th>)}</tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-t border-white/10 print:border-slate-300">
                    <td className="p-3 print:p-2">{record.department}</td><td className="p-3 font-bold print:p-2">{record.employeeName}</td><td className="p-3 print:p-2">{record.role}</td><td className="p-3 print:p-2">{record.requiredTraining}</td><td className="p-3 print:p-2">{record.completionStatus}</td><td className="p-3 print:p-2">{record.certificationStatus}</td><td className="p-3 print:p-2">{formatDate(record.expirationDate)}</td><td className="p-3 print:p-2">{record.supervisorSignOff || "Not signed"}</td>
                    <td className="p-3 print:hidden"><div className="flex gap-2"><button onClick={() => editRecord(record)} className="rounded-lg bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950">Edit</button><button onClick={() => deleteRecord(record.id)} className="rounded-lg border border-rose-300/30 px-3 py-2 text-xs font-black text-rose-100">Delete</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRecords.length === 0 ? <p className="p-6 text-center text-slate-300 print:text-slate-700">No training matrix records match the current filters.</p> : null}
        </section>
      </section>
    </main>
  );
}
