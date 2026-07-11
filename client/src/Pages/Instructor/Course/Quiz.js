import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const Quiz = ({
  loading,
  skillsData,
  skillsPosition,
  handleNext,
  setNextButton,
}) => {
  const imageLinkRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;

  if (loading || !skillsData) return null;

  // ── Assessment type 0 — Multiple choice ──────────────────────────────────
  if (skillsData.assessmentType === 0) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-question-circle text-white"></i>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Quiz preview</p>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {skillsData.questions?.length} questions
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {skillsData.questions.map((question, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-2xl p-5 bg-white dark:border-gray-600 dark:bg-gray-800"
            >
              <div className="flex items-start gap-2 mb-4">
                <span className="flex-shrink-0 w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500 dark:bg-gray-700 dark:text-gray-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="font-semibold text-slate-900 text-sm pt-0.5 dark:text-white">
                  {question.question}
                </p>
              </div>

              {question.code && question.code !== "" && (
                <div className="ml-9 mb-4 rounded-xl overflow-hidden">
                  <AceEditor
                    mode="javascript"
                    theme="monokai"
                    value={question.code}
                    readOnly={true}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{ useWorker: false }}
                    style={{ width: "100%", height: "120px" }}
                  />
                </div>
              )}

              <div className="space-y-2 ml-9">
                {question.choices.map((choice, ci) => (
                  <div
                    key={ci}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      choice.isCorrect
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                        choice.isCorrect ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    >
                      {choice.isCorrect && (
                        <i className="fas fa-check text-white text-xs"></i>
                      )}
                    </div>

                    <div className="text-sm text-slate-700 flex-1 dark:text-gray-200">
                      {imageLinkRegex.test(choice.text) ? (
                        <img
                          src={choice.text}
                          alt="choice"
                          className="max-h-20 rounded"
                        />
                      ) : (
                        choice.text
                      )}
                    </div>

                    {choice.isCorrect && (
                      <span className="ml-auto text-xs text-emerald-600 font-semibold whitespace-nowrap">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Assessment type 1 — Correct elements ─────────────────────────────────
  if (skillsData.assessmentType === 1) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-list-check text-white"></i>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Correct elements preview</p>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {skillsData.correctElements?.length} elements marked correct
            </p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-5 bg-white dark:border-gray-600 dark:bg-gray-800">
          <p className="text-xs text-slate-400 mb-4 dark:text-gray-500">
            The following elements are marked as correct answers:
          </p>
          <div className="flex flex-wrap gap-2">
            {skillsData.correctElements.map((element, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl"
              >
                <i className="fas fa-circle-check text-blue-500 text-sm"></i>
                <span className="text-sm font-medium text-blue-700">
                  {element.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Assessment type 2 — Reorder / drag ───────────────────────────────────
  return (
    <div>
      <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <i className="fas fa-arrows-up-down text-white"></i>
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">Reorder solution preview</p>
          <p className="text-sm text-slate-500 dark:text-gray-400">Correct order shown below</p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl p-5 bg-white dark:border-gray-600 dark:bg-gray-800">
        <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2 dark:text-gray-200">
          <i className="fas fa-trophy text-amber-400"></i>
          Solution
        </p>

        {skillsData.questions && (
          <div className="text-sm text-slate-600 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 dark:text-gray-300 dark:bg-gray-900 dark:border-gray-700">
            {skillsData.questions}
          </div>
        )}

        <div className="space-y-2">
          {skillsData?.statements?.map((element, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-emerald-800">
                    {element.text}
                  </span>
                </div>
                <i className="fas fa-grip-lines text-emerald-400 cursor-grab"></i>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
