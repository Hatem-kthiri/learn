import React, { useState, useEffect } from "react";

function SlideDown({ title, children, isCurrentChapter, nightMode }) {
  const [open, setOpen] = useState(isCurrentChapter);

  // If navigation moves into this chapter later (e.g. clicking "Next" past
  // a chapter boundary), auto-expand it rather than only checking on mount.
  useEffect(() => {
    if (isCurrentChapter) setOpen(true);
  }, [isCurrentChapter]);

  const dm = nightMode;
  return (
    <div className="mb-1">
      <button onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${dm ? "hover:bg-gray-700 text-gray-200" : "hover:bg-slate-100 text-slate-700"}`}>
        {/* Section title - always highly visible */}
        <span className={`text-xs font-bold uppercase tracking-wider ${dm ? "text-indigo-300" : "text-indigo-600"}`}>{title}</span>
        <i className={`fas fa-chevron-${open ? "down" : "right"} text-xs ${dm ? "text-gray-500" : "text-slate-400"}`}></i>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export default SlideDown;
