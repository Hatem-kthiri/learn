import React from "react";

const Modal = ({ show, title, onClose, children, onSave, saveLabel = "Save", loading }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        <div className="flex gap-3 p-6 border-t border-slate-100 flex-shrink-0">
          <button onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all">Cancel</button>
          {onSave && (
            <button onClick={onSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} {saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
