import React, { useEffect, useState } from "react";
import HeaderS from "../../../Components/Header/HeaderS";
import { useSelector, useDispatch } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import { url, errorToast } from "../../../utils";
import axios from "axios";

const statusColor = {
  Present: "bg-emerald-100 text-emerald-700",
  Absent: "bg-rose-100 text-rose-700",
  Late: "bg-amber-100 text-amber-700",
  Excused: "bg-sky-100 text-sky-700",
  Pending: "bg-slate-100 text-slate-500",
};

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-4">
    <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${accent || "text-slate-900 dark:text-white"}`}>{value}</p>
  </div>
);

const AttendanceHistoryStudent = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(current());
  }, []);

  useEffect(() => {
    if (userLoading || !user?._id) return;
    setLoading(true);
    axios
      .get(`${url}/api/v1/guild/students/${user._id}/attendance`)
      .then((r) => {
        setRecords(r.data.data.records);
        setStats(r.data.data.stats);
      })
      .catch(() => errorToast("Failed to load attendance history"))
      .finally(() => setLoading(false));
  }, [user, userLoading]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <HeaderS />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Attendance History</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mb-6">
          Your attendance record across all training sessions.
        </p>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            <StatCard label="Total Sessions" value={stats.totalSessions} />
            <StatCard label="Present" value={stats.present} accent="text-emerald-600" />
            <StatCard label="Absent" value={stats.absent} accent="text-rose-600" />
            <StatCard label="Late" value={stats.late} accent="text-amber-600" />
            <StatCard
              label="Attendance Rate"
              value={stats.attendancePercentage !== null ? `${stats.attendancePercentage}%` : "—"}
              accent="text-indigo-600"
            />
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-gray-700 text-left text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Guild</th>
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-b border-slate-50 dark:border-gray-700 last:border-0">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{r.guild?.name}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-gray-400">#{r.session?.sessionNumber}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-gray-400">
                    {r.session?.date ? new Date(r.session.date).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 dark:text-gray-500">{r.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && records.length === 0 && (
            <div className="text-center py-16 text-slate-400 dark:text-gray-500">
              <i className="fas fa-clipboard-list text-5xl mb-4 block opacity-20"></i>
              <p className="font-semibold">No attendance records yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryStudent;
