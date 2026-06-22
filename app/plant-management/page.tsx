import Link from "next/link";

const users = [
  { name: "Maria Lopez", role: "Supervisor", shift: "A Shift", status: "Approver" },
  { name: "Jamal Reed", role: "Process Technician", shift: "B Shift", status: "Trainer" },
  { name: "Priya Shah", role: "Operator", shift: "A Shift", status: "In training" },
  { name: "Evan Carter", role: "Setup Technician", shift: "C Shift", status: "Recert due" },
];

const trainingRecords = [
  { employee: "Priya Shah", module: "Operator Safety & Startup", score: "96%", completed: "Jun 18", supervisor: "Maria Lopez" },
  { employee: "Evan Carter", module: "Clamp & Setup Verification", score: "88%", completed: "Jun 14", supervisor: "Jamal Reed" },
  { employee: "Luis Nguyen", module: "Defect Recognition Basics", score: "91%", completed: "Jun 12", supervisor: "Maria Lopez" },
];

const certifications = [
  { title: "Operator Level 1", holders: 18, expiring: 2, compliance: 92 },
  { title: "Setup Technician Level 1", holders: 7, expiring: 1, compliance: 78 },
  { title: "Defect Recognition Specialist", holders: 11, expiring: 3, compliance: 84 },
];

const shiftAssignments = [
  { shift: "A Shift", focus: "Startup checklist sign-off", assigned: 8, due: "Today" },
  { shift: "B Shift", focus: "Short-shot troubleshooting", assigned: 6, due: "Jun 24" },
  { shift: "C Shift", focus: "Material drying verification", assigned: 5, due: "Jun 26" },
];

const reportMetrics = [
  { label: "Active users", value: "42", note: "Operators, techs, trainers, and supervisors" },
  { label: "Training completions", value: "128", note: "Last 30 days across all shifts" },
  { label: "Open assignments", value: "19", note: "Shift-based modules still due" },
  { label: "Certification compliance", value: "86%", note: "Plant-wide required credential coverage" },
];

function ComplianceBar({ value }: { value: number }) {
  return (
    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800" aria-label={`${value}% compliant`}>
      <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function PlantManagementPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Link href="/" className="w-fit text-sm font-bold text-cyan-200 hover:text-cyan-100">
          ← Dashboard
        </Link>

        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300">Plant Management Mode</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Manage people, training, certifications, and shift readiness in one supervisor workspace.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Coordinate multiple users, review employee training records, track credential expirations, assign shift learning plans, and export training reports for daily production meetings.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Supervisor dashboard</p>
              <p className="mt-3 text-4xl font-black text-white">7</p>
              <p className="mt-1 text-sm text-slate-300">team members need supervisor review this week</p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Training report metrics">
          {reportMetrics.map((metric) => (
            <article key={metric.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <p className="text-3xl font-black text-white">{metric.value}</p>
              <h2 className="mt-2 font-bold text-cyan-100">{metric.label}</h2>
              <p className="mt-2 text-sm leading-5 text-slate-400">{metric.note}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5">
            <h2 className="text-2xl font-black text-white">Multiple users</h2>
            <p className="mt-2 text-sm text-slate-400">Role-based visibility for operators, technicians, trainers, and supervisors.</p>
            <div className="mt-5 space-y-3">
              {users.map((user) => (
                <div key={user.name} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white">{user.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{user.role} • {user.shift}</p>
                    </div>
                    <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cyan-100">{user.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5">
            <h2 className="text-2xl font-black text-white">Employee training records</h2>
            <p className="mt-2 text-sm text-slate-400">Completed modules remain tied to score, date, supervisor, and employee history.</p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              {trainingRecords.map((record) => (
                <div key={`${record.employee}-${record.module}`} className="grid gap-2 border-b border-white/10 bg-white/[0.04] p-4 last:border-b-0 sm:grid-cols-[1fr_auto]">
                  <div>
                    <h3 className="font-bold text-white">{record.employee}</h3>
                    <p className="mt-1 text-sm text-slate-300">{record.module}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">Reviewed by {record.supervisor}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl font-black text-emerald-200">{record.score}</p>
                    <p className="text-sm text-slate-400">{record.completed}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5">
            <h2 className="text-2xl font-black text-white">Certification tracking</h2>
            <div className="mt-5 space-y-4">
              {certifications.map((certification) => (
                <div key={certification.title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white">{certification.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{certification.holders} holders • {certification.expiring} expiring soon</p>
                    </div>
                    <p className="text-2xl font-black text-white">{certification.compliance}%</p>
                  </div>
                  <ComplianceBar value={certification.compliance} />
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5">
            <h2 className="text-2xl font-black text-white">Shift training assignments</h2>
            <div className="mt-5 grid gap-3">
              {shiftAssignments.map((assignment) => (
                <div key={assignment.shift} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white">{assignment.shift}</h3>
                      <p className="mt-1 text-sm text-slate-300">{assignment.focus}</p>
                    </div>
                    <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-slate-950">Due {assignment.due}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{assignment.assigned} employees assigned</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
