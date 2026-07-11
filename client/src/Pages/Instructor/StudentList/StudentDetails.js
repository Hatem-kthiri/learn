import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import {
  get_student_learningSchedule,
  get_students_progress,
} from "../../../redux/actions/InstructorActions";
import { useParams, Link } from "react-router-dom";
import HeaderI from "../../../Components/Header/HeaderI";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Footer from "../../../Components/Footer/Footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const StudentDetails = () => {
  const dispatch = useDispatch();
  const { studentId } = useParams();
  const [student, setStudent] = useState(undefined);
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { studentsProgress, studentSchedule } = useSelector(
    (state) => state.instructorReducer,
  );

  useEffect(() => {
    dispatch(current());
  }, []);
  useEffect(() => {
    if (!userLoading) dispatch(get_students_progress(user.guild));
  }, [user]);
  useEffect(() => {
    const found = studentsProgress.find((s) => s._id === studentId);
    setStudent(found);
    if (found)
      dispatch(
        get_student_learningSchedule({
          student: found,
          courseId: found.course?.[0]?.courseId?.[0],
        }),
      );
  }, [studentsProgress]);

  if (!student)
    return (
      <div className="min-h-screen bg-slate-50">
        <HeaderI />
        <div className="flex items-center justify-center py-32">
          <div className="text-center text-slate-400">
            <i className="fas fa-spinner fa-spin text-4xl mb-3 block"></i>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );

  const chartData = {
    labels: studentSchedule?.map?.((s) => s.title) || [],
    datasets: [
      {
        label: "Progress %",
        data:
          studentSchedule?.map?.(
            (s) =>
              (s.details?.filter((d) => d.open).length /
                (s.details?.length || 1)) *
              100,
          ) || [],
        backgroundColor: "rgba(99,102,241,0.6)",
        borderColor: "rgb(99,102,241)",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { callback: (v) => `${v}%` } },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderI />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/students-list"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors"
          >
            <i className="fas fa-arrow-left text-sm"></i>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Student Details
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {student.firstName} {student.lastName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
            <img
              src={student.profileImg}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover bg-slate-100 mx-auto mb-4"
            />
            <p className="font-bold text-slate-900 text-lg">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-slate-500 text-sm mt-0.5">{student.email}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500">Progress</span>
                <span className="text-sm font-bold text-indigo-600">
                  {student.course?.[0]?.learnProgress || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500">Score</span>
                <span className="text-sm font-bold text-emerald-600">
                  {student.course?.[0]?.learnScore || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500">Guild</span>
                <span className="text-sm font-bold text-slate-700">
                  {student.course?.[0]?.guild}
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-5">
              Learning Progress by Section
            </h2>
            {studentSchedule?.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400">
                <div className="text-center">
                  <i className="fas fa-chart-bar text-4xl mb-2 block opacity-20"></i>
                  <p className="text-sm">No schedule data</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
