import React, { useEffect, useState } from "react";
import HeaderI from "../../../Components/Header/HeaderI";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import { get_students_progress } from "../../../redux/actions/InstructorActions";
import { Link } from "react-router-dom";
import Footer from "../../../Components/Footer/Footer";

const StudentList = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { studentsProgress } = useSelector((state) => state.instructorReducer);
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(current()); }, []);
  useEffect(() => { if (!userLoading) dispatch(get_students_progress(user.guild)); }, [user]);

  const sorted = [...studentsProgress].sort((a, b) => (parseFloat(b.course?.[0]?.learnScore) || 0) - (parseFloat(a.course?.[0]?.learnScore) || 0));
  const filtered = sorted.filter((s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <HeaderI />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Students</h1>
            <p className="text-slate-500 text-sm mt-1 dark:text-gray-400">{studentsProgress.length} students in your guild</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-5 border-b border-slate-100 dark:border-gray-700">
            <div className="relative max-w-sm">
              <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-600" />
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm dark:text-gray-500"></i>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 dark:bg-gray-900 dark:border-gray-700">
                  {["Rank", "", "Student", "Course", "Guild", "Progress", "Score", "Details"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-gray-700">
                {filtered.map((student, i) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors dark:hover:bg-gray-700">
                    <td className="px-4 py-4">
                      <span className={`text-sm font-bold ${i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-400" : "text-slate-300"}`}>#{i+1}</span>
                    </td>
                    <td className="px-4 py-4"><img src={student.profileImg} alt="" className="w-9 h-9 rounded-xl object-cover bg-slate-100 dark:bg-gray-700" /></td>
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{student.firstName} {student.lastName}</td>
                    <td className="px-4 py-4 text-slate-500 text-xs dark:text-gray-400">{student.course?.[0]?.course?.title}</td>
                    <td className="px-4 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">{student.course?.[0]?.guild}</span></td>
                    <td className="px-4 py-4 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden dark:bg-gray-700">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${student.course?.[0]?.learnProgress || 0}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500 flex-shrink-0 dark:text-gray-400">{student.course?.[0]?.learnProgress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-indigo-600">{student.course?.[0]?.learnScore}</td>
                    <td className="px-4 py-4">
                      <Link to={`/student-details/${student._id}`} className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors">
                        <i className="fas fa-eye text-xs"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-16 text-slate-400 dark:text-gray-500">
                    <i className="fas fa-users text-4xl mb-3 block opacity-20"></i>
                    <p className="font-medium">No students found</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentList;
