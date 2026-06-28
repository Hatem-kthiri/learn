import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const Quiz = ({ loading, skillsData }) => {
  if (loading || !skillsData) return null;
  return (
    <div>
      <div className="flex items-center gap-3 mb-6 p-4 bg-violet-50 border border-violet-200 rounded-2xl">
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center"><i className="fas fa-question-circle text-violet-600"></i></div>
        <div><p className="font-bold text-slate-900">Quiz Preview</p><p className="text-sm text-slate-500">{skillsData.questions?.length} questions</p></div>
      </div>
      <div className="space-y-5">
        {skillsData.questions?.map((q, qi) => (
          <div key={qi} className="border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start gap-2 mb-4">
              <span className="flex-shrink-0 w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">{qi + 1}</span>
              <p className="font-semibold text-slate-900 text-sm">{q.question}</p>
            </div>
            {q.code && (
              <div className="ml-9 mb-4 rounded-xl overflow-hidden">
                <AceEditor mode="javascript" theme="monokai" value={q.code} readOnly={true} editorProps={{ $blockScrolling: true }} setOptions={{ useWorker: false }} style={{ width: "100%", height: "120px" }} />
              </div>
            )}
            <div className="space-y-2 ml-9">
              {q.choices?.map((c, ci) => (
                <div key={ci} className={`flex items-center gap-3 p-3 rounded-xl border ${c.isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100"}`}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${c.isCorrect ? "bg-emerald-500" : "bg-slate-200"}`}>
                    {c.isCorrect && <i className="fas fa-check text-white text-xs"></i>}
                  </div>
                  <span className="text-sm text-slate-700">{c.text}</span>
                  {c.isCorrect && <span className="ml-auto text-xs text-emerald-600 font-semibold">Correct</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Quiz;
