import axios from "axios";
import React, { useEffect, useState } from "react";
import CourseContent from "./CourseContent";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import HeaderS from "../../../Components/Header/HeaderS";
import Quiz from "./Quiz";
import { scrollToElement, url } from "../../../utils";
import SlideDown from "./SlideDown";
import { get_learning_schedule } from "../../../redux/actions/StudentAction";

const Course = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { learningSchedule } = useSelector((state) => state.StudentReducer);
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
      if (skills) { setSkillsData(skills.skillsData); setLoading(false); }
    }
  }, [course]);

  const handleNext = async () => {
    if (skillsPosition < skillsData.length - 1) {
      setSkillsPosition(skillsPosition + 1);
      return;
    }
    setOpenLoading(true);
    try {
      const res = await axios.put(`${url}/api/student/open-skill`, { userId: user._id, superSkillsId, skillsId });
      dispatch(get_learning_schedule(user));
      const nextSkill = res.data.nextSkill;
      if (nextSkill) {
        setIdSkills(nextSkill._id);
        setSkillsData(nextSkill.skillsData);
        setSkillsPosition(0);
        navigate(`/course/${superSkillsId}/${nextSkill._id}`);
      }
    } catch (e) { console.log(e); } finally { setOpenLoading(false); }
  };

  const getScheduleDetails = (sectionId) => learningSchedule?.learning?.find((l) => l._id === sectionId)?.details || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HeaderS />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-72" : "w-0"} flex-shrink-0 bg-white border-r border-slate-100 overflow-y-auto transition-all duration-300 flex flex-col`}>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="font-bold text-slate-900 text-sm">{course?.title}</h2>
            <button onClick={() => setSidebarOpen(false)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
          <div className="flex-1 p-3">
            {course?.data?.map((section, courseIndex) => {
              const scheduleDetails = getScheduleDetails(section._id);
              return (
                <SlideDown key={section._id} title={section.title} courseIndex={courseIndex}>
                  <div className="space-y-0.5 py-1">
                    {section.superSkills?.map((skill, index) => {
                      const detail = scheduleDetails.find((d) => d._id === skill._id);
                      const isOpen = detail?.open || (courseIndex === 0 && index === 0);
                      const isActive = skillsId === skill._id;
                      const isCheckpoint = skill.type == "1";
                      return (
                        <Link key={skill._id} id={skill._id}
                          to={isOpen ? `/course/${section._id}/${skill._id}` : "#"}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${isActive ? "bg-indigo-600 text-white" : isOpen ? "text-slate-700 hover:bg-slate-50" : "text-slate-300 cursor-not-allowed"}`}>
                          <i className={`fas ${isCheckpoint ? "fa-flag-checkered" : isOpen ? "fa-check-circle" : "fa-lock"} flex-shrink-0 ${isActive ? "text-white" : isOpen && !isCheckpoint ? "text-emerald-500" : ""}`}></i>
                          <span className="flex-1 truncate font-medium">{skill.skillsName}</span>
                        </Link>
                      );
                    })}
                  </div>
                </SlideDown>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {/* Toggle sidebar button */}
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="fixed left-0 top-1/2 -translate-y-1/2 z-30 w-8 h-16 bg-white border border-slate-200 rounded-r-xl shadow-sm flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          )}

          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Progress bar */}
            {!userLoading && user.course?.[0] && (
              <div className="mb-6 flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${user.course[0].learnProgress || 0}%` }}></div>
                </div>
                <span className="text-xs text-slate-500 font-medium flex-shrink-0">{user.course[0].learnProgress || 0}% complete</span>
              </div>
            )}

            {/* Course content */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center text-slate-400">
                  <i className="fas fa-spinner fa-spin text-3xl mb-3 block"></i>
                  <p className="text-sm">Loading content...</p>
                </div>
              </div>
            ) : skillsData.length > 0 && (
              <>
                {skillsData[skillsPosition]?.type === 0 ? (
                  <CourseContent loading={loading} skillsData={skillsData} skillsPosition={skillsPosition} setNextButton={setNextButton} handleNext={handleNext} openLoading={openLoading} />
                ) : (
                  <Quiz loading={loading} skillsData={skillsData[skillsData.length - 1]} skillsPosition={skillsPosition} handleNext={handleNext} setNextButton={setNextButton} skillsId={idSkills} />
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  <button onClick={() => setSkillsPosition(Math.max(0, skillsPosition - 1))} disabled={skillsPosition === 0}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
                    <i className="fas fa-arrow-left text-xs"></i> Previous
                  </button>
                  <span className="text-sm text-slate-400">{skillsPosition + 1} / {skillsData.length}</span>
                  <button onClick={handleNext}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
                    Next <i className="fas fa-arrow-right text-xs"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
