import axios from "axios";
import React, { useEffect, useState } from "react";
import CourseContent from "./CourseContent";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import HeaderS from "../../../Components/Header/HeaderS";
import Quiz from "./Quiz";
import { scrollToElement, successToast, url } from "../../../utils";
import SlideDown from "./SlideDown";
import { get_learning_schedule } from "../../../redux/actions/StudentAction";
import CertificateButton from "./CertificateButton";

const Course = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { learningSchedule, night_mode } = useSelector((state) => state.StudentReducer);
  const [course, setCourse] = useState();
  const { superSkillsId, skillsId } = useParams();
  const [skillsData, setSkillsData] = useState([]);
  const [skillsPosition, setSkillsPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openLoading, setOpenLoading] = useState(false);
  const [nextButton, setNextButton] = useState(false);
  const [idSkills, setIdSkills] = useState(skillsId);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { dispatch(current()); }, []);
  useEffect(() => { if (!userLoading) { setCourse(user.course[0].course); dispatch(get_learning_schedule(user)); } }, [userLoading]);
  useEffect(() => { scrollToElement(skillsId); }, [skillsId]);
  useEffect(() => {
    if (course) {
      const section = course.data.find((el) => el._id == superSkillsId);
      const skills = section?.superSkills?.find((el) => el._id == skillsId);
      if (skills) { setSkillsData(skills.skillsData); setLoading(false); setSkillsPosition(0); }
    }
  }, [course, skillsId]);

  const handleNext = async () => {
    if (skillsPosition < skillsData.length - 1) { setSkillsPosition(skillsPosition + 1); return; }
    setOpenLoading(true);
    try {
      const res = await axios.put(`${url}/api/user/open-skill`, {
        userId: user._id,
        courseId: course._id,
        superSkillsId,
        skillsId,
      });
      dispatch(get_learning_schedule(user));
      dispatch(current());
      const nextSkill = res.data.nextSkill;
      if (nextSkill) {
        setIdSkills(nextSkill._id);
        setSkillsData(nextSkill.skillsData);
        setSkillsPosition(0);
        // The next lesson can be in a different chapter, so use the chapter id
        // the backend resolved rather than assuming it's the current one.
        navigate(`/course/${res.data.nextSuperSkillsId}/${nextSkill._id}`);
      } else {
        successToast("You've completed this course! 🎉");
      }
    } catch (e) { console.log(e); } finally { setOpenLoading(false); }
  };

  const getScheduleDetails = (sectionId) =>
    learningSchedule?.learning?.find((l) => l._id === sectionId)?.details || [];

  // dark mode classes
  const dm = night_mode;
  const bg = dm ? "bg-gray-900" : "bg-slate-50";
  const sidebarBg = dm ? "bg-gray-800 border-gray-700" : "bg-white border-slate-100";
  const sidebarHeader = dm ? "bg-gray-800 border-gray-700" : "bg-white border-slate-100";
  const mainBg = dm ? "bg-gray-900" : "bg-slate-50";
  const textPrimary = dm ? "text-gray-100" : "text-slate-900";
  const textSecondary = dm ? "text-gray-400" : "text-slate-500";
  const cardBg = dm ? "bg-gray-800 border-gray-700" : "bg-white border-slate-100";
  const inputBg = dm ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-slate-200 text-slate-800";
  const navLinkBase = dm ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";
  const navLinkActive = "bg-indigo-600 text-white";
  const progressBarBg = dm ? "bg-gray-700" : "bg-slate-100";

  return (
    <div className={`h-screen flex flex-col ${bg}`}>
      <HeaderS />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-72" : "w-0"} flex-shrink-0 border-r ${sidebarBg} flex flex-col overflow-hidden transition-all duration-300`}>
          {/* Sidebar header */}
          <div className={`px-4 py-3 border-b ${sidebarHeader} flex items-center justify-between flex-shrink-0`}>
            <p className={`font-bold text-sm truncate ${textPrimary}`}>{course?.title}</p>
            <button onClick={() => setSidebarOpen(false)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ml-2 ${dm ? "bg-gray-700 text-gray-400 hover:bg-gray-600" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>

          {/* Nav items */}
          <div className="flex-1 overflow-y-auto p-3">
            {course?.data?.map((section, courseIndex) => {
              const scheduleDetails = getScheduleDetails(section._id);
              return (
                <SlideDown key={section._id} title={section.Name} isCurrentChapter={section._id === superSkillsId} nightMode={dm}>
                  <div className="space-y-0.5 py-1">
                    {section.superSkills?.map((skill) => {
                      const detail = scheduleDetails.find((d) => d._id === skill._id);
                      const isOpen = detail?.open || (courseIndex === 0);
                      const isActive = skillsId === skill._id;
                      const isCheckpoint = skill.type == "1";
                      return (
                        <Link key={skill._id} id={skill._id}
                          to={isOpen ? `/course/${section._id}/${skill._id}` : "#"}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${isActive ? navLinkActive : isOpen ? navLinkBase : `opacity-40 cursor-not-allowed ${textSecondary}`}`}>
                          <i className={`fas ${isCheckpoint ? "fa-flag-checkered" : isOpen ? "fa-check-circle text-emerald-400" : "fa-lock"} flex-shrink-0 text-xs`}></i>
                          {/* TITLE - always visible with contrast */}
                          <span className={`flex-1 truncate font-medium leading-snug ${isActive ? "text-white" : isOpen ? textPrimary : ""}`}>
                            {skill.skillsName}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </SlideDown>
              );
            })}
          </div>
        </aside>

        {/* Sidebar toggle when closed */}
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)}
            className={`fixed left-0 top-1/2 -translate-y-1/2 z-30 w-8 h-16 ${dm ? "bg-gray-800 border-gray-700 text-gray-400" : "bg-white border-slate-200 text-slate-400"} border rounded-r-xl shadow-sm flex items-center justify-center hover:text-indigo-500 transition-colors`}>
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        )}

        {/* Main content */}
        <div className={`flex-1 overflow-y-auto ${mainBg}`}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Progress */}
            {!userLoading && user.course?.[0] && (
              <div className="flex items-center gap-3 mb-6">
                <div className={`flex-1 h-2 ${progressBarBg} rounded-full overflow-hidden`}>
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${user.course[0].learnProgress || 0}%` }}></div>
                </div>
                <span className={`text-xs font-semibold flex-shrink-0 ${textSecondary}`}>{user.course[0].learnProgress || 0}%</span>
              </div>
            )}

            {!userLoading && user.course?.[0] && (
              <CertificateButton studentId={user._id} courseId={user.course[0].course?._id} dm={dm} />
            )}

            {loading ? (
              <div className={`flex items-center justify-center py-24 ${textSecondary}`}>
                <div className="text-center"><i className="fas fa-spinner fa-spin text-3xl mb-3 block"></i><p className="text-sm">Loading content...</p></div>
              </div>
            ) : skillsData.length > 0 && (() => {
              const currentSlide = skillsData[skillsPosition];
              // Quiz slides have no `type` field at all; checkpoint slides are
              // regular content (type 0) that embed the checkpoint widget.
              const isQuizSlide = currentSlide?.type === undefined;
              const isCheckpointSlide = currentSlide?.content?.includes("checkpoint-preview");
              const requiresSubmission = isQuizSlide || isCheckpointSlide;
              const nextDisabled = requiresSubmission && !nextButton;
              return (
              <>
                {currentSlide?.type === 0 ? (
                  <CourseContent loading={loading} skillsData={skillsData} skillsPosition={skillsPosition} setNextButton={setNextButton} handleNext={handleNext} openLoading={openLoading} nightMode={dm} />
                ) : (
                  <Quiz loading={loading} skillsData={skillsData[skillsData.length - 1]} skillsPosition={skillsPosition} handleNext={handleNext} setNextButton={setNextButton} skillsId={idSkills} nightMode={dm} />
                )}

                {/* Navigation */}
                <div className={`flex items-center justify-between mt-8 pt-6 border-t ${dm ? "border-gray-700" : "border-slate-100"}`}>
                  <button onClick={() => setSkillsPosition(Math.max(0, skillsPosition - 1))} disabled={skillsPosition === 0}
                    className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed border ${dm ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
                    <i className="fas fa-arrow-left text-xs"></i> Previous
                  </button>
                  <span className={`text-sm ${textSecondary}`}>{skillsPosition + 1} / {skillsData.length}</span>
                  <button onClick={handleNext} disabled={nextDisabled}
                    title={nextDisabled ? (isQuizSlide ? "Submit the quiz to continue" : "Submit your checkpoint to continue") : undefined}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
                    Next <i className="fas fa-arrow-right text-xs"></i>
                  </button>
                </div>
              </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
