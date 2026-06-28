import React from "react";
import CheckPointPreview from "./CheckPointPreview";
import ClipLoader from "react-spinners/ClipLoader";

const CourseContent = ({ skillsData, loading, skillsPosition, setNextButton, handleNext, openLoading }) => {
  if (loading) return <div className="flex justify-center py-16"><ClipLoader color="#4f46e5" size={36} /></div>;

  const content = skillsData[skillsPosition];

  if (openLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-2/3"></div>
        <div className="h-4 bg-slate-200 rounded-xl w-full"></div>
        <div className="h-4 bg-slate-200 rounded-xl w-5/6"></div>
        <div className="h-4 bg-slate-200 rounded-xl w-4/5"></div>
        <div className="h-32 bg-slate-200 rounded-xl w-full mt-4"></div>
      </div>
    );
  }

  if (content?.content?.includes("checkpoint-preview")) {
    return <CheckPointPreview skillsData={skillsData} skillsPosition={skillsPosition} setNextButton={setNextButton} handleNext={handleNext} />;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-400">
        <span className="bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-lg">{skillsPosition + 1} / {skillsData.length}</span>
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${((skillsPosition + 1) / skillsData.length) * 100}%` }}></div>
        </div>
      </div>
      <div className="prose max-w-none text-slate-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content?.content }} />
    </div>
  );
};

export default CourseContent;
