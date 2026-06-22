"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type MeetingType = "Production" | "Quality" | "Maintenance" | "Safety" | "Training" | "Customer" | "Other";

type MeetingRecord = {
  id: string;
  meetingDate: string;
  meetingType: MeetingType;
  attendees: string;
  mainTopics: string;
  decisionsMade: string;
  actionItems: string;
  assignedOwner: string;
  dueDate: string;
  followUpNotes: string;
  updatedAt: string;
};

type MeetingForm = Omit<MeetingRecord, "id" | "updatedAt">;

type Field = {
  key: keyof MeetingForm;
  label: string;
  type?: "text" | "date" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
};

const storageKey = "molding-mentor-meeting-notes";

const meetingTypes: MeetingType[] = ["Production", "Quality", "Maintenance", "Safety", "Training", "Customer", "Other"];

const emptyMeeting: MeetingForm = {
  meetingDate: new Date().toISOString().slice(0, 10),
  meetingType: "Production",
  attendees: "",
  mainTopics: "",
  decisionsMade: "",
  actionItems: "",
  assignedOwner: "",
  dueDate: "",
  followUpNotes: "",
};

const fields: Field[] = [
  { key: "meetingDate", label: "Meeting date", type: "date", required: true },
  { key: "meetingType", label: "Meeting type", type: "select", required: true },
  { key: "attendees", label: "Attendees", placeholder: "Names, departments, or shifts present", required: true },
  { key: "mainTopics", label: "Main topics discussed", type: "textarea", placeholder: "Production priorities, quality risks, open issues, escalations...", required: true },
  { key: "decisionsMade", label: "Decisions made", type: "textarea", placeholder: "Document decisions, approvals, rejected options, and rationale" },
  { key: "actionItems", label: "Action items", type: "textarea", placeholder: "Follow-up tasks, checks, containment, maintenance, training, customer responses" },
  { key: "assignedOwner", label: "Assigned owner", placeholder: "Primary owner responsible for follow-up" },
  { key: "dueDate", label: "Due date", type: "date" },
  { key: "followUpNotes", label: "Follow-up notes", type: "textarea", placeholder: "Status updates, blockers, completion evidence, next meeting notes" },
];

function formatDate(value: string) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [form, setForm] = useState<MeetingForm>(emptyMeeting);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<"All" | MeetingType>("All");
  const [dateFilter, setDateFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedMeetings = window.localStorage.getItem(storageKey);
    if (storedMeetings) setMeetings(JSON.parse(storedMeetings) as MeetingRecord[]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) window.localStorage.setItem(storageKey, JSON.stringify(meetings));
  }, [isLoaded, meetings]);

  const filteredMeetings = useMemo(() => {
    return [...meetings]
      .filter((meeting) => typeFilter === "All" || meeting.meetingType === typeFilter)
      .filter((meeting) => !dateFilter || meeting.meetingDate === dateFilter || meeting.dueDate === dateFilter)
      .filter((meeting) => meeting.assignedOwner.toLowerCase().includes(ownerFilter.trim().toLowerCase()))
      .sort((a, b) => `${b.meetingDate}-${b.updatedAt}`.localeCompare(`${a.meetingDate}-${a.updatedAt}`));
  }, [dateFilter, meetings, ownerFilter, typeFilter]);

  function resetForm() {
    setForm({ ...emptyMeeting, meetingDate: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedAt = new Date().toISOString();

    if (editingId) {
      setMeetings((current) => current.map((meeting) => (meeting.id === editingId ? { ...form, id: editingId, updatedAt } : meeting)));
      resetForm();
      return;
    }

    setMeetings((current) => [{ ...form, id: crypto.randomUUID(), updatedAt }, ...current]);
    resetForm();
  }

  function editMeeting(meeting: MeetingRecord) {
    setForm({ meetingDate: meeting.meetingDate, meetingType: meeting.meetingType, attendees: meeting.attendees, mainTopics: meeting.mainTopics, decisionsMade: meeting.decisionsMade, actionItems: meeting.actionItems, assignedOwner: meeting.assignedOwner, dueDate: meeting.dueDate, followUpNotes: meeting.followUpNotes });
    setEditingId(meeting.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteMeeting(id: string) {
    setMeetings((current) => current.filter((meeting) => meeting.id !== id));
    if (editingId === id) resetForm();
  }

  function clearFilters() {
    setTypeFilter("All");
    setDateFilter("");
    setOwnerFilter("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6 print:max-w-none print:space-y-4">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8 print:border-0 print:bg-white print:p-0 print:shadow-none">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300 print:text-slate-600">Meeting follow-up tracker</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl print:text-3xl print:text-slate-950">Meeting Notes & Follow-Up Tracker</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base print:text-slate-700">Capture production, quality, maintenance, safety, training, customer, and other meeting notes with owners, due dates, and printable follow-up summaries.</p>
            </div>
            <button type="button" onClick={() => window.print()} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 print:hidden">Print summary</button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/40 sm:p-6 print:hidden">
          <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black text-white">{editingId ? "Edit meeting record" : "Create meeting record"}</h2>{editingId ? <button type="button" onClick={resetForm} className="text-sm font-bold text-cyan-200">Cancel edit</button> : null}</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
                <span className="text-sm font-bold text-slate-200">{field.label}</span>
                {field.type === "select" ? (
                  <select value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value as MeetingType }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-300">{meetingTypes.map((type) => <option key={type}>{type}</option>)}</select>
                ) : field.type === "textarea" ? (
                  <textarea value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} required={field.required} rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
                ) : (
                  <input type={field.type ?? "text"} value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} required={field.required} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300" />
                )}
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-200 sm:w-auto">{editingId ? "Save meeting changes" : "Save meeting record"}</button>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 sm:p-6 print:hidden" aria-label="Meeting filters">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><h2 className="text-xl font-black text-white">Filter saved meetings</h2><button type="button" onClick={clearFilters} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">Clear filters</button></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label><span className="text-sm font-bold text-slate-200">Meeting type</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "All" | MeetingType)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300"><option>All</option>{meetingTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label><span className="text-sm font-bold text-slate-200">Meeting or due date</span><input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>
            <label><span className="text-sm font-bold text-slate-200">Owner</span><input value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)} placeholder="Search assigned owner" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" /></label>
          </div>
        </section>

        <section className="space-y-4" aria-label="Saved meetings">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-black text-white print:text-slate-950">Saved meetings</h2><p className="text-sm font-bold text-slate-400 print:text-slate-600">{filteredMeetings.length} shown · {meetings.length} total</p></div>
          {filteredMeetings.length === 0 ? <div className="rounded-[1.5rem] border border-dashed border-cyan-300/30 bg-cyan-300/10 p-6 text-slate-300 print:border-slate-300 print:bg-white print:text-slate-700">No meetings match the current view. Create a record or adjust filters.</div> : filteredMeetings.map((meeting) => (
            <article key={meeting.id} className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30 print:break-inside-avoid print:border-slate-300 print:bg-white print:shadow-none">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200 print:text-slate-600">{meeting.meetingType}</p><h3 className="mt-1 text-xl font-black text-white print:text-slate-950">{formatDate(meeting.meetingDate)}</h3><p className="mt-1 text-sm text-slate-300 print:text-slate-700">Owner: {meeting.assignedOwner || "—"} · Due: {formatDate(meeting.dueDate)}</p></div><div className="flex gap-2 print:hidden"><button type="button" onClick={() => editMeeting(meeting)} className="rounded-xl border border-cyan-300/30 px-4 py-2 text-sm font-bold text-cyan-100">Edit</button><button type="button" onClick={() => deleteMeeting(meeting.id)} className="rounded-xl border border-red-300/30 px-4 py-2 text-sm font-bold text-red-100">Delete</button></div></div>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {fields.filter((field) => !["meetingDate", "meetingType", "dueDate"].includes(field.key)).map((field) => <div key={field.key} className="rounded-2xl bg-white/[0.05] p-4 print:border print:border-slate-200 print:bg-white"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 print:text-slate-600">{field.label}</dt><dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100 print:text-slate-900">{meeting[field.key] || "—"}</dd></div>)}
              </dl>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
