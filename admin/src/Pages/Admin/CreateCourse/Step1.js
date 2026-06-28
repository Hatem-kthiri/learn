import React from "react";

const Step1 = ({ getCourseValue, handleImageUpload }) => (
  <div id="tab_step1" className="space-y-5">
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Course Title <span className="text-red-500">*</span>
      </label>
      <input type="text" name="title" placeholder="e.g. Complete JavaScript Bootcamp" maxLength={100}
        onChange={getCourseValue}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
      <p className="text-xs text-slate-400 mt-1.5">Maximum 100 characters. Make it unique and descriptive.</p>
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Short Description <span className="text-red-500">*</span>
      </label>
      <textarea name="description" rows={4} placeholder="Describe what students will learn..."
        onChange={getCourseValue}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" />
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">Course Image</label>
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
            <i className="fas fa-cloud-upload-alt text-indigo-500 text-xl"></i>
          </div>
          <p className="text-sm font-semibold text-slate-600">Click to upload image</p>
          <p className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB</p>
        </div>
        <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>
    </div>
  </div>
);

export default Step1;
