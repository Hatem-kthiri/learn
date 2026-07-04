import React, { useState, useRef } from "react";
import Modal_AddChapter from "./Modal_AddChapter";
import Modal_AddQuiz from "./Modal_AddQuiz";
import Modal_AddSkills from "./Modal_AddSkills";
import Modal_AddSkillsContent from "./Modal_AddSkillsContent";
import JoditEditor from "jodit-react";
import api from "../../../utils/api";
import ClipLoader from "react-spinners/ClipLoader";

const Step2 = ({ course, setCourse }) => {
  const editorConfig = { readonly: false, height: 400, toolbarAdaptive: false };
  const editorRef = useRef(null);

  // Chapter modal
  const [chapterShow, setChapterShow] = useState(false);
  const [chapterName, setChapterName] = useState("");
  // Skills modal
  const [skillsModal, setSkillsModal] = useState({ show: false, superSkillsId: null });
  const [skillsName, setSkillsName] = useState("");
  // Content (slide) modal
  const [contentModal, setContentModal] = useState({ show: false, ids: null, existingContent: "" });
  const [newContent, setNewContent] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  // Quiz modal
  const [quizModal, setQuizModal] = useState({ show: false, indexes: null });
  // Edit names
  const [editSection, setEditSection] = useState({ show: false, id: null, name: "" });
  const [editSkill, setEditSkill] = useState({ show: false, superSkillsId: null, skillsId: null, name: "" });
  // Open/close sections
  const [openSections, setOpenSections] = useState({});

  // ---- Chapter ----
  const saveChapter = () => {
    if (!chapterName) return;
    api.put(`/api/admin/addChapter/${course._id}`, { name: chapterName })
      .then((r) => { setCourse(r.data.data); setChapterShow(false); setChapterName(""); })
      .catch(console.log);
  };

  // ---- Skills ----
  const saveSkill = () => {
    if (!skillsName || !skillsModal.superSkillsId) return;
    api.put(`/api/admin/addSuperSkills/${course._id}/${skillsModal.superSkillsId}`, { name: skillsName })
      .then((r) => { setCourse(r.data.data); setSkillsModal({ show: false, superSkillsId: null }); setSkillsName(""); })
      .catch(console.log);
  };

  // ---- Content ----
  const saveContent = () => {
    setUpdateLoading(true);
    const { courseId, superSkillsId, skillsId } = contentModal.ids || {};
    api.put(`/api/admin/addSkillsContent`, { courseId, indexZero: superSkillsId, indexOne: skillsId, content: newContent })
      .then((r) => { setCourse(r.data.data); setContentModal({ show: false, ids: null, existingContent: "" }); setUpdateLoading(false); })
      .catch(() => setUpdateLoading(false));
  };

  const updateContent = () => {
    setUpdateLoading(true);
    api.put(`/api/admin/updateSkillsContent`, { ...contentModal.ids, content: newContent })
      .then((r) => { setCourse(r.data.data); setContentModal({ show: false, ids: null, existingContent: "" }); setUpdateLoading(false); })
      .catch(() => setUpdateLoading(false));
  };

  const deleteContent = (superSkillsId, skillsId, contentIndex) => {
    api.delete(`/api/admin/deleteSkillsContent/${course._id}/${superSkillsId}/${skillsId}/${contentIndex}`)
      .then((r) => setCourse(r.data.data)).catch(console.log);
  };

  const deleteSkill = (superSkillsId, skillsId) => {
    api.delete(`/api/admin/deleteSuperSkills/${course._id}/${superSkillsId}/${skillsId}`)
      .then((r) => setCourse(r.data.data)).catch(console.log);
  };

  const deleteSection = (superSkillsId) => {
    api.delete(`/api/admin/deleteChapter/${course._id}/${superSkillsId}`)
      .then((r) => setCourse(r.data.data)).catch(console.log);
  };

  const renameSection = () => {
    api.put(`/api/admin/updateChapterName/${course._id}/${editSection.id}`, { name: editSection.name })
      .then((r) => { setCourse(r.data.data); setEditSection({ show: false, id: null, name: "" }); })
      .catch(console.log);
  };

  const renameSkill = () => {
    api.put(`/api/admin/updateSuperSkillsName/${course._id}/${editSkill.superSkillsId}/${editSkill.skillsId}`, { name: editSkill.name })
      .then((r) => { setCourse(r.data.data); setEditSkill({ show: false, superSkillsId: null, skillsId: null, name: "" }); })
      .catch(console.log);
  };

  return (
    <>
      {/* Chapter modal */}
      <Modal_AddChapter show={chapterShow} display={chapterShow ? "block" : "none"} closeModal={() => setChapterShow(false)} getChapterName={(e) => setChapterName(e.target.value)} saveChapterName={saveChapter} />

      {/* Skills modal */}
      <Modal_AddSkills show={skillsModal.show} display={skillsModal.show ? "block" : "none"} close={() => setSkillsModal({ show: false, superSkillsId: null })} getSkillsName={(e) => setSkillsName(e.target.value)} saveSkillsName={saveSkill} />

      {/* Content (slide) modal */}
      {contentModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setContentModal({ show: false, ids: null, existingContent: "" })}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-bold text-slate-900">{contentModal.ids?.contentIndex !== undefined ? "Edit Slide" : "Add Slide"}</h3>
              <button onClick={() => setContentModal({ show: false, ids: null, existingContent: "" })} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><i className="fas fa-times text-sm"></i></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <JoditEditor config={editorConfig} value={contentModal.existingContent} onBlur={(v) => setNewContent(v)} />
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100 flex-shrink-0">
              <button onClick={() => setContentModal({ show: false, ids: null, existingContent: "" })} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm">Cancel</button>
              <button onClick={contentModal.ids?.contentIndex !== undefined ? updateContent : saveContent}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                {updateLoading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-save"></i> {contentModal.ids?.contentIndex !== undefined ? "Update" : "Save"}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz modal */}
      <Modal_AddQuiz quizModal={quizModal} setQuizModal={setQuizModal} quizIndexes={quizModal.indexes} setCourse={setCourse} />

      {/* Rename section modal */}
      {editSection.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditSection({ show: false })}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Rename Section</h3>
            <input type="text" defaultValue={editSection.name} onChange={(e) => setEditSection({ ...editSection, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setEditSection({ show: false })} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={renameSection} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Rename skill modal */}
      {editSkill.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditSkill({ show: false })}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Rename Lesson</h3>
            <input type="text" defaultValue={editSkill.name} onChange={(e) => setEditSkill({ ...editSkill, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setEditSkill({ show: false })} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={renameSkill} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Main curriculum UI */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-900">Course Curriculum</h3>
            <p className="text-sm text-slate-500 mt-0.5">Edit your course structure</p>
          </div>
          <button onClick={() => setChapterShow(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all inline-flex items-center gap-2">
            <i className="fas fa-plus text-xs"></i> Add Section
          </button>
        </div>

        <div className="space-y-3">
          {course?.data?.map((section, si) => (
            <div key={section._id} className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-4 bg-slate-50 cursor-pointer" onClick={() => setOpenSections((p) => ({ ...p, [section._id]: !p[section._id] }))}>
                <i className={`fas fa-chevron-${openSections[section._id] ? "down" : "right"} text-xs text-slate-400 flex-shrink-0`}></i>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">Section {si + 1}: {section.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{section.superSkills?.length || 0} lessons</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setEditSection({ show: true, id: section._id, name: section.title })} className="w-7 h-7 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors"><i className="fas fa-edit text-xs"></i></button>
                  <button onClick={() => deleteSection(section._id)} className="w-7 h-7 rounded-lg bg-white hover:bg-red-50 border border-slate-200 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"><i className="fas fa-trash text-xs"></i></button>
                  <button onClick={() => setSkillsModal({ show: true, superSkillsId: section._id })} className="flex items-center gap-1 bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-all ml-1">
                    <i className="fas fa-plus text-xs"></i> Lesson
                  </button>
                </div>
              </div>

              {openSections[section._id] && (
                <div className="divide-y divide-slate-100">
                  {section.superSkills?.map((skill, ski) => (
                    <div key={skill._id} className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <i className={`fas ${skill.type == "1" ? "fa-flag-checkered text-amber-500" : "fa-file-alt text-indigo-400"} flex-shrink-0`}></i>
                        <p className="flex-1 font-semibold text-slate-800 text-sm">{skill.skillsName}</p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => setEditSkill({ show: true, superSkillsId: section._id, skillsId: skill._id, name: skill.skillsName })} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors"><i className="fas fa-edit text-xs"></i></button>
                          <button onClick={() => deleteSkill(section._id, skill._id)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"><i className="fas fa-trash text-xs"></i></button>
                        </div>
                      </div>
                      {/* Slides */}
                      <div className="ml-6 space-y-1.5 mb-2">
                        {skill.skillsData?.map((slide, sdi) => (
                          <div key={sdi} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl group">
                            <i className="fas fa-file-alt text-slate-300 text-xs"></i>
                            <span className="flex-1 text-xs text-slate-600 truncate">Slide {sdi + 1}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setContentModal({ show: true, ids: { courseId: course._id, superSkillsId: section._id, skillsId: skill._id, contentIndex: sdi }, existingContent: slide.content })} className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><i className="fas fa-edit text-xs"></i></button>
                              <button onClick={() => deleteContent(section._id, skill._id, sdi)} className="w-6 h-6 rounded-lg bg-red-100 text-red-500 flex items-center justify-center"><i className="fas fa-trash text-xs"></i></button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="ml-6 flex gap-2">
                        <button onClick={() => setContentModal({ show: true, ids: { courseId: course._id, superSkillsId: section._id, skillsId: skill._id }, existingContent: "" })} className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-all">
                          <i className="fas fa-plus text-xs"></i> Add Slide
                        </button>
                        <button onClick={() => setQuizModal({ show: true, indexes: { si, ski, courseId: course._id } })} className="flex items-center gap-1 bg-violet-50 hover:bg-violet-100 text-violet-600 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-all">
                          <i className="fas fa-question-circle text-xs"></i> Add Quiz
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!section.superSkills || section.superSkills.length === 0) && (
                    <div className="p-6 text-center text-slate-400 text-sm">No lessons yet</div>
                  )}
                </div>
              )}
            </div>
          ))}

          {(!course?.data || course.data.length === 0) && (
            <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              <i className="fas fa-layer-group text-4xl mb-3 block opacity-20"></i>
              <p className="font-medium">No sections yet</p>
              <button onClick={() => setChapterShow(true)} className="mt-3 inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:underline"><i className="fas fa-plus text-xs"></i> Add first section</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Step2;
