import React from "react";
const Step1 = ({ getCourseValue, course }) => (
  <div className="space-y-5">
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">Course Title <span className="text-red-500">*</span></label>
      <input type="text" name="title" defaultValue={course?.title || ""} placeholder="Course title" onChange={getCourseValue}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
    </div>
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
      <textarea name="description" defaultValue={course?.description || ""} rows={4} placeholder="Describe what students will learn..." onChange={getCourseValue}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" />
    </div>
    {course?.image && (
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Current Image</label>
        <img src={course.image} alt="" className="w-40 h-28 object-cover rounded-xl border border-slate-200" />
      </div>
    )}
  </div>
);
export default Step1;
