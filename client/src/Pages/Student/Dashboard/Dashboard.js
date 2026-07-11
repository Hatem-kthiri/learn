import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderS from "../../../Components/Header/HeaderS";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import MiddleComponent from "./MiddleComponent";
import { get_all_checkpoint, get_all_quiz, get_learning_schedule } from "../../../redux/actions/StudentAction";
import Footer from "../../../Components/Footer/Footer";

const DashboardStudent = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { learningSchedule, studentQuizScore, studentCheckpointScore, night_mode } = useSelector((state) => state.StudentReducer);

  useEffect(() => { dispatch(current()); }, []);
  useEffect(() => { if (!userLoading) dispatch(get_learning_schedule(user)); }, [userLoading]);
  useEffect(() => { dispatch(get_all_quiz(user)); dispatch(get_all_checkpoint(user)); }, [user]);

  const ResumeCourse = () => {
    if (!learningSchedule) return null;
    let lastOpenSkill = null, superSkillsId = null;
    for (let i = learningSchedule.learning.length - 1; i >= 0; i--) {
      for (let j = learningSchedule.learning[i].details.length - 1; j >= 0; j--) {
        if (learningSchedule.learning[i].details[j].open) { lastOpenSkill = learningSchedule.learning[i].details[j]; superSkillsId = learningSchedule.learning[i]._id; break; }
      }
      if (lastOpenSkill) break;
    }
    return lastOpenSkill ? [superSkillsId, lastOpenSkill._id] : null;
  };

  const calcScore = () => {
    let q = 0, c = 0;
    studentQuizScore?.forEach((s) => (q += +s.quizScore));
    studentCheckpointScore?.forEach((s) => (c += +s.score));
    return q + c;
  };
  const calcProgress = () => Math.round(user.course?.[0]?.learnProgress || 0);
  const resumeLink = ResumeCourse();
  const dm = night_mode;

  return (
    <div className={`min-h-screen flex flex-col ${dm ? "bg-gray-900" : "bg-slate-50"}`}>
      <HeaderS />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${dm ? "text-white" : "text-slate-900"}`}>My Dashboard</h1>
          <p className={`text-sm mt-1 ${dm ? "text-gray-400" : "text-slate-500"}`}>Welcome back, {user.firstName}! Keep up the great work.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Progress card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-7 text-white shadow-lg shadow-indigo-200/40">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Course Progress</p>
                <p className="text-4xl font-black mt-1">{calcProgress()}<span className="text-xl font-bold text-indigo-300">%</span></p>
                <p className="text-indigo-200 text-sm mt-1">Total Score: <span className="text-white font-bold">{calcScore()}</span></p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <i className="fas fa-chart-line text-2xl"></i>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${calcProgress()}%` }}></div>
            </div>
            {(resumeLink || user.course) && (
              <Link to={resumeLink ? `/course/${resumeLink[0]}/${resumeLink[1]}` : `/course/${user.course?.[0]?.courseId?.[0]}/${user.course?.[0]?.courseId?.[1]}`}
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors">
                <i className="fas fa-play"></i> Resume Course
              </Link>
            )}
          </div>

          {/* Courses panel */}
          <div className={`rounded-2xl p-5 ${dm ? "bg-gray-800 border border-gray-700" : "bg-white border border-slate-100 shadow-sm"}`}>
            <h2 className={`font-bold mb-4 flex items-center justify-between ${dm ? "text-white" : "text-slate-900"}`}>
              My Courses
              <Link to="/courses" className="text-xs text-indigo-400 font-semibold hover:underline">View all</Link>
            </h2>
            {userLoading ? (
              <div className="space-y-3">{[1,2].map((i) => <div key={i} className={`h-16 rounded-xl animate-pulse ${dm ? "bg-gray-700" : "bg-slate-100"}`}></div>)}</div>
            ) : user.course?.map((enrollment, i) => (
              <div key={i} className={`flex gap-3 mb-3 last:mb-0 p-3 rounded-xl ${dm ? "bg-gray-700" : "bg-slate-50"}`}>
                {enrollment.course?.image && <img src={enrollment.course.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${dm ? "text-white" : "text-slate-900"}`}>{enrollment.course?.title}</p>
                  <p className={`text-xs mt-0.5 line-clamp-1 ${dm ? "text-gray-400" : "text-slate-400"}`}>{enrollment.course?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <MiddleComponent user={user} userLoading={userLoading} />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardStudent;
