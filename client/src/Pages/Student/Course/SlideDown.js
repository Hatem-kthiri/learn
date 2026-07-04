import React, { useState } from "react";

function SlideDown({ title, children, courseIndex, nightMode }) {
  const [open, setOpen] = useState(courseIndex === 0);
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
