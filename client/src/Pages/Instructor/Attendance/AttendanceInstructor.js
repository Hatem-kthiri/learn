import React, { useEffect, useState } from "react";
import HeaderI from "../../../Components/Header/HeaderI";
import { useSelector, useDispatch } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import { url, errorToast, successToast } from "../../../utils";
import axios from "axios";

const STATUS_OPTIONS = ["Present", "Absent", "Late", "Excused"];

const statusColor = {
  Present: "bg-emerald-100 text-emerald-700",
  Absent: "bg-rose-100 text-rose-700",
  Late: "bg-amber-100 text-amber-700",
  Excused: "bg-sky-100 text-sky-700",
  Pending: "bg-slate-100 text-slate-500",
};

const AttendanceInstructor = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(current());
  }, []);

  useEffect(() => {
    if (userLoading || !user?._id) return;
    setLoadingSessions(true);
    axios
      .get(`${url}/api/v1/guild/sessions/instructor/${user._id}`)
      .then((r) => setSessions(r.data.data))
      .catch(() => errorToast("Failed to load sessions"))
      .finally(() => setLoadingSessions(false));
  }, [user, userLoading]);

  const openSession = (session) => {
    setSelectedSession(session);
    setLoadingAttendance(true);
    axios
      .get(`${url}/api/v1/guild/sessions/${session._id}/attendance`)
      .then((r) => setAttendance(r.data.data.attendance))
      .catch(() => errorToast("Failed to load attendance"))
      .finally(() => setLoadingAttendance(false));
  };

  const setStudentStatus = (studentId, status) => {
    setAttendance((prev) =>
      prev.map((a) => (a.student._id === studentId ? { ...a, status } : a)),
    );
  };

  const setStudentNotes = (studentId, notes) => {
    setAttendance((prev) =>
      prev.map((a) => (a.student._id === studentId ? { ...a, notes } : a)),
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const records = attendance.map((a) => ({
        studentId: a.student._id,
        status: a.status,
        notes: a.notes,
      }));
      await axios.post(`${url}/api/v1/guild/sessions/${selectedSession._id}/attendance`, {
        records,
      });
      successToast("Attendance saved");
      setSessions((prev) =>
        prev.map((s) => (s._id === selectedSession._id ? { ...s, status: "Completed" } : s)),
      );
    } catch (err) {
      errorToast(err?.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <HeaderI />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session list */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 p-4 h-fit">
          <h2 className="font-bold text-slate-900 dark:text-white mb-3 px-1">Sessions</h2>
          {loadingSessions && <p className="text-sm text-slate-400 dark:text-gray-500 px-1">Loading...</p>}
          <div className="space-y-1.5 max-h-[70vh] overflow-y-auto">
            {sessions.map((s) => (
              <button
                key={s._id}
                onClick={() => openSession(s)}
                className={`w-full text-left p-3 rounded-xl transition-colors ${selectedSession?._id === s._id ? "bg-indigo-600 text-white" : "hover:bg-slate-50 dark:hover:bg-gray-700"}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${selectedSession?._id === s._id ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    Session {s.sessionNumber} · {s.guild?.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedSession?._id === s._id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400"}`}
                  >
                    {s.status}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${selectedSession?._id === s._id ? "text-indigo-200" : "text-slate-400 dark:text-gray-500"}`}>
                  {new Date(s.date).toLocaleDateString()} · {s.startTime}–{s.endTime}
                </p>
              </button>
            ))}
            {!loadingSessions && sessions.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-gray-500 px-1 py-6 text-center">
                No sessions assigned yet.
              </p>
            )}
          </div>
        </div>

        {/* Attendance form */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 p-6">
          {!selectedSession && (
            <div className="text-center py-24 text-slate-400 dark:text-gray-500">
              <i className="fas fa-clipboard-list text-5xl mb-4 block opacity-20"></i>
              <p className="font-semibold">Select a session to take attendance.</p>
            </div>
          )}

          {selectedSession && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedSession.guild?.name} · Session {selectedSession.sessionNumber}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">
                    {new Date(selectedSession.date).toLocaleDateString()} · {selectedSession.startTime}–
                    {selectedSession.endTime}
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={saving || loadingAttendance}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 transition-colors"
                >
                  {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                  Submit Attendance
                </button>
              </div>

              {loadingAttendance && <p className="text-sm text-slate-400 dark:text-gray-500">Loading roster...</p>}

              <div className="space-y-2">
                {attendance.map((a) => (
                  <div
                    key={a._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={a.student?.profileImg}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover bg-slate-100 dark:bg-gray-700 flex-shrink-0"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {a.student?.firstName} {a.student?.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setStudentStatus(a.student._id, opt)}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${a.status === opt ? statusColor[opt] : "bg-slate-50 dark:bg-gray-700 text-slate-400 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-gray-600"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Note (optional)"
                      value={a.notes || ""}
                      onChange={(e) => setStudentNotes(a.student._id, e.target.value)}
                      className="sm:w-40 bg-slate-50 dark:bg-gray-700 dark:text-white border border-slate-200 dark:border-gray-600 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceInstructor;
