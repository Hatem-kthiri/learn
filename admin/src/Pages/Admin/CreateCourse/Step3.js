import React from "react";
const Step3 = () => (
  <div className="text-center py-8">
    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
      <i className="fas fa-rocket text-emerald-600 text-3xl"></i>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Publish!</h3>
    <p className="text-slate-500 text-sm max-w-sm mx-auto">
      Your course is currently in draft. Click <strong>Publish</strong> below to make it available to students.
    </p>
    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-sm mx-auto text-left">
      <p className="text-xs text-amber-700 font-medium"><i className="fas fa-info-circle mr-1.5"></i>Students cannot enroll in draft courses. Publishing will make it visible.</p>
    </div>
  </div>
);
export default Step3;
