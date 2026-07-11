import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { current } from "../../../redux/actions/Actions";
import HeaderI from "../../../Components/Header/HeaderI";
import SlideDown from "./SlideDown";
import Footer from "../../../Components/Footer/Footer";
import Quiz from "./Quiz";

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
  const [currentSkill, setCurrentSkill] = useState(null);
  const [isQuizSlide, setIsQuizSlide] = useState(false);

  useEffect(() => {
    dispatch(current());
  }, []);
  useEffect(() => {
    if (!userLoading && user.course) {
      const found = user.course.find((c) => c._id === courseId);
      setCourse(found);
    }
  }, [userLoading]);
  useEffect(() => {
    if (course) {
      for (const section of course.data || []) {
        const skill = section.superSkills?.find((el) => el._id == skillsId);
        if (skill) {
          setSkillsData(skill.skillsData);
          setCurrentSkill(skill);
          setLoading(false);
          setSkillsPosition(0);
          break;
        }
      }
    }
  }, [course, skillsId]);

  useEffect(() => {
    setIsQuizSlide(
      currentSkill?.skillsData?.[skillsPosition]?.type === undefined
    );
  }, [skillsPosition, currentSkill]);

  // Preview mode has no persisted progress, so "next/previous lesson" is just
  // walking a flattened, ordered list of every lesson across every chapter.
  const getFlatSkills = () => {
    const flat = [];
    for (const section of course?.data || []) {
      for (const skill of section.superSkills || []) {
        flat.push({ chapterId: section._id, skill });
      }
    }
    return flat;
  };

  const currentFlatIndex = () =>
    getFlatSkills().findIndex((f) => f.skill._id === skillsId);

  const isFirstSlideOverall = skillsPosition === 0 && currentFlatIndex() <= 0;
  const flatSkills = getFlatSkills();
  const isLastSlideOverall =
    skillsPosition === skillsData.length - 1 &&
    currentFlatIndex() === flatSkills.length - 1;

  const handlePrevious = () => {
    if (skillsPosition > 0) {
      setSkillsPosition(skillsPosition - 1);
      return;
    }
    const idx = currentFlatIndex();
    if (idx > 0) {
      const prev = flatSkills[idx - 1];
      navigate(`/course/${courseId}/${prev.chapterId}/${prev.skill._id}`);
    }
  };

  const handleNext = () => {
    if (skillsPosition < skillsData.length - 1) {
      setSkillsPosition(skillsPosition + 1);
      return;
    }
    const idx = currentFlatIndex();
    if (idx !== -1 && idx < flatSkills.length - 1) {
      const next = flatSkills[idx + 1];
      navigate(`/course/${courseId}/${next.chapterId}/${next.skill._id}`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-gray-900">
      <HeaderI />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-72" : "w-0"} flex-shrink-0 bg-white border-r border-slate-100 flex flex-col overflow-hidden transition-all duration-300`}
        >
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0 dark:border-gray-700">
            <p className="font-bold text-sm truncate text-slate-900 dark:text-white">
              {course?.title}
            </p>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors flex-shrink-0 ml-2 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {course?.data?.map((section, si) => {
              return (
                <SlideDown
                  key={section._id}
                  title={section.Name}
                  courseIndex={si}
                >
                  <div className="space-y-0.5 py-1">
                    {section.superSkills?.map((skill) => {
                      const isActive = skillsId === skill._id;
                      const isCheckpoint = skill.type == "1";
                      return (
                        <Link
                          key={skill._id}
                          to={`/course/${courseId}/${section._id}/${skill._id}`}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${isActive ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                          <i
                            className={`fas ${isCheckpoint ? "fa-flag-checkered" : "fa-file-alt"} flex-shrink-0 text-xs ${isActive ? "text-white" : isCheckpoint ? "text-amber-500" : "text-indigo-400"}`}
                          ></i>
                          {/* Always-visible title */}
                          <span
                            className={`flex-1 truncate font-medium ${isActive ? "text-white" : "text-slate-800"}`}
                          >
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

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-30 w-8 h-16 bg-white border border-slate-200 rounded-r-xl shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500"
          >
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        )}

        {/* Main */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-24 text-slate-400 dark:text-gray-500">
                <div className="text-center">
                  <i className="fas fa-spinner fa-spin text-3xl mb-3 block"></i>
                  <p className="text-sm">Loading...</p>
                </div>
              </div>
            ) : skillsData.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-violet-100 text-violet-700 font-bold px-3 py-1 rounded-lg text-xs">
                    <i className="fas fa-chalkboard-teacher mr-1.5"></i>Preview
                    Mode
                  </span>
                  <span className="text-xs text-slate-400 dark:text-gray-500">
                    {skillsPosition + 1} / {skillsData.length}
                  </span>
                </div>

                {isQuizSlide ? (
                  <Quiz
                    loading={loading}
                    skillsData={skillsData[skillsData.length - 1]}
                    skillsPosition={skillsPosition}
                  />
                ) : (
                  <div
                    className="prose max-w-none text-slate-800 leading-relaxed dark:text-gray-100"
                    dangerouslySetInnerHTML={{
                      __html: skillsData[skillsPosition]?.content,
                    }}
                  />
                )}

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-gray-700">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstSlideOverall}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
                  >
                    <i className="fas fa-arrow-left text-xs"></i> Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isLastSlideOverall}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
                  >
                    Next <i className="fas fa-arrow-right text-xs"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-24 text-slate-400 dark:text-gray-500">
                <i className="fas fa-file-alt text-5xl mb-4 block opacity-20"></i>
                <p>No content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInstructor;
