import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import HeaderI from "../../../Components/Header/HeaderI";
import SlideDown from "./SlideDown";
import CourseContent from "./CourseContent";
import Footer from "../../../Components/Footer/Footer";

const CourseInstructor = () => {
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { courseId, superSkillsId, skillsId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [course, setCourse] = useState();
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillsPosition, setSkillsPosition] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { dispatch(current()); }, []);
  useEffect(() => {
    if (!userLoading) setCourse(user.course.find((c) => c._id === courseId));
  }, [userLoading]);
  useEffect(() => {
    if (course) {
      const section = course.data.find((el) => el._id == superSkillsId);
      const skills = section?.superSkills?.find((el) => el._id == skillsId);
      if (skills) { setSkillsData(skills.skillsData); setLoading(false); }
    }
  }, [course]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HeaderI />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-72" : "w-0"} flex-shrink-0 bg-white border-r border-slate-100 overflow-y-auto transition-all duration-300 flex flex-col`}>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="font-bold text-slate-900 text-sm truncate">{course?.title}</h2>
            <button onClick={() => setSidebarOpen(false)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors flex-shrink-0">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
          <div className="flex-1 p-3">
            {course?.data?.map((section, si) => (
              <SlideDown key={section._id} title={section.title} courseIndex={si}>
                <div className="space-y-0.5 py-1">
                  {section.superSkills?.map((skill) => {
                    const isActive = skillsId === skill._id;
                    return (
                      <Link key={skill._id}
                        to={`/course/${courseId}/${section._id}/${skill._id}`}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${isActive ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-50"}`}>
                        <i className={`fas ${skill.type == "1" ? "fa-flag-checkered" : "fa-file-alt"} flex-shrink-0`}></i>
                        <span className="flex-1 truncate font-medium">{skill.skillsName}</span>
                      </Link>
                    );
                  })}
                </div>
              </SlideDown>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="fixed left-0 top-1/2 -translate-y-1/2 z-30 w-8 h-16 bg-white border border-slate-200 rounded-r-xl shadow-sm flex items-center justify-center text-slate-400 hover:bg-slate-50">
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          )}
          <div className="max-w-4xl mx-auto px-6 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-24 text-slate-400">
                <div className="text-center"><i className="fas fa-spinner fa-spin text-3xl mb-3 block"></i><p className="text-sm">Loading...</p></div>
              </div>
            ) : skillsData.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-6 text-xs text-slate-400">
                  <span className="bg-violet-100 text-violet-700 font-bold px-2.5 py-1 rounded-lg"><i className="fas fa-chalkboard-teacher mr-1"></i>Preview Mode</span>
                  <span>{skillsPosition + 1} / {skillsData.length}</span>
                </div>
                <div className="prose max-w-none text-slate-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: skillsData[skillsPosition]?.content }} />
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  <button onClick={() => setSkillsPosition(Math.max(0, skillsPosition - 1))} disabled={skillsPosition === 0}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
                    <i className="fas fa-arrow-left text-xs"></i> Previous
                  </button>
                  <button onClick={() => setSkillsPosition(Math.min(skillsData.length - 1, skillsPosition + 1))} disabled={skillsPosition === skillsData.length - 1}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
                    Next <i className="fas fa-arrow-right text-xs"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-24 text-slate-400"><p>No content</p></div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseInstructor;
