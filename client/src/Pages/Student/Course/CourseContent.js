import React from "react";
import CheckPointPreview from "./CheckPointPreview";
import ClipLoader from "react-spinners/ClipLoader";

const CourseContent = ({ skillsData, loading, skillsPosition, setNextButton, handleNext, openLoading, nightMode }) => {
  const dm = nightMode;
  const cardBg = dm ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-slate-100 text-slate-800";
  const skeletonBg = dm ? "bg-gray-700" : "bg-slate-200";

  if (loading) return <div className="flex justify-center py-16"><ClipLoader color="#6366f1" size={36} /></div>;

  const content = skillsData[skillsPosition];

  if (openLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className={`h-8 ${skeletonBg} rounded-xl w-2/3`}></div>
        <div className={`h-4 ${skeletonBg} rounded-xl w-full`}></div>
        <div className={`h-4 ${skeletonBg} rounded-xl w-5/6`}></div>
        <div className={`h-4 ${skeletonBg} rounded-xl w-4/5`}></div>
        <div className={`h-40 ${skeletonBg} rounded-xl w-full mt-4`}></div>
      </div>
    );
  }

  if (content?.content?.includes("checkpoint-preview")) {
    return <CheckPointPreview skillsData={skillsData} skillsPosition={skillsPosition} setNextButton={setNextButton} handleNext={handleNext} nightMode={dm} />;
  }

  return (
    <div>
      {/* Slide progress indicator */}
      <div className="flex items-center gap-2 mb-6 text-xs">
        <span className="bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-lg">{skillsPosition + 1} / {skillsData.length}</span>
        <div className={`flex-1 h-1.5 ${dm ? "bg-gray-700" : "bg-slate-100"} rounded-full overflow-hidden`}>
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((skillsPosition + 1) / skillsData.length) * 100}%` }}></div>
        </div>
      </div>
      {/* Content - apply dark mode prose styles */}
      <div
        className={`prose max-w-none leading-relaxed ${dm ? "prose-invert text-gray-100 [&_*]:text-gray-100 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_code]:bg-gray-700 [&_code]:text-indigo-300 [&_pre]:bg-gray-900 [&_blockquote]:border-indigo-500 [&_a]:text-indigo-400" : "text-slate-800"}`}
        dangerouslySetInnerHTML={{ __html: content?.content }}
      />
    </div>
  );
};

export default CourseContent;
