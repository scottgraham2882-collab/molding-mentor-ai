"use client";

import { useEffect, useMemo, useState } from "react";

type RolePath = {
  role: string;
  summary: string;
  estimatedCompletionTime: string;
  requiredTrainingModules: string[];
  recommendedLessons: string[];
  requiredCertifications: string[];
  requiredSkills: string[];
  advancementPath: string[];
};

type PathSectionKey = keyof Pick<
  RolePath,
  "requiredTrainingModules" | "recommendedLessons" | "requiredCertifications" | "requiredSkills" | "advancementPath"
>;

type CompletionProgress = Record<string, boolean>;

const storageKey = "moldingMentor.roleTrainingPathProgress";

const rolePaths: RolePath[] = [
  {
    role: "Operator",
    summary: "Build safe machine habits, consistent startup checks, defect awareness, and clear shift communication.",
    estimatedCompletionTime: "2–3 weeks / 14 training hours",
    requiredTrainingModules: ["Operator Safety & Startup", "Defect identification basics", "Work instruction and process sheet reading", "Scrap reporting and escalation rules"],
    recommendedLessons: ["Decoupled molding overview", "Common molding defects", "Shift handoff best practices"],
    requiredCertifications: ["Machine safety sign-off", "Startup checklist qualification", "Quality alert acknowledgement"],
    requiredSkills: ["Lockout/tagout awareness", "Part inspection basics", "Cycle observation", "Accurate production counts"],
    advancementPath: ["Senior Operator", "Setup Technician trainee", "Quality Technician trainee"],
  },
  {
    role: "Setup Technician",
    summary: "Prepare technicians to complete safe mold changes, utility connections, startup verification, and first-shot readiness.",
    estimatedCompletionTime: "4–6 weeks / 32 training hours",
    requiredTrainingModules: ["Mold Setup Training Module", "Crane and rigging safety", "Mold protection standards", "Startup Approval System workflow"],
    recommendedLessons: ["Clamp tonnage calculation", "Resin drying checks", "First article handoff expectations"],
    requiredCertifications: ["Crane/hoist authorization", "Mold change qualification", "LOTO authorized employee"],
    requiredSkills: ["Mold spotting and clamping", "Water, hydraulic, and air connections", "Robot/EOAT verification", "Setup documentation"],
    advancementPath: ["Lead Setup Technician", "Process Technician", "Maintenance Technician cross-training"],
  },
  {
    role: "Process Technician",
    summary: "Develop scientific molding discipline for process verification, data-based troubleshooting, and approved process changes.",
    estimatedCompletionTime: "6–8 weeks / 48 training hours",
    requiredTrainingModules: ["Process Technician Training Module", "Process Sheet Builder", "Process Change Log", "Troubleshooting Assistant"],
    recommendedLessons: ["Decoupled molding 1", "Gate seal study", "Process window development", "Viscosity curve fundamentals"],
    requiredCertifications: ["Process technician qualification", "Scientific molding fundamentals", "Process change approval"],
    requiredSkills: ["Fill-only setup", "Transfer and cushion control", "Pack/hold validation", "Root-cause troubleshooting"],
    advancementPath: ["Senior Process Technician", "Process Engineer trainee", "Production Supervisor"],
  },
  {
    role: "Quality Technician",
    summary: "Train quality support to protect the customer with inspections, containment, audits, and corrective-action discipline.",
    estimatedCompletionTime: "4–5 weeks / 30 training hours",
    requiredTrainingModules: ["First Article Inspection Report", "Quality Hold / Containment Tracker", "Audit Checklist System", "Corrective Action / Root Cause Report"],
    recommendedLessons: ["Defect library review", "Measurement system basics", "8D problem solving overview"],
    requiredCertifications: ["First article approval", "Gauge use qualification", "Containment release authorization"],
    requiredSkills: ["Critical dimension inspection", "Defect containment", "Audit evidence collection", "Customer complaint documentation"],
    advancementPath: ["Lead Quality Technician", "Quality Engineer trainee", "Production Supervisor"],
  },
  {
    role: "Maintenance Technician",
    summary: "Focus maintenance training on safe troubleshooting, preventive maintenance, machine history, and downtime reduction.",
    estimatedCompletionTime: "6–10 weeks / 56 training hours",
    requiredTrainingModules: ["Preventive Maintenance Tracker", "Machine History Database", "Downtime Tracker", "Maintenance safety procedures"],
    recommendedLessons: ["Hydraulic system checks", "Electrical troubleshooting basics", "Cooling system reliability", "Robot interface checks"],
    requiredCertifications: ["LOTO authorized employee", "Electrical safety qualification", "PM sign-off qualification"],
    requiredSkills: ["PM execution", "Hydraulic and pneumatic diagnosis", "Controller alarm review", "Repair documentation"],
    advancementPath: ["Lead Maintenance Technician", "Automation Technician", "Maintenance Supervisor"],
  },
  {
    role: "Production Supervisor",
    summary: "Prepare supervisors to lead shift execution, coach teams, manage KPIs, and maintain training compliance.",
    estimatedCompletionTime: "5–7 weeks / 40 training hours",
    requiredTrainingModules: ["Supervisor Training Module", "Training Assignment Manager", "Training Compliance Dashboard", "Executive KPI Dashboard"],
    recommendedLessons: ["Daily report expectations", "Shift handoff review", "OEE and downtime leadership", "Coaching conversation practice"],
    requiredCertifications: ["Supervisor readiness sign-off", "Safety leadership acknowledgement", "Training compliance owner"],
    requiredSkills: ["Shift prioritization", "Escalation decisions", "Performance coaching", "KPI review and follow-up"],
    advancementPath: ["Senior Production Supervisor", "Production Manager", "Plant Management Mode owner"],
  },
];

const sections: { key: PathSectionKey; title: string }[] = [
  { key: "requiredTrainingModules", title: "Required training modules" },
  { key: "recommendedLessons", title: "Recommended lessons" },
  { key: "requiredCertifications", title: "Required certifications" },
  { key: "requiredSkills", title: "Required skills" },
  { key: "advancementPath", title: "Advancement path" },
];

function itemId(role: string, section: PathSectionKey, item: string) {
  return `${role}:${section}:${item}`;
}

export default function RoleTrainingPathsPage() {
  const [selectedRole, setSelectedRole] = useState(rolePaths[0].role);
  const [progress, setProgress] = useState<CompletionProgress>({});
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setProgress(JSON.parse(saved) as CompletionProgress);
      } catch {
        setProgress({});
      }
    }
    setHasLoadedProgress(true);
  }, []);

  useEffect(() => {
    if (hasLoadedProgress) window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, hasLoadedProgress]);

  const selectedPath = rolePaths.find((path) => path.role === selectedRole) ?? rolePaths[0];
  const allItemIds = useMemo(
    () => sections.flatMap((section) => selectedPath[section.key].map((item) => itemId(selectedPath.role, section.key, item))),
    [selectedPath],
  );
  const completedCount = allItemIds.filter((id) => progress[id]).length;
  const completionPercent = allItemIds.length === 0 ? 0 : Math.round((completedCount / allItemIds.length) * 100);

  function toggleItem(id: string) {
    setProgress((current) => ({ ...current, [id]: !current[id] }));
  }

  function resetSelectedPath() {
    setProgress((current) => {
      const next = { ...current };
      allItemIds.forEach((id) => delete next[id]);
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 print:max-w-none print:gap-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-slate-300 print:bg-white print:p-4 print:shadow-none">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300 print:text-slate-600">Training Tools</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Role-Based Training Paths</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">
            Select a molding role, review required development steps, mark items complete, save progress in this browser, and print a clean role training path.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.6fr] print:block">
          <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-slate-950/30 print:hidden">
            <label htmlFor="role" className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">Select role</label>
            <select id="role" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="mt-3 w-full rounded-2xl border border-cyan-300/20 bg-slate-950 px-4 py-3 text-base font-bold text-white outline-none focus:ring-4 focus:ring-cyan-300/20">
              {rolePaths.map((path) => <option key={path.role}>{path.role}</option>)}
            </select>
            <div className="mt-5 grid gap-2">
              {rolePaths.map((path) => (
                <button key={path.role} type="button" onClick={() => setSelectedRole(path.role)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${selectedRole === path.role ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-slate-900/70 text-slate-300 hover:border-cyan-300/30"}`}>
                  {path.role}
                </button>
              ))}
            </div>
          </aside>

          <article className="rounded-[1.75rem] border border-cyan-300/20 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-950/20 sm:p-7 print:border-0 print:bg-white print:p-4 print:shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:flex-row">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300 print:text-slate-600">Selected path</p>
                <h2 className="mt-2 text-3xl font-black text-white print:text-slate-950">{selectedPath.role}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 print:text-slate-700">{selectedPath.summary}</p>
              </div>
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm print:border-slate-300 print:bg-white">
                <p className="font-black text-emerald-100 print:text-slate-950">{completionPercent}% complete</p>
                <p className="mt-1 text-slate-300 print:text-slate-700">{completedCount} of {allItemIds.length} items complete</p>
                <p className="mt-2 font-bold text-cyan-100 print:text-slate-800">{selectedPath.estimatedCompletionTime}</p>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800 print:border print:border-slate-300 print:bg-white">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${completionPercent}%` }} />
            </div>

            <div className="mt-6 grid gap-4">
              {sections.map((section) => (
                <section key={section.key} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 print:break-inside-avoid print:border-slate-300 print:bg-white">
                  <h3 className="text-lg font-black text-white print:text-slate-950">{section.title}</h3>
                  <div className="mt-3 grid gap-2">
                    {selectedPath[section.key].map((item) => {
                      const id = itemId(selectedPath.role, section.key, item);
                      return (
                        <label key={id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-200 print:border-slate-200 print:bg-white print:text-slate-800">
                          <input type="checkbox" checked={Boolean(progress[id])} onChange={() => toggleItem(id)} className="mt-1 h-5 w-5 rounded border-cyan-300 bg-slate-950 accent-cyan-300 print:accent-slate-900" />
                          <span className={progress[id] ? "text-slate-400 line-through print:text-slate-600" : ""}>{item}</span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row print:hidden">
              <button type="button" onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30">Print role path</button>
              <button type="button" onClick={resetSelectedPath} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-slate-200 hover:border-rose-300/40">Reset selected path</button>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
