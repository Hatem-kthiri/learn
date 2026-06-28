import React from "react";
const Modal_AddChapter = ({ show, display, closeModal, getChapterName, saveChapterName }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">New Section</h3>
          <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><i className="fas fa-times text-sm"></i></button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Section Name <span className="text-red-500">*</span></label>
          <input type="text" placeholder="e.g. Introduction to JavaScript" onChange={getChapterName}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
        </div>
        <div className="flex gap-3 p-6 border-t border-slate-100">
          <button onClick={closeModal} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all">Cancel</button>
          <button onClick={saveChapterName} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all"><i className="fas fa-plus mr-2"></i>Add Section</button>
        </div>
      </div>
    </div>
  );
};
export default Modal_AddChapter;
