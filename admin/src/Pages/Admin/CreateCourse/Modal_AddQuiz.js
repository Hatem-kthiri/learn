import React, { useState } from "react";
import api from "../../../utils/api";
import ClipLoader from "react-spinners/ClipLoader";

const Modal_AddQuiz = ({ quizModal, setQuizModal, quizIndexes, setCourse }) => {
  const [tab, setTab] = useState("1");
  const [loading, setLoading] = useState(false);

  // ── Type 1: Multiple Choice ──────────────────────────────────────────
  const [questions, setQuestions] = useState({
    assessmentType: 0,
    questions: [{ question: "", code: "", choices: [{ text: "", isCorrect: false }] }],
  });
  const handleQuestionChange = (e, i) => { const q = { ...questions }; q.questions[i].question = e.target.value; setQuestions(q); };
  const handleCodeChange = (e, i) => { const q = { ...questions }; q.questions[i].code = e.target.value; setQuestions(q); };
  const handleChoiceText = (e, qi, ci) => { const q = { ...questions }; q.questions[qi].choices[ci].text = e.target.value; setQuestions(q); };
  const handleChoiceCheck = (qi, ci) => { const q = { ...questions }; q.questions[qi].choices[ci].isCorrect = !q.questions[qi].choices[ci].isCorrect; setQuestions(q); };
  const addQuestion = () => { const q = { ...questions }; q.questions.push({ question: "", code: "", choices: [{ text: "", isCorrect: false }] }); setQuestions(q); };
  const addChoice = (qi) => { const q = { ...questions }; q.questions[qi].choices.push({ text: "", isCorrect: false }); setQuestions(q); };
  const handleSubmit1 = () => {
    setLoading(true);
    api.put(`/api/admin/updateQuizContent`, { QuizContent: questions, quizIndexes })
      .then((r) => { setCourse(r.data.data); close(); })
      .finally(() => setLoading(false));
  };

  // ── Type 2: Fill in the Blanks ───────────────────────────────────────
  const [quizData, setQuizData] = useState({ assessmentType: 1, blankItems: [{ text: "" }], correctElements: [{ text: "" }], elements: [{ text: "" }] });
  const [blankInput, setBlankInput] = useState("");
  const [elementInput, setElementInput] = useState("");
  const [correctInput, setCorrectInput] = useState("");
  const updateBlank = (i, v) => { const b = [...quizData.blankItems]; b[i] = { text: v }; setQuizData({ ...quizData, blankItems: b }); };
  const updateElement = (i, v) => { const e = [...quizData.elements]; e[i] = { text: v }; setQuizData({ ...quizData, elements: e }); };
  const updateCorrect = (i, v) => { const c = [...quizData.correctElements]; c[i] = { text: v }; setQuizData({ ...quizData, correctElements: c }); };
  const handleSubmit2 = () => {
    setLoading(true);
    api.put(`/api/admin/updateQuizContent`, { QuizContent: quizData, quizIndexes })
      .then((r) => { setCourse(r.data.data); close(); })
      .finally(() => setLoading(false));
  };

  // ── Type 3: Drag & Drop Ordering ─────────────────────────────────────
  const [quizRange, setQuizRange] = useState({ assessmentType: 2, questions: "", statements: [] });
  const [stmtInput, setStmtInput] = useState("");
  const updateStmt = (i, v) => { const s = [...quizRange.statements]; s[i] = { text: v }; setQuizRange({ ...quizRange, statements: s }); };
  const handleSubmit3 = (e) => {
    e.preventDefault();
    setLoading(true);
    api.put(`/api/admin/updateQuizContent`, { QuizContent: quizRange, quizIndexes })
      .then((r) => { setCourse(r.data.data); close(); })
      .finally(() => setLoading(false));
  };

  const close = () => setQuizModal({ ...quizModal, show: false, display: "none" });

  if (!quizModal?.show) return null;

  const tabs = [
    { id: "1", label: "Type 1 · Multiple Choice", icon: "fas fa-list-ul" },
    { id: "2", label: "Type 2 · Fill Blanks", icon: "fas fa-pen" },
    { id: "3", label: "Type 3 · Ordering", icon: "fas fa-sort" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={close}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-slate-900 text-lg">Add Quiz</h3>
          <button onClick={close} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-100 flex-shrink-0 px-4 pt-3 gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${tab === t.id ? "bg-indigo-50 text-indigo-700 border-indigo-500" : "text-slate-500 hover:text-slate-700 border-transparent"}`}>
              <i className={`${t.icon}`}></i> {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── TAB 1: Multiple Choice ── */}
          {tab === "1" && (
            <div className="space-y-5">
              {questions.questions.map((q, qi) => (
                <div key={qi} className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-lg">Question {qi + 1}</span>
                  </div>
                  <input type="text" placeholder="Question text..." value={q.question} onChange={(e) => handleQuestionChange(e, qi)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-3" />
                  <textarea rows={2} placeholder="Code snippet (optional)..." value={q.code} onChange={(e) => handleCodeChange(e, qi)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none mb-3" />
                  <p className="text-xs font-semibold text-slate-500 mb-2">Choices</p>
                  <div className="space-y-2 mb-3">
                    {q.choices.map((c, ci) => (
                      <div key={ci} className="flex items-center gap-2">
                        <input type="checkbox" checked={c.isCorrect} onChange={() => handleChoiceCheck(qi, ci)} className="w-4 h-4 accent-indigo-600 flex-shrink-0" />
                        <input type="text" placeholder={`Choice ${ci + 1}`} value={c.text} onChange={(e) => handleChoiceText(e, qi, ci)}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addChoice(qi)} className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                    <i className="fas fa-plus text-xs"></i> Add Choice
                  </button>
                </div>
              ))}
              <button onClick={addQuestion} className="w-full border-2 border-dashed border-slate-200 hover:border-indigo-400 text-slate-400 hover:text-indigo-600 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                <i className="fas fa-plus"></i> Add Question
              </button>
              <button onClick={handleSubmit1} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-save"></i> Save Quiz Type 1</>}
              </button>
            </div>
          )}

          {/* ── TAB 2: Fill in Blanks ── */}
          {tab === "2" && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><i className="fas fa-minus-circle text-rose-400"></i> Blank Items (words to place)</p>
                <div className="space-y-2 mb-3">
                  {quizData.blankItems.map((item, i) => (
                    <input key={i} type="text" placeholder={`Blank ${i + 1}`} value={item.text} onChange={(e) => updateBlank(i, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="New blank item..." value={blankInput} onChange={(e) => setBlankInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={() => { setQuizData({ ...quizData, blankItems: [...quizData.blankItems, { text: blankInput }] }); setBlankInput(""); }}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-4 py-2 rounded-xl text-sm transition-all">Add</button>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><i className="fas fa-puzzle-piece text-violet-400"></i> All Elements (sentence parts)</p>
                <div className="space-y-2 mb-3">
                  {quizData.elements.map((el, i) => (
                    <input key={i} type="text" placeholder={`Element ${i + 1}`} value={el.text} onChange={(e) => updateElement(i, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="New element..." value={elementInput} onChange={(e) => setElementInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={() => { setQuizData({ ...quizData, elements: [...quizData.elements, { text: elementInput }] }); setElementInput(""); }}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-4 py-2 rounded-xl text-sm transition-all">Add</button>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><i className="fas fa-check-circle text-emerald-400"></i> Correct Elements (answer order)</p>
                <div className="space-y-2 mb-3">
                  {quizData.correctElements.map((el, i) => (
                    <input key={i} type="text" placeholder={`Correct ${i + 1}`} value={el.text} onChange={(e) => updateCorrect(i, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="New correct element..." value={correctInput} onChange={(e) => setCorrectInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={() => { setQuizData({ ...quizData, correctElements: [...quizData.correctElements, { text: correctInput }] }); setCorrectInput(""); }}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-4 py-2 rounded-xl text-sm transition-all">Add</button>
                </div>
              </div>
              <button onClick={handleSubmit2} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-save"></i> Save Quiz Type 2</>}
              </button>
            </div>
          )}

          {/* ── TAB 3: Drag & Drop Ordering ── */}
          {tab === "3" && (
            <form onSubmit={handleSubmit3} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Quiz Question / Instructions</label>
                <textarea rows={3} placeholder="e.g. Arrange the steps in the correct order..." value={quizRange.questions}
                  onChange={(e) => setQuizRange({ ...quizRange, questions: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><i className="fas fa-sort text-indigo-400"></i> Statements (correct order top → bottom)</p>
                <div className="space-y-2 mb-3">
                  {quizRange.statements.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <input type="text" placeholder={`Statement ${i + 1}`} value={s.text} onChange={(e) => updateStmt(i, e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="New statement..." value={stmtInput} onChange={(e) => setStmtInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button type="button" onClick={() => { setQuizRange({ ...quizRange, statements: [...quizRange.statements, { text: stmtInput }] }); setStmtInput(""); }}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-4 py-2 rounded-xl text-sm transition-all">Add</button>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-save"></i> Save Quiz Type 3</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal_AddQuiz;
