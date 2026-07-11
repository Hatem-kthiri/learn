import React, { useEffect } from "react";
import HeaderI from "../../../Components/Header/HeaderI";
import { current } from "../../../redux/actions/Actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { get_checkpoints, get_students_progress } from "../../../redux/actions/InstructorActions";
import MidlleComponent from "../../../Pages/Student/Dashboard/MiddleComponent";

const DashboardInstructor = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { studentsProgress, studentsCheckpoints } = useSelector((state) => state.instructorReducer);

  useEffect(() => { dispatch(current()); }, []);

  useEffect(() => {
    if (!userLoading) {
      dispatch(get_students_progress(user.guild));
      dispatch(get_checkpoints(user));
    }
  }, [user]);

  const pendingCheckpoints = studentsCheckpoints.filter((el) => el.open === true).length;
  const topStudents = [...studentsProgress].sort((a, b) => (parseFloat(b.course?.[0]?.learnScore) || 0) - (parseFloat(a.course?.[0]?.learnScore) || 0)).slice(0, 3);

  const stats = [
    { label: "Pending Checkpoints", value: pendingCheckpoints, icon: "fas fa-flag-checkered", color: "bg-amber-50 text-amber-600", border: "border-amber-200", link: "/checkpoints" },
    { label: "Total Students", value: studentsProgress.length, icon: "fas fa-users", color: "bg-indigo-50 text-indigo-600", border: "border-indigo-200", link: "/students-list" },
    { label: "My Courses", value: !userLoading && user.course ? user.course.length : 0, icon: "fas fa-book-open", color: "bg-violet-50 text-violet-600", border: "border-violet-200", link: "#" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <HeaderI />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Instructor Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1 dark:text-gray-400">Welcome back, {user.firstName}!</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
            <i className="fas fa-calendar-alt text-indigo-500"></i>
            <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {stats.map((s, i) => (
            <Link key={i} to={s.link} className={`bg-white rounded-2xl p-6 shadow-sm border ${s.border} flex items-center gap-5 hover:shadow-md transition-shadow`}>
              <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <i className={`${s.icon} text-xl`}></i>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium dark:text-gray-400">{s.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-0.5 dark:text-white">{s.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Top Students */}
        {topStudents.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 dark:text-white">Top Students</h2>
              <Link to="/students-list" className="text-sm text-indigo-600 font-semibold hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {topStudents.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`w-6 text-xs font-bold text-center ${i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : "text-orange-400"}`}>#{i + 1}</span>
                  <img src={s.profileImg} alt="" className="w-9 h-9 rounded-xl object-cover bg-slate-100 dark:bg-gray-700" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate dark:text-white">{s.firstName} {s.lastName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden dark:bg-gray-700">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.course?.[0]?.learnProgress || 0}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500 flex-shrink-0 dark:text-gray-400">{s.course?.[0]?.learnProgress || 0}%</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-indigo-600 flex-shrink-0">{s.course?.[0]?.learnScore}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses */}
        {!userLoading && user.course && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="font-bold text-slate-900 mb-5 dark:text-white">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.course.map((course, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group dark:bg-gray-900">
                  {course.image && <img src={course.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate dark:text-white">{course.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate dark:text-gray-400">{course.description}</p>
                  </div>
                  {course.data?.[0]?._id && (
                    <Link to={`/course/${course._id}/${course.data[0]._id}/${course.data[0].superSkills?.[0]?._id}`}
                      className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors opacity-0 group-hover:opacity-100">
                      Preview
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInstructor;
