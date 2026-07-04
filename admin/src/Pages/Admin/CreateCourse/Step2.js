import React, { useState } from "react";
import Modal_AddChapter from "./Modal_AddChapter";
import Modal_AddQuiz from "./Modal_AddQuiz";
import Modal_AddSkills from "./Modal_AddSkills";
import Modal_AddSkillsContent from "./Modal_AddSkillsContent";

const Step2 = ({
  getChapterName, saveChapterName, courseCreated,
  getSkillsName, saveSkillsName,
  skillsShow, skillsDisplay, ModalSkillsOpen, ModalSkillsClose,
  skillsContentShow, skillsContentDisplay,
  ModalSkillsContentOpen, ModalSkillsContentClose,
  handleUpdate, saveSkillsContent,
  showQuiz, displayQuiz, ModalQuizOpen, closeModalQuiz,
}) => {
  const [chapterShow, setChapterShow] = useState(false);
  const [quizModal, setQuizModal] = useState({ show: false, indexes: null });
  const [courseRef, setCourseRef] = useState(null);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <Modal_AddChapter show={chapterShow} display={chapterShow ? "block" : "none"} closeModal={() => setChapterShow(false)} getChapterName={getChapterName} saveChapterName={() => { saveChapterName(); setChapterShow(false); }} />
      <Modal_AddSkills show={skillsShow} display={skillsDisplay} close={ModalSkillsClose} getSkillsName={getSkillsName} saveSkillsName={saveSkillsName} />
      <Modal_AddSkillsContent show={skillsContentShow} display={skillsContentDisplay} ModalSkillsContentOpen={ModalSkillsContentOpen} ModalSkillsContentClose={ModalSkillsContentClose} handleUpdate={handleUpdate} saveSkillsContent={saveSkillsContent} />
      <Modal_AddQuiz quizModal={quizModal} setQuizModal={setQuizModal} quizIndexes={quizModal.indexes} setCourse={setCourseRef} />

      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-900">Course Curriculum</h3>
            <p className="text-sm text-slate-500 mt-0.5">Build your course structure</p>
          </div>
          <button onClick={() => setChapterShow(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all inline-flex items-center gap-2">
            <i className="fas fa-plus text-xs"></i> Add Section
          </button>
        </div>

        <div className="space-y-3">
          {courseCreated?.data?.map((section, si) => (
            <div key={section._id} className="border border-slate-200 rounded-2xl overflow-hidden">
              {/* Section header */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 cursor-pointer" onClick={() => toggleSection(section._id)}>
                <i className={`fas fa-chevron-${openSections[section._id] ? "down" : "right"} text-xs text-slate-400 flex-shrink-0`}></i>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">Section {si + 1}: {section.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{section.superSkills?.length || 0} lessons</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); ModalSkillsOpen(section._id); }}
                  className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 font-semibold px-3 py-1.5 rounded-xl text-xs transition-all">
                  <i className="fas fa-plus text-xs"></i> Lesson
                </button>
              </div>

              {/* Skills list */}
              {openSections[section._id] && (
                <div className="divide-y divide-slate-100">
                  {section.superSkills?.map((skill, ski) => (
                    <div key={skill._id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                      <i className={`fas ${skill.type == "1" ? "fa-flag-checkered text-amber-500" : "fa-file-alt text-indigo-400"} flex-shrink-0`}></i>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{skill.skillsName}</p>
                        <p className="text-xs text-slate-400">{skill.skillsData?.length || 0} slides</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => ModalSkillsContentOpen(section._id, skill._id)}
                          className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-all">
                          <i className="fas fa-plus text-xs"></i> Slide
                        </button>
                        <button onClick={() => setQuizModal({ show: true, indexes: { si, ski, courseId: courseCreated?._id } })}
                          className="flex items-center gap-1 bg-violet-50 hover:bg-violet-100 text-violet-600 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-all">
                          <i className="fas fa-question-circle text-xs"></i> Quiz
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!section.superSkills || section.superSkills.length === 0) && (
                    <div className="p-6 text-center text-slate-400 text-sm">
                      <i className="fas fa-book-open block text-2xl mb-2 opacity-20"></i>
                      No lessons yet — add one above
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {(!courseCreated?.data || courseCreated.data.length === 0) && (
            <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              <i className="fas fa-layer-group text-4xl mb-3 block opacity-20"></i>
              <p className="font-medium">No sections yet</p>
              <button onClick={() => setChapterShow(true)} className="mt-3 inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:underline">
                <i className="fas fa-plus text-xs"></i> Add your first section
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Step2;
