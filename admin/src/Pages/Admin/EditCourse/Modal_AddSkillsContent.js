import React from "react";
import JoditEditor from "jodit-react";
const Modal_AddSkillsContent = ({ show, display, handleUpdate, ModalSkillsContentClose, saveSkillsContent }) => {
  const config = { readonly: false, height: 400, toolbarAdaptive: false };
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={ModalSkillsContentClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-slate-900">Add Slide Content</h3>
          <button onClick={ModalSkillsContentClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><i className="fas fa-times text-sm"></i></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Slide Content <span className="text-red-500">*</span></label>
          <JoditEditor config={config} onBlur={handleUpdate} />
        </div>
        <div className="flex gap-3 p-6 border-t border-slate-100 flex-shrink-0">
          <button onClick={ModalSkillsContentClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all">Cancel</button>
          <button onClick={saveSkillsContent} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all"><i className="fas fa-save mr-2"></i>Save Slide</button>
        </div>
      </div>
    </div>
  );
};
export default Modal_AddSkillsContent;
