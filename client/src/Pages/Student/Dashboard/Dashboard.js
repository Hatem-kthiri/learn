import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderS from "../../../Components/Header/HeaderS";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import MiddleComponent from "./MiddleComponent";
import { get_all_checkpoint, get_all_quiz, get_learning_schedule } from "../../../redux/actions/StudentAction";

const DashboardStudent = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { learningSchedule, studentQuizScore, studentCheckpointScore } = useSelector((state) => state.StudentReducer);
  const [courseId, setCourseId] = useState({});

  useEffect(() => { dispatch(current()); }, []);
  useEffect(() => { if (user.course) setCourseId([user.course[0].courseId[0], user.course[0].courseId[1]]); }, [user.course]);
  useEffect(() => { if (!userLoading) dispatch(get_learning_schedule(user)); }, [userLoading]);
  useEffect(() => { dispatch(get_all_quiz(user)); dispatch(get_all_checkpoint(user)); }, [user]);

  const ResumeCourse = () => {
    if (!learningSchedule) return null;
    const courses = learningSchedule.learning;
    let lastOpenSkill = null, superSkillsId = null;
    for (let i = courses.length - 1; i >= 0; i--) {
      for (let j = courses[i].details.length - 1; j >= 0; j--) {
        if (courses[i].details[j].open === true) { lastOpenSkill = courses[i].details[j]; superSkillsId = courses[i]._id; break; }
      }
      if (lastOpenSkill) break;
    }
    return lastOpenSkill ? [superSkillsId, lastOpenSkill._id] : null;
  };

  const calcScore = () => {
    let q = 0, c = 0;
    studentQuizScore?.forEach((s) => (q += +s.quizScore));
    studentCheckpointScore?.forEach((s) => (c += +s.checkpointScore));
    return q + c;
  };

  const calcProgress = () => {
    if (!user.course) return 0;
    return Math.round(user.course[0]?.learnProgress || 0);
  };

  const resumeLink = ResumeCourse();

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderS />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user.firstName}! Keep up the great work.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Progress Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-7 text-white shadow-lg shadow-indigo-200">
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

          {/* My Courses panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
              My Courses
              <Link to="/courses" className="text-xs text-indigo-600 font-semibold hover:underline">View all</Link>
            </h2>
            {userLoading ? (
              <div className="space-y-3">
                {[1,2].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>)}
              </div>
            ) : user.course?.map((course, i) => (
              <div key={i} className="flex gap-3 mb-3 last:mb-0">
                {course.course?.image && <img src={course.course.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{course.course?.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{course.course?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Component (students progress for instructor view, meetings, etc) */}
        <MiddleComponent user={user} userLoading={userLoading} />
      </div>
    </div>
  );
};

export default DashboardStudent;
