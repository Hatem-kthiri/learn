import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import Statistics from "./Statistics";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [myCourse, setMyCourse] = useState([]);

  useEffect(() => {
    api
      .get("/api/admin/getCourse")
      .then((res) => setMyCourse(res.data.courses));
    api.get("/api/admin/getStudents").then((res) => setStudents(res.data.data));
  }, []);

  const currentDate = new Date();
  const studentsThisMonth = students.filter((s) => {
    const d = new Date(s.createdAt);
    return (
      d.getMonth() === currentDate.getMonth() &&
      d.getFullYear() === currentDate.getFullYear()
    );
  });

  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: "fas fa-users",
      color: "bg-indigo-50 text-indigo-600",
      accent: "border-indigo-200",
    },
    {
      label: "New This Month",
      value: studentsThisMonth.length,
      icon: "fas fa-user-plus",
      color: "bg-emerald-50 text-emerald-600",
      accent: "border-emerald-200",
    },
    {
      label: "Total Courses",
      value: myCourse.length,
      icon: "fas fa-book-open",
      color: "bg-violet-50 text-violet-600",
      accent: "border-violet-200",
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back, Administrator
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600">
          <i className="fas fa-calendar-alt text-indigo-500"></i>
          <span>
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-6 shadow-sm border ${stat.accent} flex items-center gap-5`}
          >
            <div
              className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center flex-shrink-0`}
            >
              <i className={`${stat.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-5">
          Student Statistics
        </h2>
        <Statistics />
      </div>
    </div>
  );
};

export default Dashboard;
