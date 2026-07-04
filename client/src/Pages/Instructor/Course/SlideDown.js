import React, { useState } from "react";
function SlideDown({ title, children, courseIndex }) {
  const [open, setOpen] = useState(courseIndex === 0);
  return (
    <div className="mb-1">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-slate-100 transition-colors">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">{title}</span>
        <i className={`fas fa-chevron-${open ? "down" : "right"} text-xs text-slate-400`}></i>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
export default SlideDown;
