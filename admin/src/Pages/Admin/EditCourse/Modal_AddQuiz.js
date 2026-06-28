import React, { useState } from "react";
const Modal_AddQuiz = ({ show, display, closeModalQuiz, saveQuiz }) => {
  const [questions, setQuestions] = useState([{ text: "", choices: [{ text: "", isCorrect: false }] }]);
  const addQuestion = () => setQuestions([...questions, { text: "", choices: [{ text: "", isCorrect: false }] }]);
  const addChoice = (qi) => {
    const q = [...questions]; q[qi].choices.push({ text: "", isCorrect: false }); setQuestions(q);
  };
  const updateQ = (qi, val) => { const q = [...questions]; q[qi].text = val; setQuestions(q); };
  const updateC = (qi, ci, field, val) => { const q = [...questions]; q[qi].choices[ci][field] = val; setQuestions(q); };
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModalQuiz}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-slate-900">Add Quiz</h3>
          <button onClick={closeModalQuiz} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><i className="fas fa-times text-sm"></i></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {questions.map((q, qi) => (
            <div key={qi} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <label className="block text-sm font-bold text-slate-700 mb-2">Question {qi + 1}</label>
              <input type="text" placeholder="Enter question..." value={q.text} onChange={(e) => updateQ(qi, e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-3" />
              <p className="text-xs font-semibold text-slate-500 mb-2">Choices</p>
              <div className="space-y-2 mb-3">
                {q.choices.map((c, ci) => (
                  <div key={ci} className="flex items-center gap-2">
                    <input type="checkbox" checked={c.isCorrect} onChange={(e) => updateC(qi, ci, "isCorrect", e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 flex-shrink-0" />
                    <input type="text" placeholder={`Choice ${ci + 1}`} value={c.text} onChange={(e) => updateC(qi, ci, "text", e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                ))}
              </div>
              <button onClick={() => addChoice(qi)} className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                <i className="fas fa-plus text-xs"></i> Add Choice
              </button>
            </div>
          ))}
          <button onClick={addQuestion} className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
            <i className="fas fa-plus"></i> Add Question
          </button>
        </div>
        <div className="flex gap-3 p-6 border-t border-slate-100 flex-shrink-0">
          <button onClick={closeModalQuiz} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all">Cancel</button>
          <button onClick={() => saveQuiz && saveQuiz(questions)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all"><i className="fas fa-save mr-2"></i>Save Quiz</button>
        </div>
      </div>
    </div>
  );
};
export default Modal_AddQuiz;
