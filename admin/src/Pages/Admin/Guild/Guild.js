import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import Swal from "sweetalert2";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const emptySlot = () => ({ dayOfWeek: 6, startTime: "09:00", endTime: "13:00" });

const emptyForm = () => ({
  name: "",
  trainingProgram: "",
  startDate: "",
  instructor: "",
  students: [],
  sessionDuration: 4,
  totalSessions: 12,
  sessionsPerWeek: 1,
  weeklySlots: [emptySlot()],
});

const Guild = () => {
  const [guilds, setGuilds] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [generatingName, setGeneratingName] = useState(false);

  const getGuilds = () => {
    api.get("/api/admin/getGuild").then((r) => setGuilds(r.data.data)).catch(() => {});
  };

  useEffect(() => {
    getGuilds();
    api.get("/api/admin/getInstructors").then((r) => setInstructors(r.data.data)).catch(() => {});
    api.get("/api/admin/getStudents").then((r) => setStudents(r.data.data)).catch(() => {});
  }, []);

  const handleSessionsPerWeekChange = (value) => {
    const n = Number(value);
    setForm((f) => {
      const slots = [...f.weeklySlots];
      while (slots.length < n) slots.push(emptySlot());
      while (slots.length > n) slots.pop();
      return { ...f, sessionsPerWeek: n, weeklySlots: slots };
    });
  };

  const updateSlot = (index, key, value) => {
    setForm((f) => {
      const slots = [...f.weeklySlots];
      slots[index] = { ...slots[index], [key]: key === "dayOfWeek" ? Number(value) : value };
      return { ...f, weeklySlots: slots };
    });
  };

  const toggleStudent = (studentId) => {
    setForm((f) => ({
      ...f,
      students: f.students.includes(studentId)
        ? f.students.filter((id) => id !== studentId)
        : [...f.students, studentId],
    }));
  };

  const handleGenerateName = async () => {
    if (!form.trainingProgram.trim()) {
      Swal.fire({ icon: "warning", title: "Enter a training program name first" });
      return;
    }
    setGeneratingName(true);
    try {
      const r = await api.get("/api/admin/generateGuildName", {
        params: { programName: form.trainingProgram },
      });
      setForm((f) => ({ ...f, name: r.data.data.name }));
    } catch (e) {
      Swal.fire({ icon: "error", title: "Could not generate a name" });
    } finally {
      setGeneratingName(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api.post("/api/admin/createGuild", form);
      setGuilds([...guilds, r.data.data.guild]);
      Swal.fire({
        icon: "success",
        title: "Guild created",
        text: `${r.data.data.sessionsGenerated} sessions were generated automatically.`,
      });
      setForm(emptyForm());
      setShowForm(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Could not create guild",
        text: err?.response?.data?.message || "Please check the form and try again",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete guild?",
      text: "This also deletes all its sessions and attendance records.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    }).then((r) => {
      if (r.isConfirmed) api.delete(`/api/admin/delete_guild/${id}`).then(getGuilds);
    });
  };

  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-sky-100 text-sky-700",
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guilds</h1>
          <p className="text-slate-500 text-sm mt-1">{guilds.length} training groups</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm inline-flex items-center gap-2 shadow-sm"
        >
          <i className={`fas ${showForm ? "fa-times" : "fa-plus"}`}></i>
          {showForm ? "Cancel" : "New Guild"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 space-y-6"
        >
          <div>
            <h2 className="font-bold text-slate-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Training Program
                </label>
                <input
                  type="text"
                  value={form.trainingProgram}
                  onChange={(e) => setForm({ ...form, trainingProgram: e.target.value })}
                  placeholder="e.g. Web Development"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Guild Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Web Development Cohort WD01"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateName}
                    disabled={generatingName}
                    className="bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold px-3.5 rounded-xl text-xs whitespace-nowrap transition-colors"
                  >
                    <i className={`fas ${generatingName ? "fa-spinner fa-spin" : "fa-wand-magic-sparkles"} mr-1.5`}></i>
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Instructor
                </label>
                <select
                  required
                  value={form.instructor}
                  onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select instructor...</option>
                  {instructors.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.firstName} {i.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 mb-3">
              Students <span className="text-slate-400 font-normal">({form.students.length} selected)</span>
            </h2>
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
              {students.map((s) => (
                <label
                  key={s._id}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.students.includes(s._id)}
                    onChange={() => toggleStudent(s._id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  {s.firstName} {s.lastName}
                </label>
              ))}
              {students.length === 0 && (
                <p className="text-slate-400 text-sm p-2">No students available.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 mb-4">Scheduling Configuration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Session Duration
                </label>
                <select
                  value={form.sessionDuration}
                  onChange={(e) => setForm({ ...form, sessionDuration: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={2}>2 Hours</option>
                  <option value={3}>3 Hours</option>
                  <option value={4}>4 Hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Total Sessions
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.totalSessions}
                  onChange={(e) => setForm({ ...form, totalSessions: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Sessions Per Week
                </label>
                <select
                  value={form.sessionsPerWeek}
                  onChange={(e) => handleSessionsPerWeekChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 mb-3">Weekly Schedule</h2>
            <p className="text-xs text-slate-400 mb-3">
              Each slot's time range must match the session duration selected above.
            </p>
            <div className="space-y-3">
              {form.weeklySlots.map((slot, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-xs font-bold text-slate-400 w-16">Slot {i + 1}</span>
                  <select
                    value={slot.dayOfWeek}
                    onChange={(e) => updateSlot(i, "dayOfWeek", e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {DAYS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateSlot(i, "startTime", e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-400">→</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateSlot(i, "endTime", e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-sm inline-flex items-center gap-2"
            >
              {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
              Create Guild &amp; Generate Sessions
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {guilds.map((g, i) => (
          <div
            key={g._id}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 group hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${colors[i % colors.length]}`}
              >
                {g.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => handleDelete(g._id)}
                className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all"
              >
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
            <h3 className="font-bold text-slate-900">{g.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {g.trainingProgram || "Guild"} · {g.students?.length || 0} students
            </p>
            {g.instructor && (
              <p className="text-xs text-slate-500 mt-2">
                <i className="fas fa-chalkboard-teacher mr-1.5"></i>
                {g.instructor.firstName} {g.instructor.lastName}
              </p>
            )}
            {g.totalSessions && (
              <p className="text-xs text-slate-500 mt-1">
                <i className="fas fa-calendar-check mr-1.5"></i>
                {g.totalSessions} sessions · {g.sessionsPerWeek}/week
              </p>
            )}
          </div>
        ))}

        {guilds.length === 0 && (
          <div className="col-span-4 text-center py-16 text-slate-400">
            <i className="fas fa-award text-5xl mb-4 block opacity-20"></i>
            <p className="font-semibold">No guilds yet. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guild;
